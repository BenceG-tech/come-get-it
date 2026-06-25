## Diagnózis

A múltkor feltöltöttem a Vinozza/Kiscsibe listás screenshotot CDN-re (`src/assets/hero-app-venues.png.asset.json`) és `src/pages/Index.tsx`-ben az `appImages` tömb első elemét lecseréltem rá. A te képeden viszont a régi „FIRST Local Craft Beer & Kitchen" listás kép látszik — tehát vagy nem frissült a preview cache, vagy az asset URL nem töltődik be rendesen a `/__l5e/` útvonalról.

## Cél

A telefon-mockup rotációjában a **felső** képet (lista nézet) garantáltan a múltkor feltöltött screenshot mutassa, a térképes kép változatlan marad másodikként.

## Lépések

1. **Ellenőrzés** — `curl -I` a `/__l5e/assets-v1/543318c5-.../hero-app-venues.png` URL-re a dev szerveren, hogy 200-at ad-e vissza. Ha 404 / nem renderelődik, akkor a CDN pointer hibás és újra kell tölteni.
2. **Ha az asset nem elérhető**: újrafeltöltöm a screenshotot (`/mnt/user-uploads/9D01517A-BB98-45D6-BF87-C0D0FC927242.png`) friss asset ID-val, és felülírom a `src/assets/hero-app-venues.png.asset.json`-t.
3. **Fallback megerősítés**: a `src/pages/Index.tsx`-ben az `appImages` első eleme `heroVenuesAsset.url` marad. Hozzáadok egy `key={src}` propot a `PhoneMockup`-hoz vagy a képhez, hogy a böngésző biztosan újratöltse és ne a régi cache-t mutassa.
4. **Vizuális verifikáció** — headless Playwright-tal megnyitom a `localhost:8080/`-t, 8 másodpercig nézem a rotációt, screenshotot csinálok a hero szekcióról és megerősítem, hogy a Vinozza/Kiscsibe lista jelenik meg, nem a régi FIRST Local Craft Beer.

## Érintett fájlok

- `src/assets/hero-app-venues.png.asset.json` (esetleg újragenerálva)
- `src/pages/Index.tsx` (kép key, ha kell)
- `src/components/PhoneMockup.tsx` (csak ha a `key` ott kell)

Nem nyúlok a térképes (második) képhez, a többi szekcióhoz, vagy bármi máshoz az oldalon.
