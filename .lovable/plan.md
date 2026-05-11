## Footer skyline csere

A `Footer.tsx`-ben jelenleg egy inline SVG skyline van. Lecseréljük a feltöltött Budapest skyline képre.

### Lépések

1. A két feltöltött kép közül a **átlátszó hátterű PNG-t** (`68A5C11C-...png`) másoljuk `src/assets/footer-skyline.png` néven — ez illeszkedik a footer sötét hátterére anélkül, hogy fekete blokk látszódna alul.
2. `src/components/Footer.tsx`-ben:
   - Töröljük a meglévő inline `<svg>` skyline blokkot.
   - Importáljuk az új képet ES6 importtal.
   - Helyette `<img>` tag, `w-full h-auto`, `aria-hidden`, `loading="lazy"` attribútumokkal, a meglévő `max-w-7xl mx-auto px-4` konténerben.
   - Megtartjuk a nf-primary tónust (a kép már cyan), nincs szín-overlay.

### Megjegyzés
Az átlátszó verziót választom alapból, mert a footer háttere `bg-nf-background` (közel fekete), így a fekete hátterű JPG-nek nem lenne előnye, az átlátszó PNG viszont tisztább illesztést ad. Ha mégis a fekete hátterűt szeretnéd, szólj.
