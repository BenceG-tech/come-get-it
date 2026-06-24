## Következő fázis — I: Outreach Intelligence & Reply Loop

A személyre szabás és UI most rendben van. A következő nagy hiányosság: **mi történik, miután kiment a levél?** Jelenleg vakon megy a sequence, nincs reply-handling, nincs deliverability-jel, és nincs visszacsatolás az AI-nak, hogy mi működik.

### 1. Reply detection + auto-pause (`inbox-collect` bővítés)
- Az `inbox-collect` már húz emaileket. Bővítjük: ha egy partnerhez kapcsolható válasz érkezik (Message-ID / In-Reply-To header vagy email-cím match), automatikusan:
  - `outreach_enrollments.status = 'replied'`, `stop_reason = 'auto_reply_detected'`
  - `outreach_events` insert `status='replied'`
  - `inbox_items` insert `type='lead_replied'` magas prioritással
  - Partner `status` → `negotiating` ha még `contacted` volt
- Új mező: `outreach_enrollments.last_reply_at`, `reply_sentiment` (positive / neutral / negative — AI klasszifikál)

### 2. Reply sentiment + suggested response (`outreach-reply-classify`)
Új edge function: a beérkezett választ az AI besorolja (érdeklődik / kérdez / elutasít / OOO / spam), és **javasol választ** a brand-context + eredeti thread alapján. Megjelenik az `AdminInbox` `lead_replied` kártyán: "Válasz-vázlat" + 1-click "Másol és nyiss Gmail-t".

### 3. Deliverability & engagement jelek a kanban-on
- `LeadOutreachModal` és a kanban kártya kap egy mini-strip-et: küldve / megnyitva / kattintva / válaszolt számokkal (`outreach_events`-ből aggregálva).
- Ha 2 lépés után 0 open → "gyenge subject" jelzés (sárga badge a partneren).
- Ha bounce / spam-complaint → "rossz email" piros badge + auto-pause.

### 4. AI subject A/B tanulás (`outreach-suggest` bővítés)
- Az `outreach_events` open-rate-jét visszacsatoljuk: amikor új subject variánsokat kér az AI, megkapja az utolsó 20 elküldött subject + open-rate párost a `BRAND_CONTEXT` mellé, és kifejezetten **eltérő stílust** javasol a leggyengébbtől.
- Top-performer subject minták kerülnek a `outreach_sequences` "subject_library" mezőbe (új JSON oszlop), amit a wizard fel tud kínálni.

### 5. Sequence-szintű guardrails
- A `LeadOutreachModal` "Beállítások" tab guardjait kiterjesztjük sequence-szintre is (sequence-en is állítható: "ne küldj péntek 18:00 után", "max 3 email / partner / hónap", "ha másik aktív sequence van, ne indulj").
- `outreach-tick` ezeket ellenőrzi futás előtt, és `skipped_reason`-t ír az event-be (látható a timeline-on).

### 6. Founding-specifikus signal-ek a partner-detail oldalon
A `AdminPartnerDetail` kap egy új "Outreach health" kártyát:
- Hány lépés ment ki, mennyit nyitott, mikor válaszolt utoljára
- AI-javasolt következő lépés (folytasd / pause / promote / új sequence) — egy `lead-promote-suggest` kibővítés
- "Founding deal status": függőben / elfogadva / elutasítva — manuális dropdown + tag az enrollment-en

### Érintett fájlok
- `supabase/functions/inbox-collect/index.ts` — reply matching + enrollment update
- `supabase/functions/outreach-reply-classify/index.ts` (új)
- `supabase/functions/outreach-suggest/index.ts` — open-rate feedback loop
- `supabase/functions/outreach-tick/index.ts` — guardrail check + skipped_reason
- `src/pages/admin/AdminInbox.tsx` — `lead_replied` kártya + válasz-vázlat
- `src/components/admin/leads/LeadsKanban.tsx` — engagement strip + badge-ek
- `src/components/admin/leads/LeadOutreachModal.tsx` — sequence-szintű guard tab
- `src/pages/admin/AdminPartnerDetail.tsx` — Outreach health kártya
- Migráció: `outreach_enrollments.last_reply_at`, `reply_sentiment`, `outreach_events.skipped_reason`, `outreach_sequences.guardrails jsonb`, `subject_library jsonb`

### Mit NEM most
- Nem építünk teljes IMAP-integrációt; az `inbox-collect` jelenlegi forrását használjuk.
- Nem cseréljük a kanban-t / nem nyúlunk a landinghez.
- A többi AI fn promptját csak akkor, ha kéred.

Mehet, vagy valamit kivennél / áttennél előbbre?
