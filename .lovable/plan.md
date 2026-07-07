# Terv: `come-get-it-uzleti-kerdoiv-v2.docx`

A felhasználó által beírt teljes anyagot (A) kérdőív-válaszok + B) weboldal-optimalizálás) egy letisztult, Founding Pitch stílusú DOCX-be öntöm. Kód nem változik.

## Kimenet
- `/mnt/documents/come-get-it-uzleti-kerdoiv-v2.docx`
- Utána `<presentation-artifact>` tag.

## Tartalom (a beírt szöveget követi, nem generálok új választ)

1. **Címlap** — Come Get It · Üzleti kérdőív-válaszok (vázlat) · 2026-07-07 · Gátai Bence · hello@come-get-it.app · +36 70 585 2053
2. **Bevezető keret** — a „⚠️ = nem bizonyított / eldöntendő" jelölés magyarázata, a kérdőív szellemének idézése („a 'nem tudjuk pontosan' informatívabb").
3. **A rész — Kérdőív-válaszok**
   - I. Alaphelyzet (1–4)
   - II. Mit adtok el, és kinek? (5–8) — az 5. pontban a venue-pricing ellentmondás pirosan kiemelve
   - III. Ügyfélkapcsolat (9–11)
   - IV/a. Hol van a valódi kérdés? (12–15)
   - IV/b. Enterprise szerep — rövid „nem releváns" bekezdés
   - V. Gazdasági kép (19–21)
   - VI. Mire épül a cég? (22–24)
   - VII. Háttéranyagok — bullet-lista
4. **B rész — Weboldal tartalom-optimalizálás**
   - 🔴 Kritikus (1–4): ROI-blokk átkeretezése, „garantált" állítások, számok egységesítése (15 vs 50, 91%), AI-mockup szövegek
   - 🟠 Konverzió (5–9): hero-alcím, duplikált „hogyan működik", CTA-káosz, social proof, vendéglátóhely-oldal sorrend
   - 🟢 Finomítások (10–13): adatvédelem (Brevo, GPS), footer/IG-handle, bejelentkezés gomb, nyelvi apróságok
5. **Zárás** — „Következő lépések" mini-blokk: (a) venue-pricing döntés, (b) számok egységesítése kifelé, (c) ROI-blokk átírása, (d) waitlist-számláló élesítése amint van szám.

## Formázás (`mem://` PDF-stílus szerint)
- `python-docx`, Liberation Sans / Arial, A4, 2 cm margó
- H1 (chapter): 22pt, cyan `#00BCD4`, bold
- H2 (kérdés/téma): 15pt, cyan, bold
- Body: 11pt fekete
- ⚠️-jelölésnél a mondat félkövér
- Bullet-listák a felsorolásokra
- Kérdésszámok cyan színnel a kérdés előtt (pl. „**5.** Mit vesz meg…")

## Ellenőrzés
- LibreOffice headless → PDF → `pdftoppm` → minden oldal PNG-jét megnézem (nincs overflow, cyan renderel, ⚠️ karakter kijön).
- Ha bármi tört, javítom és újragenerálom v3 nélkül (v2 fájlnév marad, egy fordulóban rendbe teszem).

## Amit NEM csinálok most
- Nem módosítok kódot / komponenseket / szövegeket a site-on. Ha kell, külön körben megyünk végig a 🔴/🟠/🟢 listán.
- Nem találok ki új választ — a beírt szöveget tükrözöm, minimál tipográfiai kiigazítással.
