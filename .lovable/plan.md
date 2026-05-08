## Visual redesign — homepage lower flow

Scope (visual + responsive only — no copy, fields, routes, links, SEO, prerender, translations or analytics changes):
1. `VenuePartnerTeaser.tsx` — "Vendéglátóhely vagy?"
2. `BenefitsSection.tsx` — "Miért éri meg mindenkinek?"
3. `VenueApplicationSection.tsx` — partner / founding member application form + trust line
4. `FOMOSection.tsx` + `SignupForm.tsx` — founding member CTA blocks
5. `Footer.tsx`

Global aesthetic (matches the rest of the redesign): black / `#040a14` navy backgrounds, cyan accent (`text-nf-primary`, `border-nf-primary/20–60`), glassmorphism (`bg-white/[0.03] backdrop-blur-md`), thin cyan borders, soft radial cyan glows, condensed uppercase headings (`font-anton`), muted `text-white/60` body. No yellow, no new copy.

---

### 1. `VenuePartnerTeaser.tsx`
Currently 3 gradient-square-icon cards. Refactor visuals only.
- Section heading: switch to `font-anton uppercase tracking-tight`; add a small cyan icon (Store from lucide) above heading, centered, in a thin circular cyan outline.
- Card grid stays `md:grid-cols-3`, `gap-6`. Cards become glass:
  - `bg-white/[0.03] backdrop-blur-md border border-nf-primary/20 rounded-2xl p-7`
  - Hover: `border-nf-primary/60 shadow-[0_20px_60px_-10px_rgba(0,188,212,0.4)] -translate-y-1`
  - Icon container: `w-14 h-14 rounded-full border border-nf-primary/40 bg-nf-primary/[0.06]` with `text-nf-primary strokeWidth=1.5` icon (replace gradient-square + white icon).
- CTA button (`Csatlakozom rewards partnerként →`) stays — keep `variant="neon"`, kept centered, unchanged behavior.

### 2. `BenefitsSection.tsx`
Keep all 4 cards, copy and bullet lists. Visual rework:
- Heading: condensed uppercase `font-anton`.
- Cards become "image cards": each card gets a subtle dark photo background represented by a CSS gradient (we will NOT add new image assets — use radial cyan + dark gradient per card to evoke the night/bar/bottles/handshake mood without bringing in new copy or breaking `gen ai` restrictions). Each card:
  - Tall card `min-h-[320px]` with `rounded-2xl overflow-hidden border border-nf-primary/20`
  - Background: layered `linear-gradient(180deg, #04070d 0%, rgba(0,0,0,0.85) 100%)` + a per-card tinted radial cyan glow positioned differently (top-right, top-left, bottom-right, top-center).
  - Content padded `p-6`, top section: cyan icon badge in thin circular container.
  - Title in white bold (no copy change).
  - Description in `text-white/65`.
  - Bullet list keeps cyan dots, refined typography.
  - Hover: subtle lift + `border-nf-primary/60` + cyan glow.
- Equal heights via `h-full` and `grid grid-cols-2 md:grid-cols-4`.
- Mobile (2-col) keeps tight gap, text scales down.

Note: per request we keep existing 4 labels (user, venue, sponsor, community) — we do NOT add a 5th "Rewards partnerek" card the reference image shows. Visual mood mapping (gradient tints) per current 4 cards:
- Felhasználó → warm-cyan top-left (people / nightlife vibe)
- Vendéglátóhely → deep-cyan center (bar interior)
- Italszponzor → cyan bottom-right (bottle highlight)
- Közösség → cyan-teal top-right (handshake / connection)

### 3. `VenueApplicationSection.tsx`
- Header: keep two icon badges; restyle to thin cyan outlined circular icons (no gradient), heading in `font-anton uppercase`.
- Form container: replace shadcn `<Card>` with a custom glass shell:
  - `bg-white/[0.03] backdrop-blur-md border border-nf-primary/30 rounded-2xl p-6 md:p-10`
  - Outer wrapper has soft cyan glow ring via `shadow-[0_30px_120px_-30px_rgba(0,188,212,0.35)]` + a behind-pseudo radial blur.
  - Form-title row keeps existing two icons + title.
- Inputs (`<Input>`, `<select>`, `<textarea>` if any):
  - Restyle via Tailwind classes added on the elements themselves (do not modify the shared `Input` component): `bg-[#03070d]/80 border-nf-primary/25 focus:border-nf-primary focus:ring-2 focus:ring-nf-primary/30 text-white placeholder:text-white/40 rounded-lg` — applied via `className` prop (override, no logic change).
  - Labels stay white, icons cyan, spacing unchanged.
- Layout stays `grid-cols-1 md:grid-cols-2 gap-4` (already two-column on desktop, stacked mobile — matches request).
- Submit button: keep `variant="neon"`, same copy, centered. Add glow class `shadow-[0_0_30px_rgba(0,188,212,0.45)]`.
- Demo banner (yellow): re-tint to neutral cyan/white if present (still using existing translation copy; only color classes change to remove yellow).

### 4. Trust badges under the form (`venue_app.benefits_line`)
Currently a single `<p>`. Visually upgrade WITHOUT changing the text content:
- If the line contains the existing items as separators, render the existing string as-is in a refined wrapper: centered row with a small cyan `ShieldCheck` icon beside it; on mobile wraps naturally.
- Keep existing translation untouched — purely styling: `text-white/70 text-sm flex items-center justify-center gap-2`.

(Note: we do NOT split the string into multiple icons because that would change rendered text structure. The reference shows three icon+label badges, but the current source is a single i18n line — preserving copy means we keep one line; we add one decorative cyan icon prefix only.)

### 5. Founding member CTA blocks (`FOMOSection.tsx` + `SignupForm.tsx` shell)
Reference shows two wide horizontal "Legyél alapító tag" cards. Current homepage has `FOMOSection` (centered headline + button) and `SignupForm` (email signup form). Keep all copy/fields/logic. Visuals only:
- Wrap each section's contents in a wide glass horizontal card:
  - `bg-white/[0.03] backdrop-blur-md border border-dashed border-nf-primary/40 rounded-2xl p-6 md:p-8`
  - Subtle gradient + noise via `bg-[radial-gradient(ellipse_at_top_left,rgba(0,188,212,0.10),transparent_60%)]`
  - Layout: `flex flex-col md:flex-row md:items-center gap-6`
    - Left: cyan icon (Tag for FOMOSection, Star for SignupForm) in circular outline + headline + paragraph.
    - Right: existing CTA button / signup form, unchanged behavior.
- Section spacing tightened (`py-12`) so the two cards read as a pair.
- Keep `id="signup"` and all existing handlers.

### 6. `Footer.tsx`
- Add subtle cyan top border: replace `border-t border-white/10` with `border-t border-nf-primary/20` + thin `bg-gradient-to-b from-[#03070d] to-black`.
- Logo column unchanged (already uses `<Logo />`).
- Column headings: `text-white/90 uppercase tracking-wider font-anton text-xs`.
- Links: `text-white/65 hover:text-nf-primary transition-colors`.
- Move social links into a row of circular outline icon buttons (Instagram, TikTok, Facebook if present in current footer copy) using lucide icons; the existing text links stay accessible — render them as icon-with-sr-only label so the visible link text isn't dropped. Actually, to fully respect "do not change content": keep the existing text links AND add a small icon row above them — both visible. Final approach: prepend a small circular icon row (Instagram, TikTok) above the existing list of text links in the Kapcsolat column.
- Optional thin Budapest skyline: add a CSS `<svg>` inline-rendered skyline silhouette in `text-nf-primary/15` above the bottom copyright bar (decorative, no text).
- Bottom bar: muted gray, unchanged copy.

---

### Files to edit
- `src/components/VenuePartnerTeaser.tsx`
- `src/components/BenefitsSection.tsx`
- `src/components/VenueApplicationSection.tsx`
- `src/components/FOMOSection.tsx`
- `src/components/SignupForm.tsx` (visual wrapper only)
- `src/components/Footer.tsx`

### Out of scope (untouched)
- All `t(...)` keys, translations, copy strings
- Form fields, submit handlers, validation, toast messages
- `Index.tsx` section order
- Routes, links, SEO, prerender, analytics calls
- Other sections (Hero, Miben Segít, How It Works, Drink, Link, Earn, Give, Pricing)

### Verification
After edits, visual check at 375px (mobile), 768px (tablet), 1339px (current viewport), 1440px+:
- No horizontal overflow.
- Form readable on mobile, fields stack, focus state cyan.
- Cards equal height in grids.
- Footer columns align, social icons render, no broken links.
- Confirm no copy changed by diffing only `className`/markup, never `t(...)` arguments.