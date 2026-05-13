## Új OG/social preview kép

**1. Generálás** — `imagegen` `premium` tier, 1200×630 (16:9-hez közeli OG méret), JPG.
Prompt: Neon Fidelity stílus — fekete (#050505) háttér, cyan (#00bcd4) accent és glow, bal oldalon nagy felirat ANTON-szerű geometrikus sans-serif fonttal: **"COME GET IT"** (cyan, neon glow), alatta kisebb fehér felirat: "Igyál. Gyűjts pontokat. Segíts másokon.", jobb oldalon stilizált koktélpohár vagy ital ikon cyan fénnyel, alul Budapest skyline silhouette (Parlament körvonal) sötét cyan glow-val.

**2. Mentés** — `public/og/og-main-v2.jpg` (új fájl, nem írom felül a régit, hogy ha gond van, gyorsan visszaállítható).

**3. index.html frissítés** — minden `og:image`, `og:image:secure_url`, `twitter:image` átírása az új fájlra `?v=20260513` cache-bust paraméterrel. `og:updated_time` meta hozzáadása mai dátummal.

**4. SEO.tsx frissítés** — `DEFAULT_IMAGE` konstans az új URL-re.

**5. Routes.ts** — a `DEFAULT_OG_IMAGE` konstans is az új URL-re a prerender plugin miatt.

**6. QA** — megnyitom a generált képet, ellenőrzöm hogy nem szétfolyt-e a szöveg, jól olvasható-e a "COME GET IT", helyes-e a magyar ékezet (ha nem, edit_image-szel javítom vagy szöveg nélküli verziót generálok).

**Érintett fájlok:**
- `public/og/og-main-v2.jpg` (új)
- `index.html` (4 meta tag + új og:updated_time)
- `src/components/SEO.tsx` (1 konstans)
- `src/seo/routes.ts` (1 konstans)

**Republish + Facebook/LinkedIn debugger** kell utána, hogy a social oldalak lehúzzák — ezt te csinálod a publish után.
