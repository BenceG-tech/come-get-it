## Cél
A képelemzés mentése már működik a `documents` tábla `ai_*` mezőibe — most jönnek a hiányzó funkciók:
1. **Verziók** (utolsó 5)
2. **Beemelés** Floating AI Assistantbe és AdminDocumentChatbe (`/admin/ai`)
3. **Új admin doksi** generálása az elemzésből
4. **Strukturált vágólap** export

---

## 1. Adatbázis — verziózás

Új tábla: `image_analysis_versions`
- `document_id` (uuid, FK documents)
- `result` (jsonb — a teljes elemzés: description, alt, caption, copy, tags, mood, colors, use_cases)
- `created_by` (uuid), `created_at`
- `is_current` (boolean)

Admin-only RLS (`has_role(auth.uid(), 'admin')`).

Trigger / edge function logika: új verzió beszúrásakor a régieket `is_current=false`-ra, és ha 5-nél több verzió van a doksihoz, a legrégebbieket törölni.

A `documents.ai_*` mezők maradnak (gyors listanézethez) — mindig a `is_current=true` verziót tükrözik.

## 2. `analyze-image` edge function frissítés

A meglévő perziszt blokk után:
- Insert új sort `image_analysis_versions`-be `is_current=true`-val
- Régieket `is_current=false`
- Töröld a 6. legrégebbit, ha van

## 3. `ImageAnalysisPanel` UI bővítés

A meglévő panelhez:
- **Verzió-választó** dropdown felül (pl. „v5 · jún 20 14:32 (aktuális)" / „v4 · jún 19…") — váltás csak megjelenítést cserél, „Beállítás aktuálisnak" gombbal lehet előzőre visszaállni
- **Akció gombsor** az elemzés alján:
  - `Vágólapra (strukturált)` — formázott markdown blokk (cím, alt, caption, IG/FB copy, tags, színek)
  - `Beszúrás chatbe` — Floating AI Assistantbe küldés
  - `Új doksi készítése` — `/admin/documents` alá ment markdown fájlt
  - `Megnyitás /admin/ai-ben` — átnavigál a doksi-chat oldalra előtöltött prompttal

## 4. Floating AI Assistant integráció

`AIAssistantContext`-be új akció: `attachImageAnalysis(doc, analysis)` — megnyitja az assistantet és prefilleli az inputot egy strukturált kontextus-blokkal (kép URL + JSON elemzés), hogy a user kérhessen pl. „írj ebből 3 alternatív IG posztot"-ot.

## 5. AdminDocumentChat (`/admin/ai`) integráció

Query param-on (`?attachDoc=<id>`) érkezve betölti a doksit + legutóbbi elemzést mint rendszerüzenet kontextust, és üres prompttal várja a usert.

## 6. Új doksi generálás

Új edge function: `image-analysis-to-doc`
- Input: `docId`
- Markdown fájl generálás (kép thumbnail + összes ai_* mező rendezve)
- Upload `admin-docs` bucketbe, új sor `documents` táblában (`type: 'markdown'`, `folder: 'AI elemzések'`, `linked_document_id: <eredeti>`)
- Visszaadja az új doksi id-jét

Új oszlop: `documents.linked_document_id` (uuid, nullable) — visszahivatkozáshoz.

---

## Technikai részletek

**Új fájlok**
- `supabase/migrations/<új>.sql` — `image_analysis_versions` tábla + GRANTok + RLS + `linked_document_id` oszlop
- `supabase/functions/image-analysis-to-doc/index.ts`
- `src/components/admin/media/AnalysisVersionPicker.tsx`
- `src/components/admin/media/AnalysisActionsBar.tsx`
- `src/lib/format-analysis.ts` (markdown + strukturált szöveg formázók)

**Módosult fájlok**
- `supabase/functions/analyze-image/index.ts` — verzió insert
- `src/components/admin/media/ImageAnalysisPanel.tsx` — verzióválasztó + akciósor
- `src/contexts/AIAssistantContext.tsx` — `attachImageAnalysis`
- `src/components/admin/FloatingAIAssistant.tsx` — kontextus chip megjelenítés
- `src/pages/admin/AdminDocumentChat.tsx` — `?attachDoc` paraméter

## Sorrend
1. Migration (verziók tábla + linked_document_id)
2. `analyze-image` verzió-perziszt
3. `format-analysis.ts` + `AnalysisActionsBar` + vágólap akció
4. `AIAssistantContext` + Floating beemelés
5. `image-analysis-to-doc` edge function + „Új doksi" gomb
6. `AdminDocumentChat` `?attachDoc` támogatás
7. `AnalysisVersionPicker`
