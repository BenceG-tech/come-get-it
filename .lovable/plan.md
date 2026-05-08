## Goal

Increment the existing `/vendeglatohelyek` redesign with the remaining details from the brief — bigger hero phone, dark gradient overlay over the left text, connector arrows between the 5 process steps, a subtle cyan mesh accent on the perks panel, and a polished form container. Pure visual changes — no copy, fields, logic, routes, SEO, prerender, analytics or translations touched.

## Per-file changes

### 1. `src/components/VenueHeroSection.tsx`
- Add a left-side dark gradient overlay above the background layers but behind the content: `absolute inset-y-0 left-0 w-full lg:w-2/3 bg-gradient-to-r from-[#03060d] via-[#03060d]/85 to-transparent` for headline readability.
- Slightly brighten right-side ambient: extra cyan radial focused at ~70% horizontally to support the phone.
- Adjust grid weights to ~45/55: `lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]`.
- Scale up the phone ~20% on lg+: wrap `<PhoneMockup />` with `lg:scale-[1.18] xl:scale-125 origin-center`. Slight extra drop shadow on the wrapper (`drop-shadow-[0_25px_60px_rgba(0,0,0,0.6)]`) to separate it from the bar interior. No text/badges/cards over the visual.

### 2. `src/components/HowItWorksForVenues.tsx`
- Add desktop connector arrows between cards: between each pair, render a small absolutely-positioned `ChevronRight` icon (`text-nf-primary/50`) in a `hidden lg:flex` overlay, OR more simply a faint horizontal cyan line (`h-px bg-gradient-to-r from-transparent via-nf-primary/40 to-transparent`) behind the row at the icon's vertical center. Use a `relative` parent and place the line `absolute left-[6%] right-[6%] top-[68px]` with `z-0`, cards `relative z-10`. Hidden on `<lg`.
- Equal-height cards already covered by `h-full` + grid stretch.
- Mobile: keep current 2-col / single-col stacking.

### 3. `src/components/FoundingPartnerPerks.tsx`
- Add a subtle cyan mesh/wave SVG decoration at the right side of the panel, behind content. Use an inline SVG: a few thin curved cyan strokes (`stroke="hsl(var(--nf-primary))"` with `opacity-20`) inside an `absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none [mask-image:linear-gradient(to_left,black,transparent)]` wrapper. Keeps text fully readable.
- Highlight "Csak az első 15 budapesti vendéglátóhely" line: wrap it in a centered pill `inline-block px-5 py-2 rounded-full border border-nf-primary/40 bg-nf-primary/10 mt-2` (text content unchanged).

### 4. `src/components/VenueROI.tsx`
- Already a glass panel with cyan border. Tweaks:
  - Add subtle vertical dividers between the 4 stat columns on `sm+`: each cell except first gets `sm:border-l sm:border-nf-primary/15 sm:pl-6`.
  - Slightly emphasize the main monthly value: bump to `text-5xl md:text-7xl lg:text-8xl`, keep the existing cyan glow text-shadow.

### 5. `src/components/VenueApplicationSection.tsx`
- Already glassy. Small refinements only:
  - Increase form padding on desktop (`md:p-12`) and field gap to `gap-5 md:gap-6`.
  - Inputs: stronger focus ring already set; add `hover:border-nf-primary/50` for affordance.
  - Submit button: keep neon variant, add full-width on mobile (`w-full sm:w-auto`).
  - Trust line below the form: place inside a subtle pill — same styling as venue badge — for visual alignment. Text unchanged.

### 6. `src/components/PhoneMockup.tsx`
- No structural changes. Hero will scale via wrapper utilities, so the mockup itself is untouched (other pages keep current size).

## Out of scope

- No edits to `Navigation`, `MobileNavigation`, `Footer` — they already match the brief.
- No changes to copy, form fields, validation, submit logic, analytics calls, SEO/JSON-LD, routes, or translations.
- No new images: reuse the recently generated `venue-interior-hero.jpg`.

## Files touched

- `src/components/VenueHeroSection.tsx`
- `src/components/HowItWorksForVenues.tsx`
- `src/components/FoundingPartnerPerks.tsx`
- `src/components/VenueROI.tsx`
- `src/components/VenueApplicationSection.tsx`
