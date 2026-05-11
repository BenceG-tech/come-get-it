## Cél
Egységesíteni az összes szekció hátterét minden oldalon: fekete alap (`bg-nf-background` = #050505) + finom azúr radial glow szekciónként. Eltűnnek a `bg-nf-surface` váltakozások és az egyedi gradiensek (gray/black, #040a14).

## Mit változtatok

### 1. `src/index.css` — `.nf-section-glow` finomítás
A meglévő `.nf-section-glow` utility már létezik (radial azúr glow felülről). Picit visszafogom (még diszkrétebb, minden szekcióhoz illik), és hozzáadok egy `.nf-section-glow-center` variánst a középre helyezett változathoz, ha szükséges. Egyetlen egységes szabályt használok mindenhol.

### 2. Komponensek — `bg-nf-surface` → `bg-nf-background nf-section-glow`
Cserék (mind csak className-edit):
- `src/components/FeaturesSection.tsx` (32)
- `src/components/HowItWorksForVenues.tsx` (39)
- `src/components/LinkSection.tsx` (12)

### 3. Egyedi gradiensek normalizálása
- `src/components/WorkWithUsSection.tsx` (66): `bg-gradient-to-b from-gray-900 to-black` → `bg-nf-background nf-section-glow`
- `src/components/DrinkSection.tsx` (17): `bg-gradient-to-br from-[#040a14] via-nf-background to-[#040a14]` → `bg-nf-background nf-section-glow`

### 4. Oldalak — alternáló `bg-nf-surface` eltávolítása
- `src/pages/Italmarkak.tsx` (146, 211): `bg-nf-surface` → `bg-nf-background nf-section-glow`
- `src/pages/RewardsPartners.tsx` (212, 280): ugyanaz
- `src/pages/ComeGetItAccelerator.tsx` (141): ugyanaz
- `src/pages/Partnerek.tsx` (123): a `${idx % 2 === 0 ? 'bg-nf-background' : 'bg-nf-surface'}` ternary kivétele → minden szekció `bg-nf-background nf-section-glow`

### 5. Hozzáadom a `nf-section-glow`-t a már `bg-nf-background`-os szekciókhoz
Hogy mindenhol legyen ugyanaz a finom azúr fény (egységes érzet):
- `HeroSection`, `VenueHeroSection`: kihagyom (hero-nak már saját abstract bg/parallax háttere van)
- A többi `bg-nf-background` szekciónál hozzáadom: `MibenSegitSection`, `HowItWorks`, `EarnSection`, `GiveSection`, `PricingSection`, `VenuePartnerTeaser`, `BenefitsSection`, `VenueApplicationSection`, `SignupForm`, `FOMOSection`, `VenueKeyFeatures`, `VenueROI`, `VenueStats`, `VenueWhyWorth`, `FoundingPartnerPerks`.
- `PartnerApplicationSection`-nél már megvan.

## Mit NEM változtatok
- Hero szekciók (saját parallax/abstract bg)
- Kártyák, gombok, ikonok színei (azúr accent marad)
- Tipográfia, layout, animációk

## Eredmény
Minden oldalon (/, /vendeglatohelyek, /partnerek, /italmarkak, /rewards-partners, /come-get-it-accelerator) minden szekció ugyanaz a #050505 fekete + diszkrét azúr radial glow. Nincs többé világosabb sáv, gray-900, vagy egyedi #040a14.