# Egyedi háttérképek a kártyákhoz

## Cél
Minden kártya háttere kapjon egy egyedi, releváns képet — sötétített overlay-jel, brand-image szerint (Neon Fidelity: cyan #00bcd4 accent, sötét #050505 alap, cinematic mood).

## Generálandó képek (10 db)

### MibenSegitSection (4 kártya) → `src/assets/miben-segit/`
1. **reggeli.jpg** — Reggeli jelenet: kávé + croissant pulton, lágy reggeli fény, sötét mood
2. **ebed.jpg** — Bisztró ebéd asztal felülről, étel közeli, meleg tónus, sötétített
3. **beulos.jpg** — Hangulatos kávézó/kocsma sarok, kanapé, esti fény, intim
4. **bulizas.jpg** — Klub/bár éjjel, neon fények, koktélok, mozgó tömeg silhouette

### VenueWhyWorth (6 kártya) → `src/assets/venue-why/`
1. **uj-vendegek.jpg** — Vendégek belépnek egy bárba, mozgás
2. **nulla-rizikó.jpg** — Pénztárgép / koccintó pohár close-up, anyagi nyugalom
3. **te-dontesz.jpg** — Csapos italt készít, kontroll érzés, pult mögött
4. **adatok.jpg** — Bár belső analytics-feel, fények grafikon-szerű ritmusban (absztraktabb)
5. **lokacio-push.jpg** — Utcai séta éjjel város, telefon a kézben, neon utcai fények
6. **kockazatmentes.jpg** — Nyitott ajtó/függöny bárba, "easy out" érzés

## Vizuális stílus (mindegyikre)
- Cinematic, sötét, magas kontraszt
- Cyan/teal accent fények (#00bcd4 hangulat)
- Filmszerű, nem stock-fotó-szerű
- Tájolás: 4:3 vagy 3:2 (1024×768 / 1280×853)
- Modell: `fast` (10 kép, költség miatt)

## Komponens-módosítások

### `MibenSegitSection.tsx`
- Importálni a 4 képet
- Hozzárendelni a `cards` tömbhöz egy `bgImage` mezővel
- Kártyára: `style={{ backgroundImage: 'url(...)' }}` + `bg-cover bg-center`
- Sötétítő overlay: `before:absolute before:inset-0 before:bg-black/65 before:rounded-2xl` (vagy gradient overlay)
- Tartalom marad `relative z-10`
- Hover: overlay enyhén világosodik (`hover:before:bg-black/55`)

### `VenueWhyWorth.tsx`
- Ugyanaz a minta, 6 képpel
- A meglévő `border + bg-white/[0.03]` lecserélve háttérképre + sötét overlayre

## Háttér-overlay recept (mindkét szekcióhoz egységes)
```
- bg-cover bg-center
- before: linear-gradient(180deg, rgba(5,5,5,0.55) 0%, rgba(5,5,5,0.85) 100%)
- border-nf-primary/20 megmarad
- hover shadow cyan glow megmarad
```
Ez biztosítja a szöveg olvashatóságát és a brand-konzisztenciát.

## Megjegyzés
Nem nyúlok más szekciókhoz, csak a két kérteshez. Ha tetszik a megoldás, ugyanezt a mintát később kiterjeszthetjük a `BenefitsSection`-ra is.
