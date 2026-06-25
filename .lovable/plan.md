## Probléma
A `PhoneMockup` komponensben a screenshotok `object-cover object-top` módon vannak megjelenítve, ami levágja az oldalakat/aljat ha a kép nem pontosan a telefon képernyő arányához (kb. 9:19.5) igazodik. A jelenlegi screenshotok különböző arányúak, ezért egyesek lecsúsznak.

## Megoldás
Két részből álló javítás a `src/components/PhoneMockup.tsx`-ben:

### 1. Screenshot megjelenítés javítása
- `object-cover object-top` → `object-contain` váltás, hogy a teljes screenshot látszódjon torzítás/levágás nélkül.
- Háttér beállítása a screenshot mögé (sötét vagy a screenshot domináns színe) — `bg-black` vagy `bg-gray-900` — hogy ha a kép keskenyebb mint a képernyő, ne legyen csúnya fehér sáv.
- A jelenlegi `bg-gradient-to-br from-gray-50 to-white` belső háttér lecserélése sötétebbre, hogy app-szerűen nézzen ki.

### 2. Új `imageAspect` opcionális prop (jövőálló)
- Hozzáadunk egy `fit?: 'cover' | 'contain'` propot (alapból `contain`), hogy ha egy adott helyen mégis a teljes kitöltést akarjuk, felülírható legyen.

### 3. Felső notch fedés kezelése
- A notch (`absolute top-0 ... w-32 h-6`) jelenleg a kép tetejére rátakar. Mivel `object-contain`-nél a kép teteje a képernyő tetején van, a notch eltakarna fontos UI elemeket. Megoldás: kis felső padding (`pt-6`) a képnek, hogy a notch alatt induljon.

## Érintett fájl
- `src/components/PhoneMockup.tsx` (csak ez — minden szekció ezt használja, így egy helyen javítva minden mockup szinkronba kerül)

## Nem érintünk
- A screenshot fájlokat nem cseréljük/vágjuk — egy CSS-szintű fix mindenre megoldás.
- A többi szekció (Hero, Drink, Link, Earn) komponensei változatlanok maradnak.

## Eredmény
Minden telefon mockupban a teljes screenshot látszik, levágás nélkül, egységes méretben, sötét háttérrel a kép körül ahol szükséges.
