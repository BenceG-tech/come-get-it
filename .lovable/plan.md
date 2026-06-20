
# Fázis 3 — Content & Marketing mélyítés

Cél: a Content Studio + Marketing naptár szorosabb összekötése, brief-alapú többcsatornás poszt-generálás, vizuális ütemezés és teljesítmény visszacsatolás. Az AI Workmates (Fázis 2) outputjait (briefing, voice notes, weekly goals) becsatornázzuk a tartalomgyártásba.

## 1. Brief → Post pipeline

**Új tábla**: `content_briefs`
- `id, title, angle, target_audience, channel_mix jsonb, key_points jsonb, cta, tone, source_type (manual|ai|voice|document|briefing), source_id, status (draft|approved|in_production|published|archived), scheduled_for, created_by, created_at`
- RLS admin-only, service_role full.

**Workflow**:
1. Brief létrehozás: manuálisan, vagy `suggest-content-briefs` edge functionből (már létezik), vagy voice note `content_idea` intentből, vagy daily briefing `Top 3 akció` alapján.
2. Brief jóváhagyás → `generate-multi-format` (létezik) hívása → `content_generations` rekordok minden csatornára (IG, FB, LinkedIn, blog, email).
3. Minden generáció `saved_content_snippets`-be menthető vagy közvetlenül `marketing_calendar`-ba ütemezhető.

**Új edge function**: `brief-to-posts`
- Input: `brief_id`.
- Lekéri brief + brand_knowledge + utolsó 5 hasonló snippet (context).
- Gemini Flash prompt → csatornánként optimalizált poszt (hossz, hashtag, hook).
- Eredmény minden csatornára `content_generations` + opcionális `marketing_calendar` entry `draft` státusszal.

## 2. Marketing naptár mélyítés

**Naptár fejlesztések** (`AdminCalendar.tsx`):
- **Hét/hónap nézet kapcsoló** (jelenleg csak lista) — drag-and-drop reschedule.
- **Csatorna-sávok**: minden naphoz csatorna-oszlopok (IG/FB/LI/blog/email) színkódolva.
- **Konfliktus-warning**: ha 1 napon >2 poszt ugyanazon a csatornán.
- **"Üres napok" jelzés**: piros pötty ahol nincs ütemezve semmi és nincs `weekly_goals` mentő ok.

**Új tábla mező**: `marketing_calendar.brief_id` (fk `content_briefs`, nullable) — visszakövethetőség.

**Új edge function**: `calendar-autofill`
- Input: `start_date, end_date, channels[], target_per_week`.
- Lekéri nyitott `content_briefs` (status=approved) + ünnepnapok + meglévő calendar entries.
- AI elosztja a briefeket az üres napokra balance szerint (csatorna mix + frekvencia).
- Output: javasolt calendar entries `pending_review` státusszal, user 1 kattintással jóváhagy.

## 3. Snippet könyvtár (`saved_content_snippets`) felokosítás

**UI**: új `/admin/content/library` szekció (Content Studio aloldal vagy tab):
- Szűrés csatorna, tone, kampány, tag szerint.
- "Reuse" gomb: snippet betöltése új generáció seedjeként.
- "Performance" oszlop: ha publikált → ide kerülhet később CTR/like adat (kézi vagy integráció).

**Új tábla**: `snippet_performance`
- `snippet_id, channel, impressions, clicks, reactions, comments, shares, recorded_at, source (manual|meta_api|linkedin_api)`.
- Egyelőre manuális input, később API integráció előkészítve.

## 4. Heti content sprint nézet

**Új komponens**: `WeeklyContentSprintCard` (a dashboard Cockpitba vagy `/admin/content` tetejére):
- Ezen a héten: X poszt tervezve, Y publikálva, Z draft.
- Cél: `weekly_goals` "content" típusú célok progress barja.
- Hiányzó csatornák figyelmeztetés.

## 5. AI tone/brand őr

**Új edge function**: `content-brand-check`
- Input: szöveg + csatorna.
- Lekéri `brand_knowledge` (tone, do/don't, banned phrases).
- Output: score (0-100), találatok (banned phrase, tone mismatch), átírási javaslat.
- Integráció: minden `generate-multi-format` és `brief-to-posts` output automatikusan átfut → ha score < 70, figyelmeztetés a UI-on.

## 6. Tracking + integráció

- `track.ts` bővítés: `brief_created`, `brief_approved`, `brief_to_posts_generated`, `calendar_autofilled`, `snippet_reused`, `brand_check_warning`.
- `kpi-snapshot` bővítés: `briefs_in_pipeline`, `posts_published_week`, `avg_brand_score`.
- `daily-briefing` bővítés: "Mai naptár" + "Lejárt briefek" szekció.
- `weekly-retro` bővítés: content KPI (publikált posztok / cél, top performing snippet).

## 7. Szállítási sorrend

1. Migráció: `content_briefs`, `snippet_performance`, `marketing_calendar.brief_id` mező, grants + RLS.
2. Edge functions: `brief-to-posts`, `calendar-autofill`, `content-brand-check`.
3. `AdminContentStudio` kiegészítés: Brief lista + Brief→Post workflow UI.
4. `AdminCalendar` átírás: hét/hónap nézet, drag-drop, csatorna sávok, autofill gomb.
5. Snippet library UI (új tab a Content Studioban).
6. `WeeklyContentSprintCard` widget + Cockpit/Content Studio integráció.
7. Brand check beépítés a generálási flow-kba (warning badge).
8. `track.ts`, `kpi-snapshot`, `daily-briefing`, `weekly-retro` bővítések.

## Technikai részletek

- Drag-drop: `@dnd-kit/core` (telepíteni kell), vagy meglévő minta a Kanbanból (`LeadsKanban` HTML5 drag).
- Naptár UI: nem külső lib — saját CSS grid hét/hónap nézet, hogy a Neon Fidelity stílus megmaradjon.
- `content-brand-check` LOVABLE_API_KEY-jel, Gemini Flash, JSON mód.
- `calendar-autofill` determinisztikus elosztás + AI csak a sorrendre — gyors és olcsó.
- Minden új edge function `verify_jwt = false` + in-code `has_role(admin)` ellenőrzés.
- Nincs új secret szükséglet.

## Jóváhagyás után

Egy körben szállítom a fenti 8 lépést. Utána Fázis 4 (Partner/Lead CRM pipeline + outreach automatizálás) következik.
