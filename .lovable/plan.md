## Goal

Visual-only redesign of `/italmarkak` to match the reference: cinematic dark bar atmosphere, glass cards, large hero phone with cyan cocktail on the right, connector line between the 4 process steps, full-width highlight card for the 5th feature, and a wide CTA banner with cyan mesh art. No copy, fields, logic, routes, SEO, prerender, analytics or translations are touched. Reuses existing assets (`budapest-night-hero.jpg`, `cyan-cocktail.png` already in `src/assets/`).

## Per-section changes in `src/pages/Italmarkak.tsx`

### Hero
- Keep `<HeroBackground />` (Budapest night) but add a left-side dark gradient overlay (`hidden lg:block absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-[#03060d] via-[#03060d]/85 to-transparent`) inside the hero section so headline stays readable.
- Adjust hero grid to 45/55: `lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]`.
- Right-side composition: replace the lone `PhoneGlowWrapper` with a relative wrapper containing both phone and the cyan cocktail PNG.
  - Cyan radial glow base layer (existing `PhoneGlowWrapper` style inlined).
  - Phone: `<PhoneMockup>` wrapped with `lg:scale-[1.15] xl:scale-[1.2]` and a soft `drop-shadow-[0_25px_60px_rgba(0,0,0,0.6)]`. Positioned center-right.
  - Cocktail: `<img src={cyanCocktail}>` placed `absolute right-[-10%] bottom-0 w-[42%] max-w-[260px] hidden md:block` with its own cyan radial glow behind (`absolute inset-0 blur-2xl bg-[radial-gradient(...)]`). On smaller screens the drink hides to keep hero compact (mobile rule from brief).
  - No text/badges/labels over the visual.
- Subtitle, the 2-line note block, and the existing CTA button stay untouched (text and behavior preserved).

### How It Works (4 steps)
- Wrap the grid in `relative` and add a hidden-on-mobile cyan connector line:
  `aria-hidden`, `hidden md:block absolute left-[10%] right-[10%] top-[88px] h-px bg-gradient-to-r from-transparent via-nf-primary/40 to-transparent z-0`.
- Cards get `relative z-10` (already inside `cardCls`).
- Keep equal heights via existing `h-full` and grid auto-rows-fr (add `auto-rows-fr` to grid).

### Features (5 items)
- Brief asks for a wide full-width highlight card under the 2-col grid for the 5th item. Split `features` into `features.slice(0,4)` and `features[4]`.
- Top: 2-col grid (existing).
- Below: a single full-width highlight card with horizontal layout on `md+`: icon chip on left, title + description on the right; same glass styling, slightly stronger border (`border-nf-primary/40`) and a soft cyan glow.

### Target Audience (3 items)
- No structural change. Tighten container width to feel "compact and premium" (`max-w-3xl`) and reduce gap to `gap-4 md:gap-5`.

### Value Props (4 stat-ish items)
- Convert to smaller, more compact stat cards: reduced padding (`p-4`), smaller chip (`w-12 h-12`), and emphasize the title in cyan (`text-nf-primary`) to read as a stat. Description stays muted. Same glass style, no copy change.

### Final CTA — convert to wide cinematic glass banner
- Wrap the title + subtitle + button in a `relative overflow-hidden rounded-3xl border border-nf-primary/30 bg-white/[0.03] backdrop-blur-md p-10 md:p-14 shadow-[0_30px_120px_-30px_rgba(0,188,212,0.45)]` panel inside `max-w-6xl`.
- Add a cyan mesh/wave decoration (inline SVG with 3-4 thin curved cyan strokes, `opacity-30`, masked from right to left) on the left half — similar to the perks panel decoration we added to the venue page.
- Optional blurred bar atmosphere on the right: `absolute inset-y-0 right-0 w-1/2 bg-[url(...)] bg-cover opacity-20 blur-[2px] [mask-image:linear-gradient(to_left,black,transparent)]` using `budapestNightHero` (already imported via `HeroBackground`; we'll import the asset directly here).
- Layout inside the banner switches from centered stack to: left text block, right CTA button on `md+` (text-left), centered on mobile. Text and button label unchanged.

### Form (PartnerApplicationSection)
- Already shared component restyled in the prior turn (glass container, cyan focus, 2-col grid, centered cyan submit, trust badges). No changes needed here. Verify it renders correctly inside the page; no edits planned.

### Navigation, Footer, SEO, prerender, analytics, translations
- Unchanged.

## New imports in `Italmarkak.tsx`
- `import cyanCocktail from '@/assets/cyan-cocktail.png';`
- `import budapestNightHero from '@/assets/budapest-night-hero.jpg';` (only used inside the CTA banner background overlay)

## Files touched

- `src/pages/Italmarkak.tsx` (only)

## Out of scope

- No edits to `Navigation`, `MobileNavigation`, `Footer`, `HeroBackground`, `PhoneMockup`, `PartnerApplicationSection`, or any translation files.
- No changes to copy, CTA labels, form fields/validation, links, routes, SEO, JSON-LD, prerender or analytics.
- No new image generation — reuses existing `cyan-cocktail.png` and `budapest-night-hero.jpg`.
