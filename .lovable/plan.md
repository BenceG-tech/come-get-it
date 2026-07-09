# Terv: Teljes honlap-tartalom átdolgozás

A cél: a jelenlegi ígéret-nyelvet mérés-nyelvre cserélni, minden nem-bizonyított számot eltávolítani, és egységes CTA-rendszert bevezetni. Csak szöveg és copy változik — komponens-struktúra, layout, design tokenek, üzleti logika nem.

## Vezérelvek (minden szerkesztésre érvényes)

- **Tiltott szavak:** „garantált", „kártyalinkelt" (2027-ig), bármely kitalált % vagy Ft-eredmény (475 000 Ft, 100–150 vendég, 75%, 91%, 85%, +120%, 50+, 95%, 100+ vendég/hó).
- **Egységes CTA-k:** fogyasztó → `Jövök a körre! 🍻` · vendéglátóhely → `Jelentkezem a pilotra` · márka/rewards → `Early access-t kérek` · Plus (pre-launch) → `Értesíts az indulásról`.
- **Egységes számok:** 15 Founding Partner vendéglátóhely · 500 alapító tag · 2026. szeptember 1. · 30 napos review-ciklus · @come_get_it.
- Kártya-linkelés, lokáció-push, kártya-attribúció → vagy „HAMAROSAN" jelölést kap, vagy törölve.
- Analytics-eventek és a `send-notification-email` payload marad — csak a felszíni copy változik.

## Prioritási sorrend (ebben a sorrendben megyünk)

### P1 — Hitelességi kockázat (először)

1. **`src/pages/RewardsPartners.tsx`** — a „Partner eredmények" statisztika-kártyák (85% · +120% · 50+ · 95%) teljes törlése; „91% Gen Z & Millennial" cseréje: `18–35 éves budapesti fiatalok — a kategória, amit a legnehezebb hagyományos reklámmal elérni.`; záró CTA → `Early access-t kérek`.
2. **`src/pages/Italmarkak.tsx`** — mindkét „91% Gen Z" előfordulás cseréje; üres statisztika-címkék (FELHASZNÁLÓ / NŐK / PARTNER / APP ÉRTÉKELÉS) törlése; kártya-attribúció mondat átírása beváltás-szintű adatokra; „KÓSTOLÁS VALÓDI HELYZETBEN" felemelése; záró CTA → `Early access-t kérek`.

### P2 — Vendéglátóhely-oldal átkeretezése

3. **`src/components/VenueHeroSection.tsx`** — alcím cseréje a mérés-nyelvi verzióra; CTA `Jelentkezem a pilotra`.
4. **`src/components/VenueWhyWorth.tsx`** (6 kártya) — „Garantált új vendégek" → „Vendég a döntés pillanatában"; „3500 Ft-ot költő vendég" átkeretezés; lokáció-push kártyára `HAMAROSAN` prefix vagy törlés; „2 hét" → „30 napos review-ciklus"; „garantált" minden előfordulásának cseréje.
5. **`src/components/VenueROI.tsx`** — a 475 000 Ft/hó blokk teljes cseréje a „Számoljunk együtt" példa-kalkulációra (400 Ft önköltség / 3 000 Ft utóköltés hipotézis, `Nem mi mondjuk meg, hogy megéri. Az adataid fogják.` záró kiemeléssel).
6. **`src/components/VenueStats.tsx`** — „KIT CÉLZUNK" felcím, konkrét százalékok nélkül, a 4 kártya szövegének puhítása.
7. **`src/components/FoundingPartnerPerks.tsx`** — „Garantált megjelenés a launch-PR-ben" → „Megjelenés a közös launch-PR-ben".
8. **`src/components/HowItWorksForVenues.tsx`** — jelenleg jó, marad; csak az esetleges „garantált" ellenőrzése.
9. **Új `src/components/VenueExpectations.tsx`** — „Mit várunk tőled?" szekció (1–2 gyenge időablak, staff-felelős, standard flow, 30 napos review). Beszúrás a `Vendeglatohelyek.tsx`-be a `HowItWorksForVenues` után.
10. **`src/pages/Vendeglatohelyek.tsx`** — SEO title/description frissítése (a „100+ új vendég havonta" törlése), új szekció beillesztése.

### P3 — Főoldal

11. **`src/components/HeroSection.tsx`** — alcím cseréje az új consumer-trigger verzióra; elsődleges CTA `Jövök a körre! 🍻`; alatta megjegyzés az 500 alapító tagról.
12. **`src/components/MibenSegitSection.tsx`** — „Hol bulizzunk?" kártya szövegének finomítása.
13. **`src/components/HowItWorks.tsx`** — a regisztrációs 4 lépés átírása kártya-linkelés nélkül (Töltsd le · Nézz körül · Váltsd be · Gyűjts).
14. **DRINK/LINK/EARN blokk döntés — A opció (javasolt):** a `DrinkSection`, `LinkSection`, `EarnSection` komponensek kivezetése a `src/pages/Index.tsx`-ből (fájlok maradnak, hátha kell máshova); a `GiveSection` marad és megerősítjük a szövegét („Minden korty számít.").
    - B opció csak akkor, ha a felhasználó ezt választja: `LinkSection` szövege átírva `HAMAROSAN` jelöléssel, a többi marad.
15. **`src/components/GiveSection.tsx`** — szöveg megerősítése az új verzióval.
16. **`src/components/PricingSection.tsx`** — Plus CTA cseréje `Értesíts az indulásról`-ra; a csomagtartalmak és launch-akció blokk marad.
17. **`src/components/VenuePartnerTeaser.tsx`** — teljes szövegcsere: „Garantált forgalmat hozunk" → „Nem ígérünk számokat — együtt mérjük"; 3 kártya átírása; „2 hét" → „30 napos review"; CTA `Jelentkezem a pilotra →`.
18. **`src/components/BenefitsSection.tsx`** („Miért éri meg mindenkinek?") — törlés a `Index.tsx`-ből, helyette egy egysoros link a `/partnerek` hubra (vagy komplett törlés — a felhasználó döntése alapján).
19. **`src/pages/Index.tsx` SEO** — description csere az új verzióra.

### P4 — GYIK / chat-widget

20. **`src/components/CustomerSupport.tsx`** — 3 javítás: kártya-linkelés-mondat cseréje, „egy este" → „naponta egy", beváltási flow frissítése a „Kérd ingyen italod" + „BEVÁLTOM" gomb-logikára.

### P5 — Partnerek hub, FP-oldal, adatvédelem

21. **`src/pages/Partnerek.tsx`** — hero-alcím kiegészítése a fázis-sorrenddel; vendéglátóhely-kártya szövegének átvétele a főoldali új teaserből.
22. **`src/pages/ComeGetItAccelerator.tsx`** — 4 lépés cseréje az 5 lépésre; FRESH/SUPER-FRESH csomagok áthelyezése az `Italmarkak.tsx`-re (vagy „Italmárkáknak" alcím alá); „MIÉRT VÁLASSZ MINKET?" 4 kártya marad.
23. **`src/pages/AdatvedelmiSzabalyzat.tsx`** — Brevo hozzáadása az adatfeldolgozókhoz; új szakasz mobilalkalmazás-adatkezelésről (helymeghatározás 100 m, push, App Store / Google Play); hatályos dátum frissítése.

## Amit NEM csinálunk

- Nem változik a `send-notification-email` edge function, a Supabase séma, a form-mezők, a routing, az analytics-event nevek.
- Nem generálunk új képet, nem cserélünk mockupot.
- A memória (`mem://`) csak akkor frissül, ha a felhasználó azt mondja, hogy a mérés-nyelv és a tiltott szavak listája állandó szabály — most alapból nem írjuk hozzá.
- Az A/B döntést a DRINK/LINK/EARN blokkról a build elején egy rövid kérdéssel visszaigazoltatjuk (A opció = kivezetés a javaslat).

## Ellenőrzés

Minden P-szint után:
- gyors `rg` keresés a tiltott szavakra (`garantált`, `kártyalinkelt`, `475`, `91%`, `85%`, `120%`, `100+`, `50+`, `95%`) — nullát kell adnia az adott fájlkörben;
- build/typecheck automatikusan fut;
- a főoldal és `/vendeglatohelyek` gyors vizuális ellenőrzése a preview-ban.
