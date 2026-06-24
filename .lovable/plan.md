
# Cél

A "Mai 3 feladat" kártyán minden feladat mellé kerüljön egy **"AI végrehajtja"** gomb. Egy klikkre az AI:
1. értelmezi a feladat célját,
2. megkeresi/kiválasztja a szükséges entitásokat (pl. 20 megfelelő partner),
3. elvégzi a részfeladatokat (kutatás → személyre szabott email-draft → enrolment vagy ajánlott küldés),
4. minden lépésről eseménynaplót ír és a végén egy összegző "approve" képernyőt mutat.

Most a kártya csak megnyit egy oldalt — innentől a Lovable AI Gateway alapú agent loop tényleg végrehajtja a munkát.

## Hogyan néz ki a UX

`TodayTasksCard.tsx` minden task során:
- balra checkbox + cím (mint most)
- jobbra új gomb: **„AI végrehajtja"** (Zap ikon)
- klikk → modal: `TaskAutopilotDialog`
  - Élő step-stream (mit csinál épp az AI: „Lekérek 50 jelöltet… 22 illik a profilba… kutatás 5 partnerre… email-draft generálva…")
  - Végén: lista a generált draftokról / létrehozott enrollmentekről / új taskokról → **„Mind jóváhagy"** vagy egyenként pipálható.
  - Soha nem küld emailt jóváhagyás nélkül — csak draftol és enrollment-et javasol `status='draft'`-tal.

## Backend — új edge function: `task-autopilot`

Input: `{ task: <Task JSON a daily_focus-ból> }`

Felépítés AI SDK + tool calling-gel (`ai-sdk-agent-patterns`, `stopWhen: stepCountIs(50)`):

**Tools (mind `execute` a service role klienssel):**
- `find_partners({ filters: { city?, category?, status?, min_score?, has_email?, max_results } })` → partner ID + alap mezők listája. SQL a `partners` táblára.
- `research_partner({ partner_id })` → meghívja a meglévő `lead-auto-research` functiont.
- `personalize_email({ partner_id, sequence_id?, tone?, extra_instructions? })` → meghívja `outreach-personalize`-t, draftot ad vissza.
- `create_enrollment_draft({ partner_id, sequence_id, personalized_steps })` → `outreach_enrollments` insert `status='draft'`, `next_run_at=null`. (Új status érték: lásd lent.)
- `create_pipeline_task({ entity_id, title, description, due_at })` → `pipeline_tasks` insert manuális teendőkhöz (pl. „hívd fel").
- `log_step({ message, data })` → stream-el a UI felé.

**Rendszerprompt:** magyar, "Te a Come Get It founder asszisztense vagy. A feladat: {task.title} — {task.why}. Először `find_partners`-t hívj a feladat kontextusából kikövetkeztetett szűrőkkel (alap: type=venue, status=lead vagy contacted, has_email, max 20). Utána a top jelöltekre `research_partner` + `personalize_email`. Végül minden partnerre `create_enrollment_draft`. Semmit ne küldj el, csak draftolj."

**Stream**: `streamText` + `toUIMessageStreamResponse`, a kliens AI SDK `useChat`-szerű transporttal olvassa a `log_step` üzeneteket.

## DB változás (egy migráció)

- `outreach_enrollments.status` jelenleg szabad text/enum — adunk hozzá `'draft'` értéket (vagy ha enum, `ALTER TYPE ... ADD VALUE 'draft'`). `outreach-tick` már nem nyúl hozzá, mert csak `active`-ot dolgoz fel.
- Új tábla: `task_runs` — futások naplója.
  ```
  id uuid pk, task_signature text, task_payload jsonb,
  status text ('running'|'awaiting_approval'|'approved'|'failed'),
  steps jsonb (log_step üzenetek),
  generated jsonb (létrejött enrollment/task ID-k),
  created_by uuid, created_at, updated_at
  ```
  GRANT + RLS: csak admin lát/ír (`has_role(auth.uid(),'admin')`).

## Approve flow

`TaskAutopilotDialog` a `task_runs.generated`-ből listázza:
- Draft enrollmentek → "Aktivál" gomb: `update outreach_enrollments set status='active', next_run_at=now()`.
- Új pipeline taskok → linkek a partnerre.
- "Mind elfogad" tömegesen.
A `daily_focus.top_priorities[i].completed = true` automatikusan, amint legalább egy generált artifact jóváhagyásra kerül.

## Érintett fájlok

**Új**
- `supabase/functions/task-autopilot/index.ts` — agent loop AI SDK-val
- `supabase/functions/_shared/autopilot-tools.ts` — tool definíciók
- `src/components/admin/dashboard/TaskAutopilotDialog.tsx` — modal + stream renderer + approve UI
- migráció: `task_runs` tábla + `outreach_enrollments.status='draft'`

**Módosított**
- `src/components/admin/dashboard/TodayTasksCard.tsx` — „AI végrehajtja" gomb minden taskon
- `supabase/functions/_shared/brand-context.ts` — ha kell extra autopilot kontextus (opcionális)

## Out of scope (most)

- Tényleges email küldés autopilotból — mindig draft marad, user approve-olja.
- Cross-pillar taskok (waitlist/sponsor) végrehajtó tooljai — most csak partner pillarra van end-to-end tooling, a többinél a UI a megfelelő oldalra navigál + draft pipeline taskot készít.
- Háttér-folytatás bezárt modal után (most a stream a modal élettartamára szól; `task_runs` perzisztálódik, később folytatható).
