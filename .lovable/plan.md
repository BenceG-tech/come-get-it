# Hero Section Visual Refinement

Scope: `src/components/HeroSection.tsx` only (plus one new asset). No copy, CTA, link, SEO, route, order, or functionality changes.

## Goals
- Make the right side feel rich and balanced.
- Phone becomes the clear focal point; unbranded cyan drink is the secondary supporting visual.
- Budapest night background stays visible but cleanly separated from foreground.

## 1. New Asset — Unbranded Cyan Drink

Generate a transparent PNG via `imagegen--generate_image` (premium, transparent_background):
- Path: `src/assets/cyan-drink.png`
- Prompt: tall slim highball / long drink glass with cyan-blue sparkling liquid, clear ice cubes, mint leaf and lime wedge, soft cyan rim light, photorealistic, no logo, no label, no text, no brand, on a clean background.
- Size ~768x1280 (portrait) for crisp downscaling.

No bottle, no branding, no text. Will be imported into `HeroSection.tsx`.

## 2. Right-Side Composition Changes

In the right column of the hero grid:

- Wrap phone + drink in a single relative container so they form one composition.
- Increase phone scale on desktop: `scale-110 lg:scale-125` (≈20% bigger), keep mobile unchanged-ish (`scale-95 sm:scale-100`).
- Slight tilt for depth: phone wrapper gets `rotate-[-4deg] lg:rotate-[-6deg]` with `transform-gpu`. App screen stays readable (PhoneMockup internals untouched).
- Position phone toward center-right: container uses `justify-center lg:justify-start lg:pl-8` instead of `lg:justify-end`, and drink absolutely positioned to the far right.
- Drink placement (desktop): `absolute right-[-2rem] lg:right-[-3rem] bottom-0 w-[180px] lg:w-[240px] rotate-[6deg] z-0`, behind phone (`z-0`), phone at `z-10`.
- Drink on mobile: `hidden sm:block` so mobile hero doesn't get too tall; phone stays primary.

## 3. Glows & Shadows

Behind phone:
- Strengthen existing cyan radial glow: `rgba(0,188,212,0.55)` core → `0.20` mid → transparent, blur 40px, slightly larger ellipse.
- Add a soft dark drop shadow behind phone for separation: `shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]` on phone wrapper.

Behind drink:
- Subtle elliptical cyan glow under glass: `radial-gradient(ellipse 60% 25% at 50% 90%, rgba(0,188,212,0.45), transparent 70%)`, blur 24px.
- Faint reflection: thin white/cyan gradient strip beneath the glass.

## 4. Background Adjustments

In hero `.absolute inset-0 z-0`:
- Keep `budapest-night-hero.jpg` but bump opacity from `60` to `75` so city is more visible.
- Replace single bottom-fade overlay with side-aware gradient:
  - Left readability shield: `bg-gradient-to-r from-[#03060d]/92 via-[#03060d]/70 to-transparent` (covers ~55% width).
  - Bottom vignette: `bg-gradient-to-b from-transparent via-transparent to-[#03060d]` (last 25%).
- Right-side cyan-blue radial: stronger glow centered roughly behind phone — `radial-gradient(ellipse 55% 60% at 72% 50%, rgba(0,188,212,0.28) 0%, rgba(0,151,167,0.12) 45%, transparent 75%)`.
- Remove the secondary 15%/70% glow (no longer needed).

Net result: text side stays dark and readable; right side breathes with city + cyan light; right side never goes pure black.

## 5. Mobile Behavior

- Hero grid order unchanged (text → phone via grid).
- Drink hidden on `<sm`, shown from `sm` upward as a smaller accent (`w-[140px]`), positioned behind phone.
- Phone keeps current mobile scale; no shrinking.
- All absolute elements constrained inside `overflow-hidden` parent (already present) — no horizontal overflow.

## 6. Things Explicitly Not Changed

- All translation strings (`hero.badge`, `hero.title_line1/2`, `hero.subtitle`, `hero.cta`, `hero.cta_secondary`, `hero.founding_note`).
- Button variants, click handlers, analytics calls, scroll targets.
- `PhoneMockup` component internals.
- Section order, SEO, routes.
- No yellow, no purple, no branded bottles.

## Files Touched

- `src/assets/cyan-drink.png` (new, generated)
- `src/components/HeroSection.tsx` (visual edits only)
