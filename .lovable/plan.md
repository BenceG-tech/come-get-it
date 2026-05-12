## Cél
Visszahozni a blur-t a felugró szöveg hátterére, de akadás nélkül.

## Ok
A `backdrop-blur` önmagában nem lassú — csak akkor lesz az, ha alatta **folyamatosan változó** pixelek vannak (pl. egyszerre skálázódó kép). A korábbi verzióban a kép `scale(1.03)`-ra zoom-olt hover-re, és közben a panel is blur-ölte ezt a mozgó réteget → minden frame újra-mintavételezés.

## Megoldás — `src/components/MibenSegitSection.tsx`

**1. Image zoom kivétele hover-re**
- A `group-hover:scale-[1.03]` és a hozzá tartozó `transition-transform duration-[1100ms]` lekerül a kép wrapperről. A kép statikus marad hover alatt → a blur alatti réteg nem változik.

**2. Backdrop-blur visszatétele a panelre**
- A felugró description panel kap `backdrop-blur-md` + `bg-nf-background/40`-t (átlátszó sötét tónus + valódi blur).
- A `text-shadow` a `<p>` szövegen marad az olvashatóságért, gradient kicsit lágyítva: `linear-gradient(180deg, rgba(5,5,5,0) 0%, rgba(5,5,5,0.45) 30%, rgba(5,5,5,0.65) 100%)`.
- `will-change: opacity` + `transform-gpu` marad → külön kompozit réteg.

**3. Animáció marad sima**
- Panel: `opacity-0 → opacity-100`, `duration-200 ease-out` (gyors fade).
- Title fade: `duration-300`.
- Kártya `-translate-y-1` és border/shadow hover effekt érintetlen.

## Érintetlen
Layout, méretek, ikonok, i18n, többi szekció.
