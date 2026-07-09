## Új screenshotok cseréje a főoldalon

A feltöltött 10 iPhone screenshot (1179×2556, pontos 9:19.5 arány → a mockup keret tökéletesen kitölti, nem lóg ki semmi) elhelyezése a főoldal 4 telefon-mockup szekciójában.

### Hozzárendelés

| Szekció | Komponens | Screenshot(ok) | Miért |
|---|---|---|---|
| Hero (fent, váltakozó) | `HeroSection` (Index.tsx `appImages`) | **IMG_9833** (térkép + kártya) + **IMG_9834** (feed lista) | A jelenlegi hero szintén térkép + feed volt |
| LINK (helyszín részlet) | `LinkSection` | **IMG_9844** (Restaurant részlet) | Új, letisztult prémium enteriőr |
| DRINK (ingyen italok) | `DrinkSection` | **IMG_9846** (Midnight Tonic lista + térkép) + **IMG_9838** (Craft Beer lista) | Két különböző "ingyen italok" nézet |
| EARN (jutalmak) | `EarnSection` | **IMG_9843** (2. koktél féláron részlet) + **IMG_9847** (Mutasd a pultosnak beváltás) | Jutalom + beváltási folyamat együtt |

Kimaradnak: IMG_9837 (Romkocsma), IMG_9840 (beer beváltás), IMG_9845 (steak) — nem férnek be redundancia nélkül, de bármikor cserélhetők, ha jelzed.

### Technikai megvalósítás

1. **Asset feltöltés**: Mindegyik szükséges screenshot Lovable Assetként regisztrálva (`lovable-assets create` → `src/assets/*.png.asset.json` pointerek). Nem másoljuk binárisan a repóba.
2. **Index.tsx**: `appImages`, `drinkImages`, `linkImage`, `earnImages` tömbök átírása az új asset URL-ekre.
3. **Méret optimalizálás**: A screenshotok pontosan 9:19.5 arányúak (1179×2556), tehát a `PhoneMockup` `fit="auto"` `cover`-re kapcsol és teljesen kitölti a képernyőt vágás nélkül. Nem kell PhoneMockup módosítás — a jelenlegi mockup keret pont ehhez a mérethez lett tervezve.
4. **`object-top`** marad, így a status bar (19:00 óra, akku) látszik felül, a beváltás gomb nem szorul le.

### Ha valamelyik hozzárendelés nem tetszik

A cserék után egyesével cserélgethetőek, csak jelezd melyik szekcióhoz melyik IMG_xxxx számot szeretnéd.
