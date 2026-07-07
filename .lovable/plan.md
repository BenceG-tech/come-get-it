# Terv: 2 DOCX az Aron-emailből

Két külön dokumentum, Founding Pitch stílus (Liberation Sans, cyan #00BCD4 címek, A4, 2 cm margó, python-docx). A szöveget nem írom át — a beírt/feltöltött anyagot tükrözöm, minimál tipográfiai csiszolással.

## Fájl 1 — `/mnt/documents/come-get-it-strukturalis-diagnozis.docx`

Forrás: az e-mail „Come Get It — Végleges strukturális elemzés és diagnózis" része (a chatben beírt hosszú anyag).

Szekciók (11 fejezet):
1. Rövid helyzetkép
2. Observed Symptoms (4 alpont)
3. Commercial Transition Map (Capability · Purchase Moment · Customer Role · Repeatable Delivery · Revenue Capture)
4. Relevant Systems (Capability / Market / Client / Revenue / Decision System)
5. Dominant Transition Tension
6. Primary Structural Break
7. Causal Explanation
8. Leadership Decision — a réteg-táblázattal (Consumer / Napi ingyen ital / GIVE / Venue / Brand / Rewards / Dashboard)
9. Strategic Direction
10. Proof Condition
11. Végső diagnózis

Formázás: H1 fejezetcímek cyan, H2 alcímek cyan, bullet-lista a felsorolásokra, kulcsmondatok félkövéren („A Come Get It nem egy ingyen italos loyalty app…"), a réteg-tábla cyan header-sorral.

## Fájl 2 — `/mnt/documents/come-get-it-90-day-launch-plan.docx`

Forrás: `user-uploads://pasted-2026-07-07T14-48-04-335Z.txt` (2534 sor, „Budapest Soft Launch — 90 Day Execution Plan").

Feldolgozás: végigolvasom a teljes fájlt, felismerem a numerikus fejezetstruktúrát (`0.`, `1.`, `2.`, `3.1`, `3.2` stb.), és aszerint mapelem H1/H2/H3-ra. Táblázatokat (`Rendszerelem | Funkció` típus) valódi Word-táblává alakítom. Üres sorok bekezdés-elválasztók. A tartalmat nem szerkesztem, csak strukturálom.

Címlap: „Come Get It · Budapest Soft Launch — 90 Day Execution Plan · Belső működési dokumentum · 2026 szeptember–december".

## Amit NEM csinálok
- Nem foglalkozom a második feltöltött fájllal („AI Working Instructions", 3186 sor) — a válaszban ezt nem kérted, csak a launch plant. Ha kell, egy külön körben.
- Nem foglalkozom a Padel-projekt promptokkal (az egy másik projekt anyaga, véletlenül lóg az email-thread végén).
- Nem foglalkozom a 2026 februári régebbi diagnózissal (a mostani végleges verzió felváltja).
- Kód nem változik. Memória nem változik (a stratégiai fordulat még nem eldöntött vezetői döntés, csak Aron javaslata — amíg te ki nem mondod, hogy „ez az irány", nem mentem `mem://`-be).

## Ellenőrzés
Mindkét DOCX → LibreOffice headless PDF → pdftoppm → minden oldal QA-JPG-jét megnézem (címek renderelnek, nincs overflow, táblázatok tiszták, ⚠️/ékezetek OK). Ha bármi tört, egy körben javítom.

## Kimenet
Két `<presentation-artifact>` tag a végén.
