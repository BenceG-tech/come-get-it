# Javítások — recept hibák + doksi review egyszerűsítése

## 1. `partners.contact_person does not exist` — kritikus hibajavítás

A `task-run-recipe` edge function nem létező oszlopra hivatkozik. A `partners` táblán a valódi oszlop neve `contact_name`.

**Mit teszünk:** `supabase/functions/task-run-recipe/index.ts`-ben minden `contact_person` előfordulást átírunk `contact_name`-re (3 hely: select, result_item, followup body fallback). Ez azonnal megoldja az „Email kampány előkészítése partnerkereséshez" feladat hibáját.

## 2. Inbox nincs többé tele „Doksi review kell" itemekkel

A `inbox-collect` edge function minden olyan dokumentumot bejelöl review-ra, amelynek nincs `ai_review` mezője — beleértve a képeket és üres doksikat is. Ezért tele van az inbox értelmetlen review-feladatokkal, sőt egy részük szöveges tartalom hiánya miatt nem is futtatható le.

**Mit teszünk:**

- **`supabase/functions/inbox-collect/index.ts`** — kivesszük az 5-ös blokkot (`doc_review_needed`). A doksi review nem inbox-feladat, hanem háttérben futó automatizmus.
- **Egyszeri takarítás:** migration, ami töröl minden már létező `doc_review_needed` kind-ú nyitott inbox itemet (`delete from inbox_items where kind='doc_review_needed'`). Így a felhasználó inboxa azonnal letisztul.

## 3. AI automatikus doksi review

Új edge function: **`auto-review-documents`**. Lefut háttérben (nem chat, nem UI), és bejelölt doksikat egyenként review-ol.

- Csak olyan doksit dolgoz fel, aminek **van `content` vagy `description`** és **még nincs `ai_review`**. Képeket / üres doksikat kihagy (azokhoz külön `image-analyze` van).
- Egy hívás max 10 doksit dolgoz fel batch-ben, sorban, hogy ne robbantsa szét a rate limitet.
- Ugyanazt a logikát használja, mint a `review-document` (system prompt + Lovable AI Gateway), csak nem stream-el, hanem mentési vég eredményt ír a `documents.ai_review`-ba.

**Indítás módja** (két helyről):

1. **Manuálisan, egy gombbal** a Dokumentumok oldalról — új gomb a header mellé: **„AI review az összesre"**. Megnyitja az új `BulkReviewDialog`-ot ami:
   - Megmutatja hány doksi vár review-ra (van content, nincs ai_review).
   - Indítás után progress bar (X/Y kész).
   - Hívja az `auto-review-documents` functiont batch-elve, amíg el nem fogy a queue.
2. **Automatikusan** új doksi feltöltésekor — az új `auto-review-documents` function chain-elhető, de első körben a manuális trigger a fókusz; az automatikust egy következő iterációban kötjük rá az `upload-document`-re, hogy ne keverjük most a scope-okat.

## 4. Egyszerűsített „AI csinálja" — eldobjuk a túlbonyolítást

A felhasználó panasza: túl sok cél/loop fogalom, az AI vagy hülyeséget csinál, vagy elakad. A jelenlegi recept-rendszer már jó irányba ment, de pár sallang maradt:

- **Custom branch elhagyása user-szintről:** ha a classifier `custom`-ra esik, ne dobjon udvariaskodó hibaüzenetet, hanem **kötelezően essen vissza `research`-re** (lead lista). Inkább adjon konkrét leadeket, mint hogy „nem tudom mit csinálj".
- **Progress label egyszerűsítés:** csak 3 fix lépés címke recipenként (Keresés / Készítés / Kész), nincs többé „Feladat osztályozása…" mikrofázis a UI-on — a klasszifikáció a háttérben fut.
- **TaskResultDialog DialogDescription warning fix:** mindig adjunk értelmes leírást (pl. recipe label) — a kép is ezt mutatja (`Missing Description` warning).

Semmilyen új ReAct/agent loop. Ami most van: klasszifikál → fix pipeline → kártyák. Marad. Csak a hibákat húzzuk ki belőle.

## Érintett fájlok

- `supabase/functions/task-run-recipe/index.ts` — `contact_person` → `contact_name`, custom→research fallback, label egyszerűsítés
- `supabase/functions/inbox-collect/index.ts` — `doc_review_needed` blokk törlése
- `supabase/functions/auto-review-documents/index.ts` — **új**, batch-es háttér review
- `src/components/admin/documents/BulkReviewDialog.tsx` — **új**, progress UI a tömeges review-hoz
- `src/pages/admin/AdminDocuments.tsx` — új „AI review az összesre" gomb a header mellé, dialog megnyitása
- `src/components/admin/dashboard/TaskResultDialog.tsx` — fallback DialogDescription, ne legyen warning
- Migration: nyitott `doc_review_needed` inbox itemek törlése

## Kívül marad (külön kérés esetén csináljuk)

- Auto-trigger doksi feltöltésnél (`upload-document` chain)
- Bulk review újrafuttatása már review-olt doksikra (most csak a hiányzókat csinálja)
- Image doksik külön „AI elemzés" bulk gombja — már létezik `image-analyze`, csak nincs bulk; jelezd ha kell.
