## Goal

Visual-only redesign of `/rewards-partners` to match the reference: bigger hero phone with cyan mesh glow, dark left overlay for text readability, connector line between the 4 process steps, larger horizontal "value" cards with subtle dark imagery overlay, polished 4-up benefit cards, and a hover-lift treatment throughout. No copy, fields, logic, routes, SEO, prerender, analytics or translations are touched.

## Per-section changes in `src/pages/RewardsPartners.tsx`

### Hero
- Keep `<HeroBackground />`. Add a left-side dark overlay above background but behind content: `hidden lg:block absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-[#03060d] via-[#03060d]/85 to-transparent z-[1] pointer-events-none`.
- Adjust hero grid weighting to ~45/55: `lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]`.
- Replace `<PhoneGlowWrapper>` with a custom right-side composition (relative wrapper, `min-h-[520px] lg:min-h-[600px]`) containing:
  - Cyan radial glow base (same blurred radial as venue/italmárkák hero).
  - A subtle mesh/wave SVG decoration on the right edge (thin cyan curves, opacity ~0.4, masked) to suggest "rewards reach".
  - `<PhoneMockup imageUrl={rewardsImage} />` wrapped with `lg:scale-[1.18] xl:scale-125 origin-center drop-shadow-[0_25px_60px_rgba(0,0,0,0.6)]`.
- No drink, badges or extra cards.
- Headline, subtitle, note block, CTA button: unchanged.

### How It Works (4 steps)
- Wrap grid in `relative auto-rows-fr` and add hidden-on-mobile cyan connector line: `hidden md:block absolute left-[10%] right-[10%] top-[88px] h-px bg-gradient-to-r from-transparent via-nf-primary/40 to-transparent z-0`.
- Cards keep existing `cardCls` (already `relative`). Add `z-10` to ensure they sit above the line.

### "Jutalom rendszer előnyei" (features) — larger horizontal cards
- Convert from current centered/stacked card layout to a horizontal layout (icon-left, text-right) on `md+`. 2-col grid stays.
- Each card becomes:
  ```
  rounded-2xl border border-nf-primary/30 bg-white/[0.03] backdrop-blur-md p-6 md:p-7
  hover:border-nf-primary/60 hover:-translate-y-1 hover:shadow-[0_25px_70px_-10px_rgba(0,188,212,0.5)]
  flex md:flex-row gap-5 items-start
  ```
- Add a subtle dark image overlay inside each card: `absolute inset-0 bg-[url(...)] bg-cover opacity-[0.08] [mask-image:linear-gradient(to_left,black,transparent)] pointer-events-none` — using `budapestNightHero` as the texture asset (already in `src/assets/`).
- Icon: square-ish chip `w-14 h-14 rounded-xl border border-nf-primary/40 bg-nf-primary/[0.08]` with line icon.
- Text block: title (`text-lg md:text-xl font-bold`) + description (`text-sm md:text-base text-white/65`).
- Container: `max-w-5xl`.
- Note: `features` may have 2 or 3 entries (3 in current code). With 2-col grid, a 3rd item naturally spans into the next row centered — wrap last odd item with `md:col-span-2 md:max-w-3xl md:mx-auto` so it sits as a full-width highlight if `features.length` is odd.

### "A jutalom-partnerség előnyei" (value props, 4 items)
- Already 4-col grid. Polish: `auto-rows-fr`, slightly tighter padding on the chip wrapper, ensure `text-nf-primary` accent on the title for stat-like feel. Keep existing `cardCls`.

### Form (PartnerApplicationSection)
- No changes — already restyled previously.

### Navigation, Footer, SEO, prerender, analytics, translations
- Unchanged.

## New imports
- `import budapestNightHero from '@/assets/budapest-night-hero.jpg';` (used as faint texture inside the feature cards).
- Drop unused `PhoneGlowWrapper` from the import list.

## Files touched

- `src/pages/RewardsPartners.tsx` (only)

## Out of scope

- No edits to `Navigation`, `MobileNavigation`, `Footer`, `HeroBackground`, `PhoneMockup`, `PartnerApplicationSection`, or any translation files.
- No copy, CTA, form, validation, route, SEO, JSON-LD, prerender or analytics changes.
- No new image generation — reuses existing `budapest-night-hero.jpg`.
