# Hero Right-Side — Match Reference Composition

Scope: `src/components/HeroSection.tsx` only. No copy, CTA, link, route, or functionality changes.

## What's different from current

Reference shows:
- Phone tilted slightly to the **right** (~+8°), not to the left.
- Phone is large and centered in the right column, app screen fully visible (no clipping).
- Budapest skyline is clearly visible *behind and around* the phone — not hidden by a black gradient.
- A **large, full-height drink glass** sits on the far right, roughly the same height as the phone, partially overlapping the right edge.
- Cyan/blue ambient glow ties phone + drink + city together.
- Subtle reflection on the "table" surface beneath both phone and drink.

## Changes

### 1. Phone
- Flip rotation: `rotate-[6deg] lg:rotate-[8deg]` (was negative).
- Keep `lg:scale-125`; ensure container has enough room (`min-h-[600px] lg:min-h-[640px]`) so nothing clips.
- Keep dark drop shadow for separation.

### 2. Drink (far-right, large)
- Scale up significantly: `w-[220px] sm:w-[280px] lg:w-[360px]` (currently 150–240px).
- Anchor to bottom-right of the right column: `absolute right-[-3rem] lg:right-[-4rem] bottom-0`.
- Remove the `rotate-[6deg]` — keep upright like in the reference.
- Stronger cyan drop shadow: `drop-shadow-[0_30px_50px_rgba(0,188,212,0.45)]`.
- Z-order: drink at `z-[5]`, phone at `z-10` so phone overlaps the glass slightly on its right edge (matches reference).
- Hide on `<sm` only if it overflows; keep visible from `sm` upward at smaller width.

### 3. Reflection strip
- Add a thin horizontal reflection bar at the bottom of the right column: gradient `linear-gradient(to top, rgba(0,188,212,0.18), transparent)` with `mask-image` fade, simulating the wet-table look in the reference.

### 4. Background — let the city show through on the right
In the hero background layer:
- Reduce the left readability shield so it only covers the text side: change `from-[#03060d]/95 via-[#03060d]/70 to-transparent` to stop earlier — use `bg-gradient-to-r from-[#03060d]/95 from-0% via-[#03060d]/55 via-35% to-transparent to-60%`.
- Bump background image opacity from `75` → `85`.
- Soften bottom vignette so the "table reflection" area isn't pure black: `to-[#03060d]/85` instead of `to-[#03060d]`.
- Keep the right-side cyan radial glow but widen it slightly: `ellipse 65% 70% at 70% 55%`.

### 5. No new assets
- Reuse existing `cyan-drink.png` (already imported). No regeneration.
- Reuse existing `budapest-night-hero.jpg`.

## Files Touched
- `src/components/HeroSection.tsx`
