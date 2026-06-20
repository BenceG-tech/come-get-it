// @ts-nocheck
// Nightly recompute of scores for active partners/leads (entity_scores table).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function deriveScore(p: any, transitions: any[], events: any[]): { score: number; reasons: string[]; next_action: string } {
  let s = 40;
  const reasons: string[] = [];
  if (p.ai_score) { s = Math.round((s + p.ai_score) / 2); reasons.push(`AI alap score: ${p.ai_score}`); }
  if (p.rating && p.rating >= 4.5) { s += 8; reasons.push(`Google rating ${p.rating}`); }
  if (p.rating_count && p.rating_count > 200) { s += 5; reasons.push(`${p.rating_count} értékelés`); }
  if (transitions.length >= 2) { s += 6; reasons.push(`${transitions.length} pipeline mozgás — aktív flow`); }
  const replies = events.filter((e) => e.status === "replied").length;
  const opens = events.filter((e) => e.status === "opened").length;
  if (replies > 0) { s += 15; reasons.push(`${replies} email válasz`); }
  else if (opens > 0) { s += 4; reasons.push(`${opens} email megnyitás`); }
  const bounces = events.filter((e) => e.status === "bounced").length;
  if (bounces > 0) { s -= 20; reasons.push("Email bounce — cím gyanús"); }
  if (!p.email) { s -= 15; reasons.push("Nincs email cím"); }
  if (!p.phone) { s -= 5; reasons.push("Nincs telefonszám"); }
  s = Math.max(0, Math.min(100, s));
  let next_action = "Manuális megnyitás és gyors check";
  if (s >= 75) next_action = "Hívd fel ma — meleg lead";
  else if (s >= 55) next_action = "Indíts outreach sequence-t";
  else if (s >= 30) next_action = "Küldj alacsony küszöbű check-int";
  else next_action = "Tedd long-tail listára vagy archiváld";
  return { score: s, reasons, next_action };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  try {
    const { data: partners } = await admin.from("partners").select("*").not("status", "in", "(churned,lost)").limit(500);
    let n = 0;
    for (const p of partners ?? []) {
      const { data: trs } = await admin.from("pipeline_transitions").select("from_stage_id,to_stage_id,created_at").eq("entity_type", "partner").eq("entity_id", p.id).order("created_at", { ascending: false }).limit(20);
      const { data: ens } = await admin.from("outreach_enrollments").select("id").eq("entity_type", "partner").eq("entity_id", p.id);
      const enrollmentIds = (ens ?? []).map((e) => e.id);
      let evts: any[] = [];
      if (enrollmentIds.length > 0) {
        const { data: ee } = await admin.from("outreach_events").select("status,sent_at").in("enrollment_id", enrollmentIds);
        evts = ee ?? [];
      }
      const r = deriveScore(p, trs ?? [], evts);
      await admin.from("entity_scores").insert({
        entity_type: "partner",
        entity_id: p.id,
        score: r.score,
        reasons: r.reasons,
        next_action: r.next_action,
        model: "heuristic-v1",
      });
      n++;
    }
    return new Response(JSON.stringify({ scored: n }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
