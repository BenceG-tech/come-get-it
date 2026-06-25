## Cél
A `/vendeglatohelyek` oldalon a **"Miért éri meg neked?"** szekció 6 kártyájához alacsonyabb képarányú (kisebb) képek + mind a 6 képhez új, relevánsabb vizuál.

## Változtatások

**1. `src/components/VenueWhyWorth.tsx`**
- Képarány: `aspect-[16/10]` → `aspect-[21/9]` (vékonyabb, banner-szerű sáv — ugyanaz a stílus mint a főoldali teaser)
- Ikon-medál: `w-11 h-11 md:w-12 md:h-12` → `w-10 h-10 md:w-11 md:h-11`
- Ikon: `w-5 h-5 md:w-6 md:h-6` → `w-4 h-4 md:w-5 md:h-5`
- Top gradient: `h-1/3` → `h-1/2` (olvashatóság az alacsonyabb képen)
- Szöveg, hover, layout változatlan

**2. Új képek (`src/assets/venue-why/`, felülírjuk):**
- `uj-vendegek.jpg` — Fiatal vendégek belépnek egy meleg fényű budapesti bárba este, kívülről befelé nézet, cyan utcai fény + bent arany izzás
- `nulla-rizko.jpg` — Tiszta márvány bárpult close-up egy koktéllal és egy diszkrét "free" matricával / kis táblával, lágy cyan szegélyfény (pénzügyi biztonság érzete, klisé nélkül)
- `te-dontod.jpg` — Bárpult mögötti nézet: kéz egy tablet/POS képernyőn időablakokat / italokat állít be, háttérben homályos bár (kontroll érzete)
- `adatok-insight.jpg` — Modern dashboard egy laptop képernyőjén egy elegáns bár hátterében, cyan vonal-grafikonok, vendég-visszatérési adatok
- `lokacio-push.jpg` — Telefon közelkép utcán este, push notification értesítéssel, háttérben homályos bár neonjai, cyan glow
- `kockazatmentes-kilepes.jpg` — Nyitott ajtó egy bárba kívülről, meleg fény szűrődik ki, szabadság / "bármikor kiléphetsz" hangulat

Mind cinematic, prémium, Neon Fidelity stílusban (cyan + meleg arany, mély árnyékok, finom bokeh) — nem stock fotó hangulat.

## Érintett fájlok
- `src/components/VenueWhyWorth.tsx` (aspect + ikon méret)
- `src/assets/venue-why/uj-vendegek.jpg` (felülírás)
- `src/assets/venue-why/nulla-rizko.jpg` (felülírás)
- `src/assets/venue-why/te-dontod.jpg` (felülírás)
- `src/assets/venue-why/adatok-insight.jpg` (felülírás)
- `src/assets/venue-why/lokacio-push.jpg` (felülírás)
- `src/assets/venue-why/kockazatmentes-kilepes.jpg` (felülírás)
