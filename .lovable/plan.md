## Cél

A `HeroSection` átrendezése úgy, hogy:
1. A Parlament háttérkép ne közvetlenül a főcím alatt domináljon, hanem a **szöveg és a telefon közti középső sávban** legyen jól látható (alul-felül elhalványítva).
2. A telefon mockup beljebb csússzon a hero közepe felé, hogy a jobb szélen elférjen a feltöltött **kék koktél**.
3. A koktél (dekoratív termékkép) lebegjen a jobb oldalon, finom cyan glow-val.

Copy, CTA-k, badge, social proof, navigáció, analytics és funkcionalitás **változatlan**.

---

## Lépések

### 1. Asset
- A feltöltött koktélt átmásolom: `src/assets/cyan-cocktail.png` (átlátszó PNG marad).
- ES6 importtal hozzáadom a `HeroSection.tsx`-hez.

### 2. Háttérréteg újrastruktúra (`HeroSection.tsx`)

Most a Budapest-night kép full-cover, egyenletes ~60% opacitással + sötét overlay-jel — ezért a Parlament a főcím alatt „úszik".

Új z-rétegek alulról felfelé:
1. Sötét base (`bg-nf-background`) – teljes szekció.
2. **Parlament kép sáv** – csak a függőleges középső ~40–55%-ban látszik élesen:
   - `absolute inset-x-0 top-[32%] bottom-[22%]`
   - `object-cover object-center`
   - CSS `mask-image: linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)` (+ `-webkit-mask-image`)
   - opacity ~0.55
3. **Felső sötét fade** – `from-[#03060d] via-[#03060d]/85 to-transparent` a hero felső ~40%-án, hogy a H1 tisztán sötét háttér előtt legyen.
4. **Alsó sötét fade** – ugyanígy lefelé a CTA-k és founding note alatt.
5. **Cyan radial glow-k** – a középső sávra (telefon + koktél köré) fókuszálva.

Eredmény: a Parlament csak a középső horizontális sávban látszik, a szöveg és a telefon **között**, nem mögöttük.

### 3. Jobb oszlop átrendezése (telefon + koktél)

A jelenlegi telefonos `div` helyett relatív kontainer:

- Wrapper: `relative flex justify-center items-center min-h-[560px]`
- **Telefon**: `relative z-20`, `lg:-translate-x-10 xl:-translate-x-14` (~40–60px-szel beljebb a hero közepe felé), `scale-100` (a 105/110 helyett kicsit kisebb). Cyan glow marad.
- **Koktél**:
  - `<img src={cyanCocktail} alt="" aria-hidden="true" />`
  - `absolute right-0 lg:right-2 bottom-0 lg:bottom-6 z-10`
  - `w-[160px] lg:w-[200px] xl:w-[240px]`
  - `drop-shadow-[0_0_45px_rgba(0,188,212,0.6)]`
  - mögötte külön cyan radial glow div (`blur-3xl`)
  - `hidden lg:block` (mobilon elrejtjük, ne zsúfoljon)

### 4. Reszponzív

- **Mobil/tablet (`<lg`)**: koktél rejtve, telefon centrált — ahogy most.
- **Desktop (`lg+`)**: telefon beljebb, koktél jobbra alul, mindkettő elfér.
- A maszkolt Parlament-sáv minden méreten szépen elhalványul, így nincs durva levágás.

### 5. Háttérkép pozíció
- `object-position: center 55%` a Parlament sziluett középre helyezéséhez.

---

## Érintett fájlok

- `src/components/HeroSection.tsx` – háttér rétegek átépítése, jobb oszlop átrendezése, koktél integrálása, telefon offset + scale.
- `src/assets/cyan-cocktail.png` – új asset (a feltöltött kép másolata).

Más fájl, copy, route, SEO, analytics, form-logika **nem** változik.
