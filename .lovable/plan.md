## Mi a baj most

A képen látható "0 partner jelölt" pontosan azt mutatja, ami a legnagyobb gond a jelenlegi rendszerrel:

1. **Focus és Tasks szétválik** — a `daily_focus.top_priorities` (3 stratégiai cél) és a `pipeline_tasks` (todo lista) **két külön univerzum**. A founder fejében ezek ugyanazok.
2. **Az autopilot egy lépésben próbál mindent** — kap egy "Vedd fel a kapcsolatot 5 új partnerrel" feladatot, lefuttat **1 SQL filter-t**, és ha az üres → vége. Nincs `retry`, nincs `fallback`, nincs *"akkor kutassak ki előbb újakat"* lépés.
3. **Nincs sub-goal felbontás** — egy task = egy lineáris script. Ha az AI úgy döntené hogy *"előbb kutassunk ki 10 jelöltet → score-oljuk → 3 legjobbra írjunk outreach-et"*, arra nincs vázlat.
4. **Nincs "human-in-the-loop"** — ha hiányzik egy email vagy bizonytalan egy döntés, csak elhasal. Nem mondja meg neked *"írd be a XY telefonszámot, aztán folytatom"*.

---

## Új koncepció: **Mission Loop** — egy agentikus ciklus Focus + Tasks + Tools összekötve

```text
┌─────────────────────────────────────────────────────────────────┐
│  REGGEL (vagy ✨ gombra)                                         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ 1. AI elemzi a mission gap-et (LOI 8/20, waitlist 120/500)│  │
│  │ 2. Generál 3 NAPI CÉL-t (= Focus = Tasks, egyben)         │  │
│  │    pl: "Mai cél: +3 új partner-meeting bookolva"          │  │
│  └───────────────────────────────────────────────────────────┘  │
│                            ↓                                     │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ FELADAT KÁRTYÁN: ✨ "Indítsd el az AI-t"                   │  │
│  │                            ↓                                │  │
│  │  AGENT LOOP (max 8 iteráció):                              │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │ THINK  → mi a köv. legjobb lépés a célhoz?            │  │  │
│  │  │ ACT    → tool hívás (lásd lent)                      │  │  │
│  │  │ OBSERVE→ eredmény értékelése                          │  │  │
│  │  │ if "blocked" → ASK_HUMAN (step-by-step instrukcióval) │  │  │
│  │  │ if "done"    → összegzés + döntés-kérés               │  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Tool-ok amiket az agent használhat (mind már létezik backend-en!)

| Tool | Mit csinál |
|---|---|
| `search_partners` | Lead-ek keresése filterrel (város, kategória, score, status) |
| `research_partner` | `lead-auto-research` 1 lead-re (Firecrawl + AI dossier) |
| `score_and_grade` | `score-lead` + `lead-grade-ai-bulk` |
| `draft_outreach` | `outreach-personalize` — email/IG draft 1 lead-re |
| `enroll_outreach` | sequence-be enrollol (draft állapotban) |
| `generate_image` | `generate-post-image` — IG vizuál mockup |
| `check_inbox` | nyitott inbox_items lekérése |
| `bulk_pipeline` | `lead-bulk-process` indítása több 10-100 lead-re |
| `ask_human` | UI-on megjeleníti: *"Step-by-step: 1) Hívd fel a XY-t…"* — várja az "kész" gombot |
| `finish` | összegzi az eredményt, döntés-kérés |

### Példa loop egy valós napi célra

**Cél:** *"+3 új partner-meeting bookolva (mission gap miatt magas prioritás)"*

```text
Iter 1 - THINK: "Először nézzünk meg, van-e már nyitott meeting-bookolható lead"
         ACT: search_partners(status="contacted", min_score=70, has_email=true)
         OBSERVE: 0 találat → pivot
         
Iter 2 - THINK: "Nincs warm lead. Kell új jelölteket kutatni."
         ACT: bulk_pipeline(category="koktélbár", city="Budapest", count=20)
         OBSERVE: 20 új lead scrapelve, research+score futás háttérben
         
Iter 3 - THINK: "Várok 30s a research-re, közben checkold az inbox-ot fontosabbra"
         ACT: check_inbox(severity="high")
         OBSERVE: 1 high (Andi visszaírt) → ez fontosabb mint a meeting cél
         
Iter 4 - ASK_HUMAN: 
         "Andi visszaírt 2 órája. Step-by-step:
          1) Nyisd meg az Inbox-ot
          2) Olvasd el az üzenetet
          3) Ha pozitív → kattints 'AI válasz írás'-ra
          4) Küldés után jelezd ide hogy 'kész'"
         [Várja a felhasználó OK gombját]
         
Iter 5 - THINK: "Ember kész. Vissza a fő célhoz."
         ACT: score_and_grade(partner_ids=[20 új])
         OBSERVE: 4 db A-grade lead
         
Iter 6 - ACT: draft_outreach × 3 (top 3 A-grade-re, meeting-booking tone)
         OBSERVE: 3 draft kész
         
Iter 7 - FINISH: 
         "Eredmény: 3 outreach draft kész meeting-booking CTA-val
          Mit szeretnél?
          [Auto-küldés mind a 3-ra] [Nézem egyenként] [Mentés draftnak]"
```

---

## Mit kell építeni

### A) DB schema bővítés (`task_runs` + új `mission_goals`)

```sql
-- task_runs-hoz: agent loop tárolás
ALTER TABLE task_runs ADD COLUMN goal text;
ALTER TABLE task_runs ADD COLUMN iterations jsonb DEFAULT '[]';  -- [{think, action, observation, ts}]
ALTER TABLE task_runs ADD COLUMN human_prompt jsonb;  -- {question, steps[], waiting_since}
ALTER TABLE task_runs ADD COLUMN tool_calls_count int DEFAULT 0;
ALTER TABLE task_runs ADD COLUMN max_iterations int DEFAULT 8;

-- Mission goal = napi cél (egyesíti focus + task fogalmat)
CREATE TABLE mission_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  goal_date date NOT NULL DEFAULT current_date,
  title text NOT NULL,           -- "Bookolj 3 új meetinget"
  why text,                       -- "LOI gap 12 db, határidő szept 1"
  pillar text,                    -- partner|waitlist|sponsor
  priority text DEFAULT 'med',
  target_metric jsonb,            -- {kind: "meetings_booked", value: 3}
  current_progress int DEFAULT 0, -- 0..target_metric.value
  status text DEFAULT 'open',     -- open|in_progress|done|skipped
  related_task_run_id uuid,       -- ha indul autopilot, ide kötjük
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
-- + grants + RLS + unique(user_id, goal_date, title)
```

A `daily_focus.top_priorities` **átmegy view-vá** ami a mai `mission_goals`-okat olvassa — visszafelé kompatibilis.

### B) Új edge function: `agent-loop`

Cseréli a `task-autopilot`-ot. ReAct mintát követ (Think-Act-Observe), `gemini-2.5-pro`-val mert ehhez kell a nagyobb context window.

```ts
// agent-loop/index.ts (vázlat)
const TOOLS = [
  { name: "search_partners", schema: {...} },
  { name: "research_partner", schema: {...} },
  { name: "bulk_pipeline", schema: {...} },
  { name: "draft_outreach", schema: {...} },
  { name: "check_inbox", schema: {...} },
  { name: "ask_human", schema: { question, steps[] } },
  { name: "finish", schema: { summary, decisions_needed[] } },
];

for (let i = 0; i < MAX_ITER; i++) {
  const decision = await aiTool({ goal, history, available_tools: TOOLS });
  if (decision.tool === "finish") break;
  if (decision.tool === "ask_human") {
    await db.update(runId, { status: "awaiting_human", human_prompt: decision.input });
    return; // UI veszi át, később resume-ol
  }
  const result = await executeTool(decision.tool, decision.input);
  iterations.push({ think: decision.reasoning, action: decision, observation: result });
  await db.update(runId, { iterations, tool_calls_count: i+1 });
}
```

### C) UI: `MissionLoopDialog` (a TaskAutopilotDialog helyett)

- Header: cél + progress bar (pl. 2/3 meeting bookolva)
- Stream-elt iteráció lista (Think → Act → Observe), realtime supabase channel
- Ha `status='awaiting_human'` → **nagy citromsárga kártya step-by-step instrukcióval** + ✓ "Kész, folytasd" gomb
- Ha `status='completed'` → összegzés kártya + döntés gombok ("Mind küldd ki", "Nézem", "Skip")
- Tool-call ikon mindenhol (🔍 search, 📧 outreach, 🖼 image, 🤝 human)

### D) DailyFocusCard átalakítás

- Cseréli a "Top 3 fókusz" üres listát → **3 Mission Goal kártya progress bar-ral**
- Mindegyik kártyán: ✨ "AI indítása" gomb → MissionLoopDialog
- Plusz egy gomb: 🪄 "AI generálja mind a 3 célt + auto-indítja párhuzamosan" (advanced)

### E) Cél-generálás javítás

A jelenlegi `generate-daily-focus` is megmarad, de:
- Inkább a mission gap → konkrét **mérhető cél** (pl. *"+3 meeting"*, *"+50 waitlist"*) és nem szöveges feladat
- A `target_metric` JSON segít az agent loop-nak tudni mikor **`finish`**-elhet

---

## Javasolt scope (válassz)

- **(1) MVP** — DB + `agent-loop` function + új MissionLoopDialog, 5 tool (search/research/draft/ask_human/finish). Cél-generálás marad. **~2-3 órás építés.**
- **(2) Teljes** — fenti + mission_goals tábla + DailyFocusCard átírás + progress tracking + minden 9 tool. **~fél nap.**
- **(3) Step-by-step** — most csak `agent-loop` + `ask_human` flow (a többi tool stub), hogy ki tudd próbálni a koncepciót. Ha tetszik, jöhet a többi. **~1 óra.**

Mondd meg melyik, és nekiállok.