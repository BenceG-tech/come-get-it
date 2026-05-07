## Replace `HowItWorksForVenues` with 5-step "Csatlakozás 5 lépésben"

Rewrite `src/components/HowItWorksForVenues.tsx` to render 5 steps with hardcoded HU copy (matches user spec verbatim). Keep existing `nf-card` numbered card style with cyan number badge, gradient icon circle, hover scale + neon shadow. Keep `id="how-it-works-venues"` so the hero secondary CTA still scrolls here.

Section title (centered): "Csatlakozás 5 lépésben"

Steps (number, lucide icon, title, description):
1. `MessageCircle` — "Beszélgetünk" — "Online vagy személyesen találkozunk. Megmutatjuk az appot, az admin felületet, és válaszolunk minden kérdésedre."
2. `FileSignature` — "Aláírjuk a Letter of Intent-et" — full description.
3. `Settings` — "Beállítjuk a profilodat" — full description.
4. `Rocket` — "Elindulunk szeptember 1-én" — full description.
5. `ShieldCheck` — "Az első 6 hónap teljesen jutalékmentes" — full description.

Grid: `grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5` so 5 cards lay out cleanly.

Drops `useI18n` usage (copy is hardcoded HU as provided). The unused `venues.how_it_works.*` i18n keys can stay untouched.

### Out of scope
- No changes to other sections on the page or to `i18n` files.