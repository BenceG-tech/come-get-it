# Come Get It — üzleti kérdőív válaszdokumentum

## Cél
Egy `.docx` fájl `/mnt/documents/come-get-it-uzleti-kerdoiv.docx` néven, ami végigmegy a kapott 24 kérdésen, és a Come Get It jelenlegi (pre-launch, 2026 szeptemberi soft launch előtt álló) valóságához igazított, őszinte válaszokat ad. Ahol nincs bizonyíték, ott explicit `[FELTÉTELEZÉS]` / `[MÉG NEM BIZONYÍTOTT]` / `[NEM TUDJUK PONTOSAN]` címkével jelölöm — a kérdező kérésének megfelelően.

## Tartalmi forrás
- `mem://` (Core + business-investor, waitlist-auth, venue-applications, admin-system)
- `public/llms.txt`, `supabase/functions/_shared/brand-context.ts` — kanonikus fázis/ár/GIVE-tények
- `src/i18n/hu.json` és publikus oldalak (Index, Vendéglátóhelyek, Italmárkák, Rewards Partners, Accelerator) — value prop és ügyfél-szegmensek
- Semmilyen kitalált szám: user count, revenue, retention, pipeline → mind `[NINCS ADAT — pre-launch]`

## Dokumentum struktúra
Cover page (cím, dátum 2026-07-07, kapcsolat: Bence Gátai / hello@come-get-it.app), majd a 7 fejezet (I–VII) a beküldött sorrendben, kérdésenként:
- **Kérdés** (félkövér, eredeti szöveggel)
- **Válasz** (rövid, konkrét bekezdés)
- Ahol releváns: `Bizonyíték:` sor (mit tudunk felmutatni) és `Nyitott kérdés:` sor

Kiemelt tartalmi döntések:
- **I. Alaphelyzet:** Cég = Come Get It; piac = Budapest (majd HU); fázis = pre-launch, waitlist + founding partner recruiting; ami létezik = landing, waitlist regisztráció, partner outreach pipeline, admin CRM — nincs élő user, nincs bevétel.
- **II. Mit adtok el:** Két oldalú piactér — fogyasztónak loyalty/discovery + előfizetés (990/hét, 2 990/hó), partnernek incremental traffic holtidőben + Founding Partner perkek.
- **III. Ügyfélkapcsolat:** Első vásárlás = waitlist → app install → első pontgyűjtés vagy előfizetés; partner oldalon = Founding cohort szerződés. Bővülés = több lokáció / brand aktiváció. `[MÉG NEM BIZONYÍTOTT]` — pre-launch.
- **IV/a. Valódi kérdés:** Ami működik = outreach → founding partner érdeklődés, waitlist növekedés. Ami nyitott = konverzió waitlist→aktív user, előfizetési take-rate, partner retention. 12 hónapos döntés: geo-expanzió timing, subscription pricing finomhangolás, GIVE-partner skálázás.
- **IV/b. Enterprise:** Nem klasszikus enterprise SaaS — kihagyható vagy egy rövid „nem alkalmazható, B2B2C marketplace vagyunk” megjegyzéssel.
- **V. Gazdasági kép:** Bevétel = subscription + partner fee/rev-share (memóriából); erőforrás-intenzív = partner onboarding és content ops.
- **VI. Mire épül a cég:** Founding Partner Program + waitlist momentum; kockázat = ha a launch csúszik, a waitlist hűl.
- **VII. Háttéranyagok:** Linkek — come-get-it.app, /vendeglatohelyek, /italmarkak, /rewards-partners, /come-get-it-accelerator, llms.txt, llm.html.

## Formátum
- Python `python-docx` script (`/tmp/gen_business_doc.py`), Arial, A4, 2 cm margó, H1/H2/H3 stílusok, bullet-listák.
- Validálás: PDF konverzió LibreOffice-szal, oldal- és tartalomellenőrzés.
- Kimenet: `/mnt/documents/come-get-it-uzleti-kerdoiv.docx`.

## Nyelv
Magyar, tegező, tömör — a kérdőív hangneméhez illeszkedve.
