# Dokumentumközpont upgrade — NotebookLM-stílus

## 1. Hiba: üres oldal a "Megnyitás" után

**Ok:** A `AdminDocumentViewer` PDF-eket `<iframe>`-ben próbál megnyitni, de iOS Safari (mobil) gyakran nem renderel signed Supabase Storage URL-eket beágyazva → fehér iframe. Emellett az `openExternal` `storage_path`-t nyitja direkt (nem URL), bár ez most már a Linkre vezet — viewer szinten a baj.

**Javítás:**
- `AdminDocumentViewer`-ben mobilon ne iframe-eljük a PDF-et: detektáljuk a mobilt (`navigator.userAgent` vagy `matchMedia("(max-width: 768px)")`), ha mobil → azonnal nyissuk meg új lapon `window.open(signedUrl)` + adjunk vissza "Megnyitás új lapon" / "Letöltés" gombokat (ne üres iframe).
- Desktopon megmarad az iframe, de hozzáadunk PDF.js fallback üzenetet ha nem töltődik 3 mp-en belül.
- A `Megnyitás` gomb a listában: mobilon közvetlenül signed URL-t generál és új tabon nyit (PDF-eknél), így átugorja a viewert. Doc/text esetén marad a viewer route.
- `mime_type` null-ok kezelése: file kiterjesztésből kikövetkeztetjük (`.pdf`, `.jpg`, `.mp4`…).

## 2. Külön Média szekció (képek + videók)

**Útvonal:** új `/admin/media` oldal (`AdminMedia.tsx`) + a fő Dokumentumok oldalon új füllista: **Doksik / Képek / Videók**.

- Új menüpont a sidebarban: "Média" (Image ikon).
- Galéria-grid (2 oszlop mobil, 4 desktop) thumbnailekkel.
- Képek: inline `<img>` preview, koppintásra lightbox (Dialog).
- Videók: `<video controls preload="metadata">` poszterrel, koppintásra full-screen modal.
- Szűrők: típus (kép/videó/gif), mappa, kereső.
- Feltöltés: ugyanaz a flow mint a doksiknál (azonos `documents` tábla + `admin-docs` bucket), de a category-ba `image` / `video` kerül.

A **doksik oldalon** tab-bar:
- 📄 Doksik (PDF, doc, txt, md)
- 🖼️ Képek (image/*)
- 🎬 Videók (video/*)

Szűrés mime_type alapján kliens oldalon.

## 3. Szerkesztés (cím, leírás, tartalom, mappa, kategória)

Minden doksi kártyán új **"Szerkesztés"** gomb (Pencil ikon). Inline drawer/dialog megnyit egy formot:
- title, folder, category, description, when_to_use, content (Textarea)
- Mentés → `supabase.from("documents").update(...).eq("id", d.id)` → `load()` + toast.
- Markdown editor a content mezőhöz (egyszerű textarea + preview tab; `react-markdown` már elérhető vagy hozzáadjuk).

Bulk műveletek: kijelölt doksikra **mappa-áthelyezés**, **kategória-váltás**, **törlés** (kibővítjük a meglévő selection action bart).

## 4. NotebookLM-szerű AI funkciók

### a) Chat a doksikkal (RAG-lite)
- Új edge function: `chat-with-documents` (Lovable AI Gateway, gemini-3-flash).
- Input: `{ documentIds: string[], message: string, history: Message[] }`.
- Server: lehúzza a `content` mezőt + szükség esetén PDF-eket szöveggé alakít (jelenleg `content` mezőre építünk, mert már audit használja). Promptba beemeli system: "Csak a megadott doksikból válaszolj, idézz forrást [doc:title]."
- Streamelt válasz a `streamText` + `toUIMessageStreamResponse`-szal.
- UI: új panel `/admin/documents/chat` (vagy a meglévő FloatingAIAssistant kibővítése) — kijelölt doksik chipekként látszanak, alatta chat (AI SDK `useChat`).

### b) Automata összefoglaló + kulcspontok
- Új edge function: `summarize-document` (egyszerű generateText).
- Output: `{ tldr, keyPoints[], faq[], suggestedQuestions[] }` (Output.object zod schema).
- Új oszlopok a `documents` táblába (migration): `tldr text`, `key_points jsonb`, `faq jsonb`, `last_summarized_at timestamptz`.
- A doksi kártyán új gomb "AI összefoglaló" — kattintásra hívja, cache-eli a tábla mezőkbe. Megjelenítés: expandable szekció a kártyában.
- Tömeges audit gomb kibővítve: ha új doksi → összefoglaló is generálódik az értékelés mellett.

### c) Mindmap / kapcsolatok
- Új oldal `/admin/documents/map`.
- Edge function `document-graph`: AI elemzi a kijelölt doksik metaadatát (címek + tldr + folder + category) és visszaad `{ nodes: [{id, label, group}], edges: [{from, to, label}] }`.
- Render: lightweight SVG force-graph (saját kis komponens framer-motion-nel, vagy `react-flow` ha hozzáadható — preferált `react-flow` kis bundle: `@xyflow/react`).
- Csomópontra kattintva oldalsó panelben a doksi adatlapja + "Megnyitás" / "AI chat ezzel" gombok.

## 5. UI/UX (Neon Fidelity-konzisztens)

- Új Tab komponens (shadcn `Tabs`) cyan aktív indikátorral.
- Pill-shaped gombok, `bg-electric-300` akcentek.
- Mobil-first: tab bar sticky a viewport tetején, lightbox bottom-sheet stílusú.
- Lightbox: `Dialog` overlay-jel, képnél pinch-zoom natívan (CSS `touch-action: pinch-zoom`).

---

## Műszaki részletek

**Új fájlok:**
- `src/pages/admin/AdminMedia.tsx`
- `src/pages/admin/AdminDocumentChat.tsx`
- `src/pages/admin/AdminDocumentMap.tsx`
- `src/components/admin/documents/DocumentEditDialog.tsx`
- `src/components/admin/documents/MediaLightbox.tsx`
- `src/components/admin/documents/DocumentTabs.tsx` (Doksi/Kép/Videó switcher)
- `src/components/admin/documents/DocumentSummary.tsx`
- `supabase/functions/chat-with-documents/index.ts`
- `supabase/functions/summarize-document/index.ts`
- `supabase/functions/document-graph/index.ts`

**Migration:**
```sql
ALTER TABLE public.documents
  ADD COLUMN IF NOT EXISTS tldr text,
  ADD COLUMN IF NOT EXISTS key_points jsonb,
  ADD COLUMN IF NOT EXISTS faq jsonb,
  ADD COLUMN IF NOT EXISTS last_summarized_at timestamptz;
```
(Nem új tábla → GRANT nem kell.)

**Módosítandó fájlok:**
- `src/pages/admin/AdminDocuments.tsx` — tabok, edit gomb, bulk ops, mobil-friendly megnyitás
- `src/pages/admin/AdminDocumentViewer.tsx` — mobil detektálás, PDF fallback
- `src/components/admin/AdminLayout.tsx` — új menüpontok (Média, Doksi chat, Mindmap)
- `src/App.tsx` — új admin route-ok

**Függőségek:** `@xyflow/react` (mindmap), `react-markdown` (ha még nincs telepítve).

**Verifikáció:** Playwright headless chromiummal mobile viewporton (402×701) belépés (admin session env), `/admin/documents` betöltés, "Megnyitás" tap → ellenőrizzük hogy `window.open` hívódott vagy a PDF megjelenik. Screenshot.

---

## Sorrend (ha jóváhagyod, ebben az iterációban mind)

1. Megnyitás-hiba javítása (gyors win)
2. Doksi szerkesztés dialog
3. Tab szűrő (Doksi/Kép/Videó) + Média oldal
4. AI összefoglaló (migration + edge function + UI)
5. Chat a doksikkal (edge function + UI)
6. Mindmap

Ha túl nagy egy körben, jelöld melyiket vegyem ki — különben mindet egyben tolom.