## Cél

Egy `.docx` dokumentum a `/mnt/documents/` mappába, ami tartalmazza a **come-get-it.app** honlap minden publikus oldalának és szekcióinak szöveges tartalmát — magyarul, ahogy az oldalon megjelenik. Az admin súgó (PageIntro / ADMIN_PAGE_HELP) NEM kerül bele.

## Mit tartalmaz a dokumentum

Minden publikus route-hoz egy fejezet, azon belül szekciónkénti alfejezetek: H1 (title), subtitle, body szövegek, CTA feliratok, kártyák szövege, form mezők/labelek.

### Lefedett oldalak
1. **Főoldal** (`/` — `src/pages/Index.tsx`)
   - Hero, MibenSegit, Benefits, Features, Drink, Give, Earn, Link, HowItWorks, VenuePartnerTeaser, FoundingPartnerPerks, FOMO, SocialProof, WorkWithUs, Pricing, ExitIntent, SignupForm, Footer
2. **Vendéglátóhelyek** (`/vendeglatohelyek`)
   - VenueHero, VenueWhyWorth, FoundingPerks, VenueROI, VenueStats, HowItWorksForVenues (5 lépés), VenueApplication
3. **Partnerek hub** (`/partnerek`)
4. **Italmárkák** (`/italmarkak`)
5. **Rewards Partners** (`/rewards-partners`)
6. **Come Get It Accelerator** (`/come-get-it-accelerator`)
7. **Adatvédelmi Szabályzat** (`/adatvedelmi-szabalyzat`)
8. **Navigáció & Footer** (közös elemek, menüpontok, jogi linkek)

### Forrás
- Szövegek `src/i18n/hu.json`-ból + a komponensekbe hardkódolt magyar copyból.
- Sorrend a valós render-sorrendet követi (oldal komponens `<Section />` sorrend).

### Kihagyva
- `src/pages/admin/**` (admin felület)
- `src/components/admin/**` súgótartalom (`admin-help-content.ts`, `PageIntro`, `HelpTip`, `FieldHelp`)
- `Auth.tsx` (belső)

## Hogyan készül

1. Beolvasom a route-konfigot (`src/App.tsx`), az `hu.json`-t és minden érintett oldal + section komponenst — kigyűjtöm a látható stringeket.
2. Egy Node script (`docx` csomag, ami már használható) generálja a fájlt: H1 = oldal neve + URL, H2 = szekció, alatta a copy. Táblázat helyett tiszta bekezdések + bullet-listák.
3. Kimenet: **`/mnt/documents/come-get-it-honlap-tartalom.docx`** (Arial, US Letter, 1" margók, Neon Fidelity témával összhangban semleges tipográfia).
4. Validálás a docx skill script-jével, majd letölthető linket adok.

## Kérdés jóváhagyás előtt

Csak a **magyar** verzió kell (default), vagy az angol (`en.json`) fordításokat is tegyem be minden szekcióhoz párhuzamosan?
