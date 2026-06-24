
# Admin upgrade — 3 fázisú terv

Sok dolgot kérsz egyszerre, ezért fázisokra bontom. **Fázis 1 + 2 közvetlenül implementálható**, **Fázis 3 (design refresh) extra körrel** megy: előbb paletta/typo/layout választás, aztán 3 rendered direction közül választasz.

---

## FÁZIS 1 — AI „csinálja" 3 új recepttel

A `task-run-recipe` edge function classifier-jét bővítjük + 3 új recept-pipeline. Mindegyik konkrét **eredmény-kártyákat** ír a `task_runs.result_items`-be, amit a `TaskResultDialog` már renderel.

### 1.1 `content` recept
- **Trigger**: „írj posztot…", „email a partnereknek…", „copy a Founding Partnerhez…".
- **Pipeline**: 
  1. Brand Memory + (opcionális) cél persona betöltése.
  2. `generate-content-from-brief` (vagy direkt AI gateway) → 3 variáns draft (rövid / középső / hosszú).
  3. Mindegyik draft külön kártya: csatorna-tag (IG/LinkedIn/Email), szerkeszthető textarea, „Mentés Content Studio-ba" gomb (insert `saved_content_snippets`).

### 1.2 `doc-review` recept
- **Trigger**: feladat doksi-névre vagy doksi-id-re hivatkozik, vagy „nézd át a … doksit".
- **Pipeline**:
  1. Doksi keresés `documents` táblán (név vagy explicit id).
  2. `auto-review-documents` újrahasználva 1 doksira, vagy közvetlen AI-hívás ugyanazzal a rendszer-prompttal.
  3. Eredmény 1 kártya: 4 pont (Erősségek / Hiányzó / Javaslatok / Összegzés) + „Megnyitás" gomb → `/admin/documents?id=…`.

### 1.3 `decision` recept
- **Trigger**: „segíts dönteni…", „mit válasszak…", vagy nyitott `decisions` rekordra hivatkozik.
- **Pipeline**:
  1. Nyitott döntések listázása (`decisions.status = 'open'`), vagy explicit döntés betöltése.
  2. AI strukturált pro/kontra + ajánlás (`recommendation`, `confidence`).
  3. Kártya: opciók, pro/kontra oszlopok, „Elfogadom — naplózom" gomb (insert `decisions` / update status).

### 1.4 Classifier frissítés
A `task-run-recipe` AI classifier prompt-jába belerakjuk az új 3 típust pontos példákkal, hogy a fallback ne mindig `research`-re essen.

---

## FÁZIS 2 — Navigáció & user flow (strukturális, design refresh ELŐTT)

Ez a réteg a meglévő tokeneken belül marad, hogy a fázis 3 design refresh tiszta lapra dolgozzon.

### 2.1 Globális command palette előtérben
- ⌘K / Ctrl+K hint a topbar-ban (kis chip: „⌘K — keresés mindenhol").
- Palette tartalom: route-ok, partnerek (top 50), nyitott feladatok, doksik. Fuzzy keresés.
- Új komponens: `src/components/admin/CommandPaletteHint.tsx`, hook a meglévő palette-hez.

### 2.2 Sticky in-page section nav (jobb oldali quick-jump)
- Új `<PageSectionNav />` komponens — automatikusan kigyűjti az oldalon lévő `<section id>`-okat, IntersectionObserver-rel highlightolja az aktívat.
- Bevezetés: `AdminDashboard`, `AdminPartnerDetail`, `AdminDocuments`. Mobilon összecsuklik horizontális tab-bar-rá az oldal tetején (sticky).

### 2.3 Breadcrumb mindenhol
- `<AdminBreadcrumb />` az `AdminLayout` topbar-jában, route-config alapján generálva (a NAV_GROUPS-ot használva forrásként).

### 2.4 Dashboard prioritás
- Jelenlegi flat lista → **1 hero zóna** (mai 3 feladat + napi briefing + streak) + **2 oszlop** (bal: pipeline pulse, jobb: inbox/AI gyors-csinál).
- Másodlagos kártyák (KPI snapshot-ok, retro, checklist) **tab-ek** mögé: „Áttekintés / Számok / Retro".
- Új struktúra: `DashboardHero`, `DashboardColumns`, `DashboardSecondaryTabs`.

### 2.5 Mobil
- Bottom nav változatlan, de minden hub-oldalon `<MobileSectionTabs />` — egész oldalas swipe szekciók (a meglévő `Carousel` primitive-vel), nem összevisszán scrollozható kártya-tömeg.

---

## FÁZIS 3 — Admin design refresh (extra körrel, redesign skill szerint)

Mivel „nagyobb refresh"-t kértél, **NEM** kezdek implementálni dizájnt amíg nem pin-eltük az ízlést. Miután fázis 1+2 megvan, az alábbi sorrendben megyünk:

1. **Capture**: Playwright screenshot a jelenlegi `/admin` Dashboardról és egy belső oldalról (Partner detail vagy Documents).
2. **Pin the taste**: 1 round, 3 kérdés egyszerre — paletta (4 swatch opció a Neon Fidelity környékéről, pl. mélyebb noir, hidegebb cyan, hibrid magenta-accent), typography pair (4 preset), layout (4 wireframe: dashboard / bento-grid / asymmetric / sidebar).
3. **3 direction generálás** `design--create_directions`-szel, a screenshot + locked palette/typo/layout alapján. 3 distinct kompozíció.
4. **Te választasz** prototype kérdéssel, és csak ezután kódolom be — pontos token-átvétellel.

A refresh scope: `AdminLayout` (topbar, sidebar), `AdminDashboard`, `AdminPartnerDetail`. Az egyedi feature-oldalak (Outreach, Content Studio) az új token-rendszerre automatikusan átállnak, finom utómunka után.

---

## Technical notes

**Új / módosított fájlok (Fázis 1+2):**
- `supabase/functions/task-run-recipe/index.ts` — classifier prompt + 3 új recept függvény
- `supabase/functions/generate-decision-analysis/index.ts` *(új, ha nincs)*
- `src/components/admin/dashboard/TaskResultDialog.tsx` — új kártya-renderek (content draft, doc review, decision)
- `src/components/admin/CommandPaletteHint.tsx` *(új)*
- `src/components/admin/PageSectionNav.tsx` *(új)*
- `src/components/admin/AdminBreadcrumb.tsx` *(új)*
- `src/components/admin/MobileSectionTabs.tsx` *(új)*
- `src/pages/admin/AdminDashboard.tsx` — hero + columns + tabs refactor
- `src/pages/admin/AdminLayout.tsx` — breadcrumb + ⌘K hint
- `src/pages/admin/AdminPartnerDetail.tsx`, `AdminDocuments.tsx` — section id-k + nav beillesztés

**Nincs új tábla.** A `task_runs.result_items` és `recipe_type` már létezik, az új receptek azt használják.

**Migráció:** nincs DB változás Fázis 1+2-ben. Fázis 3-ban csak ha új token-rendszer kell (CSS-only akkor is).

---

## Sorrend

1. Fázis 1 (3 új recept) — ~1 hosszú implementációs kör.
2. Fázis 2 (nav + dashboard layout) — ~1 hosszú kör.
3. Fázis 3 (design refresh) — paletta/typo/layout kérdés → directions → választás → implement.

Mehet így, vagy átrendezzük (pl. design refresh előbb)?
