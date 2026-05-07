## Update per-page SEO meta tags

The site already has a `<SEO>` component (`src/components/SEO.tsx`) that sets title, description, canonical, og:title, og:description, og:url, twitter tags, etc. Each page already calls it — only the title/description strings need updating. Canonical paths are already correct.

### Edits

**`src/pages/Index.tsx`** (lines 154–155)
- title: `Come Get It — Találd meg, hova menj ma Budapesten`
- description: `Budapesti loyalty és discovery app. Ingyen italok, pontok, jutalmak — szeptemberben indulunk. Csatlakozz alapító tagként.`

**`src/pages/Vendeglatohelyek.tsx`** (lines 82–83)
- title: `Vendéglátóhelyeknek — Founding Partner Program | Come Get It`
- description: `Csatlakozz az első 15 budapesti partnerhelyhez. 6 hónap jutalékmentes, 100+ új vendég havonta a holtidőkben.`

**`src/pages/Italmarkak.tsx`** (lines 50–51)
- title: `Italmárkáknak — Digitális sampling Budapesten | Come Get It`
- description: `Mérhető brand-aktiváció valódi fogyasztási helyzetben. Az italmárka-program a 2. fázisban indul.`

**`src/pages/RewardsPartners.tsx`** (lines 102–103)
- title: `Rewards Partnereknek — Legyél beváltható jutalom | Come Get It`
- description: `Add a saját termékedet a Come Get It közösségnek. A rewards-program a 2. fázisban indul.`

**`src/pages/ComeGetItAccelerator.tsx`** (lines 104–105)
- title: `Founding Partner Program — Csatlakozz korán | Come Get It`
- description: `A Come Get It Founding Partner Program vendéglátóknak, italmárkáknak és rewards-partnereknek. Korai hozzáférés, exkluzív feltételek, lifetime preferred státusz.`

### Sitemap
`public/sitemap.xml` already includes all 5 routes with correct canonical URLs. Bump each `<lastmod>` for the 5 routes to today's date (`2026-05-07`). No structural changes.

### Notes
- og:title / og:description / og:url / twitter tags are auto-derived from title/description/canonical inside the `SEO` component, so no further changes needed.
- Existing JSON-LD breadcrumbs remain untouched.
