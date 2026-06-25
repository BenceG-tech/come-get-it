Screenshot és mockup méretezés – terv

1. Mi volt előtte
   - A régi PhoneMockup fix `w-64 h-[520px]` volt, azaz 256px × 520px, képarány ~1:2.03 (9:18.3).
   - Ez túl magas volt, és a screenshotok vagy lecsúsztak, vagy fekete sávosak lettek.

2. Mi van most
   - A komponens már 9:19.5 arányú (modern iPhone-szerű), desktopon 300px széles.
   - A képarány jó, de a 300px-es szélesség túl nagy a heróban – a telefon dominálja a kompozíciót.

3. Mit mondj a rork.com-nak screenshot-generáláskor
   - Felbontás: `1179 × 2556 px` (iPhone 15 Pro) vagy `1170 × 2532 px` (iPhone 14 Pro).
   - Képarány: `9:19.5`.
   - Formátum: PNG (transzparens elemek nélkül, hogy a mockup fekete háttérén jól mutasson).
   - Fontos: a tetején hagyjanak helyet a Dynamic Island számára (~38px magas sáv a tetején), és az alján a home indicator/bar számára (~34px). Ne tegyenek kritikus UI-t a legfelső 5%-ba és a legalsó 5%-ba.

4. Mit változtassunk az oldalon
   - Csökkenteni a PhoneMockup alapértelmezett szélességét: `w-[220px] sm:w-[240px] md:w-[260px]` (jelenleg 260/280/300).
   - Ez a heróban kisebb, arányosabb telefont ad, és a szöveg/Cta marad a fókuszban.
   - A képarányt nem kell módosítani, a 9:19.5 továbbra is jó.

5. Amikor megvannak az új screenshotok
   - Feltöltés Lovable asset-ként (`lovable-assets create`).
   - `src/assets/hero-app-... .asset.json` pointerek frissítése.
   - Ellenőrzés: a screenshotok `object-cover object-top` módban kitöltik a kijelzőt, a Dynamic Island nem takar el lényeges tartalmat.