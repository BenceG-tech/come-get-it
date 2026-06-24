// @ts-nocheck
// Daily Apify auto-scrape — invoked by pg_cron. Checks system_settings.apify_daily_autopilot,
// asks lead-discovery-plan, and starts an Apify run if balance allows and cost ceiling fits.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" };
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const APIFY_TOKEN = Deno.env.get("APIFY_API_TOKEN")!;
const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { data: settings } = await admin.from("system_settings")
      .select("value").eq("key", "apify_daily_autopilot").maybeSingle();
    const cfg = (settings?.value ?? {}) as { enabled?: boolean; cap_usd?: number };
    if (!cfg.enabled) {
      return new Response(JSON.stringify({ skipped: "disabled" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const capUsd = Number(cfg.cap_usd ?? 3.0);

    // Apify balance
    let balanceRemaining = Infinity;
    try {
      const r = await fetch("https://api.apify.com/v2/users/me/limits", {
        headers: { Authorization: `Bearer ${APIFY_TOKEN}` },
      });
      if (r.ok) {
        const j = await r.json();
        const used = Number(j?.data?.current?.monthlyUsageUsd ?? 0);
        const max = Number(j?.data?.limits?.maxMonthlyUsageUsd ?? Infinity);
        balanceRemaining = isFinite(max) ? max - used : Infinity;
      }
    } catch (_) { /* ignore */ }

    // Plan
    const planRes = await fetch(`${SUPABASE_URL}/functions/v1/lead-discovery-plan`, {
      method: "POST",
      headers: { Authorization: `Bearer ${SERVICE_ROLE}`, "Content-Type": "application/json" },
      body: "{}",
    });
    if (!planRes.ok) throw new Error(`plan ${planRes.status}: ${await planRes.text()}`);
    const plan = await planRes.json();

    const ceiling = Number(plan.cost_ceiling_usd ?? 0);
    if (ceiling > capUsd) {
      return new Response(JSON.stringify({ skipped: "ceiling_above_cap", ceiling, capUsd }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (ceiling > balanceRemaining) {
      return new Response(JSON.stringify({ skipped: "insufficient_balance", ceiling, balanceRemaining }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Start scrape via apify-run-start
    const startRes = await fetch(`${SUPABASE_URL}/functions/v1/apify-run-start`, {
      method: "POST",
      headers: { Authorization: `Bearer ${SERVICE_ROLE}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        input: plan.apify_input,
        actor_name: "Daily Autopilot",
        estimated_cost_usd: plan.cost_estimate_usd,
      }),
    });
    const startJson = await startRes.json();
    if (!startRes.ok) throw new Error(`start ${startRes.status}: ${JSON.stringify(startJson)}`);

    return new Response(JSON.stringify({ ok: true, run_id: startJson.run_id, plan: plan.plan, cost_estimate_usd: plan.cost_estimate_usd }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error(e);
    return new Response(JSON.stringify({ error: String(e?.message ?? e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
