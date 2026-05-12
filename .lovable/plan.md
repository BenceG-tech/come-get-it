## Probléma
A "Miben segít?" kártyák hover animációja akadozik. Ok: a felugró panelen `backdrop-blur-md` van, amit minden frame-ben újraszámol a böngésző az alatta lévő (skálázódó) képre — ez a fő FPS-gyilkos.

## Megoldás — `src/components/MibenSegitSection.tsx`

**1. `backdrop-blur` eltávolítása**
- A description panelről lekerül a `backdrop-blur-md`.
- Helyette enyhe `text-shadow` a `<p>` szövegen az olvashatóságért (`text-shadow: 0 1px 8px rgba(0,0,0,0.7)`), és kicsit erősebb sötét gradient háttér: `linear-gradient(180deg, rgba(5,5,5,0) 0%, rgba(5,5,5,0.7) 30%, rgba(5,5,5,0.88) 100%)`.

**2. GPU-barát kompozitálás**
- A panel és a kép kap `will-change: transform, opacity` + `transform: translateZ(0)` (egy `transform-gpu` osztály) → külön kompozit rétegen fut, nem fut layout/paint minden frame-ben.

**3. Animáció finomítása**
- Panel: `opacity-0 → opacity-100`, `duration-200 ease-out` (gyors, könnyű fade).
- Kép zoom: `duration-[1100ms]` marad, de `transform-gpu`-val.
- A title fade kicsit gyorsabb: `duration-300`.

## Érintetlen
- Layout, méretek, ikonok, i18n, desktop/mobil elrendezés, többi szekció.
