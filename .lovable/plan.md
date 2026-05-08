## Goal

Bring the four subpages (`/vendeglatohelyek`, `/italmarkak`, `/rewards-partners`, `/come-get-it-accelerator`) in line with the new homepage visual language: soft cyan phone glow, faded Budapest middle-band background in heroes, rounded glass cards with circular icon chips, Anton headline pairings, pill-shaped CTAs and consistent spacing. **No copy, routes, form fields, analytics, or section order changes.**

---

## Visual System (reused on every subpage)

These tokens come from the new `HeroSection` / `MibenSegitSection` / `BenefitsSection`:

- **Background**: `bg-nf-background` (#050505) with optional radial cyan glows.
- **Hero background**: same layered structure as homepage — masked Budapest middle band + top/bottom dark fades + cyan radial accents (no cocktail; phone only on subpages).
- **Hero typography**: `font-anton uppercase`, white line + `text-nf-primary` line with `drop-shadow-[0_0_30px_rgba(0,188,212,0.45)]`.
- **CTA buttons**: `variant="neon"` (pill) + secondary `outline` pill with `border-nf-primary/60 text-nf-primary hover:bg-nf-primary/10`.
- **Card**: `rounded-2xl border border-nf-primary/20 bg-white/[0.03] backdrop-blur-md hover:-translate-y-1 hover:border-nf-primary/60 hover:shadow-[0_20px_60px_-10px_rgba(0,188,212,0.45)]`.
- **Icon chip**: circular `w-14 h-14 md:w-16 md:h-16 rounded-full border border-nf-primary/40 bg-nf-primary/[0.06]`, icon `text-nf-primary` with `strokeWidth={1.5}`, hover adds `shadow-[0_0_30px_rgba(0,188,212,0.5)]`.
- **Section title**: `text-3xl md:text-4xl lg:text-5xl font-anton uppercase tracking-tight text-white`.
- **Phone glow**: same wrapper used in homepage hero — `relative flex justify-center items-center` with a `radial-gradient(ellipse 60% 60% at 40% 50%, rgba(0,188,212,0.32)…)` blurred layer behind `<PhoneMockup />`. Drop the legacy `animate-glow-pulse scale-110`.

---

## Per-file changes

### 1. `src/components/VenueHeroSection.tsx`
- Replace the `hero-abstract-bg` block with the homepage's layered Budapest-band background (reuse `budapest-night-hero.jpg`, same mask gradient + top/bottom fades + cyan radial accents). Phone only — no cocktail.
- Wrap the phone in the same glow wrapper as the new homepage hero (`min-h-[520px] lg:min-h-[580px]`, blurred radial cyan behind `PhoneMockup`).
- Keep all existing copy, badge, CTAs, and analytics intact.

### 2. `src/pages/Italmarkak.tsx` (hero + sections)
- **Hero**: same background restructure as VenueHero. Replace `HeroTitle/HeroSubtitle` typographic primitives with the homepage hero markup (`font-anton`, white + `text-nf-primary`). Keep launch-phase note callout (just restyle its border to `border-l-2 border-nf-primary/60 bg-white/[0.03]`). Phone uses new glow wrapper, no `animate-glow-pulse scale-110`.
- **How it works / Features / Target / Value props grids**: swap each card from `azure-beam glass-effect` → new `nf-card` style (token list above). Replace the gradient square icon backings with circular cyan-bordered chips. Headlines adopt the unified section title style.
- **Final CTA**: convert to homepage pattern — `font-anton` headline with the second line in `text-nf-primary`, neon pill button.

### 3. `src/pages/RewardsPartners.tsx`
Same treatment as Italmarkak (hero background restructure, phone glow wrapper, card + icon chip restyle, section titles, neon pill CTAs). Keep all copy and analytics calls.

### 4. `src/pages/ComeGetItAccelerator.tsx`
Same treatment: hero background, phone glow, card restyle (5-step grid + 4 benefits grid use the unified card+chip), section titles, final CTA pattern. Keep copy and analytics.

### 5. `src/components/HowItWorksForVenues.tsx`
- Replace the gradient circle icon (`bg-gradient-to-br from-nf-primary to-nf-secondary … text-white`) with the homepage's outlined cyan chip (`border border-nf-primary/40 bg-nf-primary/[0.06]`, icon `text-nf-primary`, hover glow).
- Card frame swapped from `nf-card` to the unified glass card (border + `bg-white/[0.03] backdrop-blur-md`, lift + shadow on hover).

### 6. `src/components/VenueWhyWorth.tsx`
- Same swap: replace the filled gradient `rounded-2xl` icon block with the circular cyan-outlined chip used on the homepage; align card frame to the unified glass card. Keep titles/copy.

### 7. `src/components/VenueStats.tsx`
- Replace the filled `rounded-2xl bg-gradient-to-br from-nf-primary to-nf-secondary` icon block with the homepage circular cyan chip (icon `text-nf-primary`, hover cyan glow).

### 8. `src/components/FoundingPartnerPerks.tsx`
- Keep the framed card concept but soften to match homepage: outer ring `border border-nf-primary/30` (drop the heavy `border-2`), reduced inner shadow (`shadow-[0_30px_80px_-20px_rgba(0,188,212,0.35)]`), check icon container becomes the unified circular chip.

### 9. `src/components/VenueROI.tsx`
- Same lighter border / softer cyan shadow treatment as `FoundingPartnerPerks` so both highlight cards feel like one family. Numbers stay `font-anton` cyan (already matches).

### 10. `src/components/PartnerApplicationSection.tsx`
- Visual-only restyle to match the new homepage form (`SignupForm` / `VenueApplicationSection`):
  - Card → `rounded-2xl border border-nf-primary/20 bg-white/[0.03] backdrop-blur-md`.
  - Inputs → `bg-black/40 border-nf-primary/25 focus:border-nf-primary` (replacing `electric-300/30`).
  - Header icons → circular cyan chips.
  - Submit button → `variant="neon"` pill (drop the `brand-gradient-cta` class chain). All form fields, validation, labels, analytics untouched.

---

## Out of scope

- No copy, label, route, SEO, or JSON-LD changes.
- No changes to form fields, validation, submission logic, Supabase calls, or analytics events.
- No changes to section order on any page.
- `Footer`, `MobileNavigation`, `Navigation`, `CustomerSupport` already use the new style — leave as-is.

## Files touched

- `src/components/VenueHeroSection.tsx`
- `src/components/HowItWorksForVenues.tsx`
- `src/components/VenueWhyWorth.tsx`
- `src/components/VenueStats.tsx`
- `src/components/FoundingPartnerPerks.tsx`
- `src/components/VenueROI.tsx`
- `src/components/PartnerApplicationSection.tsx`
- `src/pages/Italmarkak.tsx`
- `src/pages/RewardsPartners.tsx`
- `src/pages/ComeGetItAccelerator.tsx`
