### Phase 16 — Admin UX + Workflow Overhaul (3 fázis)

12 pontot bontjuk fázisokra. Minden fázis külön deploy-olható, így folyamatosan használható az admin.

---

## 🔴 Fázis A — Sürgős UX fixek + Quick winek (1–4 + 9, 10, 12)

**Cél:** azonnali használhatóság, vizuális hibák, sebesség.

### A1. Dashboard átrendezés (#1)
- `AdminDashboard.tsx`: új layout
  - **Felül (mindig nyitva):** Daily Briefing + EveningSummary + Streak bar
  - **Középen (mindig nyitva):** Top 3 prioritás (Inbox + Today focus)
  - **Alul (collapsible, alapból zárva):** Pipeline & Waitlist, Heti munka, Tudás & Riportok
- Collapsible szekciók fejlécén **badge** mutatja a fontos számokat zárva is (pl. "Pipeline (3 új lead)") — így nem vész el a kontextus.

### A2. Lead rating hibrid auto + bulk AI (#2)
- **DB migration:** `partners.rating` text column (A/B/C/D), `partners.rating_source` ('auto' | 'ai'), `partners.rating_computed_at`.
- **Trigger:** insert/update partners-en, ha `ai_score` változik és `rating_source != 'ai'`, automatikusan kiszámol score-alapú rating-et (>80=A, 60-80=B, 40-60=C, <40=D, null=—).
- **Edge function:** `lead-rating-ai-bulk` — fogadja a top 20 lead ID-t (`ai_score desc` szerint), Gemini olvassa a `research_dossier`-t + google_rating-et + instagram_handle-t, visszaad finomhangolt rating-et, `rating_source='ai'`-ra állítja.
- **UI:** AdminLeads.tsx fejlécbe gomb: "🤖 AI értékeli a top 20 leadet" — futás után toast + refresh.

### A3. Dokumentumok fejléc + animáció fix (#3)
- `AdminDocuments.tsx` (vagy a Documents page header komponens): megnézzük az overflow/font-shrink CSS-t. Valószínűleg `text-balance` vagy negatív letter-spacing animáció okozza az "Dōkumentumok" glitch-et. Stabilizáljuk:
  - Fix `min-width` a fejléc containeren
  - Animációt csak `transform`-on (nem `letter-spacing`-en)

### A4. Pipeline mező-emlékeztetők (#4)
- `AdminPartners.tsx` Pipeline view: a "—" cellákhoz **inline edit** (Partner kapcsolat + Follow-up dátum). Egy kattintás → popover input → mentés.
- Kanban kártyán **figyelmeztető pötty** ha `contact_name` vagy `next_followup_at` üres.

### A9. ⌘K parancspaletta bővítés (#9)
- Meglévő `CommandPalette.tsx` kibővítése:
  - **Akciók (nem csak nav):**
    - "➕ Új partner" → megnyitja az EntityDrawer-t üres állapotban
    - "✏️ Lead státusz változtatás" → 2 lépéses: lead választó + új státusz
    - "📝 Gyors brief generálás" → ContentStudio brief modal megnyitása előre kitöltve
    - "📞 Outreach küldés a kiválasztott leadnek" (context-aware)
    - "🔬 Deep research futtatás"
- Akciókat regisztrálható API-n: `useCommandAction({ id, label, icon, group, handler })`.

### A10. Bulk akciók (#10)
- `AdminLeads.tsx` és `AdminPartners.tsx`: már van checkbox. Hozzáadunk:
  - **Floating action bar** alulra, ha ≥1 sor ki van jelölve.
  - Akciók: "Státusz változtatása", "Outreach küldés (B fázisra köt)", "Címkézés", "Export CSV", "Töröl".
  - Bulk endpoint: `bulk-leads-action` edge function (mert RLS + delete + audit log).

### A12. Mobil bottom nav — Outreach (#12)
- `AdminMobileNav.tsx`: 4 → **5 ikon** vagy átstrukturálás:
  - Ma | Leadek | **Outreach** | Tartalom | Több (drawer)
  - "Több" drawer-be a ritkábban használt (Dokumentumok, Riportok, Beállítások).

---

## 🟡 Fázis B — Workflow integrációk (5, 6, 7, 8)

**Cél:** rendszerek ne legyenek silókban.

### B5. Lead → Outreach 1-click (#5)
- `LeadRow` / `EntityDrawer`: új gomb "📨 Outreach indítása".
- Modal:
  - Sequence választó (`outreach_sequences` table-ből)
  - AI személyre szab (Gemini olvassa research_dossier + lead adatait, finomhangolja a sequence első emailt)
  - Preview → "Küldés" → `outreach_enrollments` insert + Resend trigger.
- **DB:** `outreach_enrollments` már létezik, ezt használjuk.

### B6. Brief → Naptár auto-link (#6)
- `content_briefs` insert/update trigger: ha `scheduled_for` van, automatikus row a `marketing_calendar`-ba (`brief_id` FK-val).
- ContentStudio brief form: "Naptárba kerül" toggle (default on) + dátumválasztó.
- MarketingCalendar oldalon a brief-alapú itemek kattinthatók → ugranak a brief detail-re.

### B7. Inline AI asszisztens (#7)
- `<InlineAIHelper context={...} />` komponens: floating "✨ AI segítség" gomb minden form-on (partner edit, outreach compose, brief).
- Context-aware prompt: a komponens átadja a környező adatot (pl. partner neve + dossier + iparág).
- Backend: meglévő `admin-ai-chat` function, csak `context` paramétert kap.

### B8. Streak ↔ Content sync (#8)
- `marketing_calendar.published_at` (new column) — amikor egy poszt status='published'-ra vált.
- Trigger: minden `published_at` increment-eli a `user_streaks` rekordot annak a usernek aki publikálta.
- DailyStreakBar real-time refresh: ha ma volt publikáció → streak++.

---

## 🟢 Fázis C — Content & dokumentumok mélyítés (11)

**Cél:** AI chat-with-docs működjön.

### C11. Doksi content backfill + audit (#11)
- **Edge function:** `documents-extract-content` — PDF-eket Firecrawl + `markitdown`-szerű pipeline-nal kiolvas, `documents.content` mezőbe ír, chunks → embedding.
- **Admin UI:** Documents oldalon "Tartalom státusza" oszlop:
  - ✅ Feldolgozva (chunks > 0)
  - ⏳ Folyamatban
  - ❌ Hiányzik content → "🔄 Újrafeldolgoz" gomb
- **Bulk:** "Összes hiányzó feldolgozása" gomb (sorba állít, max 5 párhuzamos).

---

## Sorrend és iterációk

1. **1. iteráció (most):** A1 + A3 (vizuális fixek, no backend) + A2 DB migration + lead-rating-ai-bulk edge function.
2. **2. iteráció:** A4 + A9 + A10 + A12 (interakció + bulk).
3. **3. iteráció (Fázis B):** B5 + B6 + B7 + B8.
4. **4. iteráció (Fázis C):** C11.

Most az **1. iterációval** kezdjünk. Jó?

## Technikai részletek

- DB migration (`partners.rating` + trigger), 1 edge function (`lead-rating-ai-bulk`).
- Új komponens: `CollapsibleDashboardSection.tsx` (badge-es header).
- Módosított: `AdminDashboard.tsx`, `AdminDocuments.tsx` header, `AdminLeads.tsx` (AI bulk gomb).
- Nincs új npm package.
- Lovable AI Gateway (Gemini Flash) a bulk rating-hez — pár forint 20 leadre.
