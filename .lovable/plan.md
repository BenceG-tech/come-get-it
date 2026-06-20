
# Következő lépések — Fázis 4–6 roadmap

Az eddig kész fázisok (1: Cockpit/KPI, 2: AI Workmates, 3: Content & Marketing) után a következő természetes lépés a **CRM-mélyítés és outreach automatizáció**, majd a **dokumentum/Drive intelligencia** és végül egy **egységes analytics réteg**.

## Fázis 4 — Partner/Lead CRM pipeline + outreach automatizálás (következő szállítás)

### 4.1 Egységes pipeline modell

- Új tábla: `pipeline_stages` (id, kind: `lead|partner`, key, label, order, color, sla_days, win_probability) — eddig hardkódolt stage-ek dinamizálva.
- `leads` + `partners` kap `stage_id` fk-t (migráció a régi `status` mező mellett, backfill).
- Új tábla: `pipeline_transitions` (entity_type, entity_id, from_stage, to_stage, by, at, reason, ai_suggested bool) — minden mozgás auditolva.
- Új tábla: `pipeline_tasks` (entity_type, entity_id, title, due_at, owner, status, source: `manual|ai|sla`) — minden lead/partner kártya alá tartozó teendők.

### 4.2 Outreach motor

- Új tábla: `outreach_sequences` (name, kind, steps jsonb: `[{day_offset, channel, template_id, condition}]`, active).
- Új tábla: `outreach_enrollments` (sequence_id, entity_type, entity_id, current_step, next_run_at, status: `active|paused|done|stopped`, stop_reason).
- Új tábla: `outreach_events` (enrollment_id, step_index, channel, sent_at, opened_at, clicked_at, replied_at, bounce).
- Új edge function: `outreach-tick` — `pg_cron` 15 percenként; a `next_run_at <= now()` rekordoknál meghívja a megfelelő csatornát (`send-partner-email` vagy új `send-outreach-sms` stub), majd lépteti a sequence-et. Reply detektálás esetén autopause.
- Új edge function: `outreach-suggest` — egy lead/partner adott állapotából AI (Gemini Flash) javasol sequence-et + személyre szabott első email draftot.

### 4.3 Lead/partner score 2.0

- A meglévő `score-lead` és `score-partner` kibővítése: input most már `pipeline_transitions` history + `outreach_events` engagement + `partner_interactions`. Output: 0–100 score + 3 mondat indoklás + javasolt next action.
- Új tábla: `entity_scores` (entity_type, entity_id, score, reasons jsonb, next_action, model, computed_at) — historikusan tárolva, hogy a dashboardon trendet lehessen mutatni.
- Új edge function: `score-recompute-batch` — naponta 04:00 UTC újraszámol minden aktív leadet/partnert.

### 4.4 UI változások

- `AdminLeads.tsx` és `AdminPartners.tsx` kanban: stage-ek dinamikusan a `pipeline_stages`-ből, drag-drop tranzakció `pipeline_transitions`-be is logol.
- Új kártya-drawer (mindkét entitásnál): tabok = Áttekintés / Időszalag (transitions+interactions+outreach merge) / Teendők / Sequence-ek / Score-trend / AI javaslat.
- Új oldal: `/admin/outreach` — sequence builder (step-lista, csatorna, template választó, várakozás napokban), aktív enrollmentek listája, performance (open/reply rate).
- `AdminDashboard.tsx`: új widget `OutreachHealthCard` (ma kiment X, válasz Y, lejárt SLA Z).
- Új komponens: `SlaWarningBadge` — ha egy entity adott stage-ben tovább van, mint `sla_days`, piros pötty + dashboardon összesítve.

### 4.5 Beépítés a meglévő AI workmate flow-ba

- `daily-briefing` bővítés: „Mai outreach feladatok”, „Lejárt SLA leadek”, „Heti reply rate”.
- `voice-capture` intent kibővítés: `lead_note` → automatikusan `pipeline_tasks` insert + opcionális stage advance.
- `weekly-retro`: pipeline conversion rate (lead→partner), top sequence, churn pontok.
- `track.ts` új események: `sequence_enrolled`, `sequence_step_sent`, `sequence_reply`, `stage_transition`, `sla_breach`.

### 4.6 Szállítási sorrend (1 körben)

1. Migráció: új táblák + fk-k + grants + RLS (admin-only).
2. Edge functions: `outreach-tick` (+cron), `outreach-suggest`, `score-recompute-batch` (+cron), `score-lead`/`score-partner` bővítés.
3. `AdminLeads` + `AdminPartners` kanban átírás dinamikus stage-ekre.
4. Új entity-drawer komponens (közös lead+partner detailhoz).
5. `/admin/outreach` page + sequence builder.
6. `OutreachHealthCard` + `SlaWarningBadge` integráció a dashboardba.
7. `daily-briefing`, `weekly-retro`, `voice-capture`, `track.ts` bővítések.

## Fázis 5 előzetes — Dokumentum + Drive intelligencia

- **Auto-tagging + relevance scoring**: minden új dokumentum mellé AI cimkék (pl. „Founding pitch”, „Pénzügy”, „Jogi”) + 1 mondatos hook a kereséshez.
- **Semantic search v2**: pgvector embedding minden chunkra (jelenleg csak summary van), reranker a top találatokon.
- **Drive → CRM bridge**: ha egy Drive doksiban felismerünk partner-nevet, automatikus link a partner kártyára.
- **Doksi „életjel”**: hány napja nem nyitották meg, javaslat archiválásra vagy frissítésre.
- **Heti document digest**: új és módosult doksik AI-összefoglalója a heti retroban.

## Fázis 6 előzetes — Analytics & forecasting

- **Unified KPI dashboard**: jelenlegi `daily_kpi_snapshots` mellé heti/havi aggregátumok, cohort-elemzés (waitlist → app user, lead → partner).
- **Forecast view**: egyszerű lineáris/EWMA előrejelzés a waitlist és pipeline metrikákra, „ha így megy, X napra elérjük az Y célt”.
- **Anomália jelzés**: napi snapshot összevetése 14 napos átlaggal, kiugrás esetén Slack-szerű in-app értesítés + `daily-briefing`-be belekerül.
- **Export**: CSV/PDF egy gombbal heti riportok befektetőknek (a meglévő PDF stílusban).

## Technikai megjegyzések

- Minden új edge function `verify_jwt=false` + in-code `has_role(admin)` ellenőrzés a meglévő minta szerint.
- Cronok mind `pg_cron` + `pg_net` invokáció (mint a Fázis 2 daily/weekly).
- Új secret nem kell — minden AI hívás `LOVABLE_API_KEY` Gemini Flash.
- Drag-drop a kanbanon a meglévő HTML5 drag mintát követi (`LeadsKanban`), nincs új lib.
- Sequence builder pure-React, shadcn primitívek, Neon Fidelity stílus.

## Jóváhagyási kérdés

Menjünk **Fázis 4 teljes terjedelmében** (CRM + outreach motor egy körben)? Vagy bontsuk ketté: először csak a pipeline-modell + dinamikus stage-ek + score 2.0 (4.1+4.3+4.4 részlegesen), és utána külön körben az outreach motor (4.2+4.5)?
