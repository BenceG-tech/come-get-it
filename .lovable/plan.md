# Sticky AI + multi-context + voice + Instagram

## 1. Sticky AI chatbot az egész adminon

- Új `FloatingAIAssistant` komponens, beágyazva az `AdminLayout`-ba — minden admin oldalon megjelenik jobb alsó sarokban (cyan körgomb, neon-glow).
- Kattintásra panel nyílik (desktop: 420×620 dock jobb oldalt, mobil: full-screen sheet).
- Tartalmaz: thread-választó (kis dropdown a fejlécben), Önellenőrző toggle, mikrofon, +Kontextus gomb, üzenetek, input.
- Ugyanazt a `ai_conversations` / `ai_messages` táblát + `admin-ai-chat` edge function-t használja, mint a `/admin/ai` oldal — ez a "kis ablak" verziója, a full oldal megmarad nagyobb munkához.
- A jelenlegi route-on dolgozik: a context bar mutatja "Most látott: Főoldal pitch (doksi)" és automatikusan átadja a doksi ID-t az AI-nak.

## 2. Multi-context: doksik + képek kijelölése az AI-nak

- A `/admin/documents` oldalon minden doksi-kártyán **checkbox** (bal felső sarok).
- Több kijelölés után megjelenik egy lebegő action bar: `3 kijelölve · AI-val dolgozz velük · Letöltés · Tagek`.
- "AI-val dolgozz velük" → megnyitja a sticky asszisztenst, automatikusan beírja a kontextusba: `📎 3 doksi csatolva: Főoldal pitch, ÁSZF v2, Marketing terv`.
- Ugyanez kép-oldalon (Brand Media — most készítjük el): kép-grid, checkbox, kijelölés → AI látja (multimodal, Gemini vision).
- **Vegyes:** doksi + kép egyszerre csatolható (pl. "ezekből a képekből és ebből a pitchből csinálj IG karusszelt").
- Edge function bővítés: `messages` mellé `context: { docIds: [], mediaIds: [] }` mező → szerver letölti és a promptba injektálja (PDF szöveg + képek base64 image_url-ként Gemini-nek).
- Inline szerkesztés: az AI válaszán "Mentsd új doksinak" gomb → automatikusan létrehoz egy markdown doksit az `admin-docs` bucketbe, megnyitható szerkesztésre.

## 3. Doksik értékelésének láthatósága + AI-pontozás

- A `/admin/documents` lista minden kártyán mutassa: **csillag-ikon + szám** (`★ 8.5/10`), színkód (zöld 8+, sárga 5-7, piros <5, szürke még nem értékelt).
- Hover/tooltip: rövid AI-indoklás (`quality_notes` mező — már van DB-ben).
- Új "Audit" gomb a doksi-listán: AI végigfut az összes még nem értékelt doksin (PDF szöveg-kinyerés → Gemini-nek pontozza 6 dimenzió szerint: tartalmi mélység, struktúra, magyar nyelv, brand-konzisztencia, célzottság, frissesség). Eredmény: `quality_score`, `quality_notes`, duplikátum-javaslat.
- Szűrő-sáv: `Mind / Magas (8+) / Közepes / Alacsony / Nincs értékelve / Duplikátumok`.
- Doksi-megnyitásnál (viewer): jobb oldali panel az értékeléssel + "Újraértékelés" gomb + "Javasolj jobb verziót" gomb.

## 4. Diktálás (hangbevitel) a chat-be

- Mikrofon-gomb a chat input mellett (sticky és `/admin/ai` oldalon is).
- Lenyomva → `MediaRecorder` (webm/mp4 auto-detect böngésző szerint) felvesz, elengedéskor felmegy egy új `admin-transcribe` edge function-re.
- Edge function: Lovable AI `openai/gpt-4o-mini-transcribe` (magyar nyelv), streaming → részleges szöveg élőben jelenik meg az inputban.
- Záróesemény után a szöveg ott marad az inputban, a user még szerkesztheti küldés előtt (vagy `Auto-küldés` toggle bekapcsolva azonnal küldi).
- Vizuális visszajelzés: pulzáló piros pötty + élő hangszint-bar felvétel közben.

## 5. Instagram összekötés (lépcsőzetesen)

**Most (1. lépés — kódolható, API nélkül):**
- Új admin oldal: `/admin/instagram`.
- "Saját IG handle" + "Versenytárs handle-ek" beviteli mezők (mentve egy új `instagram_accounts` táblába, admin-only RLS).
- Heti screenshot-feltöltés: feltöltöd a követőid / követéseid / posztjaid screenshotjait → AI (Gemini vision) kiolvassa: kit követsz, ki követ, posztolási ritmus, témák, hashtag stratégia.
- Eredmény mentve `instagram_insights` táblába (handle + AI elemzés + dátum).
- Sticky AI látja ezt: ha kérdezed "kik közül kéne először a founding partner ajánlatot megküldenem?", az IG insights alapján javaslatot ad.

**Később (2. lépés — külön blokk, csak ha jóváhagyod):**
- Meta Graph API + Instagram Business Login: valódi automatikus szinkron (követők, követések, DM-ek olvasása). Ehhez 2-4 hét Meta app review kell — most nem indítjuk el, csak előkészítjük az adatmodellt.

## Technikai részletek

**Új fájlok:**
- `src/components/admin/FloatingAIAssistant.tsx` — sticky panel
- `src/components/admin/AIContextBar.tsx` — csatolt doksik/képek chipek
- `src/components/admin/VoiceRecorderButton.tsx` — diktálás
- `src/components/admin/DocumentRatingBadge.tsx` — csillag-ikon kártyán
- `src/pages/admin/AdminInstagram.tsx` — IG insights oldal
- `supabase/functions/admin-transcribe/index.ts` — STT proxy
- `supabase/functions/admin-audit-documents/index.ts` — batch doksi-pontozás
- `supabase/functions/admin-analyze-image/index.ts` — IG screenshot + brand kép elemzés
- 1 migration: `instagram_accounts`, `instagram_insights` táblák (admin-only RLS + GRANT)

**Módosított fájlok:**
- `src/components/admin/AdminLayout.tsx` — sticky asszisztens beágyazás + IG menüpont
- `src/pages/admin/AdminDocuments.tsx` — checkboxok, rating badge, multi-select action bar, "Audit" gomb
- `src/pages/admin/AdminAI.tsx` — diktálás gomb, +Kontextus gomb (közös logika a sticky-vel egy `useAIChat` hookban)
- `supabase/functions/admin-ai-chat/index.ts` — `context.docIds` + `context.mediaIds` támogatás, PDF szöveg kinyerés, multimodal (image_url) Gemini-nek

**Modell:** `google/gemini-3-flash-preview` (multimodal: szöveg + kép), STT `openai/gpt-4o-mini-transcribe`.

## Sorrend

1. Sticky AI panel + közös `useAIChat` hook (gyorsan érezhető).
2. Doksi-rating badge a listán + "Audit futtatása" gomb (batch AI pontozás).
3. Multi-select checkbox + "AI-val dolgozz velük" csatolás (doksi).
4. Diktálás (STT edge function + mikrofon gomb).
5. Brand Media oldal + képek csatolása az AI-hoz (multimodal).
6. Instagram screenshot-elemzés oldal + IG insights tábla.
7. (Később, külön projekt) Meta Graph API valódi szinkron.

Jó így? Ha igen, váltsd Build módba és kezdem az 1+2 blokkal együtt.
