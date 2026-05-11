# Vizuális frissítés terve — referencia képek alapján

A 4 feltöltött screenshotból ezeket az elemeket veszem át:

## 1. Hero — fénycsóva + tükröződő felület + pohár (Index + Vendéglátóhelyek + Italmárkák + Rewards)

**Mit átveszünk** (a 3. és 4. ref. képből):
- A telefon **mellé jobbra egy ikonikus pohár** (jeges koktél, lime, szívószál) — ugyanaz a kompozíció mint az "Italmárkáknak" oldalon, de finomabban a főoldalon.
- **Tükröződő, nedves padló-effekt** a hero alján: alulról halvány cyan reflexió a telefonra és a pohárra (CSS gradient + blur, nem új asset).
- **Diagonális fénycsóva** a háttérben jobb oldalról balra le — vékony cyan glow sáv, ami a Parlament felett halad át (light-leak hatás).

**Hol**: 
- `HeroSection.tsx` — hozzáadok egy `glass-hero.png` (vagy meglévő pohár asset, ha van) komponenst a telefon jobbjára desktopon, mobilon a telefon alá kisebben.
- Új `<HeroLightBeam />` SVG/div overlay — reusable komponens.
- Új `<ReflectionFloor />` overlay alul a hero szekciókban.

## 2. Kártyák halvány képes háttérrel ("MIÉRT ÉRI MEG MINDENKINEK?" / "JUTALOM RENDSZER ELŐNYEI")

**Mit átveszünk** (1., 2. ref. kép):
- A kártyák mögé **halvány, témához illő fotó** (~10–18% opacity, sötét overlay-jel, jobb-oldali maszkkal kifutva — pont mint a `RewardsPartners` features szekcióban már működik).
- Erőteljesebb hover: a kép kissé fényesebb lesz (opacity 18→28%).

**Hol**:
- `BenefitsSection.tsx` (főoldal "Miért éri meg mindenkinek?" — 4 kártya) — minden kártyához témához illő bg image:
  - Felhasználók → emberek bárban
  - Vendéglátóhelyek → bár belső
  - Italmárkák → koktél/üveg close-up
  - Jótékonysági partner → tiszta víz / kézfogás
- Ugyanezt alkalmazom: `MibenSegitSection.tsx` 4 kártyájára is (reggeli/ebéd/randi/buli — finom étel/ital fotók).
- `RewardsPartners.tsx` "value props" 4 kártyájára (közönség, brand, mérés, kampány).

**Implementáció**: kivonok egy közös `GlassImageCard` wrapper-t a `RewardsPartners` features mintájára (már megvan ott), és `src/components/ui/glass-image-card.tsx` néven megosztom.

## 3. Footer — élesebb kék városi skyline

**Mit átveszünk** (mind a 4 ref. kép footere):
- A jelenlegi nagyon halvány (`text-nf-primary/15`) skyline helyett **kontrasztosabb cyan**, két rétegben: hátul halvány (15%), elöl élesebb (35–45%) — mélységérzet.
- Finom **cyan glow** a skyline tetején (drop-shadow), mintha a város világítana.
- Magasabb skyline (h-10 → h-14/16), részletesebb SVG path (Lánchíd / Parlament sziluett utalás).

**Hol**: `Footer.tsx` SVG csere + glow.

## 4. Hero háttér finomítás — diagonális fénycsóva minden hero-n

**Mit átveszünk**: A 3–4. képen a Parlament fölött átsuhanó cyan light-leak nagyon hangulatos.
- Új réteg a `HeroBackground.tsx`-be: `linear-gradient(115deg, transparent 40%, rgba(0,188,212,0.12) 50%, transparent 60%)` blur-rel.
- Ez automatikusan minden hero-n megjelenik (Vendéglátóhelyek, Italmárkák, Rewards is használja).

## 5. Mobil hero — telefon "fénycsóva" glow erősítése

A 3. ref. képen mobilon a telefon mögött erős sugaras cyan glow van.
- `HeroSection.tsx` mobil view-ban (lg alatt) erősítem a `radial-gradient` glow-t a telefon mögött (0.32 → 0.5) és hozzáadok egy második, sugár-szerű `conic-gradient`-et.

---

## Amit NEM csinálok most (jelezted vagy nem aktuális)
- App screenshot cserék (DRINK/LINK/EARN mockupok) — saját képeid, később cseréled.
- BESTIA / FIRST CRAFT BEER referencia logók.
- Nem nyúlok a copy-hoz, csak vizuális réteg.

---

## Technikai részletek

**Új fájlok**:
- `src/components/ui/glass-image-card.tsx` — közös kártya wrapper image bg-vel
- `src/components/HeroLightBeam.tsx` — diagonális fénycsóva overlay
- `src/components/ReflectionFloor.tsx` — tükröződő padló overlay (hero alján)
- `src/assets/hero-glass.png` (vagy reuse meglévő) — pohár image a hero-ba

**Módosított fájlok**:
- `src/components/HeroSection.tsx` — pohár + reflection + light beam
- `src/components/HeroBackground.tsx` — light beam + intenzívebb glow réteg
- `src/components/VenueHeroSection.tsx` — light beam + reflection
- `src/pages/RewardsPartners.tsx` — light beam + reflection a hero-ban
- `src/pages/Italmarkak.tsx` — light beam + reflection (a meglévő pohárhoz)
- `src/components/BenefitsSection.tsx` — image-bg kártyák
- `src/components/MibenSegitSection.tsx` — image-bg kártyák
- `src/components/Footer.tsx` — élesebb 2-rétegű skyline

**Asset stratégia**: a kártya háttérképekhez újrahasznosítom a meglévő `budapest-night-hero.jpg`, `venue-interior-hero.jpg` képeket + szükség esetén 2-3 új image generálással (koktél close-up, kézfogás-jótékonyság).

Jóváhagyás után megyek.
