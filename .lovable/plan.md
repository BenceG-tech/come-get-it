## Cél
A szeptemberi misszió (20 partner LOI · 500 előregisztráció · italszponzor pitch) ne csak egy szám legyen a dashboardon, hanem napi operatív vezérlő: lássam **miért állunk itt**, **mit kell ma tennem**, és heti szinten **mit értünk el / mi csúszik**.

## 1) Mission Detail nézet — `/admin/mission`
Új oldal, ahova a MissionTracker kártyák átkattintanak (jelenleg `/admin/partners`, `/admin/content`, `/admin/brand` linkek — ezek megmaradnak mint deep-link, de a szám-kártya elsősorban ide visz).

Három tab (Partner LOI · Előregisztráció · Italszponzor), mindegyikben:
- **Hol tartunk most**: aktuális szám, célhoz viszonyított %, napi/heti változás sparkline (utolsó 30 nap, `daily_kpi_snapshots` alapján).
- **Forecast vonal**: aktuális heti tempóval szept. 1-re hova érünk → zöld ha hozza, piros ha csúszik, és kiírja, hogy `+X partner / hét` kell az utolérésig.
- **Mi húzza / mi blokkolja**: top 3 stage ahol pang a lead (`partners.status` count), top 3 forrás ami hozott waitlistet (`waitlist_signups.source`), italszponzornál a hiányzó kritériumok checklist.
- **Következő 3 konkrét lépés**: a `pipeline_tasks` / `daily_focus` táblából a misszió-specifikus task-ok, inline „kész" / „elhalasztom holnapra" gombbal.

## 2) „Mai 3 feladat" valódi adat alapján
A jelenlegi dashboard placeholder helyett **`daily_focus` táblát** használjuk, amit reggel egy edge function (`generate-daily-focus`) tölt fel AI-jal:

Input → 
- nyitott `inbox_items` (sürgősség, snooze figyelembe véve)
- pangó `partners` (utolsó interakció > 5 nap, `status in ['contacted','negotiating']`)
- aktív `outreach_enrollments` ahol `next_action_at <= today`
- aktuális misszió-gap (melyik szám van legtávolabb a céltól)

Output → 3 task ranked priority-vel (high/med/low), mindegyiknek `mission_pillar` (partner/waitlist/sponsor), `entity_ref` (partner_id vagy lead_id), `suggested_action` (1 mondat), `estimated_minutes`. 

Dashboard `TodayTasksCard.tsx` (új) mutatja a 3-at, kattintásra megnyitja az adott entitást EntityDrawer-ben. „Kész" gomb → `completed_at` + analytics event `daily_focus_completed`. „Cseréld le" → új AI javaslat ugyanabba a pillarba.

Edge function ütemezve **pg_cron-nal hétfő-vasárnap 06:00 CET**. Manuális „Frissítsd most" gomb is.

## 3) Heti review export (PDF)
Új edge function: `weekly-mission-review`. Generál egy 1-oldalas PDF-et a Founding Pitch stílusban (#050505 bg, cyan border-card, Liberation Sans), tartalom:
- Hét eleji vs. hét végi misszió-számok, delta
- Top 5 új partner / új waitlist source
- Italszponzor pitch readiness scorecard
- Következő hét 3 fókusz-feladata (AI generált)
- Lábléc: hét száma, dátum, „Come Get It — heti misszió review"

Trigger: `/admin/mission` jobb felső sarokban „Heti review (PDF)" gomb → meghívja a functiont → letöltés. **pg_cron vasárnap 18:00 CET** automatikusan generálja és `inbox_items`-be tesz egy „Heti review kész" kártyát letöltés-linkkel.

## 4) Mission timeline (kontextus a számhoz)
A detail oldal alján egy timeline (`activity_log` + `pipeline_transitions` + `waitlist_signups` mergelve), filterezve misszió-releváns eseményekre: új LOI, signed partner, waitlist milestone (100/250/500), italszponzor pitch interakció. Így látom **miért** mozdult vagy állt a szám.

## 5) Apró polishok a dashboard MissionTracker-en
- A 3 kártya bal felső sarkába kis trendnyíl (↑ +3 / hét, ↓ stagnál) — `daily_kpi_snapshots` 7 napi delta.
- Italszponzor stage manuálisan is állítható (jelenleg csak heurisztika): kis dropdown a kártyán admin role-nak.
- A `SEPTEMBER_DEADLINE` bug fix: ha már elmúlt (jövő évben futtatva), automatikusan jövő szept. 1-re ugorjon.

## Technikai részletek
**Új fájlok:**
- `src/pages/admin/AdminMission.tsx` (3-tabos detail nézet)
- `src/components/admin/mission/MissionPillarPanel.tsx` (sparkline + forecast + blockers)
- `src/components/admin/mission/MissionTimeline.tsx`
- `src/components/admin/dashboard/TodayTasksCard.tsx`
- `supabase/functions/generate-daily-focus/index.ts`
- `supabase/functions/weekly-mission-review/index.ts` (PDF gen — `jspdf` Deno-compatibilis)

**Migráció:**
- `daily_focus` táblán index: `(user_id, focus_date, priority)`, `completed_at` mező ha még nincs
- pg_cron: `daily-focus-morning` (06:00 CET), `weekly-mission-review-sunday` (18:00 CET)
- `daily_kpi_snapshots` — biztosítjuk hogy partner LOI count + waitlist count napi rögzítve van (ha nem, edge function `snapshot-daily-kpi` futtassa éjfélkor)

**Módosított:**
- `src/lib/admin-nav-config.ts` → "Szeptemberi misszió" phase-be új menüpont: „Misszió központ" (`/admin/mission`)
- `src/App.tsx` → új route `/admin/mission`
- `src/components/admin/dashboard/MissionTracker.tsx` → trendnyíl + sponsor stage dropdown + deadline bugfix
- `src/pages/admin/AdminDashboard.tsx` → `TodayTasksCard` integráció a Northstar helyett/mellett

**Nem ebben a fázisban:** drag-and-drop pipeline, bulk lead akciók, AI költség UI mélyítés, dropdown audit — ezek külön körben.

## Build sorrend
1. DB migráció (`daily_focus` index, cron jobok)
2. `generate-daily-focus` edge function + manuális trigger UI
3. `TodayTasksCard` a dashboardon
4. `AdminMission.tsx` váz + 3 tab (Partner / Waitlist / Sponsor pillar panelek)
5. Forecast számítás + sparkline
6. MissionTimeline
7. `weekly-mission-review` PDF function + letöltés gomb + vasárnapi cron
8. MissionTracker polish (trendnyíl, dropdown, deadline fix)
9. Playwright smoke: `/admin/mission` betölt, tab váltás, „Frissítsd most" működik, PDF letöltődik.
