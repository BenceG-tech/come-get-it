
# Lead Outreach egyszerűsítés

Cél: egy lead drawer-ből 1 kattintás → 1 dialog → kész. Nincs tab, nincs sequence-select, nincs slider, nincs settings. Az AI ad **2–3 kész változatot** (subject + body), te kiválasztod, opcionálisan szerkeszted, és küldöd. A háttérben futó sequence/enrollment rendszer marad, csak nem látszik a lead-flow-ban.

## Mit látsz majd

A drawer-ben az "Outreach indítása" gomb új dialogot nyit:

```text
┌─ Outreach: Cube Coffee Bar ──────────── ✕ ┐
│  AI 3 sablon (chip-sor):  [Founding pitch ✓] [Warm intro] [Rövid nudge]    │
│  ─────────────────────────────────────────────────────────────             │
│  Tárgy:    [40-60 char input]                                              │
│  Szöveg:   [textarea, 8 sor, inline szerkeszthető]                         │
│  ─────────────────────────────────────────────────────────────             │
│  Címzett: hello@cube.hu  ·  Küldés: most  ·  ⚠ 12 napja már ment           │
│                              [Újra generál]  [Küldés most]                 │
└────────────────────────────────────────────┘
```

- Megnyitáskor azonnal AI-hívás → 3 változat (founding / warm / nudge), defaultban a **founding** kiválasztva, a mezők előre kitöltve.
- Tone-váltás chip-re kattintva: a másik AI-változat tölti be (cached, nem új hívás).
- "Újra generál": új 3 változat ugyanazzal a hangnem-szettel.
- Recent-guard: ha 30 napon belül ment levél, csak egy halk figyelmeztető sor + "Küldés most" gomb pirosabb.
- Egyetlen tab, nincs Preview/Settings. A preview egyben a szerkeszthető mező.

## Mit dobunk el a lead-flow-ból

- Sequence/Lépés select (a háttérben fix "Lead quick outreach" sequence megy).
- Hossz-slider, kiegészítő instrukció input, Preheader, A/B variants Badge sor, Risks panel.
- Tabs (Tartalom / Előnézet / Beállítások).
- Mikor induljon (Most / Holnap 9 / Egyedi), Founding PDF csatolás switch — mind ki.
- 30 napos guard `confirm()` blocker → halk inline warning.

A `/admin/outreach` hub és a sequence-szerkesztés **érintetlen** — haladó user oda mehet.

## Backend

Új fix sequence seed (egyszer, migration): `kind='lead_quick'`, `name='Lead quick outreach'`, 1 lépés (`channel='email'`, üres subject/body), `active=true`. A dialog mindig ezt használja, a personalized override-ban megy ki a tényleges tartalom — a meglévő `outreach_enrollments.metadata.personalized_steps[0]` mechanizmus marad.

Új edge function: `outreach-quick-drafts`
- Input: `{ partner_id }`
- Output: `{ drafts: [{ tone, subject, body }, ...] }` — 3 elem (founding_pitch, warm_intro, short_nudge).
- Egyetlen AI-hívás Lovable Gateway-en (`google/gemini-2.5-flash`), JSON output. Brand context + partner adatok.
- A/B subject-stats betöltése **megmarad** (a meglévő `loadSubjectStats` logika átemelve), hogy a top subjectek stílusát kövesse.

Bugfix: a drawer "Outreach javaslat" gomb jelenleg `{ partner_id }` payload-dal hívja `outreach-suggest`-et, ami `{ entity_type, entity_id }`-t vár → ez a non-2xx hiba a képen. Két opció:
1. Eltávolítjuk az "Outreach javaslat" gombot a drawer-ből (az új quick dialog kiváltja).
2. Marad, de javítjuk a payload-ot.

Javaslat: **eltávolítjuk** — az új flow lefedi. Egy gomb, egy út.

## Érintett fájlok

- `src/components/admin/leads/LeadOutreachModal.tsx` — teljes átírás: ~390 → ~150 sor, 1 panel.
- `src/components/admin/crm/EntityDrawer.tsx` — "Outreach javaslat" gomb + handler törlése; az "Outreach indítása" megmarad, csak az új dialog nyílik.
- `supabase/functions/outreach-quick-drafts/index.ts` — új.
- Migration: `lead_quick` sequence beszúrása ha még nincs.
- `src/components/admin/leads/BulkOutreachModal.tsx` — érintetlen (multi-select-re marad a sequence-választós flow).

## Out of scope

- `/admin/outreach` oldal, sequence editor, batch wizard, analytics — változatlan.
- Reply-handling, follow-up logika (`outreach-tick`, `outreach-reply-classify`) — változatlan.
- Tényleges email-küldés infrastruktúrája (Resend / outreach-tick cron) — érintetlen.

## Lépésrend

1. Migration: `lead_quick` sequence seed.
2. `outreach-quick-drafts` function (Lovable AI Gateway, JSON, 3 draft, brand+subject stats).
3. Új `LeadOutreachModal` (chip-sor + 2 input + Küld gomb).
4. Drawer cleanup: javaslat-gomb ki.
5. Smoke: drawer → Outreach indítása → 3 sablon megjelenik → Küldés → enrollment létrejön → toast.
