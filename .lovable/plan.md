## Hero szekció finomítás

**1. Törésvonal / tükröződés eltávolítása**
- `src/components/HeroSection.tsx`-ből kiveszem a `<ReflectionFloor />` komponens használatát (ez okozza a vízszintes csíkot a hero alján).
- A `budapestNight` parlament képet is kiveszem teljesen a hero háttérből (a maszk széle adhatja a látható "törést"), helyette csak a tiszta `#03060d` háttér + cyan radial glow + diagonal light-leak marad. Tisztább, törésmentes hero.

**2. Koktélpohár nagyobb — telefon méretű**
- `HeroSection.tsx`-ben a `<img src={cyanCocktail}>`-en:
  - méret: `w-48 xl:w-60` → `w-72 xl:w-96` (kb. a phone mockup szélességével azonos)
  - igazítás: `self-end` helyett `self-center`, így a telefon mellett középen áll, mintha mellette tartanák
  - dőlés és pozíció marad: `rotate-[10deg] translate-x-2`, drop-shadow változatlan
  - mobile: marad `hidden lg:block` (mobilon nem fér el két ekkora elem egymás mellett)

**Érintett fájl:** `src/components/HeroSection.tsx` (egyetlen fájl)

Nem nyúlok a `ReflectionFloor.tsx`-hez magához (más oldalakon még használatban lehet), csak a homepage hero-ból veszem ki.
