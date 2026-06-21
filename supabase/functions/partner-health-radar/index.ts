// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { partner_id } = await req.json();
    if (!partner_id) throw new Error("partner_id required");

    const thirtyAgo = new Date(Date.now() - 30 * 86400000).toISOString();

    const [partnerR, intsR, oevR, opensR, linksR, scoresR] = await Promise.all([
      supabase.from("partners").select("status, status_changed_at, lead_score").eq("id", partner_id).maybeSingle(),
      supabase.from("partner_interactions").select("id, created_at").eq("partner_id", partner_id).gte("created_at", thirtyAgo),
      supabase.from("outreach_events").select("event_type, created_at, outreach_enrollments!inner(entity_id)").eq("outreach_enrollments.entity_id", partner_id).gte("created_at", thirtyAgo),
      supabase.from("document_opens").select("id, opened_at, document_id, document_entity_links!inner(entity_id)").eq("document_entity_links.entity_id", partner_id).gte("opened_at", thirtyAgo),
      supabase.from("document_entity_links").select("id").eq("entity_id", partner_id),
      supabase.from("entity_scores").select("score, computed_at").eq("entity_id", partner_id).gte("computed_at", thirtyAgo).order("computed_at"),
    ]);

    const partner = partnerR.data;
    const ints = intsR.data ?? [];
    const oev = oevR.data ?? [];
    const opens = opensR.data ?? [];
    const links = linksR.data ?? [];
    const scores = scoresR.data ?? [];

    // Engagement: 0..100 based on interactions in last 30d (cap at 10 interactions = 100)
    const engagement = clamp((ints.length / 10) * 100);

    // Response latency: avg time between sent and reply; lower is better
    const sent = oev.filter((e: any) => ["sent", "step_sent"].includes(e.event_type));
    const replies = oev.filter((e: any) => e.event_type === "reply");
    let responseLatency = 50;
    if (replies.length > 0 && sent.length > 0) {
      const lastSent = new Date(sent[sent.length - 1].created_at).getTime();
      const lastReply = new Date(replies[0].created_at).getTime();
      const hours = Math.max(0, (lastReply - lastSent) / 3600000);
      responseLatency = clamp(100 - (hours / 72) * 100); // 0h=100, 72h=0
    } else if (sent.length > 0 && replies.length === 0) {
      responseLatency = 20;
    }

    // Document activity
    const docActivity = clamp(((opens.length * 10) + (links.length * 5)));

    // Outreach receptivity = reply rate
    const receptivity = sent.length > 0 ? clamp((replies.length / sent.length) * 100) : 30;

    // Score trend: delta of first vs last in 30d
    let scoreTrend = 50;
    if (scores.length >= 2) {
      const delta = (scores[scores.length - 1].score ?? 0) - (scores[0].score ?? 0);
      scoreTrend = clamp(50 + delta * 2);
    } else if (partner?.lead_score != null) {
      scoreTrend = clamp(partner.lead_score);
    }

    // Days in stage (inverse): fewer days = healthier
    let daysInStage = 50;
    if (partner?.status_changed_at) {
      const days = (Date.now() - new Date(partner.status_changed_at).getTime()) / 86400000;
      daysInStage = clamp(100 - (days / 30) * 100); // 0 days=100, 30 days=0
    }

    const dimensions = [
      { key: "Engagement", value: engagement },
      { key: "Response", value: responseLatency },
      { key: "Docs", value: docActivity },
      { key: "Receptivity", value: receptivity },
      { key: "Score trend", value: scoreTrend },
      { key: "Stage fresh", value: daysInStage },
    ];

    return new Response(JSON.stringify({ ok: true, dimensions }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("partner-health-radar", e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
