## /vendeglatohelyek — replace benefits with "6 érv" section

### New component: `src/components/VenueWhyWorth.tsx`

A 6-card "Miért éri meg neked?" grid (md:2 cols / lg:3 cols) using the existing `nf-card` glass styling, gradient cyan icon tile, and hover lift, matching `MibenSegitSection` patterns.

Cards (icon → title → description), copy verbatim:
1. `Users` — "Garantált új vendégek" — "A juzereink azért nyitják meg az appot, mert döntéshelyzetben vannak: „hova menjek ma?" Te megjelensz a válaszuk között."
2. `DollarSign` — "Nulla pénzügyi rizikó" — full description as provided.
3. `Clock` — "Te döntöd el, mit és mikor adsz ingyen" — full description.
4. `BarChart3` — "Adatok, amiket sehol máshol nem kapsz" — full description.
5. `MapPin` — "Lokáció-alapú push az utcán" — full description.
6. `DoorOpen` — "Kockázatmentes kilépés" — full description.

Section header: "Miért éri meg neked?" (centered, `text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white`).

Copy is hardcoded HU in the component (matches what the user provided; no i18n keys requested for this section).

### `src/pages/Vendeglatohelyek.tsx`
- Replace `import { VenueKeyFeatures } from '@/components/VenueKeyFeatures'` with `import { VenueWhyWorth } from '@/components/VenueWhyWorth'`.
- Replace `<VenueKeyFeatures />` with `<VenueWhyWorth />` in the JSX (placement unchanged: after `HowItWorksForVenues`, before `VenueStats`).

### Out of scope
- `VenueKeyFeatures.tsx` left in place but unused (safe to delete later if desired).
- No hero, stats, or application form changes.