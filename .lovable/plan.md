# Partner & Pitch Dokumentumok — Magyar nyelvű PDF csomag

Készítek 8 db professzionális PDF dokumentumot magyarul, a weboldalon már fent lévő adatokkal és vizuális elemekkel (screenshotok a comegetitapp.com-ról + app mockupok a `public/lovable-uploads/` mappából). Mind a `/mnt/documents/` mappába kerül, letölthető formában.

## A 8 dokumentum

1. **`01-master-overview.pdf`** (~15-20 oldal)
   Komplett cég- és termékbemutató: vízió, problémamegoldás, app képernyők, üzleti modell (alapító ajánlat), GIVE küldetés, roadmap, csapat, kapcsolat. Befektetőknek és komoly partnereknek.

2. **`02-pitch-vendeglatohelyek.pdf`** (~8-10 oldal)
   "Miért fáj most?" → 100+ vendég/hó ígéret → 6 hónap díjmentes alapító ajánlat → 3 lépéses folyamat → ROI példa → CTA.

3. **`03-pitch-italmarkak.pdf`** (~8-10 oldal)
   Z/Y generációs márkafelfedezés, célzott sampling, közös kampányok, márkavédelem, csomagajánlatok.

4. **`04-pitch-rewards-partnerek.pdf`** (~8-10 oldal)
   Alacsony CAC, exkluzivitás, közönség-illeszkedés, partneri csomagok, rewards integráció.

5. **`05-onepager-helyek.pdf`** / **`06-onepager-markak.pdf`** / **`07-onepager-rewards.pdf`** (1-1 A4)
   Hideg megkereséshez, email mellékletnek. Lényegre törő, 1 oldalas változatok mindhárom célcsoportra.

6. **`08-media-kit.pdf`** (~6-8 oldal)
   Logók, színpaletta (#00bcd4 stb.), tipográfia, boilerplate, alapító idézet, sajtókapcsolat.

7. **`09-faq-partnereknek.pdf`** (~4-6 oldal)
   Gyakori kérdések helyeknek/márkáknak/rewards partnereknek — értékesítési ciklus rövidítésére.

8. **`10-founding-partner-term-sheet.pdf`** (1-2 oldal)
   Konkrét feltételek az alapító partner programhoz: kedvezmények, érvényesség, kötelezettségek — aláírható formátum.

## Készítési folyamat

1. **Adatgyűjtés**: végigolvasom az `src/i18n/hu.json` fájlt + minden releváns oldal komponenst (Index, Vendeglatohelyek, Italmarkak, RewardsPartners, Partnerek, ComeGetItAccelerator) — ez minden szükséges szöveget, számot, ajánlatot tartalmaz.
2. **Vizuális anyagok**: screenshotok a live oldalról (`browser--screenshot` minden főoldalról különböző viewportokon) + meglévő app mockupok a `public/lovable-uploads/`-ból.
3. **PDF generálás**: ReportLab-bel (Python), Neon Fidelity dizájnnal — sötét háttér (#050505), cyan accent (#00bcd4), Anton-szerű display + tiszta body font. Markdown nélkül, natív tipográfia.
4. **QA**: minden PDF-et oldal-képekké renderelek (`pdftoppm`), átnézem (overlapping text, levágott szöveg, kontrasztproblémák), javítom, újra renderelem amíg tiszta.
5. **Átadás**: minden fájl `<lov-artifact>` tag-ekkel megjelenik a chatben, letölthető.

## Technikai részletek

- **Eszközök**: Python + ReportLab (PDF), `browser--screenshot` (live oldal képek), `pdftoppm` (QA renderelés).
- **Stílus**: konzisztens "Neon Fidelity" branding minden dokumentumon — cover lap cyan glow-val, fejléc/lábléc, oldalszám.
- **Nyelv**: 100% magyar. Angol verziókat csak külön kérésre csinálok később.
- **Adatok**: kizárólag a weboldalon szereplő számok és ígéretek (100+ vendég/hó, 6 hónap díjmentes alapító ajánlat, GIVE küldetés stb.) — semmit nem találok ki.
- **Iteráció**: ha bármelyik dokumentumon változtatni szeretnél, `_v2`, `_v3` verziókat csinálok az eredeti megtartásával.

Várhatóan 15-25 perc a teljes csomag legyártása + QA. Kezdhetem?
