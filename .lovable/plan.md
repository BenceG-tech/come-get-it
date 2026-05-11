# Javítások: hero csík + koktél + kártya-háttérképek

## 1. Hero alatti kék csík eltávolítása

A `src/components/ReflectionFloor.tsx` komponens egy fényes cián vízszintes vonalat (horizon glow) renderel, ami a hero szekció alján egy kék csíkként jelenik meg, és átfolyik a következő (`Hogyan működik`) szekcióba.

- Eltávolítjuk a "Horizon glow line" div-et.
- A reflective sheen megmarad (halvány gradient), de a markáns csík nélkül.

## 2. Koktél kép (`cyan-cocktail.png`) cseréje

A jelenlegi koktél kép gagyinak hat a hero mellett és a kártyákban is.

- Új, fotórealisztikus, prémium hangulatú cián világítású koktél generálása `imagegen` (`premium`) használatával, transzparens háttérrel: `src/assets/cocktail-glass.png`.
- A `HeroSection.tsx`-ben kicseréljük az importot.
- A `BenefitsSection` és `MibenSegit` "sponsor"/"sofa" kártyájából eltávolítjuk a koktélt és relevánsabb saját képet kapnak (lásd lent).

## 3. Egyedi, releváns háttérképek minden kártyához

Jelenleg 8 kártya összesen 3 képet újrahasznál, és túl sötét az overlay (alig látszanak).

### MibenSegit szekció (4 kártya — napszakok / alkalmak)
Új generált képek (`fast` quality, ~1024×1024, fotórealisztikus, cián tinttel):

1. `breakfast-cafe.jpg` — reggeli kávézó, croissant, latte, reggeli fény
2. `lunch-bistro.jpg` — bisztró ebéd, asztal felülről, ételek
3. `lounge-evening.jpg` — kanapés lounge, esti hangulat, neon
4. `nightclub-party.jpg` — éjszakai klub, neon fények, tömeg

### Benefits szekció (4 kártya — célcsoportok)

1. `user-friends-drinks.jpg` — fiatal csoport koccint cián drinkekkel (felhasználó)
2. `venue-bartender.jpg` — bartender koktélt készít a pult mögött (vendéglátóhely)
3. `brand-bottles.jpg` — prémium italmárka palackok cián világításban (sponsor/brand)
4. `charity-water.jpg` — tiszta víz csepp / közösségi segítés vizuális (charity)

Mind sötét háttérrel, cián accent-tel, hogy illeszkedjenek a Neon Fidelity stílushoz.

## 4. GlassImageCard overlay világosítása

Jelenleg az overlay tul sotet (`rgba(3,7,13,0.85)` tetejen) — a kép alig latszik.

A `src/components/ui/glass-image-card.tsx`-ben:
- Alap kép opacitás: `0.14` → `0.32`, hover: `0.28` → `0.5`.
- Sötét overlay gradient: `rgba(3,7,13,0.85) → 0.55` lecsökkentve `0.55 → 0.25`-re a kép láthatóságához.
- Maszk kicsit gyengébb, hogy a kép feljebb is áttörjön.

## 5. Érintett fájlok

```text
módosított:
  src/components/ReflectionFloor.tsx        — horizon csík törölve
  src/components/ui/glass-image-card.tsx    — világosabb overlay
  src/components/HeroSection.tsx            — új cocktail import
  src/components/MibenSegitSection.tsx      — 4 új egyedi bgImage
  src/components/BenefitsSection.tsx        — 4 új egyedi bgImage
új:
  src/assets/cocktail-glass.png             — új koktél (premium)
  src/assets/breakfast-cafe.jpg
  src/assets/lunch-bistro.jpg
  src/assets/lounge-evening.jpg
  src/assets/nightclub-party.jpg
  src/assets/user-friends-drinks.jpg
  src/assets/venue-bartender.jpg
  src/assets/brand-bottles.jpg
  src/assets/charity-water.jpg
```

A kártyák így mind egyedi, releváns, jól látható képet kapnak; a hero-csík eltűnik; a koktél prémium hangulatú lesz.
