
# Apify scrape — javítások és AI-vezérelt autopilot

## Diagnózis (mit találtam most)

A két scrape, ami az UI-on „running" maradt, **valójában lefutott az Apify-on** (480 + ~300 hely, status `SUCCEEDED`), és **fizetős** — a Google Maps Scraper pay-per-event ($0.004/hely + $0.002 contact enrichment), együtt ~$2.69 + ~$2 levonva az Apify egyenlegedről. Tehát:
- Az Apify nem ingyenes — a saját Apify accountod USD-egyenlegéből/credit-jéből megy. Az induló $5 free credit egy-két scrape-re elég, utána tölteni kell.
- A „running" állapot azért ragadt be, mert **csak a böngészőből pollolunk** — amint bezártad a modált, megállt a frissítés, így a DB sosem kapta meg, hogy SUCCEEDED, és sosem importálta az adatot.

## Mit fogunk csinálni

### 1) Szerver-oldali háttér-poller (cron) — soha többé ne ragadjon be
- Új edge function `apify-runs-tick`: 2 percenként megnézi az összes `apify_runs.status IN ('RUNNING','READY')` sort, lekérdezi az Apify-tól a státuszt, és ha `SUCCEEDED`, lefuttatja az importot is.
- pg_cron job 2 percenként hívja.
- A meglévő 2 stuck runt egyből újraimportáljuk (manuális trigger most).

### 2) Email / website / Instagram mezők rendesen kerüljenek be
A Google Maps Scraper `scrapeContacts: true`-vel ezeket adja: `emails[]`, `phones[]`, `websites[]`, `instagrams[]`, `facebooks[]`, `linkedIns[]`, `twitters[]`. Az aktuális mapper csak részben veszi ki őket. Frissítjük a `mapGoogleMapsItem`-et hogy:
- `email`: első valid `emails[]` elem
- `website`: első `websites[]` ami nem facebook/instagram
- `instagram_handle`: `instagrams[]`-ből `@handle` kinyerése
- Új mező `partners.facebook_url`, `partners.linkedin_url`, `partners.contacts_blob jsonb` (raw enrichment) — migráció

### 3) AI Autopilot scrape (nem te írod be mit keressen)
Új mód a scrape modálban: **„Hagyd az AI-ra"** (alap választás).
- Egy kattintásra a `lead-discovery-plan` edge function:
  - Lehúzza a már létező partnereink kerület/kategória eloszlását → tudja mi van LEFEDVE.
  - Megnézi a `BRAND_CONTEXT`-et + a score rubrikát (lent).
  - AI 3-5 célzott search-string csomagot ad vissza: pl. „specialty coffee Budapest VII. kerület", „craft beer bar Budapest VIII. kerület", „rooftop bar Budapest belváros" — a hiányzó szegmensekre koncentrál.
  - Becsült költség USD-ben (places * $0.004 + contacts * $0.002), a felhasználó **látja a becsült árat és felső plafonját** indítás előtt.
- A felhasználó csak rákattint és „Indítás" — semmit nem kell beírnia.

### 4) Score & Grade — átlátható rubrika (most fekete doboz)
Determinisztikus baseline score + AI finomítás, és egy tooltip/info popover ami mutatja **miért kapta**.

**Baseline (0-100):**
- **Kategória illeszkedés (max 30):** koktélbár 30, craft bár 28, specialty coffee 25, bisztró 20, étterem 15, pub 12, gyors 5, egyéb 0.
- **Lokáció (max 25):** Budapest V/VI/VII/VIII/IX = 25, többi BP kerület = 18, agglomeráció = 10, vidéki nagyváros = 8, egyéb = 3.
- **Méret/forgalom (max 20):** Google review count: 500+ = 20, 200-499 = 16, 100-199 = 12, 50-99 = 8, 20-49 = 4, <20 = 1.
- **Minőség (max 10):** Google rating: 4.6+ = 10, 4.3-4.59 = 7, 4.0-4.29 = 4, alatta = 1.
- **Elérhetőség (max 15):** email +6, website +5, instagram +4.

**Grade mapping:** A 80+, B 60-79, C 40-59, D 0-39 (már létezik).

**AI overlay (±10):** a `score-lead` AI rátehet ±10-et hely-specifikus tényezőkre (pl. „student-favorite", „új megnyitó momentum"), és írásban indokol — ez kerül a `score_reasons.adjustments`-be.

UI változás: a `LeadScoreBadge`-re kattintva popover ami listázza a baseline felbontást + AI módosítók.

### 5) Apify kredit-helyzet kezelése
- A scrape modálban egy „🪙 Apify egyenleg" badge: `apify-actors-list` hívás kibővítve, hogy `/v2/users/me/limits` is jöjjön → mutatja maradék USD-t.
- Indítás előtti dialógus ha az egyenleg < becsült költség → figyelmeztet + link az Apify console-ra.
- Egyértelmű hibakezelés: ha Apify 402-vel elutasít, „Tölts fel kreditet az Apify accountodon" üzenet (linkkel).

### 6) Instagram DM kiküldés saját accountból

**Itt van rossz hír:** közvetlen IG DM küldés sajat acc-ról automatizáltan nem megy tisztán API-val, csak **Instagram Graph API** (a) Business account, (b) Facebook Page-hez kötve, (c) Meta App review jóváhagyva, (d) végfelhasználó által Messenger-rel kezdeményezett 24h üzenet-ablak. Hidegen indított DM **nincs** támogatott API-val. Megoldási opciók:
- **(a) Félautomata (legrealisztikusabb most):** „Send DM" gomb → kinyit egy új tabot `https://ig.me/m/<handle>` URL-en (Instagram saját deep link), a personalizált szöveg **automatikusan a vágólapra kerül**, te csak Ctrl+V + Enter. Egy gombnyomásból kettő — de tisztán szabályos.
- **(b) Graph API integráció:** ha van/lesz Facebook Page-hez kötött Business IG accountod, beállítunk egy OAuth flow-t + Edge function-t. Ez 2-3 napos meta app review és külön lépés — most kihagyom, csak előkészítem (DB mező: `comms_channels.instagram_oauth`), ha rábólintasz.
- **(c) 3rd party (ManyChat, Instamber):** unofficial automatizáció, könnyen acc-ban, nem ajánlom.

**Ebben a körben az (a)-t építem meg** (instant használható), az (b)-t csak ha most kérted.

## Érintett fájlok

**Edge functions**
- `apify-runs-tick` *(új)* — cron-driven státusz frissítő + auto-import
- `apify-run-import` — javított `mapGoogleMapsItem` (email/website/IG/FB/LinkedIn)
- `apify-actors-list` — kibővítve user balance lekéréssel
- `apify-run-start` — alapértelmezett actor explicit (`nwua9Gu5YrADL7ZDj` Google Maps Scraper), pricing-becslés visszaadva
- `lead-discovery-plan` *(új)* — AI scrape-tervező (gap analízis + search strings + ár)
- `score-lead` — átírva: determinisztikus baseline + AI overlay, részletes `score_reasons.breakdown`

**Frontend**
- `src/components/admin/leads/ApifyScrapeModal.tsx` — új „Autopilot" mód (alap), Apify balance badge, becsült ár
- `src/components/admin/leads/LeadScoreBadge.tsx` — popover a baseline felbontással
- `src/components/admin/leads/LeadsKanban.tsx` és `LeadOutreachModal.tsx` — „Send DM" gomb (ig.me + vágólap)
- `src/lib/lead-score-rubric.ts` *(új)* — deterministic scoring függvény + magyarázat

**DB migráció**
- `partners`: új mezők `facebook_url text`, `linkedin_url text`, `contacts_blob jsonb`
- `apify_runs`: új mező `estimated_cost_usd numeric`, `actual_cost_usd numeric`
- pg_cron job: `apify-runs-tick` 2 percenként

**Manuális one-shot most**
- A 2 ragadó run (`hEkRrb58LinRN2NGL` és a másik dataset) azonnali import — 480+~300 helyet behoz, hogy ne vesszen el a $4.7 költés.

## Out of scope (ebben a körben)

- Tényleges Instagram Graph API integráció + Meta app review (külön kör, ha rábólintasz)
- Outreach autopilot trigger Instagram csatornán (most csak email)
- TikTok / Facebook DM
