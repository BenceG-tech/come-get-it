## Probléma
A képen a telefon mockup még mindig nem néz ki natívan: túl vastag/mesterséges a keret, a screenshot körül/alatt látszik egy türkiz négyzetes háttér, és mobil nézetben a telefon túl nagyra nő, ezért rálóg a következő CTA/szöveg területre.

## Javítási terv
1. **PhoneMockup újrarakása egyszerűbb, pontosabb kerettel**
   - A jelenlegi extra belső háttér/keret rétegeket minimalizálom.
   - A screenshotot közvetlenül egy iPhone 17 Pro arányú, lekerekített viewportba teszem.
   - Eltüntetem azt a látható türkiz/négyzetes hátteret, ami most kilóg a telefon mögül.

2. **Képarány és illeszkedés stabilizálása**
   - A mockup aránya marad `1206 / 2622`.
   - A képek alapértelmezésben teljesen kitöltik a telefont, de nem kapnak plusz belső pozicionálási hibát.
   - Ha valamelyik asset tényleges mérete eltér, az `auto` fit csak akkor váltson `contain`-re, amikor tényleg szükséges.

3. **Mobil hero méret javítása**
   - A hero telefon külön kisebb méretet kap mobilon, hogy ne nyomja rá magát az alsó CTA-ra és founding note-ra.
   - Desktopon marad látványos, de mobilon kontrolláltabb lesz.

4. **Szekciók egységesítése**
   - Hero, Drink, Link és Earn telefonok ugyanazt a javított mockupot használják.
   - Ahol kell, külön `widthClassName`-mel állítom a méretet, nem skálázással, hogy ne torzuljon.

5. **Ellenőrzés mobil nézetben**
   - A végén megnézem a főoldalt mobil viewporton, hogy:
     - nincs kilógó türkiz téglalap,
     - nem vágódik le a screenshot széle,
     - a telefon nem takarja a CTA-t/szöveget,
     - a mockup aránya egységes minden szekcióban.

## Technikai részletek
Érintett fájlok:
- `src/components/PhoneMockup.tsx`
- `src/components/HeroSection.tsx`
- szükség esetén: `src/components/DrinkSection.tsx`, `src/components/LinkSection.tsx`, `src/components/EarnSection.tsx`

Nem cserélek képet, csak a telefon mockup megjelenítését és méretezését javítom.