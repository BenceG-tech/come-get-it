## Visual redesign — homepage middle flow

Scope (visual + responsive only, no copy/route/SEO/analytics changes):
1. Benefit icon row under hero (`QuickAccessChips.tsx`)
2. `MibenSegitSection.tsx`
3. `HowItWorks.tsx` — "Válassz. Menj el. Igyál. Adj vissza."
4. `DrinkSection.tsx` — start/hero of Drink

Global aesthetic: dark navy/black, cyan accents (`text-nf-primary`, `border-nf-primary/20–60`), glassmorphism (`bg-white/[0.03] backdrop-blur-md`), thin cyan borders, soft radial cyan glows, condensed uppercase titles (`font-anton`), muted body (`text-white/60`). No yellow, no new copy.

---

### 1. Benefit icon row (`QuickAccessChips.tsx`)
Currently mobile-only. Promote to a unified row directly under hero on all breakpoints.
- Remove `lg:hidden`; render on desktop too.
- Desktop: single horizontal row, centered, max-w container, items separated by thin `border-l border-nf-primary/15` dividers (skip first).
- Each item: cyan line icon (`strokeWidth={1.5}`, `text-nf-primary`) + label, no pill background, hover → `text-nf-primary` + soft glow.
- Mobile: 2x2 grid (`grid-cols-2 gap-3`), glass tile per item, icon centered above label.
- Top/bottom spacing: `py-8 md:py-10`, sits flush against hero bottom.

### 2. `MibenSegitSection.tsx`
Already glass cards — refine for premium look.
- Desktop: keep 4-in-a-row, enforce equal height (`h-full` already there) and consistent padding `p-7`.
- Circular icon container upgraded: `w-16 h-16 rounded-full border border-nf-primary/40 bg-nf-primary/[0.06]`, hover → `border-nf-primary` + cyan ring glow.
- Mobile: `grid-cols-2` (already), tighten gap to `gap-3`, ensure descriptions don't overflow (`text-xs` on smallest, `text-sm md:text-base`).
- Add subtle ambient cyan radial glow at top (already present, keep).

### 3. `HowItWorks.tsx`
- Desktop (lg+): keep 4-card row + dotted cyan connector line behind icon centers (already exists, refine to align with new icon size and stop at edges).
- Numbered cyan badge on each card top-right of icon (already present).
- Mobile: switch from grid to **vertical timeline**:
  - Layout: flex column, each step = `flex gap-4` row.
  - Left column: numbered cyan badge `w-9 h-9 rounded-full bg-nf-primary text-black` + vertical `border-l border-dashed border-nf-primary/30` continuing down to next badge (last item: no line).
  - Right column: full-width glass card containing icon + title + description.
- Use `lg:hidden` for timeline + `hidden lg:grid` for current desktop grid.

### 4. `DrinkSection.tsx`
Already split layout with cyan glow — polish and improve mobile.
- Desktop: keep 2-col grid; widen `gap-20`, tighten title leading, ensure phone glow behind phone (radial cyan, blur 40px).
- Add subtle `bg-gradient-to-br from-[#040a14] via-nf-background to-[#040a14]` and a faint cyan vignette top-right.
- Mobile: title/subtitle/paragraph/CTA first, then phone below; CTA full-width (`w-full sm:w-auto`); reduce phone scale on small screens so section isn't too tall (`scale-90 sm:scale-100`).

---

### Files to edit
- `src/components/QuickAccessChips.tsx`
- `src/components/MibenSegitSection.tsx`
- `src/components/HowItWorks.tsx`
- `src/components/DrinkSection.tsx`

### Out of scope (explicitly untouched)
- All `t(...)` keys, translations, copy
- `Index.tsx` section order
- Routes, links, SEO, prerender, analytics calls
- Other sections (Earn, Give, Pricing, etc.)

### Verification
After edits: visual check at 375px (mobile), 768px (tablet), 1339px (current viewport), 1440px+ — confirm no overflow, equal card heights, timeline alignment on mobile, phone glow rendering on Drink.