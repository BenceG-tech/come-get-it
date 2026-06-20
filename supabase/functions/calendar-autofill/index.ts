// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { loadBrandContext } from "../_shared/brand-context.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!isAdmin) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: corsHeaders });

    const { start_date, end_date, channels = ["instagram", "facebook", "linkedin"], target_per_week = 5 } = await req.json();
    if (!start_date || !end_date) return new Response(JSON.stringify({ error: "start_date, end_date required" }), { status: 400, headers: corsHeaders });

    // Approved briefs not yet used
    const { data: briefs } = await supabase
      .from("content_briefs")
      .select("id, title, angle, target_audience, channel_mix, key_points, cta, tone")
      .eq("status", "approved")
      .order("created_at", { ascending: true })
      .limit(50);

    if (!briefs?.length) return new Response(JSON.stringify({ error: "No approved briefs available", suggestions: [] }), { status: 200, headers: corsHeaders });

    const { data: existing } = await supabase
      .from("marketing_calendar")
      .select("scheduled_date, channel")
      .gte("scheduled_date", start_date)
      .lte("scheduled_date", end_date);

    // Build day buckets per channel
    const start = new Date(start_date);
    const end = new Date(end_date);
    const days: string[] = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(d.toISOString().slice(0, 10));
    }

    const occupied: Record<string, Set<string>> = {};
    for (const day of days) occupied[day] = new Set();
    for (const e of existing ?? []) {
      const day = String(e.scheduled_date).slice(0, 10);
      if (occupied[day]) occupied[day].add(e.channel);
    }

    // Round-robin distribute briefs across days/channels
    const weeks = Math.max(1, Math.ceil(days.length / 7));
    const targetTotal = Math.min(briefs.length, target_per_week * weeks * channels.length);
    const suggestions: any[] = [];
    let bi = 0, di = 0, ci = 0;
    while (suggestions.length < targetTotal && bi < briefs.length) {
      const brief = briefs[bi];
      let placed = false;
      for (let attempt = 0; attempt < days.length * channels.length; attempt++) {
        const day = days[di % days.length];
        const channel = channels[ci % channels.length];
        ci++;
        if (ci % channels.length === 0) di++;
        if (!occupied[day].has(channel) && (brief.channel_mix?.length ? brief.channel_mix.includes(channel) : true)) {
          suggestions.push({
            scheduled_date: day,
            scheduled_time: "18:00",
            channel,
            type: "post",
            title: brief.title,
            content_draft: `[Brief: ${brief.title}]\n${brief.angle ?? ""}\nCTA: ${brief.cta ?? ""}`,
            status: "draft",
            brief_id: brief.id,
            assistant_rationale: `Autofill: ${brief.title} → ${channel} @ ${day}`,
          });
          occupied[day].add(channel);
          placed = true;
          break;
        }
      }
      bi++;
      if (!placed) continue;
    }

    return new Response(JSON.stringify({ suggestions, summary: `${suggestions.length} bejegyzés javasolva ${briefs.length} approved briefből.` }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
