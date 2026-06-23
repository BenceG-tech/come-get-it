## Mit javítok

### 1) `AdminDocuments` mobil header elcsúszás
A képen látható probléma: a „Dokumentumok" cím mellé 7 akciógomb van pakolva (`Chat`, `AI rendezés`, `AI audit`, `AI cimkék + embed`, `Audit lista`, `Tömeges`, `Egy fájl`). Mobilon ezek ikonra esnek vissza (`sm:inline` elrejti a szöveget), wrap-elnek, és a cím-oszlop annyira összemegy, hogy a felirat („51 elem · 11 mappa…") szóról szóra törik. A wrap-elt ikonok pedig a cím *mögé* csúsznak az `items-start` miatt.

Megoldás:
- Áttérek az egységes `PageHeader` komponensre.
- Mobilon (`<md`) csak **2 elsődleges gomb**: `+ Egy fájl` (neon) és egy `⋯` (MoreHorizontal) dropdown menü, amibe bekerül a többi 5 művelet (Chat, AI rendezés, AI audit, AI cimkék, Audit lista, Tömeges).
- Desktopon (`md:`) marad az összes gomb külön, de szövegekkel (most ikonok és „hidden sm:inline" szöveg keveredik — letisztítom).
- A cím-oszlopra `min-w-0 flex-1` kerül, hogy a subtitle ne törjön szavanként.
- `PageIntro` chip a `PageHeader`-be megy (egyszer jelenik meg, nem duplán).

### 2) PDF előnézet iOS Chrome / Safari alatt
Jelenleg `<object data="…pdf">` — iOS Safari / iOS Chrome **nem** renderel inline PDF-et `<object>` vagy `<iframe>` elemben (csak natív Safari viewerben, új lapon). Ezért látszik üresen.

Megoldás:
- **Mobil / iOS detektálás**: ha iOS vagy a viewport `<768px`, **nem** `<object>`-et használok, hanem a `pdfjs-dist` (már Lovable-friendly, ESM) segítségével az **első 2 oldalt képként** renderelem canvasből → `<img>`-ek egy `Card`-ban. Így minden mobil böngészőben látszik az előnézet. Mellé „Megnyitás új lapon" + „Letöltés" gomb.
- Desktopon marad az `<object>` (Chrome/Edge/Firefox jól kezeli), de fallback ágként ott is van canvas-render gomb („Mégse jó? Renderelj képként").
- `pdfjs-dist` worker: Vite-kompatibilis import (`pdfjs-dist/build/pdf.worker.min.mjs?url`).
- Új komponens: `src/components/admin/documents/PdfCanvasPreview.tsx` — lazy-loadolja a `pdfjs-dist`-et, hogy a fő bundle ne hízzon.

### 3) Általános mobil ellenőrzés ezen az oldalon
- `pb-40` már megvan az alsó nav alatti scrollhoz, marad.
- A fenti header-tisztítás után a teljes lap végig görgethető és minden látszik 375–402 px szélességen is.

## Érintett fájlok
- `src/pages/admin/AdminDocuments.tsx` — header refaktor (PageHeader + overflow menü), `PageIntro` eltávolítása onnan (PageHeader adja).
- `src/pages/admin/AdminDocumentViewer.tsx` — PDF rész kicserélése iOS-aware logikára.
- **Új**: `src/components/admin/documents/PdfCanvasPreview.tsx` — pdfjs-canvas előnézet.
- `package.json` — `pdfjs-dist` (ha még nincs).

## Amit NEM csinálok most
- Nem nyúlok a doksi-listához, fülekhez, szűrőkhöz, feltöltéshez — csak a header és a PDF-preview.
- Nem módosítok edge functiont vagy DB-t.
- Más admin oldalakat nem érintek ebben a körben.
