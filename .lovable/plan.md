## Cél

A főoldal (és kapcsolódó komponensek) szöveg- és struktúra-fixei a visszajelzések alapján. Képeket NEM cseréljük most (saját képek, később frissülnek).

## Változtatások

### 1. Terminológia egységesítés: "Jutalom Partnerek" → "Rewards-partnerek"
Minden előfordulás cseréje (nav, mobil-nav, partner-link kártyák, footer ha van) HU + EN i18n-ben.
- Fájlok: `src/i18n/hu.json`, `src/i18n/en.json`, `src/components/Navigation.tsx`, `src/components/MobileNavigation.tsx`, `src/pages/Partnerek.tsx`, `src/components/QuickAccessChips.tsx` (ha érintett)

### 2. Terminológia: "Italszponzor" → "Italmárka"
A "Miért éri meg mindenkinek?" / BenefitsSection oszlopcímek és szövegek átírása.
- Fájl: `src/components/BenefitsSection.tsx` + i18n kulcsok

### 3. "Közösség" oszlop a BenefitsSection-ben → "Jótékonysági partner"
Átnevezés, hogy a Give-modellhez logikusan kapcsolódjon. Szöveg finomítása ennek megfelelően.
- Fájl: `src/components/BenefitsSection.tsx` + i18n

### 4. Főoldali 4-kártyás partner-szekció redukálása 1 CTA-ra
A `VenuePartnerTeaser` (vagy a 4 partner-link kártyát megjelenítő szekció) átalakítása:
- Egyetlen blokk: cím "Partnerként csatlakoznál?" + 1 gomb "Partnerek programja →" → `/partnerek`
- A 4 különálló kártya (Vendéglátóhelyek / Italmárkák / Rewards-partnerek / Founding Partner) eltávolítása a főoldalról (a /partnerek hub-on maradnak)
- Fájl: `src/components/VenuePartnerTeaser.tsx` (vagy a megfelelő komponens — ellenőrzendő)

### 5. Duplikált "alapító tag" szekciók egyesítése
Jelenleg két szekció van egymás után:
- "Legyél alapító tag" (1000 bennfentes, "Jövök a körre" gomb) — `FOMOSection`
- "Legyél az alapító tagok között" (500 Plus, email form) — `SignupForm`

Megoldás: a `FOMOSection` eltávolítása a főoldalról (Index.tsx), csak a `SignupForm` marad. Számok következetesek lesznek a PricingSection-nel (500 / 1500 / haver-meghívás).
- Fájl: `src/pages/Index.tsx` (FOMOSection import + render törlése)

### 6. "Saját tiszta víz számláló" → "Saját Give-impact: lásd hány liter tiszta víz adományoztál"
A Plus csomag listájában a `PricingSection`-ben.
- Fájl: `src/components/PricingSection.tsx` + i18n

### 7. Helyszín típusa dropdown ellenőrzése
A `VenueApplicationSection` form "Helyszín típusa" dropdown opcióinak ellenőrzése. Ha hiányzik, kiegészítés: Bár, Étterem, Kávézó, Pub, Bisztró, Klub, Fine dining, Reggelizős, Vegyes/Egyéb.
- Fájl: `src/components/VenueApplicationSection.tsx`

## Amit NEM csinálunk most
- App screenshot cserék (DRINK/LINK/EARN mockupok) — saját képek, később
- BESTIA / FIRST CRAFT BEER referenciák — később, friss screenshotokkal
- 2x2 grid magasság-finomítás (stilisztikai, nem fontos)

## Ellenőrzés
- Build hibamentes
- Mobil preview (390×844) — minden módosított szekció vizuális ellenőrzése
- HU + EN nyelvváltó működik az új kulcsokon
