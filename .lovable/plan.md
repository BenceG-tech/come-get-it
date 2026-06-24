
# Fázis 2 — Navigáció és user flow

A meglévő tokeneken belül maradunk (design refresh fázis 3-ban jön). Cél: kevesebb klikk, gyorsabb tájékozódás, kevesebb scroll-vakság.

---

## 2.1 ⌘K Command Palette előtérben

**Probléma:** A palette létezik, de senki nem tud róla.

- A `AdminLayout` topbar-jába kis chip: **„⌘K — keresés"** (Mac-en ⌘, máshol Ctrl), kattintható is.
- A palette tartalma frissül: route-ok (NAV_GROUPS-ból), top 50 partner (név/város), nyitott feladatok (`pipeline_tasks`), top 20 doksi (cím). Fuzzy keresés a meglévő `cmdk` primitive-vel.
- Új fájl: `src/components/admin/CommandPaletteHint.tsx`. Meglévő palette komponens kiegészítése partner/doksi/feladat forrásokkal.

## 2.2 In-page section nav (jobb oldali quick-jump)

**Probléma:** Hosszú oldalakon (Dashboard, Partner detail, Documents) elveszik a kontextus.

- Új komponens: `src/components/admin/PageSectionNav.tsx`.
  - Props: `sections: { id: string; label: string; icon?: LucideIcon }[]`.
  - Desktop (≥lg): fix jobb oldalon, `position: sticky; top: 80px`, vékony pont-sor + label hover-re.
  - IntersectionObserver tracking → aktív szekció kiemelve electric-300 színnel.
  - Mobil: sticky horizontális tab-bar az oldal tetején, vízszintesen scrollozható.
- Bevezetés: `AdminDashboard`, `AdminPartnerDetail`, `AdminDocuments`. Minden szekciónak `<section id="…">` wrapper.

## 2.3 Globális breadcrumb

**Probléma:** Mély oldalakon (pl. `/admin/partners/:id`) nem látszik hol vagy.

- Új komponens: `src/components/admin/AdminBreadcrumb.tsx`.
- Forrás: route + `NAV_GROUPS` matching + (ha partner/doksi detail) entitás cím lekérdezés.
- Beépül a `AdminLayout` topbar-ba a `SidebarTrigger` mellé.
- Shadcn `breadcrumb` primitive-t használja, minden szegmens Link.

## 2.4 Dashboard prioritás-átalakítás

**Probléma:** Egyforma kártya-folyam, nincs vizuális hierarchia, sokat kell scrollozni.

Új struktúra:

```text
┌─────────────────────────────────────────────────────────┐
│  HERO ZÓNA  (full-width)                                │
│  Napi briefing rövidke + Mai 3 feladat (TodayTasksCard) │
│  + Streak chip                                          │
└─────────────────────────────────────────────────────────┘
┌────────────────────────────┬────────────────────────────┐
│  BAL OSZLOP (2/3)          │  JOBB OSZLOP (1/3)         │
│  · Pipeline pulse          │  · Inbox (top 5)           │
│  · Outreach gyors-status   │  · AI "Mit csináljak?"     │
│  · Recent activity         │    + AI csinálja gomb      │
└────────────────────────────┴────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│  TABS: Áttekintés / Számok / Retro / Eszközök          │
│  (másodlagos kártyák ide kerülnek — KPI snapshot,      │
│   weekly retro, checklist, mission summary, stb.)      │
└─────────────────────────────────────────────────────────┘
```

- Új komponensek: `DashboardHero.tsx`, `DashboardColumns.tsx`, `DashboardSecondaryTabs.tsx` (mind `src/components/admin/dashboard/` alatt).
- `AdminDashboard.tsx` refaktor: csak komponens-kompozíció, minden meglévő kártya megmarad, csak átrendeződik.
- A meglévő szekciók a 2.2 `PageSectionNav` bemenetét adják (id-k: `hero`, `pipeline`, `inbox`, `overview-tabs`).

## 2.5 Mobil swipe-szekciók

**Probléma:** Mobilon a dashboard egy végtelen scroll-tömeg.

- Új komponens: `src/components/admin/MobileSectionTabs.tsx` a meglévő `Carousel` primitive fölé.
- Csak `<lg` (mobil + tablet) bekapcsol — felül horizontális tab-fejlécek, swipe-elhető szekciók.
- Bevezetés: `AdminDashboard`-on. Más hub-okon később.

---

## Technical notes

**Új fájlok:**
- `src/components/admin/CommandPaletteHint.tsx`
- `src/components/admin/PageSectionNav.tsx`
- `src/components/admin/AdminBreadcrumb.tsx`
- `src/components/admin/MobileSectionTabs.tsx`
- `src/components/admin/dashboard/DashboardHero.tsx`
- `src/components/admin/dashboard/DashboardColumns.tsx`
- `src/components/admin/dashboard/DashboardSecondaryTabs.tsx`

**Módosított fájlok:**
- `src/pages/admin/AdminLayout.tsx` — breadcrumb + ⌘K hint a topbar-ban
- `src/pages/admin/AdminDashboard.tsx` — refaktor új struktúrára
- `src/pages/admin/AdminPartnerDetail.tsx` — section id-k + PageSectionNav
- `src/pages/admin/AdminDocuments.tsx` — section id-k + PageSectionNav
- (opcionális) meglévő command palette komponens — több forrással

**Nincs DB változás.** Nincs új edge function.

**Token / design constraint:** csak meglévő semantic class-okat használjuk (`bg-nf-surface-alt`, `text-electric-300`, `border-nf-border`, stb.). Semmi hardcoded szín. A design refresh (fázis 3) ezeket fogja átírni egy helyen.

---

## Sorrend (egy turn alatt szállítva)

1. `PageSectionNav` + `AdminBreadcrumb` + `CommandPaletteHint` komponensek
2. `AdminLayout` beillesztés
3. Dashboard hero/oszlop/tabs refaktor
4. `MobileSectionTabs` integráció
5. Partner detail és Documents section id-k + nav
6. Typecheck

Készen állok rá. Indítsam?
