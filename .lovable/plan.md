
# Build-time static prerender — final implementation plan

## Confirmed business facts (used in copy + llm.html + JSON-LD)
- **Model:** Hybrid — free pontgyűjtős verzió + opcionális előfizetés (990 HUF/hét, 2990 HUF/hó) napi 1 ingyen italért partnerhelyeken.
- **GIVE:** Minden beváltott italért 1 napi tiszta ivóvíz egy rászorulónak. Az appban kumulatív, visszamenőleges számláló (pl. "Te már 25 napi tiszta vizet biztosítottál").
- **Piac:** Budapest induláskor, országos terjeszkedés tervezett.

## Adjustments from your feedback (locked in)
1. Shared SEO data lives in `src/seo/routes.ts` — **plain TS data only**: strings, arrays, JSON-compatible objects. No React, no hooks, no `window`/`document`. Both the React `<SEO>` component and the build-time prerender import this same module.
2. **No `postbuild` lifecycle reliance.** The prerender runs as a **Vite plugin** registered in `vite.config.ts` via the `closeBundle` hook. This guarantees it runs as part of `vite build` on Lovable hosting (and any other host) — same process, same Node, no extra script invocation, no dependency on npm script lifecycles.

## Files

### New
- `src/seo/routes.ts` — single source of truth.
  - Exports `SITE_ORIGIN`, `DEFAULT_OG_IMAGE`, `RouteSEO` type, `ROUTES` array, `getRouteByPath`, `absoluteUrl`.
  - Each `RouteSEO` entry: `path`, `distDir`, `title`, `description`, `h1`, `bodyHtml` (semantic HTML fragment), `lastmod`, `priority`, `changefreq`, `noindex?`, `jsonLd[]`.
- `src/seo/prerender-plugin.ts` — Vite plugin (Node-only, uses `node:fs`/`node:path`).
  - Hook: `closeBundle`.
  - Reads the freshly built `dist/index.html`.
  - For each route in `ROUTES`:
    - Clones the HTML.
    - Replaces `<title>` and the head meta block with route-specific values (title, description, canonical, OG, Twitter, robots).
    - Removes existing JSON-LD scripts that are page-specific, keeps the global Organization/WebSite blocks, then appends route `jsonLd[]` blocks.
    - Replaces the contents of `<div id="root">…</div>` with the route's `bodyHtml`.
    - Writes to `dist/<distDir>/index.html` (root → `dist/index.html`).
  - Also regenerates `dist/sitemap.xml` from `ROUTES` (skipping `noindex`) so it can never drift from the route table.
  - Logs a warning for any route declared in `App.tsx` but missing from `ROUTES` (best-effort: regex scan of `src/App.tsx`).

### Modified
- `vite.config.ts` — register `prerenderPlugin()` after `react()`.
- `index.html` — clean shell:
  - Remove the duplicate `<title>` line.
  - Keep only **global** JSON-LD (Organization, WebSite). Per-route JSON-LD is appended by the plugin.
  - Replace the hidden fallback `<h1>Come Get It</h1>` block inside `#root` with a single neutral placeholder comment (`<!-- prerender:body -->`); the plugin replaces this per route. For `/` the homepage `bodyHtml` is injected here too.
- `src/components/SEO.tsx` — keep behaviour, but import title/description/canonical defaults and JSON-LD from `src/seo/routes.ts` so SPA navigation updates match the prerendered HTML exactly. Still uses `useEffect` for client-side updates after route changes.
- `src/pages/*.tsx` — no copy changes needed; pages can drop their hard-coded `<SEO>` props in favor of `<SEO route="/vendeglatohelyek" />` which looks up the shared data. (Backwards-compatible: explicit props still win.)
- `public/llm.html` — rewrite to reflect the confirmed model (hybrid free + 990/2990 HUF, GIVE = napi tiszta víz, Budapest induláskor).
- `public/sitemap.xml` — initial static version kept; the plugin overwrites it on each build with up-to-date `lastmod` from `ROUTES`.
- `public/robots.txt` — already references the sitemap; no change.

## How the build flow works on Lovable
```
vite build
  ├─ React app builds normally → dist/index.html, dist/assets/*
  └─ closeBundle()  ← prerender plugin runs in the same process
       ├─ writes dist/<route>/index.html for every public route
       └─ writes dist/sitemap.xml from ROUTES
```
Lovable hosting serves `dist/<route>/index.html` when the path matches a real file; SPA fallback only kicks in for routes without one. No hosting config or `_redirects` needed.

## Hydration safety
Prerendered `<main data-prerender="true">` lives inside `#root`. React 18's `createRoot(...).render(...)` replaces the container's children on first render, so the static markup is swapped for the live UI within the first frame — no visible flash, no double content. Crawlers without JS see only the static markup.

## Per-route content (Hungarian, focused)
| Route | H1 | Includes in body |
|---|---|---|
| `/` | Come Get It – Igyál, gyűjts pontokat, segíts másokon | Hybrid model, 990/2990 HUF, GIVE = napi tiszta víz, Budapest, waitlist CTA, footer-style nav |
| `/vendeglatohelyek` | Vendéglátóhelyeknek – Csatlakozz a Come Get It hálózathoz | Audience, benefits, 4-step onboarding, jelentkezés CTA |
| `/italmarkak` | Italmárkáknak – Mérhető fogyasztói aktiváció | Aktivációk, kampánymérés, sponsorship, célközönség, kapcsolat |
| `/rewards-partners` | Rewards Partnerek – Kínálj jutalmat, érj el új közönséget | Mit adnak, miért éri meg, beváltás QR-rel, jelentkezés |
| `/come-get-it-accelerator` | Come Get It Accelerator – Nőj a hálózatunkkal | Mi az, kinek, mit adunk, jelentkezés |
| `/adatvedelmi-szabalyzat` | Adatvédelmi szabályzat | Teljes irányelv (adatkezelő, adatok köre, jogalap, feldolgozók, megőrzés, jogok, NAIH, kapcsolat) |

## JSON-LD per route
- `/`: global Organization/WebSite/MobileApplication (in `index.html`) + route-specific `FAQPage` (3 Q&A: ár, piac, GIVE).
- `/vendeglatohelyek`, `/italmarkak`, `/rewards-partners`, `/come-get-it-accelerator`: `BreadcrumbList` + `Service`.
- `/adatvedelmi-szabalyzat`: `WebPage`.

## llm.html rewrite (key facts)
- Hybrid: ingyenes pontgyűjtés + 990 HUF/hét vagy 2990 HUF/hó előfizetés napi 1 ingyen italért.
- GIVE: minden beváltott italért 1 napi tiszta ivóvíz egy rászorulónak; appban kumulatív számláló.
- Piac: Budapest induláskor, országos terjeszkedés tervezett.
- Kapcsolat, partneri oldalak: változatlan linkstruktúra.

## Deliverables after build
After `vite build`, I will run a verification pass that reads each generated file from `dist/` and prints a markdown table for every public route:
- URL, file path in `dist/`, `<title>`, meta description, canonical, H1, first 300 words of crawlable text, JSON-LD present (yes/no), robots directive.

I will also explicitly confirm the existence of:
- `dist/index.html`
- `dist/vendeglatohelyek/index.html`
- `dist/italmarkak/index.html`
- `dist/rewards-partners/index.html`
- `dist/come-get-it-accelerator/index.html`
- `dist/adatvedelmi-szabalyzat/index.html`
- `dist/llm.html`
- `dist/sitemap.xml`
- `dist/robots.txt`

## Risks / tradeoffs
- Adds ~1–2s to build time. No new runtime dependencies; uses Node built-ins only.
- Future routes must be added to `ROUTES` in `src/seo/routes.ts`. The plugin warns at build time if `App.tsx` declares a route not present in `ROUTES`.
- Domain redirects (www, .com, lovable.app → come-get-it.app) and Google Search Console sitemap submission remain manual post-deploy steps.
