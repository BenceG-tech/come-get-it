# Admin felület + AI sales/marketing társ

Egy védett `/admin` rész, ahol csak te (bence@... — első belépéskor kapsz admin szerepet) látsz egy 4-modulos dashboardot: **Partnerek (CRM)**, **Dokumentumok**, **AI asszisztens**, **Marketing naptár**. Az AI mindent lát (partner adatok, napló, doksik, sablonok) és bármiben segít — outreach üzenet, "kinek mikor mit küldj", poszt ötletek, kampány terv.

## 1. Admin hozzáférés
- Bejelentkezés a meglévő `/auth` oldalon
- Első indításkor migrációval a te user_id-d kap `admin` szerepet a `user_roles` táblába (megadod az emailed)
- `/admin/*` route csak `has_role(uid, 'admin')` mellett tölt be, különben redirect
- Később admin UI-ról más usereket is admin-ná tehetsz

## 2. Partnerek (CRM)
**Lista nézet** — szűrhető típus (vendéglátóhely / italmárka / rewards) és státusz szerint. Kanban + táblázat view.

**Partner adatlap:**
- Alap: cégnév, város, kapcsolattartó, email, telefon, Instagram, website, típus
- Státusz pipeline: `lead → megkeresve → tárgyalás → ajánlat küldve → aláírt → elutasítva`
- Következő follow-up dátum (emlékeztető)
- **Kommunikációs napló** timeline: minden bejegyzés = csatorna (email/IG DM/telefon/személyes), dátum, kitől-kinek, rövid összefoglaló, opcionálisan a teljes szöveg
- **Küldött dokumentumok** lista: melyik PDF-et mikor küldted (link a doc-ra)
- Szabad szöveges jegyzetek
- `/partnerek` és `/vendeglatohelyek` űrlap leadek automatikusan ide érkeznek mint új `lead`

## 3. Dokumentumok
Supabase Storage-ban privát bucket (`admin-documents`).
- Feltöltés: PDF/DOCX, kategória (1-pager vendéglátó, hosszú pitch, italmárka deck, rewards onboarding, stb.), partner típus tag, rövid leírás "mikor használd"
- **AI által generált anyagok** külön szekció (email draft, poszt szöveg, személyre szabott pitch) — partnerhez köthető
- Sablonok kategóriánként, gyors "küld partnerhez" gomb → log bekerül a partner naplójába

## 4. AI asszisztens (Lovable AI Gateway, `google/gemini-3-flash-preview`)
Chat felület az admin oldalsávban, de **kontextus-tudatos**: lát mindent (partnerek, naplók, doksik metaadat + tartalom, korábbi posztok, marketing terv).

Funkciók (tool-calling):
- **Outreach drafter**: "Írj IG DM-et a Kelet Kávézónak" → lehúzza a partner adatait + korábbi kommunikációt + ajánlja melyik doksit csatold
- **Mit-mikor-kinek**: "Kit kell ma megkeresni?" → follow-up dátum + státusz alapján listát ad prioritással
- **Doksi ajánló**: "Most ennek a bárnak mit küldjek?" → típus + státusz alapján 1-pager vs hosszú pitch javaslat indoklással
- **Poszt író**: IG/FB poszt szöveg + hashtag + kép-prompt ötlet, hangnemben (HU, energikus, neon brand)
- **Marketing tanácsadó**: kampányok, heti tartalom napló, "hogyan kezdjem el a vendéglátóhelyek pörgetését"
- Minden generált anyag 1 kattintással menthető Dokumentumok-ba + partnerhez logolható

## 5. Marketing naptár + terv
- Heti/havi naptár nézet: tervezett IG/FB posztok, outreach hullámok, események
- AI generálja az induló 4-hetes tervet a brand + aktuális prioritások alapján (vendéglátóhely-toborzás)
- Posztokhoz draft szöveg + státusz (ötlet / draft / kész / kiposztolva)

## 6. Induló marketing terv (AI generálja, te véglegesíted)
Az első belépéskor az AI azonnal javaslatot ad:
- 1. hét: vendéglátóhely-fókuszú IG posztok ("Te is partner lehetsz") + 20 budapesti kávézó/bár listázása outreach-re
- 2. hét: founding partner perks kiemelése, esettanulmány jellegű content
- 3. hét: italmárka megkeresési hullám
- 4. hét: launch countdown + waitlist push

---

## Technikai részletek

**DB migráció (Supabase):**
- `partners` (id, type enum, company_name, city, contact_name, email, phone, instagram, website, status enum, next_followup_at, notes, created_by, timestamps)
- `partner_interactions` (id, partner_id, channel enum, direction, summary, full_content, occurred_at, created_by)
- `partner_documents_sent` (id, partner_id, document_id, sent_at, channel, notes)
- `documents` (id, title, category, partner_type, description, when_to_use, storage_path, is_ai_generated, related_partner_id, created_by, timestamps)
- `ai_conversations` + `ai_messages` (chat history az asszisztenshez, UIMessage[] formátum)
- `marketing_calendar` (id, date, channel, type, title, content_draft, status, created_by)
- Mind RLS-sel: csak `has_role(auth.uid(), 'admin')` lát/módosít
- GRANT-ek minden új public táblára
- Storage bucket: `admin-documents` (privát, csak admin policy)

**Routing:**
- `/admin` (dashboard overview — gyors stats + AI quick chat + ma teendők)
- `/admin/partners`, `/admin/partners/:id`
- `/admin/documents`
- `/admin/ai` (full screen AI chat)
- `/admin/calendar`
- `AdminLayout` shadcn `Sidebar`-rel, `AdminRoute` guard komponens

**AI backend:**
- Supabase Edge Function `admin-ai-chat` — Lovable AI Gateway, streaming, tool-calling
- Tools: `get_partners`, `get_partner_detail`, `get_documents`, `log_interaction`, `save_generated_document`, `create_calendar_entry`, `get_pending_followups`
- `LOVABLE_API_KEY` már be van állítva
- AI SDK `useChat` a frontenden, threaded chat localStorage-ben (egyszerű, gyors)

**Stílus:** meglévő Neon Fidelity dark téma, cyan akcentus, pill gombok, framer-motion — konzisztens a publikus oldallal.

---

**Felteszem 1 kérdés indítás előtt:** Melyik email címmel jelentkezel be? (Erre adok admin szerepet a migrációban.) Ha még nincs fiókod, először regisztrálj a `/auth` oldalon, majd írd meg az emailt.