# Fázis I lezárása — A/B subject feedback loop + Guardrail editor UI

A maradék két elem az előző körből.

## 1) A/B subject feedback loop az `outreach-suggest`-ben

Cél: az AI lássa, milyen subject-ek nyitottak jól a múltban, és ennek megfelelően javasoljon új variánsokat.

- `outreach-suggest/index.ts` bővítés:
  - Lekérdezi az utolsó 30 nap `outreach_events` rekordjait (`status`, `subject`, `opened_at`, `replied_at`).
  - Aggregál subject-szinten: küldés, open rate, reply rate.
  - Top 10 jól teljesítő + 5 gyengén teljesítő subject pattern → prompt-ba "TANULSÁGOK" blokkként.
  - A response JSON-ban új mező: `subject_variants: string[]` (3 alternatíva az első lépéshez).
  - Ha a sequence-nek van `subject_library` JSONB-je, az új top-3 ide kerül upsert-tel (max 20 elem, FIFO).

- `outreach-personalize` is megkapja ezt a kontextust (rövidített top-5 lista), hogy konzisztens legyen.

## 2) Sequence-szintű Guardrail editor UI

Cél: admin felületen állítható legyen a `outreach_sequences.guardrails` JSONB, ne csak DB-ben.

- Új komponens: `src/components/admin/outreach/SequenceGuardrailsEditor.tsx`
  - Tabs/Drawer-be illeszthető form. Mezők:
    - **Csendes órák**: from/to time picker (default 20:00–08:00)
    - **Hétvége kihagyása**: switch
    - **Max email/partner/hónap**: number (default 3)
    - **Csak munkanapokon**: switch
    - **Min. nap két lépés között**: number
    - **Auto-pause ha replied**: switch (default on)
    - **Auto-pause ha bounced**: switch (default on)
  - FieldHelp tooltipek mindenhol (követi az LeadOutreachModal mintát).
  - Save → `update outreach_sequences set guardrails = ...`.

- `AdminOutreach.tsx` integráció:
  - Minden sequence kártyán "Guardrails" gomb (settings ikon) → megnyitja a Dialog-ot.
  - Aktív guardrail-ek badge-ként megjelennek a kártyán (pl. "Csendes 20–8", "Max 3/hó").

- `outreach-tick` már olvassa a `guardrails`-t, nem kell módosítani.

## Érintett fájlok

**Edge functions**
- `supabase/functions/outreach-suggest/index.ts` — A/B feedback + subject_library upsert
- `supabase/functions/outreach-personalize/index.ts` — top performer kontextus

**Frontend**
- `src/components/admin/outreach/SequenceGuardrailsEditor.tsx` *(új)*
- `src/pages/admin/AdminOutreach.tsx` — guardrails gomb + badge-ek a kártyán

## Out of scope
- Subject performance dashboard (külön fázisban, ha kell)
- Per-step guardrail (most csak sequence-szint)
- Kanban / landing változás
