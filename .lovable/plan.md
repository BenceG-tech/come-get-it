## 1. „Miért éri meg mindenkinek?" kártya-címek betűtípusa

`src/components/BenefitsSection.tsx` (61. sor) — a kártyák `<h3>` címei jelenleg `font-anton uppercase` stílusúak, ami eltér a többi főoldali kártyától (pl. MibenSegitSection).

Cserélem erre, hogy egyezzen a többi kártyával:
```
font-sans font-bold uppercase tracking-wider text-white text-sm sm:text-base
```
(a többi class — hover szín, margó — marad)

## 2. Telefon mögötti glow — erőteljesebb, élesebb, kevesebb szórás

**`src/components/HeroSection.tsx`** (főoldal hero, telefon mögötti glow div):
- Jelenleg: `blur(30px)`, halvány cyan radial (0.32 → 0.12 → transparent 75%)
- Új: `blur(18px)`, élénkebb és tömörebb cyan
  - `radial-gradient(ellipse 42% 42% at 50% 50%, rgba(0,188,212,0.65) 0%, rgba(0,188,212,0.28) 40%, transparent 65%)`

**`src/components/VenueHeroSection.tsx`** (vendéglátóhelyek hero, két glow réteg):
- A cyan glow réteget hasonlóan tömörítem: `blur(16-18px)`, 0.7 középső intenzitás, transparent ~65%-nál (jelenleg 75%).
- A sötét shadow halo marad (a sötétítés OK).
- A `drop-shadow(0_0_45px_rgba(0,188,212,0.35))` filtert élesítem: `drop-shadow(0_0_28px_rgba(0,188,212,0.6))`.

## Érintett fájlok
- `src/components/BenefitsSection.tsx`
- `src/components/HeroSection.tsx`
- `src/components/VenueHeroSection.tsx`

## Verifikáció
Playwright screenshot mobil (402px) + desktop nézetben a főoldalról és /vendeglatohelyek oldalról — ellenőrzöm hogy a glow tényleg élénkebb és koncentráltabb-e, és hogy a benefits kártyák címei a többivel egyező sans-bold stílusúak.
