## Goal

Apply consistent hero composition fixes across the three partner-page heroes — Vendéglátóhelyek, Italmárkák, Rewards Partners — so the phone reads clearly against the atmospheric background. Stronger cyan glow, dark shadow halo, larger phone on desktop, clean mobile stacking. Right side stays clean (no labels/badges/cards). No copy, CTA, logic, route, SEO, prerender, analytics or translation changes.

## Shared composition treatment

For each hero's phone wrapper container we'll layer:

1. **Dark shadow halo** (behind everything) — soft elliptical dark shape that sits *under* the phone to detach it from the background:
   ```
   absolute inset-0 pointer-events-none
   background: radial-gradient(ellipse 55% 60% at 50% 55%, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.45) 35%, transparent 70%)
   filter: blur(40px)
   ```

2. **Stronger cyan glow** (above shadow, behind phone) — bumped opacity + tighter radius:
   ```
   absolute inset-0 pointer-events-none
   background: radial-gradient(ellipse 55% 55% at 50% 50%, rgba(0,188,212,0.55) 0%, rgba(0,188,212,0.22) 45%, transparent 75%)
   filter: blur(28px)
   ```

3. **Phone wrapper** with bigger desktop scale and a heavier drop-shadow:
   ```
   relative z-10 lg:scale-[1.22] xl:scale-[1.32] origin-center
   drop-shadow-[0_30px_70px_rgba(0,0,0,0.75)] drop-shadow-[0_0_45px_rgba(0,188,212,0.35)]
   ```

4. **Mobile**: keep phone at native scale (no scale class below `lg`), stack normally under text + CTA. Container `min-h` reduced so there's no empty gap on mobile (`min-h-[480px] lg:min-h-[640px]`).

## Per-file changes

### `src/components/VenueHeroSection.tsx`
- Replace the lone cyan radial inside the right column wrapper with the 3-layer stack above (shadow halo + stronger cyan glow). Update phone wrapper className to the values above. Adjust `min-h` to `min-h-[480px] lg:min-h-[640px]`.

### `src/pages/Italmarkak.tsx`
- Same 3-layer stack inside the existing `relative flex justify-center items-center` wrapper. Bump phone scale class. Keep the cocktail PNG positioning (it stays as a clean visual element, no labels). Tighten cocktail's own glow slightly so it doesn't compete with the new phone glow.

### `src/pages/RewardsPartners.tsx`
- Same 3-layer stack. Keep the cyan mesh wave SVG on the right (decorative), but lower its opacity to `~0.25` so it doesn't compete with the stronger phone glow. Bump phone scale.

## What stays the same
- All copy, CTA labels, button behavior, analytics calls, headings, subtitles, note blocks.
- Background images (`HeroBackground` for Italmárkák/Rewards, `venueInteriorHero` for Venue page).
- Left-side dark gradient overlay we added previously.
- Italmárkák right-side cocktail visual stays (per brief: "optional unbranded drink only where relevant").
- No badges/labels/cards anywhere on the right visual.

## Files touched
- `src/components/VenueHeroSection.tsx`
- `src/pages/Italmarkak.tsx`
- `src/pages/RewardsPartners.tsx`

## Out of scope
- Homepage hero (`HeroSection.tsx`) — not part of the user's recent hero feedback loop and already has its own polished composition.
- Navigation, Footer, forms, content sections below the hero.
