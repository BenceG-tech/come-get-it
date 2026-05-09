## Változtatások

**1. Koktél eltávolítása**
- `src/components/HeroSection.tsx`: töröljük a jobb oldali `cyanCocktail` képet és annak glow-ját, valamint a `cyanCocktail` importot. A telefon visszakerül középre (eltávolítjuk a `lg:-translate-x-10 xl:-translate-x-14` eltolást).
- `src/pages/Italmarkak.tsx`: töröljük a koktél képet, glow-ját és az importot a hero szekcióból. A háttér 3-rétegű glow (sötét halo + cián glow) marad.

**2. Telefon mockup méret egységesítése**
A főoldali hero telefon natív méretben (scale nélkül) jelenik meg. Az aloldalakon jelenleg `lg:scale-[1.22] xl:scale-[1.32]` van — ezt eltávolítjuk, hogy ugyanakkora legyen, mint a főoldalon.

Érintett fájlok:
- `src/components/VenueHeroSection.tsx` (Vendéglátóhelyek)
- `src/pages/Italmarkak.tsx` (Italmárkák)
- `src/pages/RewardsPartners.tsx` (Rewards Partners)

Mindháromban a phone wrapper:
```
className="relative z-10 origin-center [filter:drop-shadow(0_30px_70px_rgba(0,0,0,0.75))_drop-shadow(0_0_45px_rgba(0,188,212,0.35))]"
```
(a `lg:scale-[1.22] xl:scale-[1.32]` és a duplikált `drop-shadow-[...]` osztály eltávolítva)

A `min-h-[480px] lg:min-h-[640px]` konténer marad, így a kompozíció nem ugrik szét. A 3-rétegű háttér glow (sötét halo + cián glow) változatlan.

**Amit NEM változtatunk:** copy, CTA, formok, analytics, SEO, navigáció, háttérképek, sötét overlay-ek, a többi szekció.
