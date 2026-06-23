# Apify Integráció + Leads Command Center

## TL;DR — Hogyan működik az Apify

**Egy token az egész accountra.** Az Apify-nál egyetlen `APIFY_API_TOKEN` van az egész fiókodra, és **minden actor**-t azzal hívsz (Google Maps Extractor, Instagram Scraper, Website Contacts, stb.). Az actorokat ID alapján különbözteted meg (pl. `compass/crawler-google-places`). Tehát:
- 1 secret → bármennyi actor → bármennyi run
- Az AI tudja eldönteni futás közben, melyik actort használja

## Fázisok

### Fázis 1 — Apify backend csatlakoztatás (alap)
- Mentjük az `APIFY_API_TOKEN`-t Lovable Cloud secretbe.
- Edge functions wrapper az Apify REST API köré:
  - `apify-actors-list` — lekéri a saját actor + saved task listát
  - `apify-run-start` — actor indítás (input JSON-nal)
  - `apify-run-status` — run státusz poll-olás
  - `apify-dataset-fetch` — kész dataset behúzása URL/ID alapján (az átküldött fájlokhoz is ez kell)
  - `apify-webhook` — publikus endpoint, amit az Apify hív, ha végzett egy run → auto import
- Új DB táblák: `apify_runs` (követjük melyik run, milyen actor, status, dataset_id, eredmény szám, AI summary) és bővítjük a `lead_import_jobs`-ot.

### Fázis 2 — Leads Command Center UI (`/admin/leads` újragondolva)
A jelenlegi lista helyett egy multi-pane "command center":

```text
┌─────────────────────────────────────────────────────────────┐
│  Top bar: 🔍 Search │ Filter chips │ Bulk actions │ + Új    │
├──────────────┬──────────────────────────────────┬───────────┤
│  Bal sáv     │  Lista / Térkép / Kanban toggle  │  Jobb     │
│  ───────     │  ──────────────────────────────  │  panel    │
│  Pipeline:   │  [Card]  Hard Rock Cafe          │  ──────   │
│   • Új (124) │   📍 V. kerület · ⭐4.6 · 2.3k   │  Lead     │
│   • Kutatva  │   📧 contact@... · 📱 IG @...    │  preview  │
│   • Kontakt  │   AI score: 87 🔥                │  + AI     │
│   • Followup │   [⚡Deep research][📧][📱DM]    │  research │
│   • Won/Lost │                                  │  + Mockup │
│              │  [Card] ...                      │  preview  │
│  Saved views │                                  │           │
│  + Apify     │                                  │  Timeline │
│  source-ok   │                                  │  történés │
└──────────────┴──────────────────────────────────┴───────────┘
```

Funkciók:
- **3 nézet kapcsoló**: Lista (sűrű), Térkép (Mapbox/Leaflet — Budapest pin-ek), Kanban (pipeline drag-drop)
- **AI score** minden leadre (rating × reviews × kategória illeszkedés × van-e IG/email)
- **Bulk select + bulk action** (mass email kampány indítás, mass status change, tag-elés)
- **Saved views** (pl. "Budapest rooftop bars, IG-vel, még nem kontaktált")
- **Right panel lead preview** — kattintásra slide-in, nincs page navigation

### Fázis 3 — AI-vezérelt Apify ("Adat scrape" gomb)
Egy gomb a leads oldalon: **"➕ Új leadek scrapeléssel"**. Modal-ban:

1. **Természetes nyelvű prompt**: pl. "minden budapesti rooftop bar, ami nyitva van vasárnap"
2. AI (LLM tool call) eldönti:
   - melyik actor (default: `compass/crawler-google-places`)
   - milyen input JSON (search terms, location filter, max results, language=hu)
3. Megmutatja a tervezett run-t → te jóváhagyod → indul
4. **Háttérben fut** (webhook-kal vagy 10s pollinggal), toast értesít végeztével
5. Eredmény: dedup-pal beimportálva → AI gyors score-olás + tag-elés → megjelenik a listában

Saját Apify task-jaidat is listázzuk ("Saved tasks" dropdown).

### Fázis 4 — Deep AI research per lead
Lead kártyán **"🔬 Deep research"** gomb. Háttérben:
- Apify Website Content Crawler a hely weboldalán → menü, árak, nyitvatartás, "about us"
- Instagram scraper (ha van handle) → top posztok, követőszám, engagement
- AI összegzi → "Research dossier" markdown a lead alá:
  - Mit kínálnak (signature drinks, ételek)
  - Célközönség (típusos vendég profil)
  - Owner/manager név ha publikus
  - **3 ajánlott personalized hook** az outreach-hez ("említsd meg a Negroni-jukat...")
  - Best contact channel javaslat

Cache-eli (`partners.research_dossier` jsonb mező), 30 napig nem futtatja újra.

### Fázis 5 — Multi-channel outreach + tracking
A lead preview panelen 4 tab:

**📧 Email** — AI-generated, edithető, küldés Resend-en (van `send-partner-email`). Tracked: open/click via Resend webhook → outreach timeline.

**📱 Instagram DM** — AI generál 3 verziót (rövid/közepes/casual). Gomb:
- Másolja vágólapra
- Megnyitja az IG profilt új tabban
- Logolja `outreach_events`-be ("dm_sent_manual" típussal) → így mégis trackelve van

**📞 WhatsApp / Telefon** — AI ad call script + WhatsApp template + click-to-call/`wa.me/` link.

**🔄 Followup** — automatikus reminder 3/7/14 nap múlva ha nem válaszolt → inbox_items.

Minden interakció: `partner_interactions` táblába, megjelenik a Timeline-on.

### Fázis 6 — AI-generált personalized vizuál
Lead kártya: **"🎨 Készíts mockup-ot"**:
- AI image generation (Gemini image / nano-banana via Lovable AI Gateway)
- Prompt: "Photorealistic iPhone screenshot of the 'Come Get It' app showing a deal card from **{hely neve}**, with their actual venue photo from Google Maps, neon cyan branding, dark theme, Hungarian text 'Ingyen koktél @ {hely neve}'"
- 3 variáns egyszerre (feed poszt 1:1, story 9:16, DM preview)
- Storage-ba menti (`admin-docs` bucket-be `/lead-mockups/{partner_id}/`)
- Letöltés gomb + "Email-be csatol" / "Másolás DM-hez"

A vizuál vita-érvként jó: a lead látja **saját helyét** az appban → erős hook.

### Fázis 7 — Térkép nézet
- `react-leaflet` (ingyen, OpenStreetMap tile-ok) — nem kell Mapbox token
- Budapest középre, pin-ek státusz színekkel (új=cyan, kontakt=sárga, won=zöld, lost=szürke)
- Pin click → ugyanaz a slide-in right panel
- Cluster-ezés ha sok lead közel egymáshoz

## Adatmodell-bővítés

**Új táblák:**
- `apify_runs` (id, user_id, actor_id, run_id, status, input jsonb, dataset_id, items_count, ai_summary, started_at, finished_at)
- `lead_mockups` (id, partner_id, image_url, prompt, variant, created_at)
- `outreach_dm_log` (mert IG DM nem küldés, csak "I sent this") — vagy bővítjük az `outreach_events`-et új `channel='instagram_manual'` értékkel

**Bővítések a `partners` táblán:**
- `ai_score` (int 0–100)
- `research_dossier` (jsonb)
- `research_updated_at` (timestamptz)
- `apify_source_run_id` (uuid → apify_runs)
- `instagram_handle` (text, ha még nincs)

## Technikai részletek

- **Apify REST API**: `https://api.apify.com/v2/acts/{actorId}/runs?token={token}` indításra, `https://api.apify.com/v2/actor-runs/{runId}` státuszra, `https://api.apify.com/v2/datasets/{datasetId}/items?token={token}` adatra. Egy account token mindenhol.
- **Webhook URL** Apify-ban beállítva a publikus `apify-webhook` edge functionra (HMAC ellenőrzéssel) → automatikus dataset fetch + import.
- **AI SDK** (`ai` + `@ai-sdk/react` + Lovable AI Gateway) tool calling-gel: `pickActor`, `buildActorInput`, `summarizeDataset`, `scoreLead`, `generateOutreachCopy`, `generateMockupPrompt` toolok. `stopWhen: stepCountIs(50)`.
- **Image gen**: Lovable AI Gateway image endpoint (gemini-2.5-flash-image preview / nano-banana), 3 párhuzamos call variánsokra.
- **Térkép**: `react-leaflet` + `leaflet` npm package-ek (kicsi, ingyen).
- **Bulk actions**: react-query mutation array-jel, optimistic update.
- **Kanban**: `@dnd-kit/core` (már lehet hogy van, ha nem akkor +1 dep).
- **Realtime**: Apify run státusz változások → Supabase Realtime channel az `apify_runs` táblára → progress bar live frissül.

## Mit építsünk most (1. iteráció)

Hogy ne legyen 3 hetes monstre commit, **most ezt** csináljuk és tesztelünk:

1. `APIFY_API_TOKEN` secret beállítás
2. `apify_runs` + partners bővítés migration
3. 3 edge function: `apify-actors-list`, `apify-run-start`, `apify-dataset-fetch` (webhook később)
4. Új `/admin/leads` Command Center UI (lista + jobb panel preview, kanban + map későbbi fázisokba)
5. "➕ Új scrape" modal AI prompt → Google Maps Extractor indítás → import
6. "🔬 Deep research" gomb (csak Website Crawler első körben, IG később)
7. Lead preview panelen: AI email gen + IG DM copy-flow
8. 1 mockup variáns gen (image gen) — később bővítjük 3-ra
9. Smoke test budapesti rooftop bar query-vel

A 2. iterációban: webhook, Kanban drag-drop, térkép, IG scraper, bulk kampány.

## Mit NEM csinálunk most
- Tényleges Instagram DM küldés API-val (Meta nem ad rá engedélyt SMB-knek) — csak "copy & open" workflow
- Email reply parsing / automatikus AI-választ küldés (manual review marad)
- Apify billing/usage dashboard (későbbi nice-to-have)
- Multi-user lead assignment (egyedül használod az admint most)
