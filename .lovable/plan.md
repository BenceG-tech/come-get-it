## Cél
A 8 új iPhone screenshot lecserélje a régi mockup képeket a főoldalon és a Vendéglátóhelyek oldalon. Egyben rendezzük a PhoneMockup megjelenítést, hogy minden új kép torzítás/vágás nélkül férjen bele.

## Új képek szerepe (javasolt hozzárendelés)

Jelenleg 3 helyen látható PhoneMockup:
- **Főoldal Hero** (`Index.tsx` → `HeroSection`) — 2 kép rotál 4mp-enként
- **Vendéglátóhelyek Hero** (`VenueHeroSection`) — 1 statikus kép
- **Vendéglátóhelyek Key Features** (`VenueKeyFeatures`) — 1 statikus kép

Javasolt párosítás (megerősítést kérek ⚠️):

| Slot | Új kép | Miért |
|---|---|---|
| Főoldal Hero – 1. rotáció | `IMG_9732` (lista + térkép fent) | Ez a "belépő" nézet, jól mutatja a discovery-t |
| Főoldal Hero – 2. rotáció | `IMG_9734` (Bar detail hero fotóval) | Erős vizuál, kontrasztos a listával |
| Vendéglátóhely Hero | `IMG_9735` (detail + Ingyen italok + Kérd ingyen italod) | A "napi egy ingyen ital" ígéretet mutatja |
| Vendéglátóhely Key Features | `IMG_9736` (napok + térkép + Útvonaltervezés) | A funkciókat/mélységet illusztrálja |

Nem használt (későbbre / Jutalmak oldalhoz tartogatjuk): `IMG_9733`, `IMG_9737`, `IMG_9738`, `IMG_9747`. Ezeket a "Jutalmak" oldalhoz beígért csomagnál helyezzük el.

## PhoneMockup optimalizálás

Az új screenshotok 1179×2556 (iPhone 15 Pro, kb. 9:19.5) — pontosan egyeznek a mockup arányával, tehát:
- `PhoneMockup` alapértelmezetten `object-cover` + `object-top` marad, de mivel arány = 1:1, a `contain` és `cover` ugyanazt adja → nincs vágás
- Az `auto` fit-módban rögzítjük hogy 9:19.5 arányú képnél `cover`-t használjon (nincs "letterbox" fekete sáv)
- A hero-ban lévő 240px szélesség marad
- Ellenőrizzük: statusbar (17:11 / 5G) a mockup notch-a alatt szépen elfér, nem takarja a Dynamic Island stílusú fejrészt

## Technikai lépések

1. `lovable-assets create` a 4 kiválasztott PNG-re → `src/assets/*.asset.json` pointerek (a `/mnt/user-uploads/` mountról, nem a repóba másolva)
2. `src/pages/Index.tsx`: `appImages` tömb két elemét lecserélni az új asset URL-ekre
3. `src/components/VenueHeroSection.tsx`: `venueDetailImage` konstans → új asset
4. `src/components/VenueKeyFeatures.tsx`: `venueDetailImage` konstans → új asset
5. `src/components/PhoneMockup.tsx`: `auto` fit döntési szabály finomhangolása 9:19.5 arányra
6. Ellenőrzés preview-ban (mobil és desktop)

## Kérdés a felhasználóhoz

Rendben van a fenti párosítás, vagy másképp szeretnéd? Ha "OK", megyek buildbe. Ha másképp: írd meg pl. "Hero-ba 9734 + 9738, Venue Hero-ba 9735, Key Features-be 9736".
