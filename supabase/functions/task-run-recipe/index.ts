// @ts-nocheck
// task-run-recipe — Determinisztikus recept-alapú task futtató.
// 1) AI klasszifikálja a feladatot egyetlen recipe_type-ra + paramétereket húz ki.
// 2) A megfelelő recept lefut lépésről lépésre (NEM ReAct loop — fix pipeline).
// 3) Progress + result_items mentődik a task_runs sorba realtime-ra.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

// ─────────────── helpers ───────────────

async function setProgress(runId: string, step: number, total: number, label: string, status = "running") {
  await admin.from("task_runs").update({
    progress: { step, total, label, at: new Date().toISOString() },
    status,
  }).eq("id", runId);
}

async function addResultItem(runId: string, item: any) {
  const { data } = await admin.from("task_runs").select("result_items").eq("id", runId).maybeSingle();
  const items = Array.isArray(data?.result_items) ? data.result_items : [];
  items.push({ ...item, added_at: new Date().toISOString() });
  await admin.from("task_runs").update({ result_items: items }).eq("id", runId);
}

async function finishRun(runId: string, summary: string, extra: Record<string, any> = {}) {
  await admin.from("task_runs").update({
    status: "completed",
    final_summary: summary,
    progress: { step: 100, total: 100, label: "Kész", at: new Date().toISOString() },
    ...extra,
  }).eq("id", runId);
}

async function failRun(runId: string, error: string) {
  await admin.from("task_runs").update({
    status: "failed",
    error,
    final_summary: `Hiba történt: ${error}`,
  }).eq("id", runId);
}

// ─────────────── classifier ───────────────

type RecipeType = "outreach" | "research" | "followup" | "inbox" | "content" | "doc_review" | "decision" | "custom";

type Classification = {
  recipe_type: RecipeType;
  params: {
    // outreach/research
    city?: string;
    category?: string;
    min_grade?: "A" | "B" | "C" | "D";
    count?: number;
    tone?: "founding_pitch" | "casual" | "formal";
    // content
    channel?: "instagram" | "linkedin" | "facebook" | "email" | "general";
    topic?: string;
    persona?: string;
    // doc_review
    doc_query?: string;
    // decision
    decision_query?: string;
    options?: string[];
    notes?: string;
  };
  reasoning?: string;
};

async function classifyTask(goal: string): Promise<Classification> {
  const sys = `Magyar startup founder asszisztens vagy. A feladat szövegét egyetlen recept-típusba sorolod, és kihúzod a paramétereket.

RECEPT TÍPUSOK:
- outreach: új megkeresések küldése partnereknek (pl. "küldj 5 emailt koktélbárba", "keress meg új helyeket")
- research: piackutatás, leadek átnézése, top X lista készítése (pl. "nézd át a budapesti helyeket", "kik a legjobb A grade leadek")
- followup: már megkeresett, nem válaszolt partnereknek emlékeztető (pl. "follow up a múlt heti emailekre")
- inbox: bejövő üzenetek / inbox itemek átnézése (pl. "mi van az inboxban", "válaszolj a leveleimre")
- content: poszt / email / copy / hirdetés írás (pl. "írj egy IG posztot a Founding Partnerről", "csinálj egy LinkedIn copyt", "fogalmazz egy hírlevelet"). Töltsd ki: channel, topic, esetleg persona.
- doc_review: egy konkrét dokumentum átnézése (pl. "nézd át a pitch deck-et", "review-old a Founding Partner pdf-et"). Töltsd ki: doc_query (a doksi neve vagy kulcsszó).
- decision: döntéshozatal segítése (pl. "segíts dönteni X vagy Y", "melyik csatornát toljam"). Töltsd ki: decision_query, lehetőleg options[].
- custom: bármi más amit a fenti receptek nem fednek le

VÁLASZ FORMÁTUM (CSAK JSON, semmi más):
{"recipe_type":"content","params":{"channel":"instagram","topic":"Founding Partner Program","persona":"vendéglátós tulajdonos"},"reasoning":"rövid magyar magyarázat"}

Ha valami nem derül ki, hagyd ki a paramétert. Default count: 5.`;

  const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: sys },
        { role: "user", content: goal },
      ],
      response_format: { type: "json_object" },
    }),
  });
  if (!r.ok) throw new Error(`Classifier ${r.status}: ${await r.text()}`);
  const j = await r.json();
  const text = j?.choices?.[0]?.message?.content ?? "{}";
  try {
    const parsed = JSON.parse(text);
    if (!parsed.recipe_type) parsed.recipe_type = "custom";
    if (!parsed.params) parsed.params = {};
    return parsed;
  } catch {
    return { recipe_type: "custom", params: {} };
  }
}

// ─────────────── AI helper ───────────────

async function aiJson(systemPrompt: string, userPrompt: string, model = "google/gemini-2.5-flash"): Promise<any> {
  const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
      response_format: { type: "json_object" },
    }),
  });
  if (!r.ok) throw new Error(`AI ${r.status}: ${await r.text()}`);
  const j = await r.json();
  const text = j?.choices?.[0]?.message?.content ?? "{}";
  try { return JSON.parse(text); } catch { return {}; }
}

// ─────────────── partner search ───────────────

async function searchPartners(p: { city?: string; category?: string; min_grade?: string; has_email?: boolean; limit?: number; status?: string[] }) {
  let q = admin.from("partners")
    .select("id, company_name, city, category, email, lead_score, lead_grade, status, contact_name")
    .eq("type", "venue");
  if (p.status?.length) q = q.in("status", p.status);
  else q = q.in("status", ["lead", "contacted"]);
  if (p.city) q = q.ilike("city", `%${p.city}%`);
  if (p.category) q = q.ilike("category", `%${p.category}%`);
  if (p.min_grade) {
    const allowed = { A: ["A"], B: ["A", "B"], C: ["A", "B", "C"], D: ["A", "B", "C", "D"] }[p.min_grade] ?? ["A", "B"];
    q = q.in("lead_grade", allowed);
  }
  if (p.has_email !== false) q = q.not("email", "is", null).neq("email", "");
  q = q.order("lead_score", { ascending: false, nullsFirst: false }).limit(Math.min(50, p.limit ?? 5));
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data ?? [];
}

// ─────────────── recipes ───────────────

async function recipeOutreach(runId: string, params: Classification["params"]) {
  const count = Math.min(params.count ?? 5, 10);
  const tone = params.tone ?? "founding_pitch";

  await setProgress(runId, 1, 3, `Keresés: ${params.city ?? "minden város"} / ${params.category ?? "minden kategória"}`);
  const leads = await searchPartners({ city: params.city, category: params.category, min_grade: params.min_grade ?? "B", has_email: true, limit: count });

  if (leads.length === 0) {
    await finishRun(runId,
      `Nem találtam ${params.min_grade ?? "B"}+ grade leadeket emaillel ${params.city ? params.city + " " : ""}${params.category ?? ""} szűrőkkel. Indíts egy új scrape-et a /admin/leads alatt, vagy lazíts a szűrőkön.`
    );
    return;
  }

  await setProgress(runId, 2, 3, `Draftok írása (${leads.length} lead)`);
  const { data: seqs } = await admin.from("outreach_sequences").select("id").eq("active", true).eq("kind", "partner").limit(1);
  const sequence_id = seqs?.[0]?.id;
  if (!sequence_id) {
    await failRun(runId, "Nincs aktív partner outreach sequence");
    return;
  }

  // Generate drafts in parallel
  await Promise.all(leads.map(async (lead) => {
    try {
      const r = await fetch(`${SUPABASE_URL}/functions/v1/outreach-personalize`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${SERVICE_ROLE}` },
        body: JSON.stringify({ partner_id: lead.id, sequence_id, step_index: 0, tone }),
      });
      if (!r.ok) {
        await addResultItem(runId, { kind: "outreach_draft", lead, error: `personalize ${r.status}` });
        return;
      }
      const draft = await r.json();
      await addResultItem(runId, {
        kind: "outreach_draft",
        lead: { id: lead.id, company_name: lead.company_name, city: lead.city, category: lead.category, email: lead.email, lead_score: lead.lead_score, lead_grade: lead.lead_grade },
        sequence_id,
        subject: draft.subject ?? "",
        body: draft.body ?? "",
        action: "pending", // pending | sent | skipped | edited
      });
    } catch (e: any) {
      await addResultItem(runId, { kind: "outreach_draft", lead, error: e?.message ?? String(e) });
    }
  }));

  await finishRun(runId,
    `Kész — ${leads.length} draft elkészült (${params.city ?? "minden város"}, ${params.category ?? "minden kategória"}). Nézd át, szerkeszd, és küldd ki egyenként vagy egyben.`,
    { generated: leads.map(l => l.company_name) }
  );
}

async function recipeResearch(runId: string, params: Classification["params"]) {
  const limit = Math.min(params.count ?? 10, 25);

  await setProgress(runId, 1, 2, `Top leadek lekérése (${params.min_grade ?? "B"}+ grade)`);
  const leads = await searchPartners({
    city: params.city,
    category: params.category,
    min_grade: params.min_grade ?? "B",
    has_email: false,
    limit,
    status: ["lead", "contacted", "negotiating", "proposal_sent"],
  });

  if (leads.length === 0) {
    await finishRun(runId,
      `Nincs ${params.min_grade ?? "B"}+ grade lead ${params.city ? "ebben a városban (" + params.city + ") " : ""}${params.category ? "/ " + params.category : ""}. Indíts egy scrape-et a /admin/leads → Scrape gombbal.`
    );
    return;
  }

  await setProgress(runId, 2, 2, "Riport összeállítása");
  for (const lead of leads) {
    await addResultItem(runId, {
      kind: "lead_summary",
      lead: { id: lead.id, company_name: lead.company_name, city: lead.city, category: lead.category, email: lead.email, lead_score: lead.lead_score, lead_grade: lead.lead_grade, status: lead.status, contact_name: lead.contact_name },
      action: "pending", // pending | queued_outreach | skipped
    });
  }

  const withEmail = leads.filter(l => l.email).length;
  await finishRun(runId,
    `${leads.length} releváns lead (${withEmail} emaillel). Top: ${leads.slice(0, 3).map(l => l.company_name).join(", ")}. Felveheted őket az outreach queue-ba.`,
    { generated: leads.map(l => l.company_name) }
  );
}

async function recipeInbox(runId: string, _params: Classification["params"]) {
  await setProgress(runId, 1, 1, "Inbox átnézése");
  const today = new Date().toISOString();
  const { data } = await admin.from("inbox_items")
    .select("id, title, severity, kind, entity_kind, entity_id, payload")
    .eq("status", "open")
    .or(`snoozed_until.is.null,snoozed_until.lte.${today}`)
    .order("severity", { ascending: false })
    .limit(20);

  if (!data?.length) {
    await finishRun(runId, "Üres az inbox — minden nyitott item le van kezelve. Nincs teendő.");
    return;
  }

  for (const item of data) {
    await addResultItem(runId, { kind: "inbox_item", item, action: "pending" });
  }
  await finishRun(runId, `${data.length} nyitott inbox item vár rád. Nézd át, jelöld kész-nek vagy snooze-old.`);
}

async function recipeFollowup(runId: string, params: Classification["params"]) {
  await setProgress(runId, 1, 2, "Nem válaszolt outreach-ek keresése");
  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data } = await admin.from("outreach_enrollments")
    .select("id, partner_id, last_sent_at, status, partners!inner(id, company_name, city, email, lead_score, lead_grade)")
    .eq("status", "active")
    .is("replied_at", null)
    .lt("last_sent_at", cutoff)
    .limit(Math.min(params.count ?? 5, 15));

  if (!data?.length) {
    await finishRun(runId, "Nincs 7+ napja nem válaszolt outreach. Mindenki vagy válaszolt, vagy túl friss.");
    return;
  }

  await setProgress(runId, 2, 2, `${data.length} follow-up draft írása`);
  for (const enr of data) {
    const p = (enr as any).partners;
    await addResultItem(runId, {
      kind: "followup_draft",
      enrollment_id: enr.id,
      lead: p,
      last_sent_at: enr.last_sent_at,
      subject: `Re: Come Get It — emlékeztető`,
      body: `Szia${p.contact_name ? ` ${p.contact_name.split(" ")[0]}` : ""}!\n\nNéhány hete írtam a Come Get It-tel kapcsolatban — gondoltam ráérek egy gyors emlékeztetőre. Érdekel még a Founding Partner Program?\n\nBármilyen kérdésre szívesen válaszolok.\n\nÜdv,\nBence`,
      action: "pending",
    });
  }
  await finishRun(runId, `${data.length} follow-up draft elkészült. Nézd át és küldd ki.`);
}

// ─────────────── runner ───────────────

async function runRecipe(runId: string, goal: string) {
  try {
    await setProgress(runId, 0, 100, "Feladat osztályozása…");
    const cls = await classifyTask(goal);
    await admin.from("task_runs").update({
      recipe_type: cls.recipe_type,
      recipe_params: cls.params,
    }).eq("id", runId);

    switch (cls.recipe_type) {
      case "outreach":  return await recipeOutreach(runId, cls.params);
      case "research":  return await recipeResearch(runId, cls.params);
      case "inbox":     return await recipeInbox(runId, cls.params);
      case "followup":  return await recipeFollowup(runId, cls.params);
      case "custom":
      default:
        // Fallback: ne mondjuk azt hogy "nem tudom mit csinálj" — adjunk legalább egy lead-listát.
        return await recipeResearch(runId, cls.params);
    }
  } catch (e: any) {
    await failRun(runId, e?.message ?? String(e));
  }
}

// ─────────────── HTTP ───────────────

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const body = await req.json().catch(() => ({}));
    const { goal, task } = body;
    if (!goal && !task?.title) {
      return new Response(JSON.stringify({ error: "goal or task.title required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
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
      task_signature: `recipe::${goalText.slice(0, 80)}`,
      task_payload: { goal: goalText, task: task ?? null },
      goal: goalText,
      loop_kind: "recipe",
      status: "running",
      created_by: userId,
      progress: { step: 0, total: 100, label: "Indul…", at: new Date().toISOString() },
      result_items: [],
    }).select("id").single();
    if (runErr) throw runErr;

    // @ts-ignore
    if (typeof EdgeRuntime !== "undefined" && EdgeRuntime?.waitUntil) {
      // @ts-ignore
      EdgeRuntime.waitUntil(runRecipe(run.id, goalText));
    } else {
      runRecipe(run.id, goalText).catch(() => {});
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
