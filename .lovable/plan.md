# Drive: "Come Get it 2.0" scope + rendszerezés & archiválás

## Cél
1. A Google Drive integráció **csak a "Come Get it 2.0"** mappából (és almappáiból) szedjen le fájlokat — minden lista/keresés/elemzés erre szűkül.
2. A mappában lévő **sok régi fájl** átláthatóvá tétele: AI csoportosítás témákba, "elavult" jelölés, és **egy kattintásos archiválás** egy `_Archív` almappába.

## Mit építünk

### 1. Mappa-scope beállítás (admin felület)
- Új admin oldal **/admin/drive/settings** (vagy a `/admin/drive` tetején egy "Mappa beállítás" panel):
  - "Forrás mappa kiválasztása" — egyszer Drive-tallózó: keresd ki a "Come Get it 2.0" mappát, mentés.
  - Mentve a `brand_knowledge` táblába (`key='drive_root_folder'`, value = `{id, name}`) — nincs új tábla.
  - "Auto-archív mappa" automatikusan a kiválasztott mappán belül `_Archív` néven jön létre (ha nem létezik), és eltárolva `drive_archive_folder` kulcs alatt.

### 2. Minden Drive edge function tiszteli a scope-ot
Érintett függvények:
- `drive-list` — minden listázás automatikusan kap egy `'<root>' in parents` (vagy rekurzív leszármazott) szűrőt; a felhasználó nem tud kilépni a scope-ból.
- `drive-analyze-batch`, `drive-fetch-content`, `drive-checklist-fill`, `drive-finalize-doc` — minden `fileId` használat előtt **scope-ellenőrzés**: a fájl szülő-lánca tartalmazza-e a root mappát. Ha nem → 403.
- Új közös helper: `_shared/drive.ts`-ben `getRootFolder(supabase)` + `assertInScope(fileId, rootId)` (parents traverzálás, cache-elve 5 percig memóriában).

### 3. "Rendszerezés" nézet — `/admin/drive` új tab: **Áttekintés**
Egy gombnyomásra (`drive-organize-scan` új edge function):
- Listázza az összes fájlt a root alatt (rekurzívan, max 500).
- AI (Gemini Flash) kategorizál minden fájlt:
  - **theme**: pl. "Pitch deck", "Partner szerződések", "Marketing kreatívok", "Pénzügy", "Termékterv", "Egyéb".
  - **age_signal**: `current` / `stale` / `obsolete` (alapján: `modifiedTime`, név v1/v2/régi-dátum, ismétlődő nevek).
  - **duplicate_group**: ha ugyanaz a téma + hasonló név → csoportazonosító, a legfrissebb a "keeper", a többi `obsolete`.
  - **suggested_action**: `keep` / `archive` / `review`.
- Eredmény mentés új táblába: `drive_inventory` (file_id, name, mime, modified_time, parent_id, theme, age_signal, action, duplicate_group, ai_reason, scanned_at).

UI:
- Csoportosítás téma szerint (collapsible kártyák), minden fájlnál: badge (current/stale/obsolete), AI indok, "📦 Archív" gomb, "👁 Megnyitás", "🗑 Törlés Drive-on" (csak megerősítéssel).
- Felső sorban: "📦 Összes javasolt archiválása" tömeges gomb (mind ami `suggested_action='archive'`).

### 4. Archiválás mechanika
- Új edge function: `drive-archive-files` — input: `fileIds[]`.
- Minden fájlt **átmozgat** a `_Archív/<év>/<téma>` mappába (al-mappákat létrehoz ha kell, pl. `_Archív/2024/Pitch deck`).
- Drive API: `PATCH /files/{id}?addParents=<archiveFolder>&removeParents=<oldParent>`.
- Egy archivált fájl a "Rendszerezés" nézetben halványan, "Visszaállítás" gombbal — ami visszaadja az eredeti szülőbe (eltároljuk az eredeti `parents`-et a `drive_inventory.previous_parent` mezőben).

### 5. Védőkorlátok
- A `_Archív` mappa **része a scope-nak**, de listázásnál külön szekcióba kerül ("Archív (rejtve)" — csak kattintásra látszik).
- Sehol nincs hard delete — minden "törlés" valójában archiválás, kivéve az explicit "Drive-ról törlés" gomb (megerősítő dialóg).

## Sorrend
1. Mappa-scope beállító UI + `brand_knowledge` mentés.
2. Drive edge function-ök scope-érvényesítése (helper + minden hívó).
3. `drive-organize-scan` + `drive_inventory` tábla + UI tab.
4. `drive-archive-files` + tömeges archiválás UI + visszaállítás.

## Megerősítést kérek
- **A "Come Get it 2.0" mappát te választod ki** az új beállító dialógusban (mert csak te látod a saját Drive-ban) — jó így?
- **Archív mappa neve `_Archív`** a kiválasztott mappán belül — jó, vagy más név (pl. `Régi`, `_Archive`)?
- **"Elavult" detektálás**: a "8 hónapnál régebben módosított" + "v1/v2/régi-dátum a névben" + "AI duplikátum-detektálás" hármas elég, vagy szigorítsuk (pl. 12 hónap)?
