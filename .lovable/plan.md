## Cél
Egységes, AI-vezérelt admin operációs központtá fejleszteni a rendszert, ami napi szinten támogat: tudja mit kell ma csinálnod, mire mennyi időt fordítasz, milyen eredményt hoz, és automatikusan dolgozik helyetted ahol lehet.

## Vezérelvek
- **Egy belépési pont**: az `/admin` Dashboard a „cockpit” — minden onnan indul és oda jön vissza riportként.
- **AI mindenhol, de döntés nálad**: minden AI-output mellé „Elfogad / Módosít / Elvet” gomb, semmi nem fut automatán jóváhagyás nélkül (kivéve a tracking).
- **Egyetlen activity_log**: minden modul ide ír, így a heti retro és napi briefing valós adatból dolgozik.
- **Brand DNS minden AI hívásban**: a `_shared/brand-context.ts` továbbra is a single source of truth.

---

## 1. fázis — Cockpit + tracking alap (Hét 1)

### 1.1 Új Dashboard: „Ma" cockpit átalakítás
- Hero blokk legfelül: **AI Napi briefing kártya** (lásd 2.1).
- Pipeline funnel mini-widget: lead → qualified → meeting → signed (számok + trend nyíl).
- Waitlist növekedés ma / 7 nap / 30 nap, mini sparkline-nal.
- „Mire ment ma az idő?" widget (csak akkor, ha a tracking ki van töltve aznap).
- Gyors akciók: Új hangjegyzet · Új poszt · Új lead · Új follow-up.

### 1.2 Központi event/metric tábla
Új `metric_events` tábla, minden modul ide írja a számszerűsíthető eseményeket (waitlist_signup, lead_created, lead_stage_changed, post_published, task_completed, voice_note_created, doc_processed, partner_email_sent).
Új `daily_focus` tábla: napi cél, top 3 prioritás, aznapi reflexió.
Új `time_logs` tábla: opcionális idő-tracking modulra (lead, content, doc, partner, admin) per nap.

### 1.3 KPI snapshot edge function
Új `kpi-snapshot` edge function napi 23:00-kor (pg_cron) lefut és lement egy `daily_kpi_snapshots` sort: waitlist növekedés, új leadek, signed partnerek, posztok száma, brand-fit átlag, AI költés. Heti retró ezekből épít.

---

## 2. fázis — AI munkatárs (Hét 2)

### 2.1 Napi AI briefing
- Új `daily-briefing` edge function: minden reggel 7:00-kor (pg_cron) generál egy briefinget a usernek:
  - Mai esedékes follow-upok (partnerek tábla).
  - Mai/elmaradt checklist itemek.
  - Tegnapi waitlist & lead delta.
  - Naptárban mai posztok (van-e kép, caption, hashtag — kész-e publikálásra).
  - 3 javasolt fókusz mára (AI: dokumentumok + naptár + pipeline alapján).
- Megjelenik a Dashboard tetején, és opcionálisan email is megy (Resend, ami már be van kötve).
- „Készen áll a napom" gombbal lezárható → bekerül a `daily_focus` táblába.

### 2.2 Hangalapú jegyzet → strukturált akció
- Új `voice-capture` edge function: Lovable AI STT (`openai/gpt-4o-mini-transcribe`) → Gemini Flash strukturálás.
- A meglévő `VoiceRecorderButton.tsx` kibővítve: felvétel után AI eldönti hogy az feladat, lead, poszt-ötlet, partner-followup, vagy szabad jegyzet, és előtölti a megfelelő formot.
- Eredmény: 30 mp diktálás → kész lead/feladat/poszt-draft 1 jóváhagyással.
- Floating button minden admin oldalon (FloatingAIAssistant mellé).

### 2.3 Heti retrospektíva
- Új `/admin/retro` oldal és `weekly-retro` edge function.
- Vasárnap este AI összerakja: KPI delta (snapshots-ból), mit végeztél el (activity_log), mi maradt, javasolt 3 cél a következő hétre.
- OKR-szerű cél-tracking: maximum 3 hetes cél, hozzájuk metric, progress %.
- Cél típusok: waitlist (X új signup), partner (X aláírt), content (X poszt publikálva), brand (X dokumentum auditálva).

---

## 3. fázis — Content & Marketing mélyítés (Hét 3)

### 3.1 Content Studio v3
- **Hashtag bank** tábla + UI: téma/persona/csatorna szerint csoportosított hashtagek, AI auto-javaslat poszthoz.
- **A/B variáns**: minden mentett snippethez 2 variáns generálható, naptárban A/B jelöléssel.
- **Újrahasznosítás**: 60+ napos régi posztoknál „Frissítsd újra" gomb → AI újra-spinneli az aktuális ajánlattal.
- **Sablon-könyvtár**: 8-10 sablon (founding partner outreach, waitlist push, edukáció, GIVE, behind-the-scenes, success story, FAQ, event), 1 kattintás generálás.

### 3.2 Marketing naptár v2
- Hét/hónap/lista nézet váltó.
- Drag & drop átütemezés.
- Posztonkénti „publikálási checklist": szöveg ✓, kép ✓, hashtag ✓, logó rajta ✓, időpont ✓ — csak akkor mehet „ready" státuszba ha mind ✓.
- Engagement utólagos rögzítése (mennyi like/komment kapott) → tanulóhurok: AI a következő ajánláshoz figyelembe veszi mi működött.
- ICS export és copy-link.

### 3.3 Instagram-ready bundle
- „Posztcsomag letöltés": logózott kép + caption.txt + hashtag.txt egy zip-ben, hogy mobilról 1 kattintás Insta.
- Meta Graph API integráció **csak külön fázisban** (Hét 7+, OAuth + app review miatt).

---

## 4. fázis — CRM & Partner pipeline (Hét 4)

### 4.1 Lead/Partner Kanban v2
- A meglévő `LeadsKanban.tsx` kiterjesztése: drag & drop stage-váltás, bulk akciók, score-szerinti rendezés.
- Stage-enként automata teendő: pl. `qualified` → AI legenerál personalizált bemutatkozó emailt draftként.

### 4.2 Email szekvenciák
- Új `email_sequences` és `email_sequence_steps` tábla.
- 3 előre felépített szekvencia: founding partner (5 lépés / 14 nap), rewards partner (3 lépés / 7 nap), reactivation (2 lépés / 30 nap).
- `sequence-runner` edge function napi futás (pg_cron): esedékes lépéseket draftba teszi (NEM küldi automatán), notification a dashboardra.
- Pause/resume per partner.

### 4.3 Smart follow-up
- `score-partner` továbbfejlesztve: figyeli az email-megnyitást (Resend webhook), válaszidőt, dokumentum-letöltést → AI 1-5 ajánlott következő lépést ad.
- Konkrét „Mit írjak most ennek a partnernek?" gomb a partner részletes oldalán → AI brand-DNS + partner history + utolsó interakció alapján caption-szerű emailt javasol.

### 4.4 Outreach automatizálás (jóváhagyással)
- Bulk personalizáció: kijelölsz 20 leadet → AI 20 testreszabott emailt készít → te elfogadod egyenként vagy bulk → Resend kiküldi.
- Naponta max X email cap, hogy ne robbantsuk a domain reputációt.

---

## 5. fázis — Dokumentum & Drive intelligencia (Hét 5)

### 5.1 Szemantikus kereső
- pgvector kiterjesztés + `documents.embedding` oszlop.
- `embed-document` edge function: új/módosult doksin lefut, Lovable AI embedding.
- `/admin/search` univerzális kereső: dokumentum + brand_knowledge + snippet + naptár + chat history, természetes nyelven.

### 5.2 Auto-kategorizálás és duplikátum-szűrés
- A meglévő `drive-organize-scan` kiterjesztése: duplikátum detektálás (file-hash + szemantikus hasonlóság), elavult verzió jelölése, kategória-javaslat.
- Egy „Drive housekeeping" hetente fut, riportot tesz a Dashboard-ra („12 duplikátum, 5 elavult — átnézed?").

### 5.3 OCR + képanalízis re-run
- Minden képnél `pytesseract`/Gemini Vision OCR-szöveg eltárolása, hogy a kereső megtalálja a képen lévő szöveget is.
- „Re-analyze all images with new prompt" admin akció.

### 5.4 Doksi → tartalom pipeline finomítás
- A `convert-document-to-content` kapjon „több cél" módot: 1 doksiból egyszerre Insta caption + LinkedIn poszt + Email subject lines + Twitter thread.
- Egy klikkel mind a Content Studio saved library-be kerül.

---

## 6. fázis — Analytics & átlátható ROI (Hét 6)

### 6.1 KPI Dashboard oldal (`/admin/analytics`)
- Konverziós tölcsér: landing view → CTA klikk → form open → waitlist signup (GA4 + saját events kombinálva).
- Pipeline funnel: lead → qualified → meeting → signed, stage-enkénti konverzió és átlag idő.
- Content ROI: posztonkénti engagement, melyik content-pillér működik legjobban.
- Időbefektetés vs eredmény: time_logs vs metric_events keresztmetszet („1 óra outreach = X qualified lead").
- AI költés tracker: edge function hívásonkénti credit-becslés, havi grafikon.

### 6.2 Heti email riport
- Vasárnap este Resend-en megy egy email (saját címre): retro + KPI delta + jövő heti fókusz.

### 6.3 Export
- CSV export minden táblához (leads, partners, signups, snippets, calendar).

---

## 7. fázis — Integráció & polish (Hét 7-8)

### 7.1 Instagram Graph API
- Külön szakasz, csak akkor ha addigra megvan az Instagram Business + Facebook Page.
- `instagram-publish` edge function, token tárolás `oauth_tokens` táblában (RLS admin-only).
- „Publish to Insta" gomb a naptárban; webhookkal vissza-szinkronizálja az engagement-et.

### 7.2 Naptár-szinkron
- Google Calendar (connector már van Drive-hoz, hasonlóval): follow-upok és posztok kétirányú szinkron.

### 7.3 Mobile polish
- A meglévő admin oldalak mobil-első átnézése (te mostani viewport: 402x701), különös tekintettel a Kanban, naptár, voice button és napi briefing kártyára.

---

## Technikai részletek

### Új táblák (mind RLS admin-only, has_role-lal):
- `metric_events` (event_type, entity_id, value, metadata, created_at)
- `daily_focus` (date, top_priorities jsonb, reflection text, energy_level int)
- `time_logs` (date, module, minutes, note)
- `daily_kpi_snapshots` (date, waitlist_total, leads_new, signed_total, posts_published, ai_cost_estimate)
- `weekly_goals` (week_start, title, metric_key, target, current, status)
- `email_sequences`, `email_sequence_steps`, `partner_sequence_state`
- `hashtag_bank` (tag, category, persona, performance_score)
- `oauth_tokens` (provider, token enc, refresh_token enc, expires_at) — csak 7. fázisban

### Új edge functions:
- `kpi-snapshot` (pg_cron napi)
- `daily-briefing` (pg_cron reggel)
- `voice-capture` (STT + strukturálás)
- `weekly-retro` (pg_cron vasárnap)
- `sequence-runner` (pg_cron napi)
- `embed-document` (trigger-szerű)
- `semantic-search`
- `drive-housekeeping` (pg_cron heti)

### Új oldalak:
- `/admin/retro` — heti retro + cél tracking
- `/admin/analytics` — KPI dashboard
- `/admin/search` — univerzális szemantikus kereső
- `/admin/sequences` — email szekvencia admin

### Schedule (pg_cron):
- 07:00 daily-briefing
- 09:00 sequence-runner
- 23:00 kpi-snapshot
- Vasárnap 20:00 weekly-retro + email
- Vasárnap 22:00 drive-housekeeping

### Szükséges secret:
- Mind megvan (LOVABLE_API_KEY, RESEND_API_KEY, SUPABASE_*).
- Csak a 7. fázis Instagram integrációhoz kell majd: `META_APP_ID`, `META_APP_SECRET`.

---

## Mit fogok először szállítani, ha jóváhagyod
1. fázis **teljes egészében** (Cockpit átalakítás + metric_events / daily_focus / time_logs táblák + kpi-snapshot edge function + pg_cron).
Majd lépésről lépésre haladunk fázisonként, hogy minden szállítás után tudd tesztelni és visszajelezni.