## Cél

A megadott prémium "ServiceCard" effektus replikálása **azúrkék** (`hsl(187 100% 42%)` — a projekt `nf-primary` token) színnel, és alkalmazása az összes value-prop kártya blokkra (italmárkák, rewards-partners, founding partner / accelerator).

Háttérkép helyett **gradient háttér** (kép nélküli verzió), a jelenlegi rács-arányok megtartásával (nem portré 4/5).

## 1. Design tokenek bővítése

**`tailwind.config.ts`** — `boxShadow` blokkba új azúr glow:
- `'azure': '0 10px 40px -10px hsl(187 100% 42% / 0.45)'`
- `'azure-strong': '0 20px 60px -10px hsl(187 100% 42% / 0.6)'`
- `'elegant': '0 8px 30px -12px hsl(0 0% 0% / 0.6)'`

(Mind HSL alapú, a projekt `nf-primary`-jével harmonizál.)

## 2. Új komponens: `src/components/ui/ServiceCard.tsx`

Egységes, újrahasznosítható kártya az összes value-prop blokkhoz. Props:

```ts
interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index?: number;        // staggered belépőhöz
  badge?: string;        // opcionális bal felső pasztilla (pl. "01" / "ÚJ")
  deliverables?: string[]; // opcionális, hover-on lecsúszó lista
}
```

Felépítés (1:1 a specifikáció szerint, csak gold→azúr csere és kép helyett gradient):

- **Keret**: `group relative rounded-2xl overflow-hidden border border-white/10 hover:border-nf-primary/60 shadow-elegant hover:shadow-azure transition-all duration-500`
- **Háttér** (kép helyett): abszolút div, `bg-gradient-to-br from-nf-surface via-nf-surface-alt to-black`, fölötte egy második réteg `bg-[radial-gradient(circle_at_30%_20%,hsl(187_100%_42%/0.18),transparent_60%)]` — `transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110` (lassú zoom a gradient rétegen)
- **Sötét overlay**: `bg-gradient-to-t from-black/95 via-black/60 to-black/10 group-hover:from-black/98 group-hover:via-black/85 group-hover:to-black/40 transition-all duration-500`
- **Jobb felső lebegő ikon**: `h-11 w-11 rounded-full bg-nf-primary/95 backdrop-blur-sm shadow-azure group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500` — fekete Lucide ikonnal
- **Bal felső pasztilla** (ha `badge`): `bg-black/70 backdrop-blur-md border border-nf-primary/30 rounded-full px-3 py-1 text-xs`
- **Tartalom (alul)**: cím `group-hover:text-nf-primary transition-colors duration-300`, leírás `line-clamp-2 group-hover:line-clamp-none`
- **Deliverables lista (ha van)**: külső `grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out`, belül `overflow-hidden` div listával
- **Alsó azúr vonal**: abszolút `h-0.5 bg-gradient-to-r from-transparent via-nf-primary to-transparent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700`
- **Belépő animáció**: `motion.div` — `initial={{ opacity: 0, y: 32 }}`, `whileInView={{ opacity: 1, y: 0 }}`, `viewport={{ once: true, margin: '-50px' }}`, `transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}`

**Fontos eltérés a spec-től**: nem `aspect-[4/5]`, hanem `min-h-[280px]` flex-column, hogy beilleszkedjen a megadott rácsokba (megtartjuk a jelenlegi arányokat).

## 3. Bekötés a value-prop blokkokba

Az összes alábbi helyen a meglévő `glass-effect rounded-xl/2xl ...` `<div>`-eket lecseréljük `<ServiceCard ... index={index} />`-re. A rács `grid` és `gap` osztályok maradnak változatlanul.

| Fájl | Sor (kb.) | Szekció |
|---|---|---|
| `src/pages/ComeGetItAccelerator.tsx` | 156–180 | "Hogyan működik?" 5 kártya |
| `src/pages/ComeGetItAccelerator.tsx` | 194–202 | "Miért válassz minket?" 4 kártya |
| `src/pages/Italmarkak.tsx` | 128–153 | Brands "How it works" 4 kártya |
| `src/pages/Italmarkak.tsx` | 166–174 | Brands "Features" 4 kártya |
| `src/pages/Italmarkak.tsx` | 187–195 | Brands "Target audience" 3 kártya |
| `src/pages/Italmarkak.tsx` | 202–214 | Brands value-props 4 kártya |
| `src/pages/RewardsPartners.tsx` | 181–206 | Rewards "How it works" 4 kártya |
| `src/pages/RewardsPartners.tsx` | 219–231 | Rewards "Features" 2 kártya |
| `src/pages/RewardsPartners.tsx` | 242–254 | Rewards "A jutalom-partnerség előnyei" 4 kártya |
| `src/components/VenueWhyWorth.tsx` | 47–66 | Vendéglátók "Miért éri meg?" 6 kártya |

Ahol `step.number` van (How it works blokkok), a `badge` propon adjuk át. Ahol nincs, a `badge` kimarad.

## 4. Mit NEM piszkálunk

- A szekciók címsorait, padding-jét, háttérszínét és `grid` osztályait nem módosítjuk.
- A `framer-motion` már installálva van a projektben, új csomag nem kell.
- `index.css`-ben nincs új token — csak a `tailwind.config.ts` `boxShadow` bővül.
- I18n kulcsok és tartalmak változatlanok.

## Tech megjegyzés

A "titkos szósz" három eleme megmarad: `cubic-bezier(0.22, 1, 0.36, 1)` easing, `grid-rows-[0fr] → [1fr]` reveal trükk, és 6 párhuzamos hover-átmenet (300/500/500/500/700/1400ms). Színváltás: `gold` → `nf-primary` (`#00bcd4` / `hsl(187 100% 42%)`), `shadow-gold` → `shadow-azure`.
