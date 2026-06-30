## Probléma
A `useSecretAdminEntry` hook csak akkor navigál `/admin`-ra, ha a felhasználó **már bejelentkezett ÉS admin**. Ha nem vagy bejelentkezve (ami a fejléc logó 99%-os esete), az 5x kattintás semmit nem csinál — nincs visszajelzés, nem visz az auth oldalra.

További gyanús pont: a hook `clicksNeeded=5` darab kattintást vár **2 másodpercen belül** — ez gyors, és a `<Link>` elem default `onClick`-je egyúttal navigálhat is, ami megszakíthatja a számlálót route váltással.

## Javítás

**`src/hooks/useSecretAdminEntry.ts`**
- Ha a user nincs bejelentkezve → `/auth?redirect=/admin`-ra navigál (silent, hint nélkül).
- Ha be van jelentkezve és admin → `/admin`.
- Ha be van jelentkezve de NEM admin → semmi (nem áruljuk el a létezését).
- Ablakot 2000ms → **2500ms**-re lazítjuk, hogy desktopon is kényelmes legyen.
- `event.preventDefault()` + `event.stopPropagation()` amikor eléri a küszöböt, hogy a `<Link>` ne navigáljon közben a `/`-ra.

**`src/components/Navigation.tsx`**
- A logó jelenleg `<Link to="/" onClick={secretAdminClick}>`. Mivel a Link mindig navigál, a számláló reset-elődhet mert már a `/`-on vagyunk (nincs route váltás, de a `ScrollToTop` futhat). A `secretAdminClick`-et `event`-tel hívjuk, és a hook a 5. kattintásnál `preventDefault`-ot hív.

**`src/components/MobileNavigation.tsx`** és **`src/components/Footer.tsx`**
- Ugyanaz a frissített hook automatikusan érvényesül, nincs változtatás szükséges (mobilon `<button>`-ra van kötve, footernél copyright szövegen).

## Tesztelési forgatókönyv
1. Kijelentkezve, főoldal fejléc-logóra 5x kattintás → `/auth?redirect=/admin` betöltődik.
2. Bejelentkezve admin user-ként → egyenesen `/admin`.
3. Bejelentkezve nem-admin user-ként → semmi nem történik (silent).
