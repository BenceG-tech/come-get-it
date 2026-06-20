# Fázis 6 — Befejezés + "kockán kívüli" extra réteg

Két blokk: **6.A** a Fázis 5 lezárása (amit kihagytunk), **6.B** out-of-the-box ötletek, amik valódi versenyelőnyt adnak egy founder-vezetésű waitlist app mögött.

## 6.A — Maradék lezárás (kötelező housekeeping)

1. **Dinamikus pipeline kanban**: `LeadsKanban` + AdminPartners kanban átírása, hogy a `pipeline_stages` táblából töltsenek (kind szerint), és minden drag-drop `pipeline_transitions` rekordot is hozzon létre.
2. **Közös `EntityDrawer`** (`src/components/admin/crm/EntityDrawer.tsx`): tabok = Áttekintés / Időszalag (transitions + interactions + outreach merge) / Teendők / Sequence-ek / Score-trend / **Kapcsolódó dokumentumok** (`document_entity_links`-ből) / AI javaslat (`outreach-suggest`).
3. **`SlaWarningBadge` integrálás** a leadek listanézetébe + kanban kártyára.
4. **AdminDocumentChat v2**: jelenleg `chat-with-documents`-et hív — átkapcsolás az új `doc-semantic-search` + RAG-ra, idézet-snippetek és forrás-linkek a válaszban.
5. **Doc UI csiszolás**: AI cimke-chipek, hook előnézet, lifecycle szűrő (Friss / Régi / Archiválandó) a doc listában; doc megnyitásnál `document_opens` insert.
6. **Auto-trigger**: új doksi feltöltés után automatikus `doc-auto-tag` + `doc-embed` + `doc-entity-bridge` hívás (jelenleg manuális gomb).
7. **`weekly-retro` bővítés**: új/módosult doksik összefoglalója + pipeline conversion + top sequence.

## 6.B — Kockán kívüli "wow" réteg

### B1. **Founder Co-Pilot Inbox** — egy hely, ahol minden döntés vár rád
- Új tábla `inbox_items` (kind: `lead_alert|sla_breach|content_review|doc_stale|outreach_reply|score_drop|kpi_anomaly`, severity, payload jsonb, status, snoozed_until).
- Edge function `inbox-collect` (15 percenként pg_cron): minden AI workmate eredményéből egységes feed-et épít.
- UI: `/admin/inbox` — Gmail-szerű lista, swipe-elhető ("kész", "snooze 1 óra", "delegálás"), keyboard nav (`j/k/e/y`), aktivitás-streak gauge.
- Dashboard tetején "**Inbox zero?**" widget — 3 legfontosabb itemmel.

### B2. **Decision Journal + WHY-graph**
- Minden stage-tranzakció, sequence-launch, KPI-target mellé opcionális 1 mondatos "**miért**". 
- Új tábla `decisions` (entity_ref, decision_text, expected_outcome, review_at, outcome jsonb).
- AI havonta visszanéz: melyik döntés vált be, melyik nem → **personal feedback loop**.
- UI: timeline view + havi "decision retro" oldal a heti retro mellett.

### B3. **AI Cofounder — Socratic mode**
- Új edge function `cofounder-challenge`: ha bármilyen briefet/sequence-et/celt mentesz, az AI 3 kritikus kérdést tesz fel ("Miért most? Mi a bizonyíték? Mit nem látsz?").
- Toggle: ha bekapcsolod, semmi nem mehet "approved"-ba kérdés-válasz nélkül.
- Hetente: "**Confidence calibration**" — visszamutatja, hányszor volt igazad vs. AI.

### B4. **Voice-first morning ritual** (a meglévő VoiceCaptureFAB-ra építve)
- Új edge function `morning-standup`: nyitod a dashboardot reggel → AI hangosan (TTS) felolvassa a 90 másodperces briefinget, te hangosan válaszolsz 3 célt, majd átkerül `daily_focus`-ba.
- Storage: rövid audio mentve `admin-docs/standup/YYYY-MM-DD.mp3`.
- Heti retro hallgatható verzió ugyanígy (autopilot mode).

### B5. **Pipeline simulator ("what-if")**
- Új oldal `/admin/simulator`: csúszka — "ha 10-zel több leadet keresek meg / 20%-kal jobb conversion / 2 hetet várok", hogyan változik a 30/60/90 napos signed-partner count és revenue?
- Backend: jelenlegi `entity_scores` + historikus `pipeline_transitions` alapján Monte Carlo szimuláció (1000 run, p10/p50/p90 sáv).
- Output a befektetői pitch deckben is hasznos.

### B6. **Partner Health Radar** (drawer extra tab)
- Egy partner profilon: 6 dimenzió radar chart — Engagement, Response Latency, Document Activity, Outreach Receptivity, Score Trend, Days in Stage.
- Heti email a top 5 "veszélyben" partnerről.

### B7. **Marketing Content "Remix Engine"**
- Új edge function `content-remix`: kijelölsz egy top-performer posztot → AI 5 variánst generál különböző hook/angle/CTA-val, az `snippet_performance` historikus adatok alapján priorizálva.
- A/B teszt naptári slot generálás 2 variánssal egyszerre.

### B8. **Live "Founder Pulse" public page**
- Publikus `/pulse` oldal (anon-readable agreggált KPI-ok): waitlist növekedés, partner pipeline, content velocity — transzparens metrics page befektetőknek és közösségnek (mint a Buffer transparency reportja).
- Tábla `public_kpi_snapshots` (anonim agg), heti `kpi-public-snapshot` cron.

### B9. **Email-to-CRM bridge**
- Új edge function `email-inbound` (Resend webhook): ha valaki válaszol egy outreach emailre, automatikusan:
  - `outreach_events` reply rögzítés
  - AI extract: szándék (érdekel/elutasít/kérdés) → stage javaslat
  - `inbox_items` insert "**Új válasz: {partner}**" notifikációval
- Lényegében autopilot CRM kommunikáció.

### B10. **Smart Drive Watcher**
- 6 óránként scan a Google Drive-on (meglévő connector): új fájl → auto-import + auto-tag + entity-bridge + diff a hasonló doksikkal.
- Notifikál ha duplikátum-jellegű ("Founding pitch v3 — már van v2, akarsz mergelni?").

## Mit javaslok most szállítani?

**Erős MVP javaslat egy körben (kb. közepes méret):**
- **6.A.1–4** (kanban + drawer + SLA badge + chat v2) — kötelező lezárás
- **6.B.1 Founder Co-Pilot Inbox** — azonnal érezhető napi élmény-javulás
- **6.B.5 Pipeline simulator** — befektetői és önreflexiós eszköz

**Második körben** (külön szállítás):
- **6.A.5–7** (doc UI csiszolás + auto-trigger + retro bővítés)
- **6.B.2 Decision Journal** + **6.B.6 Health Radar**

**Harmadik körben** (külön szállítás, függ Resend webhook setupon):
- **6.B.9 Email-to-CRM** + **6.B.4 Voice morning ritual** + **6.B.10 Drive Watcher**

## Jóváhagyási kérdés

Menjünk az **első kör MVP** szerint (6.A.1–4 + B1 Inbox + B5 Simulator)? Vagy másmilyen kombinációt preferálsz a B1–B10 listából? Mondj 1–3 számot, amit először szeretnél, és az alapján optimalizálom.
