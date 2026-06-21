
# Admin felület átszervezése — Fókusz, átláthatóság, mobil

Cél: az admin ne egy "200 menüpontos rengeteg" legyen, hanem egy **napi fókuszt vezérlő munkafelület**, ami a szeptemberi célhoz (partner-előmegállapodások + előregisztráció + italszponzor pitch) terel. Minden helyen súgó, mobilon működjön normálisan, a "Something went wrong" hiba elhárítva.

---

## 1) Új menü-struktúra: 4 "fázis" + Beállítások

A jelenlegi ~15 lapos lista helyett **fázisokba** csoportosítjuk (sidebar accordion + mobil bottom nav top-5):

```text
SZEPTEMBERI MISSZIÓ
├─ 🎯 Ma (Dashboard)          — napi 3 fókusz, számláló a célokig
├─ 📥 Inbox                   — minden, ami rád vár

1. PARTNER-ELŐMEGÁLLAPODÁS (fókusz most)
├─ 🔍 Leadek                  — kutatás + új helyek
├─ 🤝 Pipeline                — előmegállapodás kanban
├─ ✉️  Outreach                — sequence-ek, email

2. ELŐREGISZTRÁCIÓ
├─ 📈 Waitlist                — növekedés, források
├─ 📣 Tartalom                — posztok, briefek, naptár

3. ITALSZPONZOR
├─ 🥃 Italmárkák              — célpartnerek, pitch státusz
├─ 📊 Pitch deck adatok       — KPI-k a deck-hez

4. TUDÁS & KUTATÁS
├─ 📚 Dokumentumok            — Drive, AI elemzés
├─ 🔭 Trend Radar             — Firecrawl heti
├─ 🧠 Döntések / Retro

BEÁLLÍTÁSOK
└─ Brand · AI · Csapat
```

Sidebarban minden szekciónak van **1 mondatos magyarázata** (mire való + miért most). Mobil bottom navon csak az 5 leggyakoribb: Ma · Inbox · Pipeline · Tartalom · Tudás.

---

## 2) Súgó-rendszer mindenhol

**a) `<HelpTip>` komponens** — kis `?` ikon minden szekció-cím / mező mellett. Hover (desktop) és tap (mobil) esetén Popover nyílik:
- **Mi ez?** — 1 mondat
- **Mire jó?** — 1 mondat
- **Mit csinálj most?** — 1 konkrét akció

**b) `<PageIntro>` komponens** — minden admin oldal tetején összecsukható panel:
- Az oldal célja, kinek szól, mik a teendők, hogyan kapcsolódik a szeptemberi misszióhoz. "Ne mutasd újra" toggle (localStorage).

**c) Üres állapotok (`<EmptyState>`)** — minden lista üres állapotában magyarázat + "Első lépés" CTA gomb (pl. Leadek üres → "Importálj 10 helyet a környékedről" gomb).

**d) Mezők alá `helperText`** — minden form input alatt 1 sor súgó + amit lehet, **Select/Combobox dropdown** szabad szöveg helyett (kategória, státusz, város, tag, csatorna stb. — előre definiált opciókkal, "Egyéb…" fallback).

---

## 3) Mobil optimalizáció (kritikus)

- **Dokumentum nézet scroll bug**: `AdminDocuments` és `AdminDocumentViewer` overflow + bottom-padding (`pb-32`) fix, hogy a bottom nav + FAB ne takarja az alját. Sticky toolbar `position: sticky` helyett `top-0` + safe-area inset.
- **EntityDrawer**: mobilon `h-[92vh]` helyett `h-[100dvh]` + belső scroll konténer + drag handle.
- **Floating gombok átfedés**: a Voice/AI FAB + bottom nav együtt takarják a tartalmat. Megoldás: FAB-ot a bottom navba integráljuk (közepén kiemelt cyan gomb), vagy bottom nav fölé pozicionáljuk `bottom: calc(nav-height + 16px)`-szel.
- **Hosszú szövegek**: `break-words` + `min-w-0` minden Card / SheetTitle-ön, hogy ne lógjon ki (a token URL most kifolyik).
- **Tab-listák**: `grid-cols-6` mobilon `overflow-x-auto` + `flex` lesz.
- **Viewport meta** + 100dvh használata `100vh` helyett.

---

## 4) "Something went wrong" hiba

Az IMG_9181 szerint ErrorBoundary trigger. Élesben kinyomozni:
- Console / network log olvasás, megnézni melyik route okozza (valószínű a frissen módosított `AdminTrends` vagy `EntityDrawer`, ahol új mezőket olvasunk a Supabase típusokból).
- Defenzív guardok: `research?.sources?.map(...)` mindenhol, `Array.isArray` ellenőrzés, missing types regen.
- Az ErrorBoundary fallbackot is **magyarra + Hibajelentés** gombbal frissítjük.

---

## 5) "Ma" dashboard átfókuszálva

A felső "Northstar" kártyát átírjuk **3 számlálóra** (a misszió szerint):
1. **Partner-előmegállapodás**: X / cél (szeptember 1-ig). Progress bar.
2. **Előregisztráció**: X / cél. 7 napos trend.
3. **Italszponzor pitch**: státusz (kutatás → első találkozó → ajánlat).

Alatta **"Ma tedd meg"** — 3 konkrét feladat AI által priorizálva (a meglévő `DailyFocusCard` átdrótozása ezekre a célokra).

---

## 6) Inputok → dropdownok

Audit + cserék (szabad szöveg helyett `Select` / `Combobox` előre definiált listával):

| Hely | Mező | Új opciók (példa) |
|---|---|---|
| Lead/Partner form | Kategória | bár, kávézó, étterem, klub, koktél, kézműves sör… |
| Lead/Partner form | Város | top 20 HU város + "Egyéb" |
| Pipeline | Stage váltás `reason` | előre definiált okok + "Egyéb" |
| Outreach | Csatorna | email, telefon, IG DM, személyes |
| Decision | Outcome | sikeres / részben / sikertelen / elhalasztva |
| Trend | Query preset | 6 előre definiált HORECA query |
| Quick task prompt | — | inline form `window.prompt` helyett, due date dropdown (ma+1, ma+3, jövő hét) |

---

## 7) Technikai változások (PM nem-kritikus szakasz)

**Új fájlok:**
- `src/components/admin/help/HelpTip.tsx` — Popover-alapú `?` ikon
- `src/components/admin/help/PageIntro.tsx` — összecsukható oldal-bevezető
- `src/components/admin/help/EmptyState.tsx`
- `src/lib/admin-help-content.ts` — minden súgó-szöveg egy helyen (i18n-ready)
- `src/lib/admin-nav-config.ts` — új fázis-csoportosítás, ikonok, magyarázatok
- `src/components/admin/forms/CategorySelect.tsx`, `CitySelect.tsx`, `ChannelSelect.tsx`
- `src/components/admin/dashboard/MissionTracker.tsx` — 3-célú számláló

**Módosítva:**
- `AdminLayout.tsx` — új csoportosított sidebar, fázis-fejlécek, mobil nav top-5
- `MobileBottomNav.tsx` — 5 ikon + középen kiemelt AI/Voice
- `AdminDashboard.tsx` — Northstar helyett MissionTracker fent
- `AdminDocuments.tsx`, `AdminDocumentViewer.tsx` — scroll/padding fix
- `EntityDrawer.tsx` — 100dvh, drag handle, break-words, quick task inline form
- `ErrorBoundary.tsx` — magyar fallback + reset
- Minden admin oldal teteje: `<PageIntro slug="..."/>`

**Migráció:** nincs (csak UI). Adatszerkezet érintetlen.

**Mit NEM csinálunk most:** drag-and-drop pipeline, bulk lead actions, swipeable cards (külön fázis); új edge function nincs.

---

## Sorrend (1 építési menet)

1. Hibajavítás (`Something went wrong` route + ErrorBoundary magyar)
2. Súgó-infrastruktúra (`HelpTip`, `PageIntro`, `EmptyState`, content fájl)
3. Új sidebar + mobil bottom nav (fázis-csoportok, magyarázatok)
4. MissionTracker a dashboardon
5. Mobil scroll/padding/100dvh javítások (Documents, Viewer, Drawer)
6. Dropdown cserék (Category/City/Channel/Reason)
7. Súgók kihelyezése minden admin lapra (PageIntro + HelpTip-ek)

Egy build-menetben végigmegyek mindenen, a végén Playwright-tal mobilnézetben ellenőrzöm a 3 fő útvonalat (Dashboard, Documents scroll, EntityDrawer).
