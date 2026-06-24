// @ts-nocheck
// Suggests lead promotions: high-score replied leads + stalled high-value leads → inbox_items
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  try {
    const { limit = 20 } = await req.json().catch(() => ({}));
    const created: any[] = [];

    // 1) High-score replied leads → suggest promote to contacted/proposal
    const { data: replyEvents } = await admin
      .from("outreach_events")
      .select("enrollment_id, replied_at")
      .not("replied_at", "is", null)
      .gte("replied_at", new Date(Date.now() - 30 * 86400000).toISOString())
      .limit(500);

    const enrollmentIds = [...new Set((replyEvents ?? []).map((e) => e.enrollment_id))];
    let repliedPartnerIds: string[] = [];
    if (enrollmentIds.length) {
      const { data: enrolls } = await admin
        .from("outreach_enrollments")
        .select("entity_id")
        .eq("entity_type", "partner")
        .in("id", enrollmentIds);
      repliedPartnerIds = [...new Set((enrolls ?? []).map((e) => e.entity_id))];
    }

    if (repliedPartnerIds.length) {
      const { data: hot } = await admin
        .from("partners")
        .select("id, company_name, ai_score, status")
        .in("id", repliedPartnerIds)
        .gte("ai_score", 70)
        .in("status", ["lead", "contacted"])
        .limit(limit);

      for (const p of hot ?? []) {
        const { error } = await admin.from("inbox_items").insert({
          kind: "lead_promote",
          severity: "high",
          title: `🔥 ${p.company_name} válaszolt — score ${p.ai_score}. Léptesd előre!`,
          entity_kind: "partner",
          entity_id: p.id,
          payload: { reason: "replied_high_score", score: p.ai_score, current_status: p.status },
          status: "open",
          dedupe_key: `lead_promote_${p.id}_${new Date().toISOString().slice(0, 10)}`,
        });
        if (!error) created.push({ partner_id: p.id, type: "promote" });
      }
    }

    // 2) Stalled high-value leads (14+ days, score >= 70) → suggest next action
    const cutoff = new Date(Date.now() - 14 * 86400000).toISOString();
    const { data: stalled } = await admin
      .from("partners")
      .select("id, company_name, ai_score, ai_next_action, updated_at")
      .in("status", ["lead", "contacted"])
      .gte("ai_score", 70)
      .lt("updated_at", cutoff)
      .order("ai_score", { ascending: false })
      .limit(limit);

    for (const p of stalled ?? []) {
      const days = Math.floor((Date.now() - new Date(p.updated_at).getTime()) / 86400000);
      const { error } = await admin.from("inbox_items").insert({
        kind: "lead_stalled",
        severity: "medium",
        title: `⏰ ${p.company_name} ${days} napja nem mozdult (score ${p.ai_score})`,
        body: p.ai_next_action ? `Javaslat: ${p.ai_next_action}` : null,
        entity_kind: "partner",
        entity_id: p.id,
        payload: { reason: "stalled", days, score: p.ai_score },
        status: "open",
        dedupe_key: `lead_stalled_${p.id}_${new Date().toISOString().slice(0, 10)}`,
      });
      if (!error) created.push({ partner_id: p.id, type: "stalled" });
    }

    return new Response(JSON.stringify({ created: created.length, items: created }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
