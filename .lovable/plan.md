## Goal

A `/vendeglatohelyek` aloldal hero szekciójában cseréljük le a Parlament hátteret egy meleg, hangulatos vendéglátóhely-belsőre (lógó pendant lámpák, bár / étterem ambient light) — hasonló stílusban, mint a feltöltött referencia. A telefon mockup mögött ugyanaz a cyan glow marad, csak a háttér mood vált: éjszakai város → forgalmas hely belső.

## Mit változtatunk

### 1. Új háttérkép — `src/assets/venue-interior-hero.jpg`
- AI-generált, fast tier, 1920×1080.
- Stílus: cinematikus, sötét vendéglátóhely-belső éjszaka — hosszú bárpult vagy étterem, sor lógó pendant lámpákkal melegfehér izzókkal, tükröződések, lágy bokeh, enyhe cyan/teal árnyalatok az árnyékokban hogy passzoljon a Neon Fidelity palettához. Üres vendégekkel — minden figyelem a térre.
- A jobb oldal kicsit sötétebb / kevésbé részletes, hogy a telefon mockup tisztán álljon ki. Bal oldal kicsit nyitottabb, hogy a nagy headline jól olvasható legyen.

### 2. `src/components/VenueHeroSection.tsx`
- A jelenlegi `budapestNight` import helyett az új `venueInteriorHero` képet használjuk.
- A meglévő layered struktúra megmarad (középső sáv mask + felső/alsó dark fade + cyan radial glow), így a szöveg fölött / alatt ugyanúgy tiszta marad a tér.
- A maszk paraméterek finomhangolása: `top: 25% / bottom: 18%` és kicsivel erősebb opacity (`opacity-65`), hogy a meleg lámpa-glow-ok átsejlenek, de a szöveg kontrasztos marad.
- `objectPosition: 'center 50%'` — a lámpasor a középső sávon menjen át.
- Phone glow wrapper, badge, headline, CTA-k változatlanok.

## Hatókör

- Csak a venue (`/vendeglatohelyek`) hero háttere változik. A többi aloldal Parlament-háttere marad.
- Nincs copy-, route-, form-, SEO- vagy analytics-változás.

## Érintett fájlok

- `src/assets/venue-interior-hero.jpg` (új)
- `src/components/VenueHeroSection.tsx` (csak az import + a maszk paraméterek finomítása)
