// Generates 3 prioritized daily tasks for the founder, persisted in daily_focus.top_priorities for today.
// Uses Lovable AI Gateway with real CRM/pipeline/inbox/mission-gap context.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PARTNER_TARGET = 20;
const WAITLIST_TARGET = 500;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableKey = Deno.env.get("LOVABLE_API_KEY")!;
    const admin = createClient(supabaseUrl, serviceKey);

    // Resolve target user: from JWT if present, else first admin
    let userId: string | null = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data: u } = await userClient.auth.getUser();
      userId = u?.user?.id ?? null;
    }
    if (!userId) {
      const { data: roles } = await admin.from("user_roles").select("user_id").eq("role", "admin").limit(1);
      userId = roles?.[0]?.user_id ?? null;
    }
    if (!userId) {
      return new Response(JSON.stringify({ error: "No admin user found" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Gather context (parallel)
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();
    const fiveDaysAgo = new Date(Date.now() - 5 * 86400000).toISOString();
    const today = new Date().toISOString();

    const [inboxRes, stalePartnersRes, loiRes, waitlistRes, outreachRes, followupRes] = await Promise.all([
      admin.from("inbox_items").select("id, title, severity, kind, entity_kind, entity_id")
        .eq("status", "open").or(`snoozed_until.is.null,snoozed_until.lte.${today}`).limit(10),
      admin.from("partners").select("id, company_name, status, last_contacted_at")
        .in("status", ["contacted", "negotiating", "meeting_scheduled"])
        .or(`last_contacted_at.lt.${fiveDaysAgo},last_contacted_at.is.null`).limit(10),
      admin.from("partners").select("id", { count: "exact", head: true })
        .in("status", ["proposal_sent", "negotiating", "signed"]),
      admin.from("waitlist_signups").select("id", { count: "exact", head: true }),
      admin.from("outreach_enrollments").select("id, entity_id, current_step, status").eq("status", "active").limit(10),
      admin.from("partners").select("id, company_name, next_followup_at")
        .lte("next_followup_at", today).not("next_followup_at", "is", null).limit(5),
    ]);

    const loiCount = loiRes.count ?? 0;
    const waitlistCount = waitlistRes.count ?? 0;
    const partnerGap = Math.max(0, PARTNER_TARGET - loiCount);
    const waitlistGap = Math.max(0, WAITLIST_TARGET - waitlistCount);

    const context = {
      mission: { loiCount, partnerTarget: PARTNER_TARGET, partnerGap, waitlistCount, waitlistTarget: WAITLIST_TARGET, waitlistGap },
      inbox: inboxRes.data ?? [],
      stalePartners: stalePartnersRes.data ?? [],
      activeOutreach: (outreachRes.data ?? []).length,
      dueFollowups: followupRes.data ?? [],
    };

    const prompt = `Magyar founder vagy a Come Get It (drink-rewards app) napi vezérlőjén. Szeptember 1-ig 20 partner-előmegállapodás és 500 waitlist a cél.

Mai kontextus (JSON):
${JSON.stringify(context, null, 2)}

Adj vissza pontosan 3 konkrét, ma elvégezhető feladatot JSON-ban:
{
  "tasks": [
    {
      "title": "Rövid, parancs alakú magyar mondat (max 80 char)",
      "why": "Egy mondatban miért most ez (mission-gap szempontból).",
      "mission_pillar": "partner" | "waitlist" | "sponsor",
      "priority": "high" | "med" | "low",
      "estimated_minutes": 15,
      "entity_kind": "partner" | "inbox" | "outreach" | null,
      "entity_id": "uuid vagy null",
      "suggested_action": "1 konkrét lépés (pl. „küldj LOI emailt”)"
    }
  ]
}

Szabályok: A high priority a legnagyobb mission-gap-hez kötődjön. Ha van pangó partner ahol >5 nap nincs interakció és status=negotiating → az legyen high. Maximum 1 waitlist és 1 sponsor task. Csak a JSON-t add vissza, semmi más.`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Lovable-API-Key": lovableKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }),
    });
    if (!aiRes.ok) throw new Error(`AI ${aiRes.status}: ${await aiRes.text()}`);
    const aiJson = await aiRes.json();
    let parsed: any = {};
    try { parsed = JSON.parse(aiJson.choices?.[0]?.message?.content ?? "{}"); } catch { parsed = {}; }
    const tasks = Array.isArray(parsed.tasks) ? parsed.tasks.slice(0, 3) : [];

    // Upsert into daily_focus for today
    const focusDate = new Date().toISOString().slice(0, 10);
    const { error: upsertErr } = await admin.from("daily_focus").upsert({
      user_id: userId,
      focus_date: focusDate,
      top_priorities: tasks,
      briefing_payload: { generated_at: new Date().toISOString(), mission: context.mission },
    }, { onConflict: "user_id,focus_date" });
    if (upsertErr) throw upsertErr;

    return new Response(JSON.stringify({ ok: true, tasks, mission: context.mission }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-daily-focus error", e);
    return new Response(JSON.stringify({ error: String(e?.message ?? e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
