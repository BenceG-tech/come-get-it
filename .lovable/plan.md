## 1) Komplexebb animációk a "Hogyan működik" ikonokra

Cserélem a mostani egyszerű loop-okat **karakter-alapú SVG animációkra** a `src/components/how-it-works/AnimatedStepIcon.tsx`-ben. Mind framer-motion, `useReducedMotion` támogatva, ugyanaz a 96px medál keret, cyan glow — csak a belső tartalom lesz gazdagabb.

- **Válassz (map)**: kis pin-ember a térkép fölé sétál be balról, megáll, a pin lepottyan a helyére, radar-pulzus körülötte. Loop ~3.5s.
- **Menj el (walk)**: oldalnézeti **sétáló alak** — két láb és két kar ellentétes fázisban hintázik (rotate ±25°), törzs finoman fel-le bobbol (2px), háttérben halvány "úton" vonal lassan jobbról balra csúszik (haladás illúziója). Loop ~1.2s.
- **Igyál (drink)**: oldalnézeti **fej + kéz pohárral**, a kéz a pohárral a szájhoz emelkedik (rotate kar + translateY pohár), pohárban folyadék-szint csökken (rect height anim), 2 buborék felszáll, majd kéz visszaereszkedik. Loop ~3s.
- **Adj vissza (give)**: két kéz nyúl egymás felé, középen szív jelenik meg (scale 0→1), heartbeat pulzál, körötte 3 apró "+1" forint/coin ikon száll fel és elhalványul. Loop ~3s.

Megvalósítás: minden lépéshez **saját kis inline SVG komponens** (`WalkChar`, `DrinkChar`, `GiveChar`, `MapPinChar`) a fájlon belül; a `kind` switch ezeket választja ki. Lucide ikonokat lecserélem ezekre (a mostani Footprints/Wine/HeartHandshake helyett valódi animált karakter). `prefers-reduced-motion` esetén statikus végállapot.

## 2) Vendéglátóhelyek oldal — szekciósorrend

Egyetértek: a "Miért éri meg neked" hook legyen rögtön a hero után, az "5 lépés" pedig közvetlenül a jelentkezés előtt — így a meggyőzés → bizonyíték → akció ív jön létre.

Új sorrend a `src/pages/Vendeglatohelyek.tsx`-ben:

```text
VenueHeroSection
VenueWhyWorth         ← felhozva (miért éri meg)
FoundingPartnerPerks  ← founding partner csomag
VenueROI              ← számszerű bizonyíték
VenueStats            ← piaci adatok
HowItWorksForVenues   ← lekerül ide (csatlakozás 5 lépésben)
VenueApplicationSection
```

Indoklás: a látogató először a **value prop**-ot kapja (miért), aztán a **konkrét ajánlatot** (founding perks + ROI + stats), és csak közvetlenül a jelentkezés előtt a **folyamat magyarázatát** (5 lépés) — így nem a logisztikán gondolkodik, mielőtt eldöntené hogy egyáltalán érdekli.

## Érintett fájlok
- `src/components/how-it-works/AnimatedStepIcon.tsx` — átírás karakter-SVG animációkra
- `src/pages/Vendeglatohelyek.tsx` — `<main>` szekciósorrend csere

Egyéb oldal/komponens nem változik.
