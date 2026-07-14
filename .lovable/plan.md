## Cél
A `PhoneMockup` keret pontosan az iPhone 17 Pro screenshot-arányához igazodjon, hogy a képek pixelre illeszkedjenek — se lelógás, se fekete csík.

## iPhone 17 Pro specifikációk
- Screenshot felbontás: **1206 × 2622 px**
- Arány: **1206 / 2622 ≈ 0.4600** (≈ 201:437, gyakorlatilag `9 / 19.5522`)
- A jelenlegi keret `9/19.5` (0.4615) — közel, de nem pontos, ezért 1-2 px lelógás/vágás előfordul.

## Változtatások — csak `src/components/PhoneMockup.tsx`

1. **Frame arány pontosítása**
   - `FRAME_RATIO = 9 / 19.5` → `1206 / 2622`
   - `aspect-[9/19.5]` → `aspect-[1206/2622]` (Tailwind arbitrary value engedi)

2. **Default fit visszaállítása `cover`-re**
   - Mivel most az arány pixelre stimmel, a `contain` már nem szükséges — a `cover` teljesen kitölti a képernyőt fekete csík nélkül.
   - `fit?: ... default = 'cover'` (auto marad fallbacknek, ha valaki más arányú képet ad be).
   - Az `auto` logika toleranciáját szűkítem 15%-ról 3%-ra, hogy csak akkor váltson `contain`-re, ha tényleg más eszközről jött a screenshot.

3. **Corner radius finomhangolás (opcionális, iPhone 17 Pro-hoz illő)**
   - Külső keret: `rounded-[2.75rem]` marad
   - Belső képernyő: `rounded-[2.35rem]` marad
   - (Az iPhone 17 Pro sarok-görbülete ~55px @ 1206px szélesség = kb. 4.5% → az aktuális arány rendben van a 200-240px mockup méretnél)

## Amit NEM módosítok
- Az `Index.tsx`-ben lévő szekciók, kép-listák, animációk maradnak.
- A hover-tilt, glow, border effektek változatlanok.
- Nem érintem a `LinkSection`, `DrinkSection`, `EarnSection`, `HeroSection` fájlokat — csak a keret aránya változik, ami automatikusan minden helyen alkalmazódik.

## Ellenőrzés implementálás után
- Preview: 402×701 (mobil) — hero szekció phone mockup nézete
- Ellenőrzöm mindegyik szekciónál (Hero, Link, Drink, Earn), hogy a screenshot pixelre kitölti a keretet.

Ha ez így jó, jóváhagyás után átváltok build módba és beadom a módosítást.