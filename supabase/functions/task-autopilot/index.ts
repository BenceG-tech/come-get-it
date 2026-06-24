// @ts-nocheck
// Task Autopilot — given a daily_focus task, plans + executes the end-to-end
// workflow (find partners → research → personalize → draft enrollment) and
// writes progress into public.task_runs. Nothing is sent without user approval.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;

const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

type Task = {
  title: string;
  why?: string;
  mission_pillar?: "partner" | "waitlist" | "sponsor";
  entity_kind?: string | null;
  entity_id?: string | null;
  suggested_action?: string;
};

async function appendStep(runId: string, message: string, data: any = null) {
  const { data: row } = await admin.from("task_runs").select("steps").eq("id", runId).maybeSingle();
  const steps = Array.isArray(row?.steps) ? row.steps : [];
  steps.push({ at: new Date().toISOString(), message, data });
  await admin.from("task_runs").update({ steps }).eq("id", runId);
}

async function aiJson(prompt: string, system = "Csak érvényes JSON-t adj vissza, semmi mást.") {
  const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [{ role: "system", content: system }, { role: "user", content: prompt }],
      response_format: { type: "json_object" },
    }),
  });
  if (!r.ok) throw new Error(`AI ${r.status}: ${await r.text()}`);
  const j = await r.json();
  const raw = j?.choices?.[0]?.message?.content ?? "{}";
  try { return JSON.parse(raw); } catch {
    const m = raw.match(/\{[\s\S]*\}/);
    return m ? JSON.parse(m[0]) : {};
  }
}

async function runPartnerAutopilot(runId: string, task: Task) {
  // 1) Plan: AI extracts filters from the task description
  await appendStep(runId, "Tervet készítek a feladathoz…");
  const { data: seqs } = await admin.from("outreach_sequences")
    .select("id, name, kind").eq("active", true).eq("kind", "partner");
  const plan = await aiJson(
    `Egy magyar founder napi feladata. Ebből vonj ki strukturált tervet partner-outreach autopilothoz.

FELADAT:
- Cím: ${task.title}
- Miért: ${task.why ?? "—"}
- Javasolt akció: ${task.suggested_action ?? "—"}

ELÉRHETŐ SEQUENCE-EK:
${(seqs ?? []).map((s: any) => `- ${s.id} :: ${s.name}`).join("\n")}

Válasz JSON:
{
  "max_results": szám 3-20 között (alap 10),
  "city": "Budapest" | null,
  "category": string | null,  // pl. "kávézó", "bár", "bisztró"
  "statuses": ["lead","contacted"],  // status szűrő, alap ["lead","contacted"]
  "min_score": szám 0-100 | null,
  "sequence_id": a fenti listából a legrelevánsabb id (kötelező),
  "tone": "founding_pitch" | "casual" | "formal" (alap founding_pitch),
  "extra_instructions": "rövid hint a personalize-nek, mit hangsúlyozzon ebben a feladatban"
}`,
  );
  const sequence_id = plan.sequence_id || seqs?.[0]?.id;
  if (!sequence_id) throw new Error("Nincs aktív partner sequence");
  await appendStep(runId, "Terv kész", plan);

  // 2) Find partners
  let q = admin.from("partners").select("id, company_name, city, category, email, lead_score, status")
    .eq("type", "venue")
    .not("email", "is", null)
    .neq("email", "");
  const statuses = Array.isArray(plan.statuses) && plan.statuses.length ? plan.statuses : ["lead", "contacted"];
  q = q.in("status", statuses);
  if (plan.city) q = q.ilike("city", `%${plan.city}%`);
  if (plan.category) q = q.ilike("category", `%${plan.category}%`);
  if (typeof plan.min_score === "number") q = q.gte("lead_score", plan.min_score);
  q = q.order("lead_score", { ascending: false, nullsFirst: false }).limit(Math.max(3, Math.min(20, plan.max_results || 10)));

  const { data: candidates, error: candErr } = await q;
  if (candErr) throw candErr;
  await appendStep(runId, `${candidates?.length ?? 0} partner jelölt találva`, { ids: candidates?.map((c: any) => c.id) });

  if (!candidates || candidates.length === 0) {
    await admin.from("task_runs").update({ status: "awaiting_approval", generated: [] }).eq("id", runId);
    return;
  }

  // Skip those already enrolled in this sequence
  const { data: existing } = await admin.from("outreach_enrollments")
    .select("entity_id").eq("sequence_id", sequence_id)
    .in("entity_id", candidates.map((c: any) => c.id));
  const skip = new Set((existing ?? []).map((e: any) => e.entity_id));
  const targets = candidates.filter((c: any) => !skip.has(c.id));
  if (skip.size) await appendStep(runId, `${skip.size} már enrolled, kihagyom`);

  const generated: any[] = [];
  for (const p of targets) {
    await appendStep(runId, `Personalize: ${p.company_name}`);
    try {
      const r = await fetch(`${SUPABASE_URL}/functions/v1/outreach-personalize`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${SERVICE_ROLE}` },
        body: JSON.stringify({
          partner_id: p.id,
          sequence_id,
          step_index: 0,
          tone: plan.tone ?? "founding_pitch",
          extra_instructions: plan.extra_instructions ?? null,
        }),
      });
      if (!r.ok) throw new Error(`personalize ${r.status}`);
      const draft = await r.json();

      const { data: enr, error: enrErr } = await admin.from("outreach_enrollments").insert({
        sequence_id,
        entity_type: "partner",
        entity_id: p.id,
        current_step: 0,
        status: "draft",
        next_run_at: null,
        metadata: {
          source: "task-autopilot",
          task_run_id: runId,
          personalized_steps: [{ subject: draft.subject, body: draft.body, preheader: draft.preheader }],
        },
      }).select("id").single();
      if (enrErr) throw enrErr;

      generated.push({
        kind: "enrollment_draft",
        enrollment_id: enr.id,
        partner_id: p.id,
        partner_name: p.company_name,
        subject: draft.subject,
        body_preview: (draft.body ?? "").slice(0, 240),
      });
      await admin.from("task_runs").update({ generated }).eq("id", runId);
    } catch (e: any) {
      await appendStep(runId, `Hiba: ${p.company_name} — ${e?.message ?? e}`);
    }
  }

  await admin.from("task_runs").update({ status: "awaiting_approval" }).eq("id", runId);
  await appendStep(runId, `Kész — ${generated.length} draft vár jóváhagyásra.`);
}

async function runGenericTask(runId: string, task: Task) {
  await appendStep(runId, "Nem-partner feladat — pipeline taskot készítek.");
  const { data: t } = await admin.from("pipeline_tasks").insert({
    entity_type: task.entity_kind ?? "general",
    entity_id: task.entity_id ?? null,
    title: task.title,
    description: `${task.why ?? ""}\n\n${task.suggested_action ?? ""}`.trim(),
    due_at: new Date(Date.now() + 86400000).toISOString(),
    source: "task-autopilot",
    metadata: { task_run_id: runId },
  }).select("id").single();
  await admin.from("task_runs").update({
    status: "awaiting_approval",
    generated: [{ kind: "pipeline_task", task_id: t?.id, title: task.title }],
  }).eq("id", runId);
  await appendStep(runId, "Pipeline task létrehozva.");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { task, task_index } = await req.json();
    if (!task?.title) throw new Error("task.title required");

    // Auth: identify user
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
      task_signature: `${task.mission_pillar ?? "x"}::${task.title}`,
      task_payload: { task, task_index: task_index ?? null },
      status: "running",
      created_by: userId,
    }).select("id").single();
    if (runErr) throw runErr;

    // Run asynchronously, return run id immediately
    (async () => {
      try {
        if ((task.mission_pillar ?? "partner") === "partner") await runPartnerAutopilot(run.id, task);
        else await runGenericTask(run.id, task);
      } catch (e: any) {
        await admin.from("task_runs").update({ status: "failed", error: String(e?.message ?? e) }).eq("id", run.id);
        await appendStep(run.id, `Hiba: ${e?.message ?? e}`);
      }
    })();

    return new Response(JSON.stringify({ run_id: run.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
