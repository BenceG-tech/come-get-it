// @ts-nocheck
// agent-loop — ReAct-style agent that pursues a goal by calling tools.
// Saves each iteration to task_runs.iterations, can pause for human input
// via status='awaiting_human' + human_prompt, and resumes via /resume call.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

// ─────────────────────────────── TOOLS ───────────────────────────────

const TOOL_SCHEMAS = [
  {
    type: "function",
    function: {
      name: "search_partners",
      description: "Vendéglátóhely leadek keresése. Használd hogy lássuk milyen partnerek elérhetőek a célhoz.",
      parameters: {
        type: "object",
        properties: {
          status: { type: "array", items: { type: "string" }, description: "lead, contacted, negotiating, proposal_sent" },
          city: { type: "string" },
          category: { type: "string", description: "pl. koktélbár, kávézó" },
          min_score: { type: "number" },
          min_grade: { type: "string", enum: ["A", "B", "C", "D"] },
          has_email: { type: "boolean" },
          limit: { type: "number", default: 10 },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "bulk_pipeline",
      description: "Több lead-re egyszerre lefuttatja a Research + Score + Grade pipeline-t háttérben. ~6 perc / 100 lead.",
      parameters: {
        type: "object",
        properties: { partner_ids: { type: "array", items: { type: "string" } } },
        required: ["partner_ids"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "draft_outreach",
      description: "Personalizált outreach email/IG draft-ot készít egy lead-re. Nem küldi el, csak draft.",
      parameters: {
        type: "object",
        properties: {
          partner_id: { type: "string" },
          tone: { type: "string", enum: ["founding_pitch", "casual", "formal"], default: "founding_pitch" },
          extra_instructions: { type: "string" },
        },
        required: ["partner_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "check_inbox",
      description: "Nyitott inbox itemek listázása (visszaírások, decision review-k, riasztások).",
      parameters: {
        type: "object",
        properties: { severity: { type: "string", enum: ["high", "med", "info"] }, limit: { type: "number", default: 10 } },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "mission_snapshot",
      description: "Mai mission gap: hány partner, hány waitlist signup vs cél.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "ask_human",
      description: "Ha az AI-nek emberi segítségre van szüksége (info hiányzik, döntés kell, offline lépés). Részletes step-by-step instrukciókkal.",
      parameters: {
        type: "object",
        properties: {
          question: { type: "string", description: "Egy mondatos összefoglaló" },
          steps: { type: "array", items: { type: "string" }, description: "Konkrét lépések amit a felhasználónak meg kell tennie" },
          why: { type: "string", description: "Miért most ez kell" },
        },
        required: ["question", "steps"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "finish",
      description: "Cél elérve vagy nem lehet tovább menni. Add meg az összegzést és a felhasználónak felajánlott döntéseket.",
      parameters: {
        type: "object",
        properties: {
          summary: { type: "string" },
          outcomes: { type: "array", items: { type: "string" } },
          decisions_needed: { type: "array", items: { type: "string" } },
        },
        required: ["summary"],
      },
    },
  },
];

// ─────────────────────────────── TOOL EXECUTION ───────────────────────────────

async function executeTool(name: string, input: any): Promise<any> {
  switch (name) {
    case "search_partners": {
      let q = admin.from("partners").select("id, company_name, city, category, email, lead_score, lead_grade, status").eq("type", "venue");
      if (Array.isArray(input.status) && input.status.length) q = q.in("status", input.status);
      if (input.city) q = q.ilike("city", `%${input.city}%`);
      if (input.category) q = q.ilike("category", `%${input.category}%`);
      if (typeof input.min_score === "number") q = q.gte("lead_score", input.min_score);
      if (input.min_grade) q = q.in("lead_grade", { A: ["A"], B: ["A", "B"], C: ["A", "B", "C"], D: ["A", "B", "C", "D"] }[input.min_grade] ?? ["A"]);
      if (input.has_email) q = q.not("email", "is", null).neq("email", "");
      q = q.order("lead_score", { ascending: false, nullsFirst: false }).limit(Math.min(50, input.limit ?? 10));
      const { data, error } = await q;
      if (error) return { error: error.message };
      return { count: data?.length ?? 0, leads: data ?? [] };
    }
    case "bulk_pipeline": {
      const r = await fetch(`${SUPABASE_URL}/functions/v1/lead-bulk-process`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${SERVICE_ROLE}` },
        body: JSON.stringify({ partner_ids: input.partner_ids }),
      });
      return await r.json();
    }
    case "draft_outreach": {
      const { data: seqs } = await admin.from("outreach_sequences").select("id").eq("active", true).eq("kind", "partner").limit(1);
      const sequence_id = seqs?.[0]?.id;
      if (!sequence_id) return { error: "Nincs aktív partner sequence" };
      const r = await fetch(`${SUPABASE_URL}/functions/v1/outreach-personalize`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${SERVICE_ROLE}` },
        body: JSON.stringify({
          partner_id: input.partner_id,
          sequence_id,
          step_index: 0,
          tone: input.tone ?? "founding_pitch",
          extra_instructions: input.extra_instructions ?? null,
        }),
      });
      if (!r.ok) return { error: `personalize ${r.status}` };
      const draft = await r.json();
      return { subject: draft.subject, body_preview: (draft.body ?? "").slice(0, 240), full_body_length: (draft.body ?? "").length };
    }
    case "check_inbox": {
      const today = new Date().toISOString();
      let q = admin.from("inbox_items").select("id, title, severity, kind, entity_kind, entity_id")
        .eq("status", "open").or(`snoozed_until.is.null,snoozed_until.lte.${today}`).limit(input.limit ?? 10);
      if (input.severity) q = q.eq("severity", input.severity);
      const { data } = await q;
      return { count: data?.length ?? 0, items: data ?? [] };
    }
    case "mission_snapshot": {
      const [{ count: loi }, { count: wl }] = await Promise.all([
        admin.from("partners").select("id", { count: "exact", head: true }).in("status", ["proposal_sent", "negotiating", "signed"]),
        admin.from("waitlist_signups").select("id", { count: "exact", head: true }),
      ]);
      return {
        loi: { current: loi ?? 0, target: 20, gap: Math.max(0, 20 - (loi ?? 0)) },
        waitlist: { current: wl ?? 0, target: 500, gap: Math.max(0, 500 - (wl ?? 0)) },
        deadline: "2026-09-01",
      };
    }
    default:
      return { error: `Unknown tool: ${name}` };
  }
}

// ─────────────────────────────── LOOP ───────────────────────────────

async function appendIteration(runId: string, iter: any) {
  const { data } = await admin.from("task_runs").select("iterations, tool_calls_count").eq("id", runId).maybeSingle();
  const iterations = Array.isArray(data?.iterations) ? data.iterations : [];
  iterations.push({ ...iter, at: new Date().toISOString() });
  await admin.from("task_runs").update({ iterations, tool_calls_count: (data?.tool_calls_count ?? 0) + 1 }).eq("id", runId);
}

async function aiDecide(goal: string, history: any[]): Promise<any> {
  const systemPrompt = `Te egy magyar founder autonóm agentje vagy a Come Get It (drink-rewards app) startup-nál.
A küldetésed: szeptember 1-ig 20 partner LOI és 500 waitlist signup.

A te dolgod most: a megadott NAPI CÉL eléréséhez tervezz és cselekedj LÉPÉSRŐL LÉPÉSRE.
Minden lépésben:
1. THINK: rövid magyar gondolkodás (max 2 mondat) — mit látsz, mi a következő legjobb lépés
2. TOOL CALL: válaszd ki a megfelelő tool-t

KEMÉNY SZABÁLYOK:
- TILOS ugyanazt a tool-t ugyanazokkal a paraméterekkel kétszer hívni. Ha egy lekérdezés üres (count=0), NE próbáld újra — vagy más szűrővel próbáld, vagy hívd a finish/ask_human-t.
- Ha 2 lépés alatt nem találsz semmi értelmes adatot a feladathoz → hívd az ask_human-t konkrét step-by-step instrukcióval, hogy a founder kézzel mit tegyen.
- Ha a feladat dokumentum-review / inbox-takarítás és üres az inbox → finish "Inbox üres, nincs teendő" összegzéssel.
- Ha találtál releváns leadeket → bulk_pipeline VAGY draft_outreach a következő logikus lépés.
- Ha info hiányzik (pl. nincs még scrape-elt lead) → ask_human "Indítsd a /admin/leads → Scrape gombot" lépéssel.
- Maximum 6 iteráció — légy hatékony, ne köröggj.

Az ask_human ÉS finish összegzések MINDIG magyar, természetes, emberi mondatok legyenek — sosem JSON vagy tech-szöveg.`;

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: `MAI CÉL: ${goal}` },
  ];

  for (const iter of history) {
    if (iter.think) messages.push({ role: "assistant", content: `Gondolkodás: ${iter.think}\nTool: ${iter.tool}(${JSON.stringify(iter.input)})` });
    if (iter.observation) messages.push({ role: "user", content: `Eredmény (${iter.tool}): ${JSON.stringify(iter.observation).slice(0, 1200)}` });
    if (iter.human_response) messages.push({ role: "user", content: `Felhasználó válasza: ${JSON.stringify(iter.human_response)}` });
  }

  const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages,
      tools: TOOL_SCHEMAS,
      tool_choice: "required",
    }),
  });
  if (!r.ok) throw new Error(`AI ${r.status}: ${await r.text()}`);
  const j = await r.json();
  const msg = j?.choices?.[0]?.message;
  const tc = msg?.tool_calls?.[0];
  if (!tc) throw new Error("AI nem hívott tool-t");
  return {
    think: msg.content ?? "",
    tool: tc.function.name,
    input: JSON.parse(tc.function.arguments || "{}"),
  };
}

function isEmptyObservation(obs: any): boolean {
  if (!obs || typeof obs !== "object") return false;
  if (obs.error) return true;
  if (typeof obs.count === "number" && obs.count === 0) return true;
  if (Array.isArray(obs.items) && obs.items.length === 0) return true;
  if (Array.isArray(obs.leads) && obs.leads.length === 0) return true;
  return false;
}

function isDuplicateCall(history: any[], tool: string, input: any): boolean {
  const key = `${tool}::${JSON.stringify(input ?? {})}`;
  return history.some((h) => `${h.tool}::${JSON.stringify(h.input ?? {})}` === key);
}

async function runLoop(runId: string) {
  const { data: run } = await admin.from("task_runs").select("goal, iterations, max_iterations").eq("id", runId).maybeSingle();
  if (!run) return;
  const maxIter = Math.min(run.max_iterations ?? 6, 6);
  let history = Array.isArray(run.iterations) ? [...run.iterations] : [];
  let consecutiveEmpty = 0;

  while (history.length < maxIter) {
    let decision: any;
    try {
      decision = await aiDecide(run.goal, history);
    } catch (e: any) {
      await admin.from("task_runs").update({ status: "failed", error: e?.message ?? String(e) }).eq("id", runId);
      return;
    }

    // Dedup guard: if AI repeats a tool+input it already tried, force ask_human
    if (
      decision.tool !== "ask_human" &&
      decision.tool !== "finish" &&
      isDuplicateCall(history, decision.tool, decision.input)
    ) {
      const askInput = {
        question: "Az AI elakadt — ugyanazt a lekérdezést ismételné, ami már nem hozott új eredményt.",
        steps: [
          "Nézd meg, hogy van-e elég adat a rendszerben (pl. scrape-elt leadek a /admin/leads alatt).",
          "Ha üres az adatbázis, indíts egy új Apify scrape-et a célváros / kategória szerint.",
          "Ha van adat, fogalmazd át a célt konkrétabbra (pl. 'Budapesti koktélbárok, A-grade, email van').",
          "Utána nyomj 'Kész — folytasd'-ot és az AI újra próbálja.",
        ],
        why: "Elkerüljük, hogy az AI hülyén köröggön ugyanazon a lekérdezésen.",
      };
      await appendIteration(runId, { think: decision.think, tool: "ask_human", input: askInput, awaiting_human: true });
      await admin.from("task_runs").update({
        status: "awaiting_human",
        human_prompt: { ...askInput, asked_at: new Date().toISOString() },
      }).eq("id", runId);
      return;
    }

    if (decision.tool === "ask_human") {
      await appendIteration(runId, { think: decision.think, tool: "ask_human", input: decision.input, awaiting_human: true });
      await admin.from("task_runs").update({
        status: "awaiting_human",
        human_prompt: { ...decision.input, asked_at: new Date().toISOString() },
      }).eq("id", runId);
      return;
    }

    if (decision.tool === "finish") {
      await appendIteration(runId, { think: decision.think, tool: "finish", input: decision.input });
      await admin.from("task_runs").update({
        status: "completed",
        final_summary: decision.input.summary,
        generated: decision.input.outcomes ?? [],
      }).eq("id", runId);
      return;
    }

    const observation = await executeTool(decision.tool, decision.input);
    await appendIteration(runId, { think: decision.think, tool: decision.tool, input: decision.input, observation });
    history.push({ think: decision.think, tool: decision.tool, input: decision.input, observation });

    // Track consecutive empty results
    if (isEmptyObservation(observation)) {
      consecutiveEmpty += 1;
    } else {
      consecutiveEmpty = 0;
    }

    // After 2 empty results in a row, escalate to human instead of looping more
    if (consecutiveEmpty >= 2) {
      const askInput = {
        question: "Nem találok releváns adatot a feladathoz — kérek emberi inputot.",
        steps: [
          "Ellenőrizd, hogy van-e friss scrape-elt lead a /admin/leads oldalon.",
          "Ha nincs, indíts új Apify scrape-et (pl. Budapest, koktélbár).",
          "Vagy zárd le ezt a feladatot készként, ha amúgy sem aktuális.",
        ],
        why: `${consecutiveEmpty} egymást követő üres lekérdezés után megálltam, hogy ne pazaroljam az AI hívásokat.`,
      };
      await appendIteration(runId, { think: "Több egymást követő üres eredmény — megállok és emberi segítséget kérek.", tool: "ask_human", input: askInput, awaiting_human: true });
      await admin.from("task_runs").update({
        status: "awaiting_human",
        human_prompt: { ...askInput, asked_at: new Date().toISOString() },
      }).eq("id", runId);
      return;
    }
  }

  await admin.from("task_runs").update({
    status: "completed",
    final_summary: `Elértem a maximum ${maxIter} lépést. Részleges eredmény mentve — nézd át a fenti lépéseket és döntsd el a következő lépést.`,
  }).eq("id", runId);
}


// ─────────────────────────────── HTTP ───────────────────────────────

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const url = new URL(req.url);
    const body = await req.json().catch(() => ({}));

    // RESUME: continue a paused loop with the user's response
    if (body.action === "resume" && body.run_id) {
      const { data: run } = await admin.from("task_runs").select("iterations").eq("id", body.run_id).maybeSingle();
      const iterations = Array.isArray(run?.iterations) ? run.iterations : [];
      const last = iterations[iterations.length - 1];
      if (last) last.human_response = body.human_response ?? { ok: true };
      await admin.from("task_runs").update({
        iterations, status: "running", human_prompt: null,
        human_response: body.human_response ?? { ok: true },
      }).eq("id", body.run_id);
      // @ts-ignore
      if (typeof EdgeRuntime !== "undefined" && EdgeRuntime?.waitUntil) {
        // @ts-ignore
        EdgeRuntime.waitUntil(runLoop(body.run_id));
      } else {
        runLoop(body.run_id).catch(() => {});
      }
      return new Response(JSON.stringify({ ok: true, run_id: body.run_id, status: "running" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // START
    const { goal, task } = body;
    if (!goal && !task?.title) throw new Error("goal or task.title required");
    const goalText = goal || `${task.title}${task.why ? ` — ${task.why}` : ""}${task.suggested_action ? `\nJavasolt: ${task.suggested_action}` : ""}`;

    const authHeader = req.headers.get("Authorization");
    let userId: string | null = null;
    if (authHeader) {
      const userClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data: u } = await userClient.auth.getUser();
      userId = u?.user?.id ?? null;
    }

    const { data: run, error: runErr } = await admin.from("task_runs").insert({
      task_signature: `agent::${goalText.slice(0, 80)}`,
      task_payload: { goal: goalText, task: task ?? null },
      goal: goalText,
      loop_kind: "agent_react",
      status: "running",
      created_by: userId,
      max_iterations: 8,
    }).select("id").single();
    if (runErr) throw runErr;

    // @ts-ignore
    if (typeof EdgeRuntime !== "undefined" && EdgeRuntime?.waitUntil) {
      // @ts-ignore
      EdgeRuntime.waitUntil(runLoop(run.id));
    } else {
      runLoop(run.id).catch(() => {});
    }

    return new Response(JSON.stringify({ run_id: run.id, status: "running" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
