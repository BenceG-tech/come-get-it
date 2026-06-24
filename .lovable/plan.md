# Fázis 3 — Admin Design Refresh

A választott irány: **Neon Fidelity Pro** paletta (#050505 / #0d1417 / #00bcd4 / #7df9ff) + **Sora + Manrope** tipográfia + **Bento Grid** dashboard layout. Ez összhangban marad a publikus oldal Neon Fidelity brand-jével (lásd Core memory), de az admin felület mélyebb surface-rétegeket, csendesebb glow-t és funkcionális density-t kap.

> Megjegyzés: az `/admin` mögé nem tudtam belépni screenshotért (külső Supabase, nem injektált session), ezért a refresh a meglévő `AdminDashboard.tsx` + Fázis 2 komponensek (PageSectionNav, AdminBreadcrumb, Hero/Columns/Secondary refactor) struktúrájára épül, amit a korábbi fázisokban már ismerünk.

---

## 1. Design token réteg (admin-scoped)

Új **admin-only** token-blokk az `src/index.css`-ben, `.admin-scope` selector alatt — nem nyúl a publikus oldal `:root` változóihoz, így a brand-konzisztencia marad.

Tokenek:
- `--admin-bg: 0 0% 2%` (#050505)
- `--admin-surface-1: 195 25% 7%` (#0d1417 — kártya alap)
- `--admin-surface-2: 195 22% 10%` (kiemelt panel)
- `--admin-surface-3: 195 18% 14%` (hover / aktív)
- `--admin-border: 188 30% 18%` (finom cyan-tinted vonal)
- `--admin-border-strong: 188 60% 30%`
- `--admin-primary: 188 100% 41%` (#00bcd4)
- `--admin-primary-glow: 184 100% 74%` (#7df9ff)
- `--admin-text: 0 0% 96%`
- `--admin-text-muted: 195 12% 65%`
- `--admin-text-dim: 195 10% 45%`
- `--admin-success / warning / danger` (hideg paletta-konform variánsok)
- Gradients: `--admin-gradient-card`, `--admin-gradient-hero`, `--admin-gradient-accent`
- Shadows: `--admin-shadow-card` (puha), `--admin-shadow-glow` (cyan, csak interaktív elemekre), `--admin-shadow-pop` (hover lift)
- Radii: `--admin-radius-sm/md/lg/xl` (8 / 12 / 16 / 24 px)

`AdminLayout.tsx` kap egy `className="admin-scope"`-ot a gyökér wrapperen, így a tokenek scope-oltak.

## 2. Tipográfia

- `bun add @fontsource/sora @fontsource/manrope`
- `src/main.tsx`-ben: `import '@fontsource/sora/400.css'` … `700.css`, `import '@fontsource/manrope/300.css'` … `600.css`
- `tailwind.config.ts`-ben új family: `admin-display: ['Sora', ...sans]`, `admin-body: ['Manrope', ...sans]`
- `.admin-scope` body default: Manrope. Hero number / KPI / section title: Sora (medium 500–600, tight tracking).
- Numeric tabular: `font-variant-numeric: tabular-nums` minden metrikán.

## 3. Bento Grid dashboard refactor

Átalakítjuk a Fázis 2-ben létrehozott `DashboardHero` + `DashboardColumns` + `DashboardSecondaryTabs` szerkezetet egy egységes **bento-grid**-re a `AdminDashboard.tsx`-ben. Cél: egy képernyős, scan-elhető vezérlőpult, ahol a méret = fontosság.

```text
+----------------------------------------------------------+
| BREADCRUMB / TOPBAR (sticky)                             |
+--------------------------+-------------------------------+
| HERO BENTO (col-span 8)  | STREAK + STATUS (col-span 4) |
| Daily briefing + 3 fő    | Streak ring, today's score,  |
| akció (XL CTA)           | quick toggles                |
+----------+---------------+-------------+----------------+
| PIPELINE | INBOX         | AI ACTION   | KPI MINI       |
| (col 4)  | (col 4)       | (col 4)     | (col 4 tall)   |
| sparkline| top 5 unread  | "Mi a köv." | 3 KPI tile     |
+----------+---------------+-------------+                +
| RECIPE / TASK RESULTS (col-span 8)     |                |
| Legutóbbi AI futtatások szalag         |                |
+----------------------------------------+----------------+
| SECONDARY TABS (col-span 12) — KPI / Snapshot / Retro  |
+----------------------------------------------------------+
```

Implementáció:
- Új `src/components/admin/dashboard/BentoGrid.tsx` — wrapper, `grid grid-cols-12 gap-4` + `auto-rows-[minmax(160px,auto)]`.
- Új `src/components/admin/dashboard/BentoCard.tsx` — variants: `hero | metric | list | accent | ghost`, props: `colSpan`, `rowSpan`, `tone` (default | accent | dim). Token-alapú: `bg-[hsl(var(--admin-surface-1))]`, `border-[hsl(var(--admin-border))]`, hover-on `shadow-[var(--admin-shadow-pop)]` + `border-[hsl(var(--admin-border-strong))]`.
- `DashboardHero.tsx`, `DashboardColumns.tsx` átírva, hogy `BentoCard`-okat render-eljenek. Tartalom változatlan; csak a chrome és a layout cserélődik.
- A meglévő `Section` (collapsible) megmarad a hosszú szekciókhoz a lap alján; bento csak a "fold above".

## 4. Komponens-szintű refresh

- **`AdminTopbar` / `AdminLayout`**: vékonyabb (52 px), `backdrop-blur`, alsó border `--admin-border`, breadcrumb beépítve. Logo monogram cyan glow-val.
- **`AdminSidebar`** (ha van): 240 px → 220 px, ikonok 18 px, aktív item `bg-[hsl(var(--admin-surface-2))]` + bal oldali 2 px cyan rail, **glow nélkül** (csendes).
- **`PageSectionNav`** (Fázis 2): dot-rail átszínezve `--admin-primary` aktív állapotra, inaktív `--admin-text-dim`. Mobile chip-bar: `--admin-surface-2` háttér.
- **Buttons**: új `admin` variant a `button.tsx`-ben (vagy admin-scope-on belüli CSS): primary = filled cyan, secondary = ghost cyan border, destructive = piros-cyan mix. Pill marad (Core rule), de admin-on belül `rounded-md` opcióval ahol denser UI kell (pl. táblázat row action).
- **Inputs / Select / Dialog**: `bg-[hsl(var(--admin-surface-2))]`, border tokenizált, focus ring `--admin-primary` 1 px + glow.
- **Táblák** (`leads`, `documents`, `partners`): row hover `--admin-surface-2`, sticky header `--admin-surface-1/95 backdrop-blur`, zebra eltávolítva, helyette finom bottom-border.
- **Badge / Pill**: szín-szemantika (open / done / blocked / waiting) cyan-konform palettán.
- **Toast**: admin-scope-on belül sötét surface + cyan accent.

## 5. Motion & micro-interactions

- `framer-motion` már jelen van. Bento kártyák: belépéskor `staggered fade + 8 px y` (max 300 ms, ease-out), egyszer, nem minden navigáción.
- Hover: 120 ms `translateY(-2px)` + shadow-pop. Nincs scale.
- Section-jump (`admin-section-open` event): smooth scroll + a célszekció 600 ms-ig finom cyan outline pulse.
- Streak ring: SVG conic-gradient, lassú (8 s) rotáció a glow-rétegen.
- Loader: cyan shimmer skeletonok (`--admin-surface-2` → `--admin-surface-3`).

## 6. Érintett oldalak (token-csere + bento opcionális)

Token-csere kötelező (csak class-rename token-utilityvel, struktúra marad):
- `AdminDashboard.tsx` — bento refactor + tokenek
- `AdminLeads.tsx`, `AdminPartners.tsx`, `AdminPartnerDetail.tsx`, `AdminDocuments.tsx`, `AdminTasks.tsx`, `AdminDecisions.tsx`, `AdminInbox.tsx`
- `AdminLayout.tsx`, `AdminBreadcrumb.tsx`, `PageSectionNav.tsx`
- Admin-belüli dialog-ok: `DocumentReviewDialog`, `BulkReviewDialog`, `TaskResultDialog`

Bento layout most csak a Dashboardon; a többi oldal a refreshelt tokent és komponens-stílust kapja, struktúra változatlan (külön kör lehet később).

## 7. Lépésrend (kis, ellenőrizhető commitek)

1. **3.1 Tokenek + fontok** — `index.css` admin-scope blokk, `tailwind.config.ts`, `main.tsx` font importok, `AdminLayout` scope class. Nincs vizuális regresszió a publikus oldalon.
2. **3.2 Primitív refresh** — admin variants: button, input, card, badge, table, dialog (scope-on belül).
3. **3.3 Topbar + Sidebar + Breadcrumb + PageSectionNav** átszínezés.
4. **3.4 Dashboard bento** — `BentoGrid` + `BentoCard`, `DashboardHero` és `DashboardColumns` átkötve.
5. **3.5 Többi admin oldal** — token-csere, hover/border/shadow összehangolás.
6. **3.6 Motion pass** — stagger, hover, section-pulse, skeleton shimmer.
7. **3.7 QA** — Playwright screenshot kör (publikus + admin route-ok, ahol elérhető) + console/network ellenőrzés.

## 8. Out of scope

- Publikus oldal (homepage, /partnerek, /italmarkak, PDF doksik) **nem változik**.
- Új funkció, új edge function, DB séma változás: nincs.
- Mobil admin külön optimalizáció: külön kör (a bento `lg:` breakpoint felett él, alatta auto-stack).

## 9. Technikai részletek

- Új fájlok: `src/components/admin/dashboard/BentoGrid.tsx`, `BentoCard.tsx`.
- Módosított: `src/index.css`, `tailwind.config.ts`, `src/main.tsx`, `src/components/admin/AdminLayout.tsx`, `AdminBreadcrumb.tsx`, `PageSectionNav.tsx`, `src/pages/admin/*.tsx`, admin dialog-ok.
- Csomagok: `@fontsource/sora`, `@fontsource/manrope`.
- Semmi hardcoded szín — minden `hsl(var(--admin-*))`-en keresztül.
- Backward-compat: ha valami komponenst nem szok-olunk `.admin-scope` alá, a régi tokenek érintetlenek.

---

**Mehet az implementáció így, vagy bármelyik ponton finomítsunk** (pl. bento elrendezés sorrendje, sidebar vs. nem-sidebar, density-szint)?
