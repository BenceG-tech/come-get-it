
# SEO & AI Crawlability Implementation Plan

Canonical domain: **https://come-get-it.app** (non-www). All other domains (`www.come-get-it.app`, `comegetitapp.com`, `come-get-it.lovable.app`) should 301 to it — this is configured in Lovable's Domain settings, not in code. I'll flag it but cannot do it from code.

Rendering approach: **meta-only** (no SSR/prerender). Google executes JS so per-page meta works for search; for AI crawlers we add a static `/llm.html` and inline as much homepage content as possible into `index.html` so non-JS bots get useful text.

---

## 1. Public route inventory

| Path | Purpose | Index? | Title (≤60c) | Description (~150c) | In sitemap |
|---|---|---|---|---|---|
| `/` | Landing + waitlist | ✅ | Come Get It – Gyűjts pontokat, szerezz jutalmakat | Az új generációs app, ahol minden korttyal pontokat gyűjtesz, jutalmakat szerzel és jótékonykodást támogatsz. Regisztrálj elő! | ✅ priority 1.0 |
| `/vendeglatohelyek` | Venue partner pitch | ✅ | Vendéglátóhelyeknek – Come Get It Partner | Csatlakozz a Come Get It-hez vendéglátóhelyként. Új vendégek, hűségrendszer, mérhető forgalom. Jelentkezz partnernek! | ✅ 0.8 |
| `/italmarkak` | Drink-brand partner pitch | ✅ | Italmárkáknak – Come Get It Partner | Érd el közvetlenül a fogyasztókat. Italmárkaként mérhető kampányok és aktivációk a Come Get It appban. | ✅ 0.8 |
| `/rewards-partners` | Reward providers | ✅ | Rewards Partnerek – Come Get It | Kínálj jutalmakat felhasználóinknak és növeld márkád ismertségét a Come Get It közösségében. | ✅ 0.8 |
| `/come-get-it-accelerator` | Accelerator program | ✅ | Come Get It Accelerator | Felgyorsítjuk a vendéglátó- és italmárka-partnereket. Tudd meg, hogyan vehetsz részt az Acceleratorban. | ✅ 0.7 |
| `/adatvedelmi-szabalyzat` | Privacy policy | ✅ | Adatvédelmi szabályzat – Come Get It | Hogyan kezeljük a személyes adataidat a Come Get It alkalmazásnál és weboldalán. | ✅ 0.3 |
| `/llm.html` | AI summary | ✅ | Come Get It – AI/LLM összefoglaló | Sűrű, tényalapú leírás a Come Get It appról AI rendszerek számára. | ✅ 0.5 |
| `/auth` | Login | ❌ noindex | – | – | ❌ |
| `*` (NotFound) | 404 | ❌ noindex | – | – | ❌ |

---

## 2. Files to create / modify

### Create
- **`public/robots.txt`** — overwrite with:
  ```
  User-agent: *
  Allow: /
  Disallow: /auth

  User-agent: Googlebot
  Allow: /
  User-agent: Bingbot
  Allow: /
  User-agent: GPTBot
  Allow: /
  User-agent: OAI-SearchBot
  Allow: /
  User-agent: ChatGPT-User
  Allow: /
  User-agent: PerplexityBot
  Allow: /
  User-agent: ClaudeBot
  Allow: /
  User-agent: Claude-Web
  Allow: /
  User-agent: anthropic-ai
  Allow: /
  User-agent: Google-Extended
  Allow: /
  User-agent: CCBot
  Allow: /
  User-agent: Applebot
  Allow: /
  User-agent: Applebot-Extended
  Allow: /
  User-agent: Twitterbot
  Allow: /
  User-agent: facebookexternalhit
  Allow: /

  Sitemap: https://come-get-it.app/sitemap.xml
  ```

- **`public/sitemap.xml`** — static XML listing the 8 indexable URLs above with `<lastmod>2026-05-05</lastmod>` and the priorities in the table.

- **`public/llm.html`** — standalone semantic HTML page (no JS) with: H1, one-sentence summary, who it's for, how it works (Drink/Link/Earn/Give), benefits, FAQ, contact (`hello@come-get-it.app`), social (`@comegetit_app`), market (Hungary), links to all public pages, link back to `/`. Linked from the site footer.

- **`src/components/SEO.tsx`** — small reusable component (no new deps) using `useEffect` to set `document.title`, description, canonical, OG (title/description/url/image), Twitter card, optional JSON-LD `<script type="application/ld+json">`, and optional `noindex`. Cleans up on unmount. Used by every page.

- **`src/components/Footer.tsx`** — visible footer for all public pages with **real `<a href>` links** (not onClick) to every public route + `/llm.html` + socials + email + copyright. Add to `Index.tsx` and the 5 sub-pages.

### Modify
- **`index.html`**
  - Tighten homepage `<title>`/description to the values above.
  - Update OG image references already in place; keep canonical `https://come-get-it.app/`.
  - Add `<link rel="alternate" hreflang="hu" …>` and `hreflang="x-default"`.
  - Inside `<div id="root">`, inject a static SEO/AI fallback block (hidden visually but in DOM) containing: H1, one-paragraph description, the 4 pillars, links to all public pages. React replaces it on hydration so no UX impact, but non-JS crawlers see it.
  - Add JSON-LD blocks: `Organization`, `WebSite` (with `SearchAction` only if applicable — skip), `MobileApplication` (Come Get It app, OS: iOS/Android, applicationCategory: LifestyleApplication, offers free).

- **`src/pages/Index.tsx`** — add `<SEO …>` with homepage meta + JSON-LD (Organization + MobileApplication + FAQPage if FAQ exists; otherwise omit). Add `<Footer />`.

- **`src/pages/Vendeglatohelyek.tsx`**, **`Italmarkak.tsx`**, **`RewardsPartners.tsx`**, **`ComeGetItAccelerator.tsx`** — add `<SEO …>` with the per-page title/description/canonical above + `BreadcrumbList` JSON-LD. Add `<Footer />`. Ensure exactly one `<h1>`.

- **`src/pages/AdatvedelmiSzabalyzat.tsx`** — replace the inline `useEffect` SEO block with `<SEO />`. Add `<Footer />`.

- **`src/pages/Auth.tsx`** — add `<SEO noindex />`.

- **`src/pages/NotFound.tsx`** — add `<SEO noindex title="404 – Come Get It" />`.

- **`src/components/Navigation.tsx`** & **`MobileNavigation.tsx`** — convert in-page section navigation buttons to real `<a href="/#drink">` etc. (keeping smooth-scroll handler via `onClick` with `preventDefault` only when already on `/`). Keeps crawlable hrefs.

---

## 3. Semantic HTML pass

- Verify exactly one `<h1>` per page (HeroSection, each partner page hero, privacy page).
- Wrap page bodies in `<main>`; existing `<nav>` already used; add `<footer>` via new Footer component.
- Section components already use `<section>` largely — spot-fix any `<div>` that should be `<section>` or `<article>`.

## 4. Content quality (light pass)

Rewrite the first paragraph of each partner page hero to lead with a direct factual answer (who it's for, what they get, how to apply) before marketing copy. No layout changes.

---

## 5. What I will NOT do

- No SSR / prerender build changes (per your choice).
- No domain redirect config (must be done in Lovable Domain settings — I'll remind you).
- No new dependencies (`react-helmet-async` not needed; `useEffect` is enough).
- No design, color, or copy-tone changes beyond the small content-quality pass.

## 6. Risks / tradeoffs

- Pure-SPA meta still requires JS execution for Google. The static fallback block in `index.html` + `/llm.html` mitigates this for AI/LLM bots that don't run JS.
- Multiple `useEffect`-set `<meta>` tags can race if a user navigates fast; the SEO component will remove its tags on unmount to prevent stacking.
- Converting nav buttons to `<a href>` slightly changes keyboard/click behavior — handler will preserve current smooth-scroll UX.

---

## 7. Verification checklist (post-deploy)

- [ ] `https://come-get-it.app/robots.txt` loads, contains `Sitemap:` line
- [ ] `https://come-get-it.app/sitemap.xml` loads, valid XML, 8 URLs
- [ ] `https://come-get-it.app/llm.html` loads as plain HTML
- [ ] Each public page has unique `<title>` + meta description (DevTools)
- [ ] Each indexable page has exactly one `<link rel="canonical">` pointing to come-get-it.app
- [ ] `/auth` and 404 carry `<meta name="robots" content="noindex">`
- [ ] Nothing in robots.txt blocks `/assets/`, `/lovable-uploads/`, JS, CSS
- [ ] Footer with real `<a href>` links visible on every public page
- [ ] Lighthouse SEO ≥ 95 on `/` and each partner page
- [ ] Google Rich Results test passes for Organization + MobileApplication
- [ ] Search Console: submit `sitemap.xml`
- [ ] Lovable Domain settings: confirm `www.come-get-it.app` and `comegetitapp.com` 301 → `come-get-it.app`

After approval, I'll switch to build mode and apply all changes in one pass.
