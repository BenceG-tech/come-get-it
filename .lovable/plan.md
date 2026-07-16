# Szövegcserék terve — csak copy, semmi layout

Kizárólag szövegcserék. Layout, komponensek, sorrend, design változatlan. Admin felülethez nem nyúlok.

## 1. Globális elvek
- "garantált" szó eltávolítása / cseréje az adott szekció szerint
- CTA-egységesítés:
  - Fogyasztói fő CTA: `Jövök a körre! 🍻`
  - Vendéglátóhely CTA: `Jelentkezem a pilotra`
  - Italmárka + rewards CTA: `Early access-t kérek`
  - Plus csomag CTA: `Értesíts az indulásról`
- "91% Gen Z & Millennial" → `18–35 éves budapesti fiatalok — a közönség, amit a legnehezebb hagyományos reklámmal elérni.`
- Kártya-összekapcsolás minden helyen "hamarosan" formulával, nem feltételként

## 2. Főoldal (`/`)
- `src/components/SEO.tsx` vagy `Index.tsx` SEO description csere
- `HeroSection.tsx` — alcím + primary CTA szöveg
- `HowItWorks.tsx` — 4 lépés címe + leírása az új verzióra
- `DrinkSection.tsx` / `i18n/hu.json` (`drink.body`) — új body szöveg
- `LinkSection.tsx` — új body, "Nincs kupon…" alcím marad
- `EarnSection.tsx` — változatlan
- `GiveSection.tsx` / `hu.json` — új body, quote törlendő
- `PricingSection.tsx` — Plus CTA `Értesíts az indulásról`
- `VenuePartnerTeaser.tsx` — alcím + 3 kártya szöveg (Új vendégek, Nulla rizikó, Valódi insight marad) + CTA `Jelentkezem a pilotra →`

## 3. Vendéglátóhelyek (`/vendeglatohelyek`)
- `Vendeglatohelyek.tsx` — SEO description új szöveg
- `VenueHeroSection.tsx` — alcím + CTA `Jelentkezem a pilotra`
- `VenueWhyWorth.tsx` — 6 kártya:
  1. cím + szöveg csere ("Vendég a döntés pillanatában")
  2. szöveg vége csere
  3. változatlan
  4. szöveg csere (mért adatok)
  5. cím elé `HAMAROSAN —`
  6. szöveg csere (kockázatmentes kilépés)
- `FoundingPartnerPerks.tsx` — "Garantált megjelenés a launch-PR-ben" → `Megjelenés a közös launch-PR-ben`
- `VenueROI.tsx` — új cím `SZÁMOLJUNK EGYÜTT`, teljes tartalom cseréje a példa-szöveggel + záró kiemelés `Nem mi mondjuk meg, hogy megéri. Az adataid fogják.` (keret és pozíció marad)
- `VenueStats.tsx` — felcím `KIT CÉLZUNK`, 4 kártya konkrét százalék nélkül
- `VenueKeyFeatures.tsx` — "BIZONYÍTHATÓ ATTRIBUTION" → `MÉRT BEVÁLTÁS ÉS UTÓKÖLTÉS`, "NEM NYOMOTT ÁR" → `ÉLMÉNYKERESŐ KÖZÖNSÉG` új szöveggel

## 4. Partnerek hub (`/partnerek`)
- `Partnerek.tsx` — hero alcím kiegészítés második mondattal, vendéglátóhely-kártya szövege azonos a főoldali új teaser-alcímmel

## 5. Italmárkák (`/italmarkak`)
- Célzott elérés + Teljesítménymérés kártyák szövegcsere
- Alsó üres statisztika-sáv (FELHASZNÁLÓ / NŐK / PARTNER / APP ÉRTÉKELÉS) törlése
- Záró CTA → `Early access-t kérek`

## 6. Rewards partnerek (`/rewards-partners`)
- "Fiatal, esti-aktív bázis" kártya új szöveg
- "Partner eredmények" 4 statisztika-kártya teljes törlése, helyére 1 szövegsor
- CTA-k → `Early access-t kérek`

## 7. Founding Partner Program (`/come-get-it-accelerator`)
- 4 lépés → 5 lépés (Beszélgetünk → LOI → Profil → Launch → 6 hónap jutalékmentes)
- FRESH / SUPER-FRESH blokk fölé alcím: `Programcsomagok italmárkáknak — 2. fázis`

## 8. Súgó / GYIK (`CustomerSupport.tsx`)
- 3 válasz szövegcsere (zárolt ingyen ital, limit, hogyan juthatsz hozzá)

## 9. Adatvédelmi szabályzat (`AdatvedelmiSzabalyzat.tsx`)
- Adatfeldolgozók listába: `Brevo (e-mail küldés és értesítések).`
- "Utolsó frissítés" mai dátumra

## 10. Végső ellenőrzés
Kódbázis-keresés: `garantált`, `91%`, `475`, `kártyalinkelt` — a nem lefedett előfordulásokat jelentem külön listában.

## Munkamódszer
- Először beolvasom az érintett fájlokat (`VenueHeroSection`, `VenueWhyWorth`, `VenueROI`, `VenueStats`, `VenueKeyFeatures`, `Italmarkak`, `RewardsPartners`, `ComeGetItAccelerator`, `Partnerek`, `HowItWorks`, `HeroSection`, `VenuePartnerTeaser`, `PricingSection`, `CustomerSupport`, `AdatvedelmiSzabalyzat`, `hu.json`), majd targetált `line_replace` szerkesztésekkel cserélem a szövegeket. Layout, className, komponensek érintetlenek.
