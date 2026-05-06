## Cél
Lecseréljük az absztrakt "döntés pillanata" típusú szövegeket egyszerű, emberi copyra. Új pozícionálás: **"Találd meg, hova menj ma — napi ingyen itallal."** Design nem változik, csak szöveg + egy új szekció + Hogyan működik bővítése 4 lépésre.

## Változtatások

### 1. `src/i18n/hu.json` és `src/i18n/en.json`

**`hero`** (HU):
- `title_line1`: "NEM TUDOD,"
- `title_line2`: "HOVA MENJ MA?"
- `subtitle`: "A Come Get It megmutatja, hol kapsz napi ingyen italt, pontokat és jutalmakat Budapesten — így könnyebb eldönteni, hol reggelizz, ebédelj, igyál vagy bulizz."
- `cta`: "Mutasd a helyeket"
- új `cta_secondary`: "Csatlakozom az induláshoz"

EN tükör: "DON'T KNOW", "WHERE TO GO TODAY?", subtitle angolul, CTA "Show me places" / "Join the launch".

**Új `miben_segit` blokk** (HU + EN) 4 kártyával:
- Hol reggelizzek? – "Találj helyet, ahol a napindításhoz extra jutalom is jár."
- Hol ebédeljek? – "Válassz gyorsabban a közeli partnerhelyek közül."
- Hova üljünk be? – "Találj jó helyet kávéra, randira vagy afterworkre."
- Hol bulizzunk? – "Menj oda, ahol az esti program mellé napi ingyen ital is jár."

**`how_it_works`** átírva 4 lépésre:
- `headline`: "Válassz. Menj el. Igyál. Adj vissza."
- `subheadline`: "Pár lépés, és tudod, hova menj ma."
- `cards.1`: "Válassz" / "Nézd meg, melyik partnerhely ad ma pluszt."
- `cards.2`: "Menj el" / "Indulj el oda, ahol tényleg megéri beülni."
- `cards.3`: "Igyál" / "Használd ki a napi ingyen italod és gyűjts pontokat."
- `cards.4`: "Adj vissza" / "Minden beváltott ital egy nap tiszta ivóvizet biztosít egy rászorulónak."

**`venues.hero`**:
- `line1`: "TÖBB VENDÉG."
- `line2`: "EGYSZERŰBBEN."
- `p1`: "A Come Get It segít, hogy azok találjanak rád, akik épp azt keresik, hova menjenek enni, inni, ebédelni vagy bulizni Budapesten."
- `p2`: "Ha valaki nem tudja, hova menjen, az app ajánlhatja a helyedet — az ingyen ital pedig segít, hogy téged válasszon."
- Új `key_features.items.5`: "LEGYÉL OTT, AMIKOR HELYET KERESNEK" / "Ha valaki nem tudja, hova menjen, az app ajánlhatja a helyedet — az ingyen ital pedig segít, hogy téged válasszon."

**`brands_page.hero`**:
- `line1`: "LÉGY OTT,"
- `line2`: "AMIKOR INNI KÉSZÜLNEK."
- `subtitle`: "Juttasd el az italodat azokhoz, akik épp helyet választanak, rendelnek és új márkákat próbálnának ki."
- Új `features.items.5`: "KÓSTOLÁS VALÓDI HELYZETBEN" / "A felhasználó nem csak látja a márkád, hanem egy partnerhelyen meg is kóstolhatja."

**`rewards_page.hero`**:
- `line1`: "LEGYÉL A KÖVETKEZŐ"
- `line2`: "PROGRAM, AMIT VÁLASZTANAK."
- `subtitle`: "Ajánlj jutalmat azoknak, akik Budapesten keresnek helyet, programot vagy új élményt."

EN fájl ugyanezekkel a kulcsokkal angolra fordítva, hogy ne maradjon fallback.

### 2. `src/components/HeroSection.tsx`
- Másodlagos CTA gomb hozzáadása `t('hero.cta_secondary')` szöveggel `variant="outline"` stílusban a primary mellé. A primary CTA "Mutasd a helyeket" jelenleg szintén a `#signup` formára scrolloz (mivel publikus helykereső még nincs); a secondary ugyanoda — analytics eseményt külön lőjük (`hero_primary` / `hero_secondary`).

### 3. Új komponens `src/components/MibenSegitSection.tsx`
4 kártyás szekció (`md:grid-cols-4`, `nf-card` stílus, lucide ikonok: `Coffee`, `UtensilsCrossed`, `Sofa`, `PartyPopper`). Kulcsok: `miben_segit.title`, `miben_segit.cards.1..4`. Beillesztve `src/pages/Index.tsx`-be a `<HeroSection />` után, `<QuickAccessChips />` elé.

### 4. `src/components/HowItWorks.tsx`
3 kártyás → 4 kártyás grid (`md:grid-cols-2 lg:grid-cols-4`). Kártya forrás: `how_it_works.cards.1..4`. Ikonok: `MapPin`, `Footprints`, `Wine`, `HeartHandshake`.

### 5. `src/components/VenueKeyFeatures.tsx`
Hozzáadunk egy 5. kártyát a `venues.key_features.items.5` kulccsal (vagy módosítjuk a meglévő grid-et hogy 5 elemet kezeljen).

### 6. `src/pages/Italmarkak.tsx` benefit cards
A meglévő features lista végére hozzáadjuk az új `brands_page.features.items.5` kártyát.

### 7. SEO – `src/seo/routes.ts` és `src/components/SEO.tsx` használat
- `/` route: title "Come Get It – Találd meg, hova menj ma Budapesten", description "A Come Get It megmutatja Budapest azon partnerhelyeit, ahol napi ingyen italt, pontokat és jutalmakat kapsz — így könnyebb eldönteni, hova menj reggelizni, ebédelni, inni vagy bulizni.", h1 "Nem tudod, hova menj ma?", bodyHtml frissítve.
- `/vendeglatohelyek`: title "Vendéglátóhelyeknek – Több vendég, egyszerűbben | Come Get It", description az új szöveggel.
- `/italmarkak`: új description + H1 az új pozícionálással.
- `/rewards-partners`: új H1 "Legyél a következő program, amit választanak.", description az új subtitle-lel.
- A meta tag-ek inline-ban (Index.tsx, Vendeglatohelyek.tsx stb.) frissítve hogy egyezzenek a `routes.ts` adataival.

### 8. `public/llm.html`
Az AI/LLM összefoglaló első bekezdése: "Come Get It helps people decide where to go in Budapest by showing partner venues where they can get a daily free drink, points and rewards." Eltávolítjuk az "in the decision moment" / "döntés pillanata" mondatokat. A többi tartalom (modell, csapat, kapcsolat) marad.

### 9. Tiltott kifejezések kitakarítása
`rg`-vel ellenőrzés és cserék a teljes `src/`-ben és `public/`-ban:
- "döntés pillanat", "decision moment", "döntési irányítóeszköz", "fogyasztási döntésbefolyás", "programválasztási infrastruktúra", "jelenlét a döntés pillanatában".

## Mi NEM változik
- Design tokenek, színek, layout, animációk, route-ok, prerender plugin működése.
- A többi szekció (DRINK / LINK / EARN / GIVE / Benefits / FOMO / Signup) szövege érintetlen marad — azok már konkrét élmény-leírások, nem absztrakt B2B copy.
- A waitlist signup logikája változatlan.

## Sorrend a végrehajtáskor
1. i18n fájlok (HU + EN) frissítése
2. Új `MibenSegitSection` komponens + beillesztés Index-be
3. `HowItWorks` 4 lépésesre alakítása
4. `HeroSection` secondary CTA
5. Venue + Brand kártyák bővítése
6. SEO routes + inline meta-k + `llm.html`
7. Tiltott szavak grep-és cleanup