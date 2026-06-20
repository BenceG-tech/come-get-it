# Admin Lead-CRM kibővítés — Vendéglátóhelyek fókusz

## Mit építettünk eddig (admin/)
- **Dashboard** — alap KPI-k
- **Partners + PartnerDetail** — CRUD lista, státusz, jegyzetek
- **Documents + Audit + Viewer** — feltöltés, AI értékelés, multi-select
- **Calendar** — marketing naptár
- **Checklist** — óriás dokumentum/teendő lista
- **AI Assistant** — sticky chat, threadek, voice, self-critique, doksi-kontextus

## Ami hiányzik (a kéréseid alapján)
1. Tömeges lead-import (Excel/CSV + Apify Google Maps scraper)
2. Pipeline-vizualizáció (Kanban): új → kontaktált → tárgyalás → szerződés → aktív / elutasítva
3. Lead-scoring (AI: hely típusa, méret, IG-követők, rating, illeszkedés a brandhez)
4. Tömeges műveletek (kijelölés → email, státusz, hozzárendelés, AI-elemzés)
5. Térkép-nézet (Mapbox) — város/kerület szerint
6. Email- és üzenetküldés a partner kártyájáról (Resend + sablonok), interakció-log
7. Duplikátum-szűrés (név + cím + telefon hasonlóság)
8. Lead-források analitikája (honnan jött a legjobb minőségű partner)

## Új felépítés — `/admin/leads` (új hub, a Partners helyett/mellett)

### 1) Nézetek egy oldalon, fülekkel
- **Lista** — szűrhető táblázat (város, típus, státusz, score, forrás, utolsó kontakt)
- **Kanban** — drag & drop a pipeline-on
- **Térkép** — pinek színezve státusz szerint
- **Naptár** — `next_followup_at` események

### 2) Tömeges import — 3 mód
- **A) Excel/CSV feltöltés**: drag & drop → oszlop-mapping wizard → preview → duplikátum-jelzés → import
- **B) Apify Google Maps Scraper**: form (keresőszó pl. "kávézó Budapest VII", limit, kategóriák) → háttér edge function indítja az Apify actort (`compass/crawler-google-places`) → poll státusz → automatikus betöltés `partners` táblába forrással `apify:google_maps`
- **C) Kézi gyors-add**: 1 soros mező (név) + AI auto-kitöltés (Apify "lookup" vagy Google Places API egy helyre)

### 3) Lead-scoring (AI)
Új oszlop a `partners` táblán: `lead_score` (0–100), `score_reasons` (jsonb), `score_updated_at`. Edge function `score-lead` minden új lead-re lefut (és kézzel is triggerelhető tömegesen):
- típus illeszkedés (kávézó/bár/étterem > gyorsétterem)
- méret-jel (Google rating count, IG-követők ha van)
- aktivitás (van IG, van weboldal, válaszolt-e DM-re)
- város prioritás (BP belváros > vidék első körben)
A score-listán színes badge (zöld 80+, sárga 50–79, piros <50).

### 4) Tömeges műveletek
Checkbox a sorokon → floating bar: **AI elemezz · Email küldés (sablon) · Státusz · Hozzárendel felhasználóhoz · Címke · Export CSV · Töröl**

### 5) Kommunikáció + interakció-log
Partner kártyán új tabok: **Áttekintés / Időnvonal / Emailek / Doksik / Jegyzetek**. Email küldés Resend-en sablonból ("Első megkeresés", "Emlékeztető", "Founding Partner ajánlat"). Minden küldés és nyitás log-olva (`partner_interactions` már létezik).

### 6) Duplikátum-kezelés
Import előtt és cron-nal: Levenshtein név + város egyezésre figyelmeztet → "Egyesítés" gomb (jegyzetek és interakciók összeolvadnak).

## Technikai részletek

### Új edge functions
- `apify-scrape-venues` — Apify actor indítása + webhook fogadása. Új secret: `APIFY_API_TOKEN`.
- `import-leads-bulk` — CSV/Excel parsolás (xlsx npm), validáció, dedup, batch insert.
- `score-lead` — Gemini-vel pontozás, eredmény mentése.
- `send-partner-email` — Resend + sablon-render, log a `partner_interactions`-be.

### DB migráció
- `partners` + `lead_score int`, `score_reasons jsonb`, `score_updated_at`, `assigned_to uuid`, `tags text[]`, `lat numeric`, `lng numeric`, `google_place_id text`, `rating numeric`, `rating_count int`
- új tábla `lead_import_jobs` (id, source, status, total, imported, duplicates, errors jsonb, created_by, created_at)
- új tábla `email_templates` (id, name, subject, body_md, variables jsonb)
- index `partners(status, lead_score desc)`, `partners(city)`, GIN `tags`

### Új komponensek
- `src/pages/admin/AdminLeads.tsx` (hub fülekkel)
- `src/components/admin/leads/LeadsTable.tsx`, `LeadsKanban.tsx`, `LeadsMap.tsx`
- `src/components/admin/leads/ImportWizard.tsx` (CSV/Excel + mapping)
- `src/components/admin/leads/ApifyScrapeDialog.tsx`
- `src/components/admin/leads/BulkActionBar.tsx`
- `src/components/admin/leads/LeadScoreBadge.tsx`
- `src/components/admin/leads/EmailComposer.tsx`

### Integrációk
- **Apify** — `APIFY_API_TOKEN` secret kell (kérni fogom build-fázisban)
- **Mapbox** — public token, térképhez
- **Resend** — már van
- **Google Places (opcionális későbbre)** — 1-1 lookup-ra

## Megvalósítási sorrend
1. DB migráció + `AdminLeads` váz (lista + szűrők + score badge)
2. CSV/Excel import wizard + duplikátum-szűrés
3. Apify integráció (a leghasznosabb most)
4. Kanban + Térkép nézet
5. AI lead-scoring (bulk + auto új lead-re)
6. Email composer + sablonok + interakció-log
7. Tömeges műveletek + analitika dashboard widget

## Kérdés mielőtt elindulok
- **Apify token**: van már aktív Apify accountod? Ha igen, build-módban kérni fogom a tokent az `add_secret`-tel. Vagy inkább Google Places API-val menjünk?
- **Térkép**: Mapbox jó (van free tier), vagy Leaflet+OpenStreetMap (teljesen ingyenes, token nélkül)?
- **Partners menüpont** maradjon külön, vagy az új **Leads** váltsa fel teljesen (a Partners adatai automatikusan az új nézetben lesznek úgyis)?