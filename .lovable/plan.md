# Fázis 6 — Második kör szállítás

A korábbi körből a 6.A.1–4 részben már megvalósult (dinamikus LeadsKanban + SLA badge + pipeline_transitions), de a **közös EntityDrawer** és a **Chat v2** még hiányzik. Most ezeket és a maradék 6.A.5–7 + 6.B.2 + 6.B.6 csomagot szállítjuk.

## 1. EntityDrawer (6.A.2 — lezárás)
Új `src/components/admin/crm/EntityDrawer.tsx` (shadcn Sheet alapon). Tabok:
- **Áttekintés** — alap mezők, score badge, SLA badge, gyors actionök (stage váltás, task)
- **Időszalag** — `pipeline_transitions` + `partner_interactions` + `outreach_events` merge, idő szerint
- **Teendők** — `pipeline_tasks` lista (megnyit/lezár)
- **Sequence-ek** — aktív `outreach_enrollments` + step állapot
- **Dokumentumok** — `document_entity_links`-ből csatolt doksik (link + lifecycle chip)
- **AI javaslat** — `outreach-suggest` edge function hívás, gombbal

Beépítés: `AdminLeads.tsx` és `AdminPartners.tsx` sorra kattintva nyílik (a meglévő részletes oldalakat megtartjuk, de a drawer gyors nézet).

## 2. AdminDocumentChat v2 (6.A.4)
`AdminDocumentChat.tsx` átírása: a chat előtt először `doc-semantic-search` hívás (top_k=5), majd a snippet-eket beletoljuk a `chat-with-documents` rendszerüzenetébe **forrás-jelöléssel**. A válasz alatt forrás-kártyák jelennek meg (cím + snippet részlet + link `/admin/documents/{id}`).

## 3. Doc UI csiszolás + auto-trigger (6.A.5–6)
- `AdminDocuments.tsx`: AI tag chip-ek a kártyán, `ai_hook` előnézet (2 sor truncate), lifecycle szűrő (Mind / Friss / Régi / Archiválandó), `document_opens` insert minden megnyitásnál.
- Auto-trigger: bulk upload / single upload sikere után automatikusan beindítjuk `doc-auto-tag` + `doc-embed` + `doc-entity-bridge` hívásokat (a meglévő manuális gomb marad fallbacknek).

## 4. Weekly Retro bővítés (6.A.7)
`weekly-retro/index.ts` prompt bővítése: új/módosult doksik száma (utolsó 7 nap), pipeline conversion (stage→stage az utolsó 7 napra), top sequence (legtöbb reply). Output sectionökben megjelenítve `AdminRetro.tsx`-en.

## 5. Decision Journal + WHY-graph (6.B.2)
**Új tábla** `decisions`:
- mezők: `decision_text`, `expected_outcome`, `entity_type`, `entity_id`, `decided_at`, `review_at` (default +30 nap), `outcome` jsonb, `outcome_rating` (1–5), `created_by`
- RLS: csak admin (`has_role`)
- GRANT-ek: authenticated + service_role

**UI:**
- `src/components/admin/DecisionPrompt.tsx` — minimalista modal: 1 mondatos "miért" + várt eredmény. Beépítve a LeadsKanban stage drop, OutreachEnrollment launch, és KPI target setting flow-ba (opcionális, "Skip" gomb).
- Új oldal `/admin/decisions` (`AdminDecisions.tsx`) — időszalag lista, lejárt review-k pirossal, "értékelés" inline form (5 csillag + szabadszöveg outcome).
- Dashboard kártya `DecisionsDueCard` — lejárt review-k száma.

**Edge function** `decision-review-tick` (heti pg_cron): minden review_at < now() AND outcome IS NULL döntésre `inbox_items` insert "Döntés értékelése: ...".

## 6. Partner Health Radar (6.B.6)
Új komponens `src/components/admin/crm/PartnerHealthRadar.tsx` (recharts `RadarChart`). 6 dimenzió, 0–100:
- **Engagement** — interakciók száma utolsó 30 napban
- **Response latency** — átlagos válaszidő outreach-re (inverz, alacsony = jó)
- **Document activity** — `document_opens` + linkelt doksik
- **Outreach receptivity** — reply rate
- **Score trend** — `entity_scores` utolsó 30 napos delta
- **Days in stage** — jelenlegi stage óta eltelt idő (inverz)

Számítás kliens oldalon a partner profil betöltésekor (egy edge function hívás `partner-health-radar` — összeadja, vissza JSON-nal).

Beépítés: `EntityDrawer` új tab partnerek esetén + `AdminPartnerDetail.tsx` felső szekció.

## 7. Tracking események
`src/lib/track.ts` bővítés: `decision_created`, `decision_reviewed`, `entity_drawer_opened`, `doc_chat_v2_used`, `health_radar_viewed`.

## Technikai részletek

**Új fájlok:**
- `src/components/admin/crm/EntityDrawer.tsx`
- `src/components/admin/crm/PartnerHealthRadar.tsx`
- `src/components/admin/DecisionPrompt.tsx`
- `src/components/admin/dashboard/DecisionsDueCard.tsx`
- `src/pages/admin/AdminDecisions.tsx`
- `supabase/functions/partner-health-radar/index.ts`
- `supabase/functions/decision-review-tick/index.ts`
- `supabase/migrations/*` — `decisions` tábla + pg_cron

**Módosított:**
- `src/App.tsx` — `/admin/decisions` route
- `src/components/admin/AdminLayout.tsx` — Döntések menü
- `src/pages/admin/AdminLeads.tsx`, `AdminPartners.tsx` — drawer integráció
- `src/pages/admin/AdminPartnerDetail.tsx` — radar
- `src/pages/admin/AdminDocumentChat.tsx` — semantic search + forrás-kártyák
- `src/pages/admin/AdminDocuments.tsx` — tag chips, hook, lifecycle szűrő, auto-trigger, opens tracking
- `src/pages/admin/AdminDashboard.tsx` — DecisionsDueCard
- `src/pages/admin/AdminRetro.tsx` — új szekciók render
- `supabase/functions/weekly-retro/index.ts` — bővített prompt
- `src/lib/track.ts` — új event típusok

## Kihagyott (külön körben)
- 6.B.4 Voice morning ritual
- 6.B.9 Email-to-CRM bridge (Resend inbound webhook)
- 6.B.10 Smart Drive Watcher
- 6.B.3 AI Cofounder Socratic mode
- 6.B.7 Content Remix Engine
- 6.B.8 Public Founder Pulse

OK ez a csomag? Kezdjük?