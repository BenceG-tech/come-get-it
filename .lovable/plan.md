## /vendeglatohelyek hero refresh

Text/structure-only update. Keep dark layout, cyan accents, phone mockup.

### `src/i18n/hu.json` — `venues.hero`
Replace with:
- `badge`: `"FOUNDING PARTNER PROGRAM — 15 HELY"`
- `line1`: `"TÖBB VENDÉG."`
- `line2`: `"KEVESEBB ÜRES ASZTAL."`
- `subtitle`: `"A Come Get It segít, hogy új vendégek fedezzék fel a helyedet a holtidőkben. A napi ingyen ital ad nekik egy okot, hogy ma este pont hozzád menjenek — a hely minősége adja a többit."`
- `cta`: `"Founding Partnerré válok"`
- `cta_secondary`: `"Hogyan működik?"`

### `src/i18n/en.json` — `venues.hero`
Mirror keys (English):
- `badge`: `"FOUNDING PARTNER PROGRAM — 15 SPOTS"`
- `line1`: `"MORE GUESTS."`
- `line2`: `"FEWER EMPTY TABLES."`
- `subtitle`: `"Come Get It helps new guests discover your venue during slow hours. The daily free drink gives them a reason to come to you tonight — the quality of your place does the rest."`
- `cta`: `"Become a Founding Partner"`
- `cta_secondary`: `"How it works"`

### `src/components/VenueHeroSection.tsx`
- Add a small cyan pill badge above the `<h1>` rendering `t('venues.hero.badge')` (same style as homepage hero badge: `inline-flex px-3 py-1 rounded-full text-xs md:text-sm font-semibold tracking-wide border border-nf-primary/40 bg-nf-primary/10 text-nf-primary mb-5`).
- Replace the two-line `<p>` (using `p1`/`p2`) with a single `<p>` rendering `t('venues.hero.subtitle')`.
- Add a secondary outline CTA next to primary; on click scrolls to `#how-it-works-venues` (or existing anchor — verify `HowItWorksForVenues` section id; if missing, add `id="how-it-works-venues"` to its root section).
- Keep primary CTA text bound to `t('venues.hero.cta')` and the existing scroll-to `#venue-application` behavior, ArrowRight icon retained.
- Wrap CTAs in a `flex flex-col sm:flex-row gap-3 sm:gap-4` container.

### `src/components/HowItWorksForVenues.tsx`
- Ensure root `<section>` has `id="how-it-works-venues"` so secondary CTA scroll target works.

### Out of scope
- No design system, color, or phone mockup changes. No other sections on this page touched.