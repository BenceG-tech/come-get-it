# Admin mobil-optimalizálás + Doksi-archívum betöltése

Két dolgot csinálunk: (1) az admin felület most már mobilon is használható, (2) az összes eddig generált PDF / screenshot felkerül a Dokumentumok közé, logikus mappákba rendezve.

---

## 1) Mobil-optimalizált admin felület

A jelenlegi gond: a sidebar 256px fix szélességű, mobilon (402px) elviszi a fél képernyőt, és a fő tartalom is `p-8` paddinggel, fix `max-w` táblákkal van — emiatt minden ki van vágva.

**Mit változtatunk:**

- `AdminLayout.tsx` átírása shadcn `Sidebar` + `SidebarProvider` komponensekre:
  - Asztali nézet: kinyitva marad, ugyanúgy mint most.
  - Mobil: off-canvas drawer, alapból csukva; felül egy fix header van „CGI Admin" felirattal + hamburger (`SidebarTrigger`) gombbal.
  - A „Vissza az oldalra / email / Kijelentkezés" blokk a sidebar aljára kerül (mobilon a drawerben).
- Minden admin oldalon (`AdminDashboard`, `AdminPartners`, `AdminDocuments`, `AdminPartnerDetail`, `AdminAI`, `AdminCalendar`):
  - `p-8` → `p-4 md:p-8`, címek `text-3xl` → `text-2xl md:text-3xl`.
  - Dashboard kártyák: `grid-cols-2 md:grid-cols-4` marad, de a számok `text-2xl md:text-3xl`, label `text-[10px] md:text-xs`, hogy a „ÖSSZES PARTNER" ne legyen levágva.
  - Partner-táblázat mobilon kártya-nézetre vált (`md:table` + `md:hidden` kártyalista) — minden sor egy kis kártya: cégnév + típus + státusz chip + város.
  - Szűrő-sávok `flex-wrap` és teljes szélességű inputok mobilon.
- Az „Új partner" / „Új doksi" gombok mobilon csak ikon + rövid felirat, nem törnek bele a címbe.

Cél: 360–430px szélességen minden olvasható, kattintható, semmi nem lóg ki.

---

## 2) Generált doksik feltöltése Storage-be + Dokumentumok mappákba rendezve

A `/mnt/documents` mappában **47 PDF + 14 screenshot PNG + 1 markdown** van, amit korábban generáltunk. Ezek most felkerülnek a Supabase Storage-be és a `documents` táblába, hogy az admin felületen egy kattintással elérhetők legyenek.

**Mit csinálunk:**

### a) Storage bucket
Új **privát** bucket: `admin-docs`. RLS: csak admin szerep tud listázni / olvasni / feltölteni. Letöltés signed URL-lel a frontendről.

### b) Adatbázis-migráció
- A `documents` táblához új oszlop: `folder text` (mappa-csoport neve, pl. `pitch-decks`).
- Új oszlop: `file_size_bytes int`, `mime_type text` (megjelenítéshez).
- A `category` enumhoz hozzáadjuk: `pitch_deck`, `investor`, `sales_script`, `screenshot`, `knowledge_base`.

### c) Mappa-struktúra és betöltés

A fájlokat egy backfill-szkript (egyszeri SQL + edge function, vagy direkt SQL `INSERT` a storage feltöltés után) tölti be ezekkel a mappákkal:

```text
01 — Pitch decks (publikus pitch oldalankint)
   01-fooldal.pdf, 02-vendeglatohelyek.pdf, 03-partnerek.pdf,
   04-founding-partner-program.pdf, 05-italmarkak.pdf,
   06-rewards-partnerek_v2.pdf, come-get-it-founding-partner-pitch.pdf

02 — Master overview & hosszú pitch-ek (_v2)
   01-master-overview_v2.pdf, 02-pitch-vendeglatohelyek_v2.pdf,
   03-pitch-italmarkak_v2.pdf, 04-pitch-rewards-partnerek_v2.pdf

03 — 1-pagerek (gyors első kontakt)
   05-onepager-helyek_v2.pdf, 06-onepager-markak_v2.pdf,
   07-onepager-rewards_v2.pdf

04 — Média & FAQ
   08-media-kit_v2.pdf, 09-faq-partnereknek_v2.pdf,
   21-sajtokozlemeny-launch.pdf, 22-founder-bio-qa.pdf

05 — Founding Partner jogi/üzleti
   10-founding-partner-term-sheet_v2.pdf

06 — Befektetői csomag
   11-befekteto-overview_v2.pdf, 12-befekteto-1pager_v2.pdf,
   13-letter-of-intent-sablon_v2.pdf, 14-barat-bemutato.pdf,
   15-milestone-return-tabla.pdf, 16-barat-loi-sablon.pdf

07 — Sales / outreach scriptek
   17-cold-email-pack.pdf, 18-linkedin-dm-scripts.pdf,
   19-venue-onboarding-playbook.pdf, 20-in-venue-print-kit-brief.pdf

08 — Knowledge base
   come-get-it-master-knowledge.pdf (+ .md)

09 — App screenshotok (desktop)
   screenshots/*.png + come-get-it-screenshots.pdf

10 — App screenshotok (mobil)
   mobile-screenshots/*.png + come-get-it-mobile-screenshots.pdf
```

A régi `v1` PDF-eket nem töltjük fel (csak a `_v2` legutolsó verziókat), hogy ne legyen duplikáció. Minden bejegyzéshez megy `title` (magyar, ember-olvasható, pl. „Befektetői 1-pager"), `description`, `when_to_use` (pl. „Első kontakt befektetővel — küldd email mellékletként").

### d) AdminDocuments oldal frissítése
- Felül egy **mappa-választó** (10 csoport + „Mind"), a régi kategória-szűrő mellett.
- Lista a mappákra csoportosítva, mappánkint kibontható szekcióval (collapsed alapból, csak az aktív mappa nyitva).
- Minden kártyán: cím, leírás, „Mikor használd", **„Megnyitás"** gomb (signed URL, új tab) + **„Másol link"** gomb.
- Új doksi feltöltése: file input → Storage-be `admin-docs/<folder>/<filename>` útra tölt, majd elmenti a táblába.
- Mobil layout: kártyák egymás alatt, full-width, nagy tap-target gombok.

---

## Technikai részletek (fejlesztőknek)

- **Migráció lépései egy commitban**: `ALTER TYPE document_category ADD VALUE` (5 új), `ALTER TABLE documents ADD COLUMN folder text, file_size_bytes int, mime_type text`, storage bucket `admin-docs` privát létrehozása, RLS policy `storage.objects` táblára (`has_role(auth.uid(),'admin')`).
- **Backfill**: külön szkriptben (`scripts/upload-admin-docs.ts`) `service_role` kulccsal feltöltünk minden fájlt `/mnt/documents` alól és `INSERT`-elünk a `documents` táblába. A szkriptet egyszer kézzel futtatjuk a sandboxból, nem kerül CI-be.
- **Frontend signed URL**: `supabase.storage.from('admin-docs').createSignedUrl(path, 3600)` egy kattintásra, nem előre.
- **Shadcn sidebar**: a `src/components/ui/sidebar.tsx` már elérhető, csak fel kell kötni az `AdminLayout`-ra `collapsible="offcanvas"` módban.
- A meglévő kézzel hozzáadott doksik (ha vannak már a DB-ben) érintetlenül maradnak, csak `folder = null` lesz náluk — ezek a „Mappázatlan" szekcióba kerülnek.

---

## Amit NEM csinálunk most
- Nem nyúlunk a login/admin RBAC logikához (az most már működik).
- Nem írunk PDF-előnézetet az admin felületre — csak megnyitás új tabban.
- Nem migrálunk Lovable Cloud-ra.
