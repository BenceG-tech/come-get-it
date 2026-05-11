## Footer skyline gap csökkentése

A `Footer.tsx`-ben a skyline kép felett túl nagy üres rész van mobilon, mert:
- a fő grid `py-12` (96px függőleges padding)
- a skyline konténer `max-w-7xl mx-auto px-4` — mobilon a `px-4` miatt fehér térköz van bal/jobb oldalon, és a kép ezért kisebb és magasabban "lebeg"

### Lépések `src/components/Footer.tsx`-ben

1. A felső grid padding csökkentése mobilon: `py-12` → `pt-12 pb-4 md:pb-12` (mobilon kicsi alsó térköz, desktopon marad).
2. A skyline konténerről mobilon levesszük az oldalsó paddinget, hogy a kép széltől-szélig érjen és vizuálisan a footer aljához tapadjon: `max-w-7xl mx-auto px-4` → `max-w-7xl mx-auto px-0 md:px-4`.
3. A copyright sáv felső bordert/elválasztót megtartjuk, de csökkentjük a `py-6`-ot mobilon: `py-6` → `py-4 md:py-6`.

Nem nyúlunk a kép méretéhez (marad `w-full h-auto`), csak a körülötte lévő térközökhöz mobilon. Desktopon a jelenlegi megjelenés változatlan.
