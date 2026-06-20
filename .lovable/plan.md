# Fázis 2 — AI munkatársak

Cél: a Cockpit adataira építve napi és heti AI-asszisztens funkciók, plusz hangalapú gyorsrögzítés.

## 1. Napi AI briefing
**Új tábla**: `daily_briefings` (id, date unique, summary_md, highlights jsonb, suggested_focus jsonb, created_at) — RLS admin-only, service_role full.

**Edge function**: `daily-briefing`
- Lekéri az utolsó 7 nap `daily_kpi_snapshots`, nyitott `partners` (stage != signed/lost), tegnapi `metric_events`, mai `marketing_calendar` bejegyzéseket.
- Gemini Flash (`google/gemini-3-flash-preview`) prompttal strukturált markdown briefinget generál: "Tegnap történt", "Mai fókusz javaslat", "Figyelmeztetések", "Top 3 akció".
- Mentés `daily_briefings`-be + opcionális Resend email küldés `hello@come-get-it.app`-ra.
- pg_cron: minden reggel 07:00 (Budapest = 06:00 UTC télen / 05:00 nyáron — fix 05:00 UTC, megjegyzéssel).

**UI**: `AdminDashboard` tetejére új `DailyBriefingCard` — mai briefing megjelenítése (react-markdown), "Újragenerálás" gomb, "Fókusz átemelése" gomb ami a 3 javaslatot beírja a `DailyFocusCard`-ba.

## 2. Hangalapú jegyzet → feladat
**Új tábla**: `voice_notes` (id, user_id, audio_path nullable, transcript, structured jsonb, action_type, target_table, target_id nullable, status: pending/applied/dismissed, created_at) — RLS admin-only.

**Edge function**: `voice-capture`
- Input: base64 audio (webm/opus) vagy közvetlen szöveg.
- STT: Gemini 2.5 Flash multimodal (audio input támogatott a gateway-en) — fallback szövegre ha hangrögzítés nem megy.
- Strukturálás: prompt → JSON `{intent: "task"|"lead_note"|"content_idea"|"focus", title, body, fields}`.
- Mentés `voice_notes`-ba `pending` státusszal, válasz a klienshez.

**UI komponens**: `VoiceRecorderButton.tsx` (új) — floating action button az admin layout jobb alsó sarkában (`/admin/*` route-okon). MediaRecorder API, max 60s, közben pulzáló piros pont. Felvétel után modal: transcript + strukturált javaslat + "Mentés ide:" választó (feladat / lead-jegyzet / content-ötlet / mai fókusz) → megfelelő táblába ír (pl. content-ötlet → `saved_content_snippets`, lead-jegyzet → `partner_interactions`).

## 3. Heti retrospektíva + cél tracking
**Új táblák**:
- `weekly_goals` (id, user_id, week_start date, title, metric, target numeric, actual numeric default 0, status, created_at) — RLS admin-only.
- `weekly_retros` (id, week_start date unique, summary_md, wins jsonb, blockers jsonb, next_week_focus jsonb, kpi_delta jsonb, created_at) — RLS admin-only.

**Edge function**: `weekly-retro`
- Lekéri elmúlt 7 nap `daily_kpi_snapshots`, `time_logs`, `daily_focus`, `metric_events`, `weekly_goals` aktuálisokat.
- Gemini prompt → OKR-stílusú összegzés: mit értünk el, hol csúsztunk, miért, jövő heti javaslat 3 cél formájában.
- Mentés `weekly_retros`-ba; auto-létrehozza a következő heti `weekly_goals` rekordokat `pending` jelleggel (user később jóváhagy/szerkeszt).
- pg_cron: szombat 20:00 (helyi) = 18:00 UTC.

**Új oldal**: `/admin/retro`
- Aktuális hét célok kártyái (progress bar metric vs actual — `actual` érték a `metric_events`-ből aggregálva: pl. waitlist_signup darabszám).
- Cél hozzáadás/szerkesztés inline.
- Heti retro lista (legutóbbi felül, markdown).
- "Most generálj retrot" gomb.
- Link a `AdminDashboard` Cockpit sorában új mini `WeeklyGoalsCard`-on keresztül.

## 4. Integrációk
- `track.ts` kibővítve: `voice_note_created`, `briefing_generated`, `retro_generated`, `goal_progress` események `metric_events`-be.
- `kpi-snapshot` kiegészítése: `weekly_goals.actual` mezők frissítése a hét eseményeiből.
- AdminLayout: `VoiceRecorderButton` mount, csak ha `has_role(admin)`.
- Nav: új menüpont "Heti retro" (`/admin/retro`).

## Technikai részletek
- **Edge functions**: `daily-briefing`, `voice-capture`, `weekly-retro` — mind `verify_jwt = false` + in-code admin ellenőrzés (`has_role`).
- **Secrets**: `LOVABLE_API_KEY` (van), `RESEND_API_KEY` (van), `SUPABASE_SERVICE_ROLE_KEY` (van) — nem kell újat kérni.
- **pg_cron**: 2 új job (`daily-briefing` 05:00 UTC, `weekly-retro` szombat 18:00 UTC). A meglévő 23:00 UTC `kpi-snapshot` mellé.
- **Email**: Resend-en keresztül `daily-briefing` HTML body (markdown → HTML konverzió a function-ben), opt-in (env flag `BRIEFING_EMAIL_ENABLED`).
- **react-markdown**: már elérhető a projektben.
- **MediaRecorder fallback**: ha böngésző nem támogatja, csak szöveges input modal.

## Szállítási sorrend (egy körben)
1. Migráció (4 új tábla + 2 cron job).
2. 3 edge function.
3. `VoiceRecorderButton` + admin layout integráció.
4. `DailyBriefingCard` a dashboardra.
5. `/admin/retro` oldal + `WeeklyGoalsCard` widget.
6. Nav frissítés.

Jóváhagyás után megyek és teljes Fázis 2-t egyben szállítom. Utána Fázis 3 (Content & Marketing mélyítés) következik.
