## Cél
A titkos admin belépés (5× kattintás 2 mp-en belül, csak admin role-lal) jelenleg csak a footer copyright szövegen működik. Bővítsük ki a header logókra is, hogy mobilon is könnyen elérhető legyen.

## Változtatások

1. **`src/components/Header.tsx`** — A desktop headerben lévő "Come Get It" logó/brand linkre kötjük rá a `useSecretAdminEntry` hookot. A hook `onClick` handlerét úgy fűzzük hozzá, hogy a normál navigáció (`/` link) továbbra is működjön — csak az 5. gyors kattintás után irányítja át `/admin`-ra (admin user esetén).

2. **Mobil menü panel logója** — Ugyanezt a hookot rákötjük a mobil slide-in menü tetején lévő logóra is, hogy mobil nézetben is elérhető legyen a titkos belépés.

3. **`src/hooks/useSecretAdminEntry.ts`** — Ha szükséges, kiegészítjük, hogy több elemen párhuzamosan is használható legyen (külön számláló példányonként, ami már most is így működik, mivel a hook minden hívásnál saját state-et kap).

## Viselkedés
- Nem-admin user: a logó kattintás normál módon a főoldalra visz, semmilyen redirect nem történik.
- Admin user: 5× kattintás 2 mp-en belül → `/admin` átirányítás. Egyetlen kattintás vagy lassabb sorozat → normál navigáció.

## Érintett fájlok
- `src/components/Header.tsx` (desktop + mobil menü logó)
- `src/hooks/useSecretAdminEntry.ts` (csak ha kell finomhangolás)
