# Bugfix + Content Studio 2.0 + Marketing AI Kalendárium

## 1. Bugfix — "uploaded_by" oszlop nem létezik

A `image-analysis-to-doc` edge function `uploaded_by`-t ír be a `documents` táblába, de a tényleges oszlop a `created_by`. **1-soros fix**: `uploaded_by` → `created_by`. Egyúttal `is_ai_generated: true` jelzéssel mentjük.

## 2. Content Studio 2.0

### A. Mentés későbbre + multi-favorite
- **Adatmodell változás**: `content_generations.selected_variants` jelentését bővítjük — `Record<formatKey, number[]>` (több index egy formátum alatt). UI a `Heart` gombbal több variánst is be tud jelölni egy kategórián belül (kék pötty számláló a Card fejlécén).
- **Új tábla: `saved_content_snippets`** — egy-egy konkrét variáns "lementve későbbre" funkció.
  - Oszlopok: `format_key`, `format_label`, `text`, `notes`, `brief`, `persona`, `generation_id`, `tags TEXT[]`, `linked_image_doc_id`, `scheduled_calendar_id` (FK ha be lett ütemezve), `created_by`, timestamps.
  - UI: minden variáns mellett "📌 Mentés" + "🗂 Könyvtár" tab az oldalon, ahol az összes saved snippet listázva, szűrhető formátum / tag szerint.

### B. Képek a posztokhoz
Két új gomb minden variáns mellett:
- **🖼 Médiatárból ajánlj** — új edge fn `match-media-for-post`:
  - Bemenet: `text` (variáns), `format_key`.
  - Lekérdezi a `documents` táblát ahol `mime_type LIKE 'image/%'`, kompakt listát (id, title, ai_description, ai_tags, ai_mood, storage_path) → AI rangsorol (Gemini Flash), visszaad top 5-öt `score`+`reason`-nel.
  - UI: oldalpanel/dialóg mutatja a thumbnails-eket; egy kattintással csatolható a snippethez (`linked_image_doc_id`).
- **✨ Generálj képet** — új edge fn `generate-post-image`:
  - Bemenet: `text`, `format_key`, `style` (auto: insta=4:5, story=9:16, fb=1.91:1, linkedin=1.91:1).
  - AI Gateway `/v1/images/generations`, `openai/gpt-image-2`, `quality: low`, `stream: true`. SSE stream visszamegy a frontend felé (progressive preview).
  - **Brand-aware system prompt**: `brand_knowledge` betöltve → "Come Get It cinematic dark, electric cyan #00bcd4, neon glow, Budapest nightlife, leave clear top-left padding for logo overlay, no text in the image". Tiltott szavak / IP-szabályok érvényesülnek.
  - Mentés a `admin-docs` bucketba `post-images/<user>/<ts>.png`, és `documents` rekord (`is_ai_generated: true`, `ai_description` = az eredeti poszt-text), automatikus csatolás a snippethez.

### C. Logo auto-overlay
- Frontend canvas-helper (`src/lib/compose-with-logo.ts`): bemenet `imageUrl` + `position` (`top-left` default, `bottom-right` opt) + `opacity` → kimenet data URL. A `come-get-it-logo.png` projektben már megvan (`src/assets/come-get-it-logo.png`).
- "Letöltés logoval" gomb minden képnél (eredeti + logózott verzió). Az AI-generált képnél default rákerül a logo a thumbnailre is, hogy realisztikus legyen a preview.

## 3. Marketing Kalendárium + AI asszisztens

### A. Schema bővítés (`marketing_calendar`)
- Új oszlopok: `scheduled_time TIME`, `image_doc_id UUID` (FK documents), `saved_snippet_id UUID` (FK saved_content_snippets), `assistant_rationale TEXT` (miért épp ekkor / itt).

### B. AdminCalendar oldal újragondolva
- **Heti / havi nézet** (CSS grid), kártyák csatornánként színkódolva (IG/FB/LinkedIn/Email).
- Drag & drop nem szükséges — kattintás → "Új poszt" dialóg: dátum/idő/csatorna/típus, snippet választó (saved snippets listából), kép választó (linked media), opcionálisan brief mező → "Generálj most" gomb (Content Studio infrastruktúra).
- Lista nézet: közelgő 14 nap, "Mára" highlight.

### C. AI Marketing Asszisztens (új edge fn `marketing-plan-suggest`)
- Bemenet: `range` (`next_week` / `next_month`), `goal` (opt., pl. "Founding Partner toborzás 5. ker"), `channels` (opt.).
- System prompt: brand_knowledge + Budapest nightlife best practices (IG csü+pé 19-21h, LinkedIn ke-csü 9-11h, stb.) + meglévő scheduled posts (hogy ne ütközzön).
- Kimenet: tervezett poszt-lista — minden elem: `scheduled_date`, `scheduled_time`, `channel`, `type`, `theme`, `brief` (a Content Studio-nak átadható), `rationale`.
- UI panel a kalendárium fölött: "🪄 Generálj tervet a hét/hónap végéig" gomb → eredmény-lista → "Mindet beütemezem" / egyenként szerkeszthető → mentés `marketing_calendar`-ba `status='draft'`-tal.

### D. Floating "Marketing AI" (külön az admin chat-től)
- Kis chat-bubble a kalendárium oldalon → kérdez-felel a tervről ("Mit posztoljak ma este?", "Mit szólnál egy heti retrospektív poszthoz?"). Ugyanaz a Lovable AI Gateway + `marketing_calendar` kontextus.

## 4. Sorrend & megerősítés

**Sorrend** (külön commit-okban):
1. Bugfix (uploaded_by) — perceken belül.
2. Saved snippets tábla + multi-favorite + Saved Library tab.
3. Match-media + generate-post-image edge fn-ek + UI a Content Studioban.
4. Logo overlay helper + letöltés-logoval.
5. Marketing calendar schema bővítés + új naptár UI + marketing-plan-suggest + Marketing AI bubble.

**Megerősítendő**:
- **Logo overlay default pozíció**: top-left, 80px padding, 24% width? (Vagy bottom-right?)
- **AI képgenerátor modell**: `openai/gpt-image-2` (drágább, jobb tipo) vagy `google/gemini-3.1-flash-image-preview` (Nano Banana, gyors & olcsó)? Default: **gpt-image-2** posztokhoz mert kép-minőség kritikus.
- **Marketing-plan időzítések alapja**: helyi Budapest-best-practice heuristika beépítve (nem külső analytics). Ok?

Ha rábólintasz, indulok 1-től lefelé sorban.
