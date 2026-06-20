// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10);
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);
    const startToday = `${dateStr}T00:00:00Z`;
    const startYesterday = `${yesterdayStr}T00:00:00Z`;

    // waitlist totals
    const [{ count: waitlistTotal }, { count: waitlistYesterday }] = await Promise.all([
      supabase.from("waitlist_signups").select("id", { count: "exact", head: true }),
      supabase.from("waitlist_signups").select("id", { count: "exact", head: true }).lt("created_at", startToday),
    ]);

    // partners breakdown
    const [{ count: leadsTotal }, { count: leadsNew }, { count: qualifiedTotal }, { count: signedTotal }, { count: signedNew }] = await Promise.all([
      supabase.from("partners").select("id", { count: "exact", head: true }).eq("status", "lead"),
      supabase.from("partners").select("id", { count: "exact", head: true }).eq("status", "lead").gte("created_at", startYesterday).lt("created_at", startToday),
      supabase.from("partners").select("id", { count: "exact", head: true }).eq("status", "qualified"),
      supabase.from("partners").select("id", { count: "exact", head: true }).eq("status", "signed"),
      supabase.from("partners").select("id", { count: "exact", head: true }).eq("status", "signed").gte("updated_at", startYesterday).lt("updated_at", startToday),
    ]);

    // calendar / posts
    const [{ count: postsPublished }, { count: postsScheduled }] = await Promise.all([
      supabase.from("marketing_calendar").select("id", { count: "exact", head: true }).eq("status", "published").gte("updated_at", startYesterday).lt("updated_at", startToday),
      supabase.from("marketing_calendar").select("id", { count: "exact", head: true }).in("status", ["scheduled", "ready"]),
    ]);

    // docs processed yesterday
    const { count: docsProcessed } = await supabase
      .from("documents")
      .select("id", { count: "exact", head: true })
      .gte("updated_at", startYesterday)
      .lt("updated_at", startToday);

    // average brand fit (last 30 days)
    const thirtyAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data: cg } = await supabase
      .from("content_generations")
      .select("brand_fit_score")
      .gte("created_at", thirtyAgo)
      .not("brand_fit_score", "is", null);
    const avgBrandFit = cg && cg.length
      ? cg.reduce((s, r) => s + Number(r.brand_fit_score || 0), 0) / cg.length
      : null;

    // ai cost rough estimate from metric_events 'ai_call' yesterday
    const { data: aiEvents } = await supabase
      .from("metric_events")
      .select("value")
      .eq("event_type", "ai_call")
      .gte("created_at", startYesterday)
      .lt("created_at", startToday);
    const aiCost = (aiEvents ?? []).reduce((s, r) => s + Number(r.value || 0), 0);

    const payload = {
      snapshot_date: yesterdayStr,
      waitlist_total: waitlistTotal ?? 0,
      waitlist_delta: (waitlistTotal ?? 0) - (waitlistYesterday ?? 0),
      leads_total: leadsTotal ?? 0,
      leads_new: leadsNew ?? 0,
      qualified_total: qualifiedTotal ?? 0,
      signed_total: signedTotal ?? 0,
      signed_new: signedNew ?? 0,
      posts_published: postsPublished ?? 0,
      posts_scheduled: postsScheduled ?? 0,
      docs_processed: docsProcessed ?? 0,
      avg_brand_fit: avgBrandFit,
      ai_cost_estimate: aiCost,
      extra: {},
    };

    const { error } = await supabase
      .from("daily_kpi_snapshots")
      .upsert(payload, { onConflict: "snapshot_date" });
    if (error) throw error;

    return new Response(JSON.stringify({ ok: true, snapshot: payload }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("kpi-snapshot error", e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
