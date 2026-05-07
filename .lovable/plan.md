## Hero copy update (homepage)

Goal: only update hero text content. Keep current layout, neon styling, phone mockup, animations, and CTA variants.

### 1) i18n updates

**`src/i18n/hu.json` → `hero` block**

- Add `badge`: `"BUDAPESTEN INDULUNK — SZEPTEMBER 2026"`
- Keep `title_line1`: `"NEM TUDOD,"`
- Keep `title_line2`: `"HOVA MENJ MA?"`
- Replace `subtitle`: `"A Come Get It segít eldönteni, hova menj Budapesten — partnerhelyeken, ahol napi ingyen ital, pontok és jutalmak várnak. Az appban felfedezed a város legjobb helyeit, miközben minden beváltással egy napi tiszta ivóvizet biztosítasz egy rászorulónak."`
- Replace `cta`: `"Csatlakozom alapító tagként"`
- Replace `cta_secondary`: `"Hogyan működik?"`
- Add `founding_note`: `"Az első 500 alapító tag életre szóló Founding Member státuszt és 1 hónap Plus-t kap ingyen."`

**`src/i18n/en.json` → `hero` block** (parallel English versions)

- `badge`: `"LAUNCHING IN BUDAPEST — SEPTEMBER 2026"`
- `title_line1`: `"DON'T KNOW"`
- `title_line2`: `"WHERE TO GO TODAY?"`
- `subtitle`: `"Come Get It helps you decide where to go in Budapest — partner venues with daily free drinks, points and rewards. Discover the city's best places, and every redemption provides one day of clean drinking water to someone in need."`
- `cta`: `"Join as a founding member"`
- `cta_secondary`: `"How it works"`
- `founding_note`: `"The first 500 founding members get lifetime Founding Member status and 1 month of Plus free."`

### 2) `src/components/HeroSection.tsx`

- Add a small badge above the `<h1>` using existing cyan/teal accent style:
  - Inline pill: `inline-flex items-center px-3 py-1 rounded-full text-xs md:text-sm font-semibold tracking-wide border border-nf-primary/40 bg-nf-primary/10 text-nf-primary mb-5`
  - Renders `t('hero.badge')`
- Update secondary CTA: change `Hogyan működik?` behavior to scroll to `#how-it-works` section instead of `#signup` (keep `#signup` for primary). If the HowItWorks section lacks an `id`, add `id="how-it-works"` to its root section.
- Below the CTA row, add a muted helper line:
  - `<p class="pt-3 text-xs md:text-sm text-nf-text-muted/80 max-w-xl">{t('hero.founding_note')}</p>`
- No layout/animation/color changes otherwise.

### 3) Verify HowItWorks anchor

Quick check `src/components/HowItWorks.tsx` for an existing `id`. If missing, add `id="how-it-works"` to its `<section>` so the secondary CTA scroll target works.

### Out of scope

- No design system changes, no new images, no analytics renames (keep `hero_primary` / `hero_secondary` events). Other pages/components untouched.