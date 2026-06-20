
# AI láthatóság, képelemzés és admin roadmap

## 1. Doksi feldolgozás — élő AI progress

Most a `summarize-document` egy `generateText` hívás, nincs visszajelzés. Kétféle mód:

**A) Egyesével — streamelt gondolkodás**
- `summarize-document` átírása `streamText`-re, `toUIMessageStreamResponse()`-szal.
- `DocumentSummary.tsx`: `useChat` helyett közvetlen `fetch` + ReadableStream olvasás, és élőben jelenítjük meg a TL;DR-t, kulcspontokat, FAQ-t ahogy generálódik (shimmer "Elemzés..." → token-by-token szöveg).
- Végén `onFinish`-ben mentés a DB-be (`tldr`, `key_points`, `faq`, `suggested_questions`, `last_summarized_at`).

**B) Batch mód — több doksi sorban**
- Új gomb a Doksik fülön: **"AI elemzés a kijelöltekre"** (a meglévő selection bar mellé).
- Új `AdminDocumentBatchProcess.tsx` panel / dialog:
  - Lista a kijelölt doksikról, mindegyik mellett státusz: `Várakozik` → `Feldolgozás...` (spinner) → `Kész` (pipa) / `Hiba` (piros + retry).
  - Progress bar összesítve (`3 / 12 kész`).
  - Élő log-szerű feed: "📄 Founding Pitch.pdf — kulcspontok kinyerése..." aktuálisan futó doksinál streamelt szöveg-előnézet.
  - Sorrendben fut (kliens oldalon `for await`), egyszerre 1 doksi, hogy ne lőjük túl a rate limitet. Opció: párhuzamosság 1/2/3.
- Megszakítás gomb (`AbortController`).

## 2. Képek — AI képelemzés és javaslatok

Új edge function: **`analyze-image`** (`google/gemini-3-flash-preview`, multimodal `image_url` blokkal a signed URL-lel).

Output struktúra (Zod-szal validálva):
```
{
  description: string,           // mit lát a képen, magyarul
  suggested_alt: string,         // SEO-barát alt text
  suggested_caption: string,     // social/marketing caption (Hungarian, tegező)
  use_cases: string[],           // pl. "Instagram story", "Landing hero", "Partner deck slide 3"
  suggested_copy: {              // kész szövegjavaslatok
    instagram: string,
    facebook: string,
    landing_headline: string,
  },
  tags: string[],                // pl. ["cocktail", "neon", "bar"]
  mood: string,                  // "energikus, esti", stb.
  dominant_colors: string[],     // hex értékek
}
```

UI a Képek tabon és a `/admin/media` galérián:
- Minden képkártyán **"AI javaslatok"** gomb (Sparkles ikon).
- Kattintásra oldalsó Sheet / Drawer nyílik, streamelt elemzés (látszik, ahogy az AI ír).
- Eredmény mentődik a `documents` táblába új mezőkbe: `ai_description`, `ai_suggested_alt`, `ai_use_cases jsonb`, `ai_suggested_copy jsonb`, `ai_tags text[]`, `ai_mood text`, `ai_dominant_colors text[]`, `ai_analyzed_at timestamptz`.
- "Másolás" gomb minden szövegjavaslat mellett.
- Lightbox-ban is megjelenik az elemzés panel oldalt.

Videókra: első frame snapshot (`ffmpeg`-et nem futtatunk böngészőben, ezért egyelőre csak a thumbnail-t küldjük az AI-nak, vagy később külön edge function-ben generálunk frame-et).

## 3. További admin ötletek és roadmap

Részletes lista, amiből választhatsz mit építsünk legközelebb:

### 3.1 Doksi intelligencia
- **Auto-tagging**: AI minden új feltöltésnél automatikusan címkéz + kategorizál (`documents.ai_tags`, `ai_category_suggestion`). Feltöltés után toast: "AI 5 címkét javasol — elfogadod?".
- **Duplikátum-érzékelés**: embedding alapú hasonlóság (pgvector), figyelmeztetés ha 90%+ egyezés.
- **Verzió-történet**: doksi szerkesztésnél diff nézet, korábbi verziók visszaállítása.
- **Doksi → email sablon konverter**: jelöljünk ki egy doksit, AI generál belőle `email_templates` bejegyzést (a meglévő tábla használatával).
- **Doksi → social poszt**: pitch deck-ből Instagram carousel szöveg, LinkedIn poszt, X thread.
- **PDF OCR**: szkennelt PDF-eknél szöveg kinyerés (Gemini multimodal natívan tudja).

### 3.2 Partner CRM bővítés (`partners`, `partner_interactions`, `partner_emails`)
- **AI partner-briefing**: gombnyomásra összegzi az adott partnerről eddig tudottakat (interakciók, küldött doksik, válaszok) — "Bence, ezt mondd a következő hívásnál".
- **Email-generátor**: a partner státusza + utolsó interakció + kiválasztott doksi alapján személyre szabott email draft, küldés előtt szerkeszthető.
- **Hot-lead score**: AI 0–100 pontot ad minden partnernek, magyarázattal (mennyire valószínű hogy aláír).
- **Follow-up emlékeztetők**: "X partnerrel 14 napja nem volt interakció — küldjek emlékeztetőt?" napi digest emailben.
- **Kanban nézet**: lead → kontaktálva → tárgyalás → szerződés → élő, drag&drop státuszváltás.

### 3.3 Marketing naptár (`marketing_calendar`)
- **AI tartalom-tervező**: adott hétre/hónapra AI javasol poszt-ötleteket (téma, csatorna, copy draft, képjavaslat a /admin/media tárból).
- **Hashtag + best-time-to-post javaslatok**.
- **Naptár export**: ICS fájl letöltés, Google Calendar sync.

### 3.4 Waitlist + Venue applications
- **Heti AI riport**: hány új feliratkozó, honnan, melyik város a legaktívabb, sentiment.
- **Vendéglátóhely-pontszámozás**: `venue_applications`-ből AI rangsorol, kinek érdemes először felhívni (méret, lokáció, kitöltött mezők minősége alapján).
- **Auto-válasz**: új jelentkezésnél AI személyre szabott "köszi" email a Resend-en keresztül.

### 3.5 Admin UX
- **Globális command palette** (Cmd+K): bárhonnan kereshető doksi, partner, oldal, gyors akció.
- **Dashboard widget-ek**: KPI kártyák — feliratkozók ma/hét/hónap, partner pipeline érték, doksi feldolgozás státusz.
- **Aktivitás-feed**: ki mit csinált utoljára (több admin esetén).
- **Mobil-optimalizált admin**: jelenleg több hely nem mobil-barát.
- **Sötét/világos téma** admin felületre (jelenleg fix sötét).

### 3.6 AI infrastruktúra
- **Embeddings + pgvector**: doksi chunkolás, valódi RAG a chat-ben (most kontextusként az egész tartalom megy be — nagy doksinál drága).
- **Cost tracking**: hány Lovable AI credit ment el / nap / funkció szerinti bontásban admin dashboardon.
- **Audit log**: minden AI hívás (kérés, válasz, költség) `ai_call_log` táblában.

## 4. Most mit építsünk ebben az iterációban

Javaslat (jóváhagyásra):
1. ✅ **Streamelt summarize** (1A) — láthatod ahogy ír
2. ✅ **Batch processing UI** (1B) — több doksi sorban progress bar-ral
3. ✅ **Képelemzés** (2) — `analyze-image` edge function + UI + DB migráció

A 3-as szekció további pontjait külön körökben építjük — jelezd melyik 2-3 érdekel legjobban a következő iterációhoz (CRM AI? Command palette? Marketing AI? RAG embeddings?).

## Technikai részletek

**Migráció** (új oszlopok a `documents` táblához):
```sql
ALTER TABLE public.documents
  ADD COLUMN ai_description text,
  ADD COLUMN ai_suggested_alt text,
  ADD COLUMN ai_suggested_caption text,
  ADD COLUMN ai_use_cases jsonb,
  ADD COLUMN ai_suggested_copy jsonb,
  ADD COLUMN ai_tags text[],
  ADD COLUMN ai_mood text,
  ADD COLUMN ai_dominant_colors text[],
  ADD COLUMN ai_analyzed_at timestamptz;
```

**Edge functions**:
- `summarize-document` átírás `streamText` + `toUIMessageStreamResponse` mintára (CORS megtartva)
- `analyze-image` új — multimodal `image_url` content block, signed URL-lel a Storage-ból

**Új komponensek**:
- `src/components/admin/documents/BatchProcessDialog.tsx` — sor-státusz lista, progress, abort
- `src/components/admin/media/ImageAnalysisPanel.tsx` — Sheet, streamelt elemzés, copy gombok
- `DocumentSummary.tsx` refaktor: stream fogadás `fetch` + reader.read() loop, részleges parse

**Verifikáció**: Playwright headless 1280×1800-on, batch dialog megnyit, lefuttat 2 doksit, screenshot a progress bar-ról és a kész állapotról; majd egy képnél megnyitja az AI panelt és ellenőrzi a streaming-et.
