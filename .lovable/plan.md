## Founding Partner 2-Pager PDF

A megadott tartalomból egy professzionális, kétoldalas A4 PDF-et készítek a Come Get It brand színeiben (fekete háttér #050505, cyan accent #00BCD4), majd `/mnt/documents/come-get-it-founding-partner-pitch.pdf` néven elérhetővé teszem.

### Design

- **Háttér**: mély fekete (#050505) szubtilis cyan glow akcentusokkal
- **Tipográfia**: Anton (headlines, condensed bold) + Inter (body) — Google Fonts-ból letöltve
- **Accent**: cyan #00BCD4 a website-tal egyezően; hangsúlyos elemekre cyan glow text-shadow
- **Ikonok**: egyszerű SVG/unicode ikonok cyan körben
- **Founding Partner badge**: stylish pill cyan kerettel és glow-val

### 1. oldal felépítése

1. **Header sáv**: bal oldalon "COME GET IT" logo-text, jobbra "FOUNDING PARTNER PROGRAM 2026" cyan pill
2. **Hero**: nagy Anton headline — "TÖBB VENDÉG. KEVESEBB ÜRES ASZTAL." + subtitle
3. **Koncepció bekezdés** (3-4 mondat)
4. **3 fő érv** — háromhasábos blokk ikonokkal (új vendégek / nulla rizikó / adatok)
5. **Számok blokk** — 2x3 stat grid, kiemelt cyan glow-val a "~475 000 Ft / hó" tételen
6. **Lábjegyzet** + **footer** (logo / come-get-it.app / hello@come-get-it.app)

### 2. oldal felépítése

1. **Header**: "FOUNDING PARTNER PROGRAM" cím + "Csak az első 15 budapesti vendéglátóhely…"
2. **Mit kapsz checklist** — 6 pont cyan ✓ ikonokkal, bold cím + leírás
3. **5 lépéses idővonal** — vízszintes vagy számozott vertikális timeline
4. **Ajánlat összegzés** — kiemelt boxban (Kockázat / Amit kapsz / Amit kérünk)
5. **CTA blokk**: "KÖVETKEZŐ LÉPÉS — 30 perces beszélgetés" + Bence Gátai elérhetőségek (**+36 70 585 2053**, hello@come-get-it.app, come-get-it.app/vendeglatohelyek)
6. **QR kód** jobb oldalon a `/vendeglatohelyek` URL-re (offline könyvtárral generálva — nincs külső API)
7. **Footer**: "COME GET IT — TÖBB VENDÉG. KEVESEBB ÜRES ASZTAL." + "Founding Partner Program 2026 · Csak 15 hely · Csak Budapest"

### Technikai megvalósítás

- Python + ReportLab a PDF generálásához (precíz layout-kontroll, beágyazott TTF fontok)
- Google Fonts Anton + Inter letöltése `/tmp/`-be, ReportLab-ben regisztrálva
- QR kód a `qrcode` Python lib-bel, cyan/fehér színekben
- A4 portré, duplex-ready, 15mm margók
- QA: PDF → JPG konverzió (`pdftoppm`), mindkét oldal vizuális ellenőrzése (átfedések, levágott szövegek, kontraszt), szükség esetén iteráció
- Output: `/mnt/documents/come-get-it-founding-partner-pitch.pdf`, presentation-artifact tag-gel kiadva

Jóváhagyás után megépítem.
