# Terv: AI doksi review + Google Drive integráció + UI tisztítás

## 1. "Kanban" → magyar elnevezés
- Korábbi roadmapban "Kanban view" volt a partnereknél. Magyar nevek amik közül választok az implementációnál: **"Táblanézet"** (oszlopok = státuszok, kártyák = partnerek). Most még nem építem meg, csak rögzítem hogy ha jön, ezen a néven fut.

## 2. Doksi Review gomb (AdminDocumentViewer)
- Új gomb a doksi nézetben: **"AI review"** (a már létező "AI tartalom" mellett).
- Megnyit egy `DocumentReviewDialog`-ot. Az AI streamelve végigmegy 4 fókuszon és mindegyikhez ad pontszámot (1-10) + konkrét észrevételeket:
  1. **Tartalmi pontosság** — ellentmondások, hiányzó adatok, elavult részek
  2. **Brand & hangnem** — Come Get It magyar tegező, energikus stílus
  3. **Jogi/üzleti kockázat** — ÁSZF / partner-megállapodás kockázatos pontok
  4. **Marketing erő** — hol lehetne ütősebb, gyengébb mondatok
- Új edge function: `review-document` (SSE streaming, hasonló a `summarize-document`-hez).
- Eredmény mentve: új `documents.ai_review` (jsonb) + `last_reviewed_at` oszlopok, hogy ne kelljen újra futtatni.

## 3. Google Drive integráció (admin-only)
- Linkelem a `google_drive` connector-t a saját Drive fiókodhoz.
- **Nem importáljuk** automatikusan a doksikat (te kérted így), csak böngészhető és AI-jal feldolgozható.
- Új admin oldal: `/admin/drive` — Google Drive böngésző:
  - Mappa fa + fájllista (név, módosítás dátuma, méret, típus)
  - Keresés mező (Drive `q=` query)
  - Multi-select fájlok + sávban gombok: **"AI elemzés"**, **"Hasonlítsd össze"**, **"Checklisthez társítsd"**
- Edge functions (mind admin auth + gateway hívás):
  - `drive-list` — mappa/keresés listázás
  - `drive-fetch-content` — egy fájl tartalmának letöltése (Docs/Sheets/Slides export plain text-re, PDF/Word raw)
  - `drive-analyze-batch` — kiválasztott fájlokat végigmegy, kivonatolja és AI-jal:
    - **Ellentmondás-detektor**: hasonló témájú párokat (pl. 2 ÁSZF verzió) összehasonlít, listázza a konkrét eltéréseket
    - **Kérdés-generátor**: a homályos / elavult / kétséges pontokra konkrét kérdéseket ír neked
    - Eredmény streamelve jön vissza + mentve egy új `drive_analyses` táblába (futtatás, érintett fájlok, JSON eredmény)
  - `drive-checklist-fill` — checklist item-ekre rákeres a Drive-ban, ami releváns infót talál, megjelöli (nem írja felül a checklist-et automatikusan, csak javaslatot ad amit jóváhagysz)
  - `drive-finalize-doc` — egy téma (pl. "végleges ÁSZF v2.0") alapján a kiválasztott Drive forrásokból új, konszolidált verziót generál, amit letölthetsz `.md` / `.docx` formában (Drive-ba is visszaírható ha kéred, de alap: helyben letöltés)

## 4. Beszélgetős "Drive Q&A" felület
- Az `/admin/drive` oldal alján chat panel: az AI a kiválasztott Drive fájlok kontextusával válaszol, és proaktívan tesz fel neked kérdéseket amikor ellentmondást talál. Te válaszolsz, ő a választ rögzíti egy "döntésnapló"-ba (új `drive_decisions` tábla) — így a következő iteráció már tudja a már eldöntött kérdéseket.

## 5. Master checklist integráció
- A `/admin/checklist` oldalon minden item mellé új mini gomb: **"Drive-ban keresd meg"** → meghívja a `drive-checklist-fill`-t csak arra az itemre, és felajánl 3-5 forrást amit elfogadhatsz.

## Technikai részletek

### Új edge functions
- `review-document` (SSE)
- `drive-list`, `drive-fetch-content`, `drive-analyze-batch` (SSE), `drive-checklist-fill`, `drive-finalize-doc`
- Mind `Lovable-managed`, admin role check, `google_drive` connector gateway-en keresztül.

### Új DB
```sql
ALTER TABLE documents
  ADD COLUMN ai_review jsonb,
  ADD COLUMN last_reviewed_at timestamptz;

CREATE TABLE drive_analyses (
  id uuid pk, run_at, kind text, source_file_ids jsonb,
  result jsonb, created_by uuid
);
CREATE TABLE drive_decisions (
  id uuid pk, question text, answer text, topic text,
  source_file_ids jsonb, decided_at, decided_by
);
```
Mindkettő admin-only RLS, GRANT-tel.

### Új komponensek
- `DocumentReviewDialog.tsx`
- `pages/admin/AdminDrive.tsx`
- `components/admin/drive/DriveBrowser.tsx`, `DriveAnalysisPanel.tsx`, `DriveChatPanel.tsx`
- AdminLayout-ba új menüpont: **"Google Drive"** + Command Palette-be.

### Connector
- `standard_connectors--connect` `google_drive` connector-rel → te bejelentkezel a saját Drive fiókodba egyszer.

## Sorrend
1. "Kanban" eldobás (csak megjegyzem, nem építjük most)
2. Review gomb + migration + dialog
3. Google Drive connector link kérése tőled
4. Drive browser oldal + list/fetch
5. Analyze batch (ellentmondás + kérdések) + decisions napló
6. Checklist Drive-keresés integráció
7. Finalize-doc generátor

Mehet?