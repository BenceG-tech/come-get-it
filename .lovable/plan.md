# Dokumentumok újragyártása — egységes stílusban

## Mi a változás

A `come-get-it-founding-partner-pitch.pdf` lett a referencia stílus. A többi PDF-en zavaróak a tömör kék kockák — azokat lecserélem erre a letisztultabb, magazin-szerű layout-ra.

## Stílus-elvek (a referenciából)

- Háttér: mély fekete (#050505), nem kék panelek
- Headline: óriási bold display betű, kulcsszó cyan színnel kiemelve (pl. „TÖBB VENDÉG. **KEVESEBB ÜRES ASZTAL.**")
- Top fejléc: bal felül „COME GET IT" cyan aláhúzással, jobb felül cyan pill-tag (pl. „FOUNDING PARTNER PROGRAM 2026")
- Tartalmi blokkok: vékony cyan keretes kártyák sötét háttéren, NEM tömör kék téglák
- Számozott kártyák: nagy cyan szám (01, 02, 03) + cím + body
- Lista-itemek: cyan pipa-ikon + bold cím + body
- Folyamat: körök (1→2→3→4→5) cyan vonallal összekötve
- Kiemelt érték-blokk: vékony cyan keret, belül bold szám + label, EGY cyan kártyával a fő szám kiemelésére
- Footer: minden oldalon `come-get-it.app` bal, cím középen, `hello@come-get-it.app` jobb

## Domain javítás

Mindenhol `come-get-it.app` (a memóriában is ez van, korábbi PDF-ek `comegetitapp.com`-ot tartalmaznak — cserélem). Email: `hello@come-get-it.app`.

## Újragyártandó PDF-ek (`_v2` verzióban, az eredetik megmaradnak)

1. `01-master-overview_v2.pdf` — cég/termék overview, új layout
2. `02-pitch-vendeglatohelyek_v2.pdf` — helyek deck
3. `03-pitch-italmarkak_v2.pdf` — márkák deck
4. `04-pitch-rewards-partnerek_v2.pdf` — rewards deck
5. `05-onepager-helyek_v2.pdf` / `06-onepager-markak_v2.pdf` / `07-onepager-rewards_v2.pdf` — egyoldalasok
6. `08-media-kit_v2.pdf` — media kit
7. `09-faq-partnereknek_v2.pdf` — FAQ
8. `10-founding-partner-term-sheet_v2.pdf` — term sheet

Egységes Python generátor: közös `nf_style.py` modul (header, footer, számozott kártya, pipa-lista, folyamat-lánc, érték-blokk komponensek) — minden doksi ezt használja, így garantáltan konzisztens.

## Új doksi-ötletek (amit készíthetek még)

**Értékesítés / partner megnyerés:**
- **Cold outreach email-csomag** (3-5 előre megírt HU email helyekre/márkákra/rewards partnerekre — copy-paste használható)
- **LinkedIn DM script-ek** (alapító outreach-hez)
- **Sales call script + objection handling** (gyakori kifogások + válaszok telefon/meeting-hez)

**Onboarding / partner kiszolgálás:**
- **Venue onboarding playbook** (lépésről-lépésre első 30 nap a partner helynek)
- **In-venue marketing kit** (asztali tent-card, QR poszter, ablakmatrica design — nyomdakész PDF)
- **Brand activation playbook** (italmárkáknak — hogyan futtatunk együtt kampányt)

**Befektető / növekedés:**
- **Investor teaser (2 oldal)** — rövid, friss befektetők előszűrésére
- **Pénzügyi modell összefoglaló (1 oldal)** — unit economics, CAC, LTV vázlat
- **Roadmap & milestone doc** — 6/12/24 hónapos terv

**Sajtó / PR:**
- **Sajtóközlemény sablon** (launch announcement HU)
- **Founder bio + Q&A doc** (interjúkhoz, podcast-okhoz)

**Jogi / operatív:**
- **Founding Partner megállapodás MVP** (egyszerű, aláírható partner agreement vázlat)
- **Adatvédelmi 1-pager partnereknek** (mit gyűjtünk, mit látnak ők)

## Kérdés mielőtt elindulok

Két kérdést teszek fel külön (nyelv + új doksik prioritása), aztán neki is állok.
