## Fázis 3 — User flow varratok + Dashboard vizuális rehab

A képen látható dashboard problémái: rideg fekete blokkok, nincs vizuális hierarchia, az "AI napi briefing" egy hatalmas, nehezen olvasható szövegfal, a jobb oldali Founder Inbox üres-szerű (3 db ugyanaz a "trend digest"), és a két oszlop magassága/sűrűsége nincs összehangolva.

### A) Dashboard megjelenés javítás (azonnali rehab)

**1. Vizuális hierarchia + light surface**
- A `TodayCard`, `PipelinePulseCard`, `WeekCard` és `Founder Inbox` mind ugyanazt a fekete háttér + cyan keret kombót használja → unalmas. Bevezetek 3 felület-szintet:
  - `surface-1` (kártya alap): `bg-white/[0.02]` + `border-white/[0.06]`
  - `surface-2` (kiemelt kártya, pl. mai briefing): `bg-gradient-to-br from-cyan-500/[0.04] via-transparent to-transparent` + `border-cyan-500/20`
  - `surface-3` (sub-blokk a kártyán belül): `bg-white/[0.015]` + `rounded-xl`, halvány bal oldali accent bar
- Egységes `rounded-2xl`, finomabb belső padding (24px), 12px-os szekció-gap.

**2. AI napi briefing tagolása**
- A jelenlegi 3 szöveg-blokk (Tegnap / Mai fókusz / Figyelmeztetések) átalakul **3 mini-kártyára** ikonnal és színkóddal:
  - Tegnap → zöld accent + `TrendingUp`
  - Mai fókusz → cyan accent + `Target`
  - Figyelmeztetések → amber accent + `AlertTriangle`
- Minden mini-kártya max 2 mondat összegzéssel, "Részletek" expand chevronnal. A hosszú szövegek alapból csukva.
- A "Javasolt fókusz" lista chip-stílusú, számozott pirula gombokkal, az "Átemelés Top 3 fókuszba" CTA primary gradient pill.

**3. Most / Reggel / Este tabok**
- Jelenleg üres-szerűek. Átalakul `SegmentedControl` stílusra (csúszó háttér), és csak akkor látszik a tab-sor, ha tényleg több nézet van — különben csak az aktuális napszak címkéje.

**4. Founder Inbox tisztítás**
- 3× ugyanaz a "trend digest" → group-by típus, 1 sor + badge `×3`.
- Üres állapot: ha nincs valódi jelzés, ne 0-tételes lista jelenjen meg, hanem "Minden tiszta" illusztráció.
- Sorok: ikon (típus szerint) + cím + relatív idő + jobbra `→`, hover halvány cyan glow.

**5. Layout ritmus**
- A jelenlegi `grid-cols-3` (2:1) marad, de:
  - Bal oszlop: `TodayCard` (nagy) + alá `PipelinePulseCard` + `WeekCard` egymás alatt
  - Jobb oszlop: `Founder Inbox` (sticky a görgetésnél) + alá kompakt `QuickActions` kártya (új lead / új jegyzet / új feladat) + `MiniStreak` (egysoros)
- Köztük 16px-os gap, mobilon egyetlen oszlop.

**6. Tipográfia + szín finomhangolás**
- Kártya címek: Sora 16px semibold, ikon + cím egy sorban, alatta `text-white/50` subtitle.
- Body: Manrope 14px / `text-white/70`, a hangsúlyos számok 28px cyan.
- Megszüntetjük a teljes cyan border-t — helyette csak felső 1px-es cyan glow-line a `surface-2` kártyák tetején.

### B) User flow varratok (Fázis 3 lényeg)

**1. Lead → Outreach folytonosság**
- `LeadDetailDrawer`-be beépítjük az `outreach-quick-drafts` chip-eket egy "Következő lépés" sávként, így a drawerből 1 kattintással küldhető megkeresés (nem kell külön modalt nyitni egyszerű esetekhez).
- A pipeline kanban kártyán direkt "Megkeresés" gomb, ami a drawert egyből az outreach pane-en nyitja.

**2. Inbox → akció link**
- Minden inbox item kap egy elsődleges akciót (pl. trend digest → "Megnyitás Trendekben", lead jelzés → "Lead megnyitása"), így nem kell visszanavigálni.
- Egységes `InboxItemRow` komponens.

**3. Hub-on belüli mély-link megőrzés**
- A hub-fülek (Pipeline/Tartalom/Tudás) megőrzik a query paramétereket (pl. szűrők, kiválasztott lead), hogy a fülek közötti váltás ne dobja vissza a felhasználót.
- `useHubNavigation` hook a sticky state-hez (sessionStorage).

**4. Globális "Vissza ide" emlékezet**
- Amikor egy oldalról drilldown-olsz (pl. lead → partner profil), a vissza nyíl tényleg az előző kontextusra visz, nem a hub gyökerére. Egy egyszerű `useBackStack` hook a layoutban.

**5. Parancspaletta (Cmd+K) bővítés**
- A jelenlegi "Keresés / parancs" sorhoz hozzáadjuk a leggyakoribb 8 akciót: új lead, új feladat, nyiss inbox, mai fókusz, scrape leadek, generálj outreach-et, briefing frissítés, este zárás.
- Recent items + fuzzy search.

**6. Toast → akció**
- A hosszan futó folyamatok (bulk research, score, grade) toastjai kapnak "Megnyitás" akciót az eredmény oldalra, és progress sávot.

### Érintett fájlok (technikai)

```text
src/pages/admin/AdminDashboard.tsx          (layout újrarendezés)
src/components/admin/dashboard/
  TodayCard.tsx                             (3 mini-kártya tagolás, segmented tabs)
  PipelinePulseCard.tsx                     (surface-1 stílus)
  WeekCard.tsx                              (surface-1 stílus)
  FounderInboxCard.tsx                      (új: group-by + üres állapot)
  QuickActionsCard.tsx                      (új: jobb oszlop kompakt)
  MiniStreak.tsx                            (új: 1 soros streak)
src/components/admin/ui/
  SurfaceCard.tsx                           (új: 3 szintű surface variant)
  SegmentedControl.tsx                      (új)
src/components/admin/leads/
  LeadDetailDrawer.tsx                      (+ outreach chip sáv)
  LeadKanbanCard.tsx                        (+ direkt Megkeresés gomb)
src/components/admin/inbox/InboxItemRow.tsx (új, egységes)
src/hooks/
  useHubNavigation.ts                       (új)
  useBackStack.ts                           (új)
src/components/admin/CommandPalette.tsx     (bővített akciók)
src/index.css                               (admin surface tokenek)
```

### Sorrend
1. SurfaceCard + dashboard layout újrarendezés (vizuális rehab — ez azonnal látszik a képen lévő problémán)
2. TodayCard tagolás + FounderInbox group-by
3. Lead drawer outreach sáv + kanban gomb
4. Inbox akció linkek + hub-nav memória
5. Command palette bővítés + toast akciók

Mehet?
