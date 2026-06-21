
# Admin egyszerűsítés + mobil-barát átdolgozás

## Cél
Az admin most 22 oldalból, 5 nav csoportból és sok dashboard kártyából áll. Túl sok az egyidejű információ, és mobilon több oldal nem görgethető végig (fix magasságok, `h-screen`, `overflow-hidden` a kártyákon). Két dolgot teszünk: **drasztikusan letisztítjuk a felületet** és **garantáljuk, hogy minden admin oldal mobilon végiggörgethető legyen, semmi se vágódjon le**.

## 1. Információs architektúra letisztítása

### Új nav-struktúra (5 csoport → 3)
A jelenlegi „Misszió / Partner / Waitlist / Szponzor / Tudás" felépítést **3 fő szekcióra** szűkítjük, a többi az ⌘K paletta + a „Több" menü mögé kerül:

```
MA            → /admin (dashboard, daily 3, mission tracker)
MUNKA         → Inbox · Pipeline · Outreach · Content Studio · Naptár
TUDÁS         → Dokumentumok · Trendek · Brand · AI chat
                (Több ▾: Leadek, Szimulátor, Retro, Decisions, Drive, Média, Checklist, Mission központ)
```

Indok: napi szinten 4-5 oldalt használsz aktívan, a többi havi/heti — azok mehetnek a „Több" alá és ⌘K-val pillanat alatt elérhetők. A mobil bottom nav-on csak `Ma · Inbox · Pipeline · Tudás · ⌘K` marad (már most is így van, csak a címkéket egységesítjük).

### Dashboard (AdminDashboard) tisztítás
Jelenleg ~10 kártya egymás alatt (MissionTracker, TodayTasks, DailyBriefing, Northstar, PipelineFunnel, WaitlistGrowth, InboxZero, OutreachHealth, AiUsage, Decisions, TrendDigest, DocumentDigest, WeeklyContent, WeeklyGoals, CompanyHealth, TimeTracker, DailyFocus). 
Átszervezés **3 sávra**:

1. **Fókusz ma** (mindig látszik, fold above): MissionTracker (kompakt) + TodayTasksCard + InboxZero számláló — egy 3-oszlopos grid (desktop) / vertikális stack (mobil).
2. **Pipeline állapot** (összecsukható): PipelineFunnel + WaitlistGrowth + OutreachHealth.
3. **Tudás & retro** (összecsukható, alapból zárva mobilon): TrendDigest, DocumentDigest, AiUsage, Decisions, WeeklyGoals, CompanyHealth, TimeTracker.

A 2-3. sáv `<details>` / `Collapsible` lesz — mobilon zárva indul, így 3 kártyával kezdesz, és magad nyitod ki amit kell. A felesleges `DailyFocusCard` (átfedés `TodayTasksCard`-dal) törlésre kerül.

### Egységes oldalfej (PageHeader)
Új `src/components/admin/PageHeader.tsx`:
- breadcrumb + cím + 1-soros leírás + 1 elsődleges akció + opcionális „Súgó" toggle (a `PageIntro` tartalmát rejti).
- Helyettesíti a most oldalanként eltérő fejléceket → kiszámítható.

## 2. Mobil scroll & „minden látszódjon" javítás

### Globális szabály
Az `AdminLayout` `<main>` már `overflow-auto pb-32 md:pb-0` — ez jó. A baj a **gyermek oldalakon és kártyákban** van:

- `h-screen`, `h-[100vh]`, fix `h-[…]` magasságok mobilon vágják a tartalmat.
- `overflow-hidden` kombinálva fix magassággal eltünteti a túlcsorduló részt.
- Több helyen 2-oszlopos `grid-cols-2` mobilon összepréseli a számokat.

### Oldalanként végigmegyünk és javítunk
Konkrét érintettek (a `rg` kimenete alapján):

| Oldal/Komponens | Mit kell javítani |
|---|---|
| `AdminDocuments.tsx` | A bal oldali sidebar `md:h-[calc(100vh-…)]` + jobb panel fix magasság → mobilon `h-auto`, csak `md:`-en marad a fix. |
| `AdminContentStudio.tsx` | Tab-tartalmak `overflow-hidden` → cseréljük `overflow-visible`-re, kártyák natúr magassággal nyúljanak. |
| `AdminDocumentChat.tsx` | Chat oszlop `h-[calc(100vh-…)]` → mobilon `min-h-[60vh] max-h-[80vh]`, oldal többi része görgethető marad. |
| `AdminAI.tsx` | Ugyanaz a chat-pattern → ugyanaz a fix. |
| `AdminDocumentViewer.tsx` | Iframe + sidebar fix magasság → mobilon stackelve, iframe `aspect-[3/4]`. |
| `AdminLeads.tsx` | A térkép + tábla mobilon egymás alá kerül, térkép max-height 50vh-ra. |
| `AdminDocumentsAudit.tsx` | Hosszú listák `overflow-hidden` → eltávolítva. |
| `AdminChecklist.tsx` | Drag-area `h-[…]` → `min-h-[…]`. |
| `AdminDrive.tsx` | Fa nézet + preview pane, mobilon tabokba rendezve („Fa" / „Előnézet"). |
| `AdminCalendar.tsx` | Heti grid mobilon vízszintesen scrollozható, dátumfejléc sticky. |
| `MissionPillarPanel.tsx`, `MissionTracker.tsx`, `PipelineFunnel.tsx`, `NorthstarCard.tsx`, `CompanyHealthCard.tsx` | Chart-konténerek `overflow-hidden` + fix `h-…` → `ResponsiveContainer` köré `min-h-[200px]` + `w-full`, kártya maga `h-auto`. |
| `ImageAnalysisPanel.tsx`, `LeadsMap.tsx`, `EmailComposer.tsx`, `ImportWizard.tsx`, `BulkUploadDialog.tsx`, `BatchProcessDialog.tsx`, `MediaLightbox.tsx`, `DocumentSummary.tsx` | Dialógok mobilon `max-h-[90dvh] overflow-y-auto`, footer sticky, hogy a „Mentés" gomb mindig elérhető legyen. |
| `EntityDrawer.tsx` | Drawer mobilon `h-[92dvh]`, belső `overflow-y-auto`. |

### Globális utility
Új CSS class az `index.css`-ben:
```css
.admin-page { @apply p-4 md:p-6 space-y-4 md:space-y-6 max-w-[1400px] mx-auto; }
.admin-card-scroll { @apply overflow-y-auto overscroll-contain; max-height: min(70vh, 600px); }
```
Minden admin oldal root divje `admin-page`-re vált → konzisztens padding + nem ragad széléhez mobilon.

### Bottom nav takarás
A `MobileBottomNav` ~56px magas + safe-area. A `<main>` már `pb-32` mobilon → marad. Ellenőrzés: minden oldal utolsó eleméhez tudunk-e görgetni (Playwright screenshot 3 kulcsoldalon: Dashboard, Documents, Content Studio).

## 3. Felhasználóbarát finomságok

- **„Súgó" toggle** minden oldalon: a `PageIntro` (most mindig látszik) alapból csukva, fejlécben kis `?` gomb nyitja. Kevesebb zaj a napi munkában.
- **Üres állapotok**: minden lista, ahol most csak `—` van, kap egy `EmptyState`-et (már van komponens) — „Még nincs adat, próbáld ezt…" CTA-val.
- **Kártya-sűrűség beállítás**: a dashboardon egy `Tömör / Normál` toggle (localStorage-ba), ami a sávok `space-y` és belső padding értékét cseréli.
- **Konzisztens betöltés**: minden oldal `Skeleton`-t használ a saját ad-hoc spinnerek helyett (most kevert).
- **Hibakezelés**: a meglévő `ErrorBoundary` köré minden admin route-ra ráhúzunk egy reset-gombos fallback-et, hogy egy hibás kártya ne dobja le az egész oldalt.

## 4. Verifikáció

Playwright-tal, mobil viewportban (`375x812`):
1. Belépés admin oldalra (session env-ből).
2. Végigmegyünk a 22 oldalon, mindegyiknél: scroll a lap aljára → screenshot → ellenőrzés hogy az utolsó elem fölött van a bottom nav (nem alatta).
3. Konzol/hálózati hibák gyűjtése.
Eredmény → rövid jelentés a hibás oldalakról, és iteratív javítás.

## Mit NEM csinálunk most
- Nem törlünk üzleti logikát, nem nyúlunk Edge Functionökhöz.
- Nem írjuk át a Supabase sémát.
- Az ⌘K paletta és a keyboard shortcutok maradnak.

## Becslés
~25 fájl módosul, 3 új komponens (`PageHeader`, `Collapsible` szekció wrapper, sűrűség toggle), 0 új függőség. Egy menetben elvégezhető.

---

**Kérdés mielőtt nekiállok**: a dashboard kártyák átszervezésénél (1-2-3 sáv, csukható) a **2. és 3. sáv mobilon alapból zárva** legyen, vagy mindkét platformon? És a nav csoportokat tényleg redukáljuk 3-ra, vagy maradjon az 5-ös, csak vizuálisan tisztábban?
