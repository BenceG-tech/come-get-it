
# Mit építünk

Négy nagy blokk. Mindegyiket külön szakaszban fejezzük be, hogy lépésenként látható legyen az eredmény.

---

## 0) AZONNALI FIXEK (még ma)

**A) Doksi „Megnyitás" nem reagál**
- Ok: a `window.open(...)` a `createSignedUrl` await UTÁN fut → a böngésző popup-blokkoló elnyeli (nem user-gesture). Mobilon biztosan ez van.
- Fix: a kattintáskor szinkron nyitunk egy `const win = window.open('', '_blank')` ablakot, majd `win.location.href = signedUrl` amint megjön. Ha `win` null (blokkolva), fallback: ugyanazon a tabon `location.assign(url)` + toast.
- Mellé: PDF-eket `?download=` paraméter nélkül adjuk (inline view), képeket szintén; külön „Letöltés" gomb a kényszerített letöltéshez.

**B) AI asszisztens 403 `LOVABLE_API_KEY is not registered`**
- A network log mutatja: az `admin-ai-chat` edge function hibára fut, mert az AI Gateway nincs aktiválva ehhez a projekthez. Ezt egyetlen lépéssel rendezem (`ai_gateway--enable`). Ettől az AI azonnal válaszol.

---

## 1) AI ASSZISZTENS TUDÁSA (RAG — minden doksit lát)

Most az AI csak a doksik **metaadatát** kapja (cím, leírás, mikor használd). A tényleges PDF-tartalmat nem.

- **PDF szöveg-kivonás**: új edge function `documents-index` ami a Storage-ban lévő PDF-eket szöveggé alakítja (pdfjs Deno-ban), és `documents.extracted_text` mezőbe menti.
- **Embeddings**: minden doksi szövege ~1000 karakteres chunkokra vágva, `google/gemini-embedding-001` → pgvector tábla (`document_chunks`, dim 3072, HNSW index).
- **Chat hívásnál**: user kérdés → embedding → top-8 leginkább releváns chunk → bekerül a system promptba „FORRÁSOK" szekcióként. Az AI így tud minden Come Get It-tel kapcsolatos kérdésre válaszolni (FAQ, Master overview, pitch decks, founder bio, sales script, stb. — mind ott van).
- A chatben minden válasz alatt megjelenik melyik doksiból idézett (kattintható link).

---

## 2) BRAND MEDIA SZEKCIÓ (`/admin/media`)

Új menüpont + új Storage bucket `brand-media` (private, admin-only RLS).

- **Feltölthető**: JPG, PNG, WebP, MP4, MOV, GIF, SVG (logók). Max 100 MB / fájl.
- **Mappák/tagek**: Logó, Mockup, Termékfotó, Social poszt referencia, Videó (b-roll), Animáció, Stock — szabadon bővíthető. Saját mező: `brand_tags[]` (pl. „cyan glow", „phone mockup", „bar setting").
- **AI vízió analízis** (auto, feltöltéskor):
  - Kép: GPT-vision/Gemini → leírás, felismert elemek, dominant színek, hangulat, „mire jó" javaslat (pl. „IG square poszt háttere", „pitch deck cover", „video starting frame").
  - Videó: első frame + 3 köztes frame kivágás → vizuális leírás + hossz, formátum, hangulat.
  - Minden eredmény mentve `media_assets.ai_description` + `ai_tags[]` + `ai_use_suggestions[]` mezőkbe.
- **Doksihoz csatolás**: a Dokumentumok oldalon új „Csatolt média" szekció — egy doksi bármennyi media assethez köthető (`document_media` join tábla), így az AI ha pl. „Founding Partner pitch"-et említ, a hozzá tartozó képeket is figyelembe veszi/kínálja.
- **Proaktív ajánló**: új admin dashboard widget („Új ötletek a médiádra"): ha lát egy frissen feltöltött képet ami pl. „eladásra kész IG poszt háttér", felajánlja: „Csináljak ebből IG posztot? Vagy videó starting frame-et?".

---

## 3) AI KÉPEK + VIDEÓK + ÖNELLENŐRZŐ + SPECIALIZÁLT GENERÁTOROK

### 3a) Chat-asszisztens kibővítése
A `/admin/ai` chat eddig csak szöveget tud. Hozzáadjuk:
- **Kép-feltöltés a chatbe** (drag & drop) → Gemini vision elemzi → AI tud rá hivatkozni, módosítást javasolni, reprodukálni.
- **Videó-feltöltés** → első/köz-frame kivágás → leírás → AI tud róla beszélni.
- **Kép-generálás közvetlenül a chatben**: ha az AI úgy dönt vagy te kéred („csinálj egy IG posztot ehhez a kávézóhoz"), `openai/gpt-image-2` streaming generálás, a kép megjelenik a buborékban. Mentés gomb → `brand-media` bucketbe.
- **Kép-szerkesztés**: meglévő brand media asseten alapuló edit (`google/gemini-3.1-flash-image-preview`) — „változtasd a hátteret estire", „tedd hozzá a Come Get It logót".
- **Videó-generálás**: külön gomb („Készíts 5 mp-es videót"), `videogen--generate_video` (Seedance) — text-to-video vagy starting-frame-ből.
- **Dokumentum-generálás**: külön gomb („Csinálj PDF-et ebből") — szerver oldali reportlab/weasyprint, a Pitch Deck stílusban, automatikusan `documents` táblába mentve.

### 3b) Specializált generátor szekciók
Új menüpont: `/admin/generators` — 4 kártya:

1. **Pitch generátor** — partner kiválasztása (a CRM-ből) vagy szabad mezők (név, város, típus, vibe) → személyre szabott 1-oldalas pitch + hosszú pitch verzió. PDF exporttal.
2. **Email generátor** — első kontakt / follow-up / re-engagement típusok, hangnem (formális/baráti), nyelv (HU/EN). Subject + body + 3 alternatív subject line.
3. **Insta DM generátor** — rövid (max 3 mondat), csábító, CTA-val. Variációk: kávézó / bár / étterem / italmárka / rewards.
4. **IG/FB poszt generátor** — caption + hashtag (HU+EN mix) + ajánlott vizuál a Brand Mediából (a vízió-tagek alapján a rendszer kiválasztja a top-3 illő képet/videót).

### 3c) Önellenőrző (self-critique) rendszer — KÖRBEN MUTATJA
Minden generátor és chat-szöveg ezzel a 3-lépéses folyamattal fut:

```text
[ v1 generálás ]
      ↓
[ kritikus modell pontoz 1-10 skálán
  + felsorolja a gyenge pontokat
  + javasol konkrét javításokat ]
      ↓
[ v2 generálás a kritika alapján ]
```

UI-on mindhárom megjelenik egymás alatt, behajtható kártyákban:
- **v1** (eredeti) — látható, másolható
- **🎯 Pontszám: 7.5/10** + bullet point kritika
- **v2** (javított) — kiemelten, „Használom ezt" gombbal

Pontozási dimenziók (a kritikának kötelező mindre kitérnie):
- Magyar nyelv minősége & tegezés
- Brand hang (energikus, friendly, neon vibe)
- CTA erőssége
- Hossz & olvashatóság (mobilon is)
- Konkrétság (van-e tényleges szám/ajánlat)
- Personalizáció (partner-specifikus elemek)

Pontszám gombokkal: „🔄 Csinálj v3-at" (még egy kör), „✏️ Saját javítás", „📋 Másol".

---

## 4) INSTAGRAM / FACEBOOK INTEGRÁCIÓ

### 4a) Posztolás közvetlenül (Meta Graph API)
- **Setup**: Meta for Developers app létrehozása (te csinálod, mi vezetünk lépésenként). Kell: Facebook Page + Instagram Business account a Page-hez kötve. Engedélyek: `pages_manage_posts`, `instagram_content_publish`, `instagram_basic`, `pages_read_engagement`.
- **OAuth flow**: `/admin/settings/integrations` oldalon „Csatlakozás Meta-hoz" gomb → Meta login → token visszajön → secret-be mentjük (`META_ACCESS_TOKEN`, `META_PAGE_ID`, `META_IG_BUSINESS_ID`).
- **Edge function `meta-publish`**: kap egy poszt objektumot (kép-URL + caption) → feltölti container endpoint-ra → publikálja IG-re és/vagy FB-re. Visszaadja a poszt URL-jét.
- **Generátorból egy gomb**: „🚀 Posztold most" — előnézet, ütemezés (azonnal / dátum) → marketing_calendar-ba is bekerül a kiment állapot.

### 4b) DM sablonok (Meta nem enged automata DM-küldést cold outreach-re — egyszerű másolás)
- Insta DM generátor (lásd 3b) ad szöveget, „📋 Másol" gomb + „Megnyitás Instagramban" deeplink a célfiókhoz.

### 4c) Brand & versenytárs insightok
- **Saját poszt analitika**: edge function `meta-insights` lekéri az utolsó 30 nap posztjait + engagement-jét (likes, comments, reach, saves). Dashboard widget mutatja a top-3 legjobban teljesítő posztot.
- **Versenytárs figyelés**: te megadsz pl. 5 IG handle-t (`@dusk_budapest`, stb.). Hetente egyszer egy cron edge function (`meta-competitor-scan`) lekéri az új posztjaikat (Graph API csak public business profile-okra megy, vagy 3rd party scraping mint Apify — ha cold flag, jelezz). Az AI heti összefoglalót ír: „Dusk most ezt csinálta, mi reagálhatnánk ezzel".

---

## TECHNIKAI RÉSZLETEK (nem-technikai olvasónak átugorható)

**Új Supabase táblák**
- `media_assets` (id, user_id, bucket_path, type, mime, width, height, duration_sec, ai_description, ai_tags[], ai_use_suggestions[], brand_tags[], created_at)
- `document_media` (document_id, media_id) — join
- `document_chunks` (id, document_id, chunk_index, content, embedding vector(3072))
- `meta_accounts` (user_id, page_id, ig_business_id, access_token_encrypted, expires_at)
- `meta_posts` (id, platform, external_id, caption, media_urls[], scheduled_for, published_at, insights jsonb)
- `competitor_handles` (id, platform, handle, last_scanned_at)
- `ai_generations` (id, type, prompt, v1, critique, score, v2, used_version, created_at) — audit log az önellenőrzőhöz
- Új Storage bucket `brand-media` (private, admin RLS)
- `documents` táblához új mező: `extracted_text text`

**Új edge functions**
- `documents-index` (PDF→szöveg→chunk→embedding)
- `admin-ai-chat` bővítése: RAG + multimodal (vision)
- `media-analyze` (vízió-analízis feltöltéskor)
- `generate-pitch-pdf`, `generate-email`, `generate-dm`, `generate-social-post` — mind self-critique loopban
- `meta-publish`, `meta-insights`, `meta-competitor-scan`

**Új secretek szükségesek** (a megfelelő pillanatban kérem be):
- `META_APP_ID`, `META_APP_SECRET` — Meta integrációhoz (4-es blokknál)

A `LOVABLE_API_KEY` már létezik, csak aktiválni kell a Gateway-t a projekthez.

---

## ÜTEMTERV (ezt javaslom így sorrendben elfogadni)

| # | Blokk | Becsült idő | Kockázat |
|---|---|---|---|
| 0 | Doksi-megnyitás fix + AI Gateway aktiválás | 5 perc | nulla — azonnal látható |
| 1 | RAG: PDF index + embeddings + chat-be kötés | 30 perc | közepes (pdfjs Deno-ban néha cseles) |
| 2 | Brand Media szekció + vízió-analízis + doksihoz csatolás | 45 perc | alacsony |
| 3a | Chat multimodal + kép/videó gen a chatben | 30 perc | alacsony |
| 3b | 4 specializált generátor (pitch / email / DM / poszt) | 60 perc | alacsony |
| 3c | Önellenőrző v1+pontszám+v2 minden generátorban | 20 perc | alacsony |
| 4a | Meta posztolás (oauth + publish) | 60 perc | magas (Meta app review-t igényelhet live használathoz) |
| 4b | DM sablon (csak generálás+másolás) | benne van 3b-ben | nulla |
| 4c | Insights + versenytárs cron | 45 perc | közepes (rate limit + Apify costs) |

Ha rábólintasz az egészre, **0+1+2+3** együtt megy első körben (kb. 3 óra meló), aztán **4** külön körben mikor a Meta app készen áll.

Mondj egy „mehet" jelet vagy jelöld ha valamit kihagynánk / előrébb hoznánk.
