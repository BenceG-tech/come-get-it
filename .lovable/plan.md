## Cél
A főoldal három kártyájából kettő képét (Új vendégek, Nulla rizikó) lecseréljük, és mindhárom kép alacsonyabb képarányt kap, hogy diszkrétebb legyen.

## Változtatások

**1. Új képek generálása** (`src/assets/venue-teaser/`, felülírjuk):
- `uj-vendegek.jpg` — Hangulatos, félhomályos pesti bárpult este, néhány vidám fiatal vendég koccint a háttérben, meleg arany és cyan fények, finom bokeh, filmes, prémium minőség. (Nem stock fotó hangulat.)
- `nulla-rizko.jpg` — Tiszta, modern bárpult felülnézetből vagy közelkép: nyitott üzleti notebook / tablet kis grafikonnal egy márvány pulton, mellette egy koktél, lágy cyan szegélyfény. Biztonságot, kontrollt sugall — nem szerződés/kézfogás klisé.
- `valodi-insight.jpg` — marad változatlan.

**2. Képarány csökkentése a `VenuePartnerTeaser.tsx`-ben:**
- A jelenlegi `aspect-[16/10]` helyett `aspect-[21/9]` (jóval alacsonyabb, banner-szerű sáv).
- Az ikon-medál mérete is kicsit csökken (`w-10 h-10 md:w-11 md:h-11`), hogy arányos maradjon a vékonyabb képsávhoz.
- Minden más (szöveg, hover, gradiens overlay, CTA) változatlan.

## Érintett fájlok
- `src/assets/venue-teaser/uj-vendegek.jpg` (felülírás)
- `src/assets/venue-teaser/nulla-rizko.jpg` (felülírás)
- `src/components/VenuePartnerTeaser.tsx` (aspect + ikon méret)
