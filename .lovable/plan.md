## Issues

1. **Hero top is clipped under the fixed nav.** The fixed `.nf-navbar` (h ~64–72px, `top-0 z-50`) sits over the hero, but every hero section uses `py-16` only — so the title's first line tucks under the navbar (visible in screenshots: "LEGY AZ ELSO" and "INGYEN ITAL" both overlap).
2. **Teal/cyan background looks "összevissza".** Two large blurred radial blobs (`hero-shape-1`, `hero-shape-2`), an animated `hero-glow-accent` ball and a hard linear gradient stack on top of each other. The shapes have different colors, opacities and blurs, plus a floating animation, making the backdrop feel busy and uneven instead of a smooth depth gradient.

## Fix

### 1. Hero top spacing (overlap fix)

Add nav-safe top padding to all hero sections (no markup restructure):

- `src/components/HeroSection.tsx` (`/`)
- `src/components/VenueHeroSection.tsx` (`/vendeglatohelyek`)
- `src/pages/Italmarkak.tsx` hero
- `src/pages/RewardsPartners.tsx` hero
- `src/pages/ComeGetItAccelerator.tsx` hero

Change the section className from `py-16 px-4` to `pt-28 md:pt-32 pb-16 px-4` so headlines clear the fixed navbar on every breakpoint where the desktop nav is shown. Mobile (`MobileNavigation`) already uses its own offset, so this padding stays safe.

### 2. Refined gradient (`src/index.css`, `.hero-abstract-bg` block)

Replace the current "stacked blobs" approach with one cohesive teal depth gradient:

- `.hero-abstract-bg`: switch the linear gradient to a smoother radial glow anchored bottom-right with the brand teal (#00bcd4 family at very low alpha), over a near-black base. No more 5-stop linear ramp.
- `.hero-shape-1`: keep, but slim down — softer single-color teal radial (brand `#00bcd4` @ ~0.18 alpha), bigger blur (80px), positioned top-right and pulled further off-canvas so only its soft edge bleeds in.
- `.hero-shape-2`: convert to a low-opacity bottom-center halo (not bottom-left) using the same brand teal so both glows feel like one continuous light source instead of two separate blobs.
- Remove `::after` cyan inner highlights on both shapes (they're what makes it look patchy).
- `.hero-glow-accent`: remove the `float` animation and reduce size/opacity, or hide it (kept hidden like `hero-glow-secondary`) — the refined radials already provide depth.

Result: a single, smooth teal-to-black depth gradient consistent with the Neon Fidelity look, instead of three competing blobs.

### Verification
After changes, visually confirm on `/`, `/vendeglatohelyek`, `/italmarkak`, `/rewards-partners`, `/come-get-it-accelerator`:
- H1 fully visible below the navbar at desktop and tablet widths.
- Background reads as one cohesive teal glow, no visible blob seams.

No changes to copy, components structure, routing, or SEO.