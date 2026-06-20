
# Tömeges feltöltés + AI mappa-rendezés + roadmap folytatás

## 1. Tömeges (mappa) feltöltés

A meglévő "Új" form egyetlen fájlt fogad. Cserélem dropzone-ra ami:

- **Több fájl egyszerre** — `<input multiple>` + drag&drop az egész képernyőre amikor a Média/Doksik tab aktív.
- **Mappa feltöltés** — `webkitdirectory` attribútum második inputon ("Mappa kiválasztása" gomb). A böngésző visszaadja a fájl relatív útját (`webkitRelativePath`, pl. `Nyari_Kampany/cocktail.jpg`), és ebből automatikusan **Come Get It mappa-név** lesz (felső szintű könyvtár). 
- **Új komponens**: `BulkUploadDialog.tsx` — listázza a kiválasztott fájlokat (név, méret, miniatúra ha kép), mindegyik mellett szerkeszthető cím és mappa mező (alapból a fájlnévből / könyvtárnévből kitöltve).
- **Párhuzamos upload progress** — soronkénti progress bar és összesített ("12 / 47 kész"), max 3 párhuzamos upload Storage-be hogy ne lőjük túl.
- **Mime detection** automatikus (`file.type` vagy kiterjesztés alapján), így rögtön a megfelelő tabra kerül (kép/videó/doksi).
- **Hibakezelés** soronként — egy fájl bukása nem állítja meg a többit, retry gomb.
- Sikeres upload után **autom. AI elemzés ajánlás** opció checkbox: "AI elemezze a feltöltöttek után" → batch dialógusba dobja őket.

## 2. AI mappa-rendezés és javaslatok

Új edge function: **`suggest-organization`** — bemenetként megkapja a doksik listáját (id, cím, mime, jelenlegi mappa, ai_description / ai_tags / kulcspontok ha vannak), kimenet:

```json
{
  "suggestions": [
    {
      "doc_id": "uuid",
      "current_folder": "00 — Mappázatlan",
      "suggested_folder": "03 — Nyári kampány",
      "reason": "Cocktail fotók nyári hangulattal, illik a kampány anyagaihoz",
      "confidence": 0.85
    }
  ],
  "new_folders": [
    { "name": "03 — Nyári kampány", "rationale": "5 doksi illene ide" }
  ]
}
```

UI két helyen:

**A) Aktív ajánlás banner** — `/admin/documents` és `/admin/media` oldal tetején, ha van legalább 5 mappázatlan vagy gyanúsan rosszul mappázott elem:

> ✨ Az AI 12 doksinak jobb helyet talált. **[Megnézem]**

Kattintásra megnyílik az **`OrganizationSuggestionsDialog.tsx`**:
- Lista soronként: doksi cím, miniatúra, jelenlegi mappa → javasolt mappa (nyíllal), AI indok, confidence sáv.
- Checkbox-szal elfogadhat / elutasíthat egyenként vagy tömegesen.
- "Áthelyez kijelölteket" gomb → `documents.folder` update.
- "Új mappákat is létrehoz" toggle (új mappák auto-létrejönnek az áthelyezéskor — Supabase-ben nincs külön mappa tábla, csak a `folder` mező az új névvel).

**B) Egyetlen feltöltésnél** — `BulkUploadDialog` végén, mielőtt mentesz: "AI javasol mappákat ehhez a 23 fájlhoz" gomb, ami a fájlnevek + képtartalom alapján csoportosít és kitölti a mappa mezőket előre.

**C) Periodikus emlékeztető** — `AdminLayout` topbarban kis pulzáló pötty a "Doksik" menüpont mellett, ha 7+ napja nem futott rendezés és van >10 mappázatlan elem. (LocalStorage flag `last_org_check_at` hogy ne legyen tolakodó.)

## 3. Az eddigi roadmap-ből most beépítjük

A user "johet sorba ahogy irtad" → a 3. szekció sorrend szerint az első blokk a **Doksi intelligencia** (3.1). Ebből most ebbe az iterációba kerül:

- **Auto-tagging feltöltéskor** — minden új image upload után automatikusan triggereli az `analyze-image`-ot háttérben (toast: "AI elemzi a hátérben…", nem blokkol). Doksiknál az `admin-audit-documents` + `summarize-document` szintén triggerelhető auto-módban (opcionális checkbox a feltöltésnél: "Auto-elemzés bekapcsolva").
- **Duplikátum-figyelmeztetés feltöltéskor** — fájl SHA-256 hash kliens oldalon (Web Crypto API), a `BulkUploadDialog` checkolja a `documents` táblát a hash-re. Új oszlop kell: `file_hash text` + index. Ha találat van, piros badge "Már létezik: X", lehet skip-elni.

A többi pont (verzió-történet, doksi→email konverter, doksi→social poszt, PDF OCR, partner CRM AI, marketing AI, command palette, RAG embeddings stb.) **következő körökben** jön — nem ebben az iterációban, hogy ez ne legyen átfogó.

## Technikai részletek

**Migráció**:
```sql
ALTER TABLE public.documents
  ADD COLUMN IF NOT EXISTS file_hash text;
CREATE INDEX IF NOT EXISTS documents_file_hash_idx ON public.documents(file_hash) WHERE file_hash IS NOT NULL;
```

**Új edge function**: `suggest-organization` (nem streamel, JSON output egyszerre — gyorsabb, és a UI úgyis táblázatként renderel).

**Új komponensek**:
- `src/components/admin/documents/BulkUploadDialog.tsx`
- `src/components/admin/documents/OrganizationSuggestionsDialog.tsx`
- `src/components/admin/documents/OrganizationBanner.tsx`
- `src/lib/file-hash.ts` (Web Crypto SHA-256 helper)

**Módosított fájlok**:
- `src/pages/admin/AdminDocuments.tsx` — "Új" gomb átirányítása a BulkUploadDialog-ra (single fájlhoz továbbra is ott a régi inline mód, de default a bulk), OrganizationBanner beillesztése.
- `supabase/functions/analyze-image/index.ts` — már megvan, csak akkor hívódik auto-módban.

**Konkurencia és rate limit**:
- Upload: max 3 párhuzamos `supabase.storage.upload`.
- Auto AI elemzés: nem azonnal mind, hanem 1-1 másodperc delay-jel kerül a háttér queue-ba (ne kapjunk 429-et).

**Verifikáció**:
- Playwright: nyit `/admin/media`, megnyit BulkUploadDialog, screenshot az üres és kiválasztott állapotról; ellenőrzi hogy a folder banner és Sheet renderel.

## Mit kérdeznél meg utólag?

(Nem blokkoló, csak ha most jelzed építkezünk be:)
- Az auto-AI elemzés legyen alapból **bekapcsolva** vagy **kikapcsolva** új feltöltésnél? *(Javaslat: bekapcsolva képeknél, kikapcsolva nagy doksiknál — kreditkímélés)*
- A duplikátum-egyezésnél **blokkold** az újratöltést vagy csak **figyelmeztess**? *(Javaslat: figyelmeztess, de engedj át — néha szándékos újrafeltöltés)*

Ezekre default választ adok ha nem jelzed, és építünk tovább.
