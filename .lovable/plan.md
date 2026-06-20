# Mi hiányzik még + hogy lesz tényleg hasznos az admin

A korábbi terv (AI Gateway fix, doksi-néző, audit mezők, master checklist) megvan. Most az alábbi rétegek hiányoznak ahhoz, hogy az admin felület **tényleg napi munkaeszköz** legyen, ne csak lista.

## 1. AI chat: több beszélgetés, mentett szálak (most hiányzik!)

Most: egy ablak, csak törölni tudsz, elveszik minden.

Új:
- `ai_threads` és `ai_messages` táblák (admin-only RLS).
- Bal oldali szál-lista: új beszélgetés, átnevezés, törlés, kedvenc/pin, keresés címben+tartalomban.
- Minden szál saját URL: `/admin/ai/:threadId` — reload visszahozza.
- Automatikus szál-cím generálás az első üzenetből.
- "Címkék" szálakon (pl. `pitch`, `IG DM`, `pénzügy`) hogy később vissza tudd keresni.
- Üzenetenként: másolás, „regeneráld jobb verzióban", „használd doksiként" (egyből új dokumentumot készít belőle).

## 2. AI tényleg ismerje a Come Get It-et (RAG)

Most: csak metaadatokat lát, PDF tartalmat nem.

Új:
- PDF/DOCX/TXT szöveg-kinyerés feltöltéskor (edge function).
- Chunkolás + `documents_chunks` tábla + embeddings (Lovable AI Gateway).
- Chat válaszadáskor szemantikus keresés a kérdés alapján → top releváns chunk-ok bekerülnek a promptba.
- Minden válasz alatt: **Források** (melyik doksiból, melyik szakaszból).
- Manuálisan is hozzáadható "tudás-snippet" (rövid tények: árazás, kontaktok, stat-ok).

## 3. Önellenőrző rendszer (v1 → pontszám → v2) — UI is

A korábbi tervben szerepelt logika, de UI-ban így jelenik meg:
- Bizonyos kérésekre (pitch, email, DM, poszt) automatikusan 3 blokk:
  1. **v1 draft**
  2. **Pontozás 1-10** dimenziók szerint (magyar nyelv, brand hang, CTA, konkrétság, személyre szabás, rövidség, meggyőzőerő) + rövid kritika
  3. **v2 javított verzió**
- Gombok minden generált szövegen: `Még jobb verzió`, `Rövidebbre`, `Formálisabbra`, `Lazább hangra`, `Másik nyelvre`.

## 4. Brand Media + multimodális AI

- `Brand Media` admin oldal, `admin-docs` bucket alatt új `media/` mappa.
- `media_assets` tábla: leírás, brand tagek, AI által generált tagek + használati javaslatok.
- Feltöltéskor AI auto-elemzi a képet (Gemini vision): mi van rajta, milyen hangulat, mire jó (IG poszt / story / pitch deck / videó start frame / email header).
- Doksihoz csatolható (`document_media` join).
- Chatben: ha relevánsan illik egy kép a kérdéshez, az AI felajánlja: *„Erre jó lenne a `barista_morning_03.jpg` — Insta sztoriba a founding partner ajánlathoz."*

## 5. IG / FB integráció (lépcsőzetesen)

Mindhárom kértél — sorrend:
- **1. lépés (most):** Üzenet/DM/poszt sablon generálás + 1-klikk másolás + „Megnyitás Instagramban" deep link (`instagram://` mobilon, web fallback). Nem kell hozzá API.
- **2. lépés:** Brand & versenytárs insightok — megadsz IG handle-eket (saját + versenytársak), heti fetch (publikus oldalak scrape-je vagy manuális screenshot feltöltés → AI elemzi: posztolási ritmus, témák, hashtag-stratégia, mit csinálj máshogy).
- **3. lépés (külön blokk, Meta Graph API + business app review kell):** közvetlen posztolás IG-re/FB-re az adminból. Ez 2-4 hét review, ezért később.

## 6. Doksi-audit befejezése (most félkész)

- A korábbi auditban van rating-mező és duplikáció-csoport, de a **valódi AI-elemzés még nem fut le** rajtuk. Egy „Audit futtatása" gomb: AI végigmegy minden doksin, kitölti `quality_score`, `quality_notes`, megjelöli a duplikátumokat, javasol fúziót vagy törlést, és **megírja a fúzionált új verziót** is, amit te jóváhagysz/elvetsz.
- Lista nézet: szűrés rating szerint, „mit kellene fixen átírni" sort.

## 7. „Use this image / doc here" proaktív javaslatok

Amikor a chatben kérsz pl. „IG posztot kávézóknak", az AI nemcsak ír, hanem:
- kiválaszt **1-2 illő képet** a Brand Mediából,
- javasol egy **doksit** amit linkelj (1-pager),
- javasolja melyik **partnernek** menjen először,
- felajánlja: *„Hozzáadjam a marketing naptárhoz holnap 10:00-ra?"*

## 8. Apró admin QoL hiányok

- Globális keresés (Cmd/Ctrl-K): partnerek + doksik + szálak + checklist.
- Doksi viewer: most még blank lehet — fallback: ha az `<object>` nem rendereli, automatikusan `Letöltés` + új tab natív böngészőnézet, és PDF.js viewer mint biztos backup.
- Mobil nézet az AI chaten: szál-lista bottom sheet-ben.
- „Mai feladatok" widget az admin dashboardon: kit hívj/írj ma (followup), milyen checklist item esedékes, milyen naptár-poszt jön.

## Sorrend (implementálási blokkok)

1. **AI chat thread-ek** (`ai_threads`, `ai_messages`, sidebar, URL routing) + doksi-viewer fallback fix.
2. **Önellenőrző UI** (v1/pontszám/v2 blokkok, gyors-újrafogalmazó gombok).
3. **RAG**: PDF-kinyerés, chunkolás, embeddings, semantic search a chatben, források megjelenítése.
4. **Brand Media** oldal + AI auto-tagging képekre + doksi-csatolás.
5. **Doksi audit AI futtatás** (automata pontozás, duplikáció-fúzió javaslat).
6. **Proaktív javaslatok** chatben (kép/doksi/partner/naptár).
7. **IG/FB 1-2. lépés** (sablonok + deep linkek + insight elemzés).
8. **Globális Cmd-K kereső + Mai feladatok widget.**
9. **Később (külön projekt):** Meta Graph API közvetlen posztolás.

Szólj melyik blokkal kezdjem — javaslom az **1+2-t együtt** (azonnal érezhető lesz, hogy nem veszik el semmi, és minden output jobb minőségű lesz), aztán **3 (RAG)** mert ettől lesz az AI tényleg „mindentudó" a Come Get It-ről.
