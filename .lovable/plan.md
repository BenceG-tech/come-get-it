# Fázis 5 — Dokumentum & Drive intelligencia + CRM UI befejezés

A Fázis 4 lerakta a CRM/outreach motor alapját, de **két oldal még a régi statikus stage-eken fut** (`AdminLeads`, `AdminPartners`), és **nincs közös entity drawer**. Mielőtt teljesen új területre lépnénk, ezeket befejezzük, majd indítjuk a Fázis 5 fő témáját: a **dokumentum/Drive intelligenciát**.

## 5.A — CRM UI lezárása (Fázis 4 befejezése)

1. **Dinamikus kanban**: `LeadsKanban` és a partner-oldali kanban átírása, hogy a `pipeline_stages` táblából töltsenek (kind szerint szűrve), drag-drop esetén `pipeline_transitions` rekord is keletkezzen.
2. **Közös EntityDrawer** (`src/components/admin/crm/EntityDrawer.tsx`): tabok = Áttekintés / Időszalag (transitions + interactions + outreach merge) / Teendők (`pipeline_tasks`) / Sequence-ek / Score-trend (`entity_scores` chart) / AI javaslat (`outreach-suggest` gomb).
3. **SlaWarningBadge** integrálása listanézetbe és kanban kártyára.
4. **Daily briefing + weekly retro + voice-capture bővítés**: lejárt SLA, mai outreach feladatok, conversion rate, `lead_note` intent → `pipeline_tasks` insert.

## 5.B — Dokumentum + Drive intelligencia (fő rész)

### Adatmodell
- `documents` bővítés: `ai_tags text[]`, `ai_hook text` (1 mondatos kereső-hook), `relevance_score int`, `last_opened_at timestamptz`, `lifecycle_status text` (`fresh|stale|archived_suggested`).
- Új tábla: `document_chunks` (document_id, chunk_index, text, embedding vector(1536), token_count) — pgvector kiterjesztés, ivfflat index.
- Új tábla: `document_entity_links` (document_id, entity_type: `partner|lead`, entity_id, confidence, source: `ai|manual`) — Drive → CRM bridge.
- Új tábla: `document_opens` (document_id, user_id, opened_at) — életjel követés.

### Edge functions
- `doc-auto-tag` (poszt-upload trigger): Gemini Flash → cimkék + hook + relevance score.
- `doc-embed`: chunkolás (~800 token) + embedding (Lovable AI Gateway `text-embedding-3-small` ekvivalens) → `document_chunks`.
- `doc-semantic-search` v2: embedding query + pgvector top 20 + Gemini reranker top 5, idézet-snippetekkel.
- `doc-entity-bridge`: új doksinál partner/lead név-felismerés → `document_entity_links` insert.
- `doc-lifecycle-tick` (napi cron 03:00 UTC): `last_opened_at` alapján `lifecycle_status` frissítés (>60 nap = `archived_suggested`).
- `weekly-retro` bővítés: új és módosult doksik AI összefoglalója egy szekcióval.

### UI
- `AdminDocuments` lista: cimke-chipek, hook előnézet, relevance score badge, lifecycle szűrő (Friss / Régi / Archiválásra javasolt).
- `AdminDocumentChat` átkapcsolása `doc-semantic-search` v2-re, forrás-idézetekkel.
- Partner/lead drawerben új **„Kapcsolódó dokumentumok”** szekció (`document_entity_links` alapján).
- Új dashboard widget: `DocumentDigestCard` — heti új doksik + archiválási javaslatok száma.

## 5.C — Tracking és cron
- `track.ts` új események: `doc_tagged`, `doc_embedded`, `doc_semantic_search`, `doc_entity_linked`, `doc_archived_suggested`.
- Új cronok: `doc-lifecycle-tick` napi 03:00, `doc-embed` batch-újrafutás heti egyszer az új/módosult doksikra.

## Szállítási sorrend

1. **5.A.1–2**: dinamikus kanban + EntityDrawer (frontend + minimális supabase olvasás)
2. **5.A.3–4**: SLA badge + briefing/retro/voice bővítés
3. **5.B migráció**: pgvector kiterjesztés + új mezők/táblák + grants + RLS
4. **5.B edge functions**: `doc-auto-tag`, `doc-embed`, `doc-semantic-search` v2, `doc-entity-bridge`, `doc-lifecycle-tick`
5. **5.B UI**: dokumentum lista bővítés, chat upgrade, drawer dokumentum-szekció, dashboard widget
6. **5.C**: tracking + cronok

## Technikai jegyzetek
- Minden új function `verify_jwt=false` + in-code `has_role(admin)`.
- Embeddings a `LOVABLE_API_KEY` Gemini-kompatibilis embedding endpointján; ha nincs natív embedding, Gemini text-embedding modell.
- pgvector index: `ivfflat (embedding vector_cosine_ops) WITH (lists = 100)`.
- A meglévő `documents` séma 39 oszlopos — csak ALTER ADD COLUMN, nincs törlés.

## Jóváhagyási kérdés

Menjünk **mindhárom blokk** (5.A + 5.B + 5.C) egy körben, vagy bontsuk: **első kör 5.A** (CRM UI lezárás), **második kör 5.B+5.C** (dokumentum intelligencia)?
