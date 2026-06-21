// @ts-nocheck
// Weekly: for every decision past review_at with no outcome, push an inbox item.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: due } = await admin
      .from("decisions")
      .select("id, decision_text, review_at")
      .is("outcome", null)
      .lte("review_at", new Date().toISOString())
      .limit(50);

    let created = 0;
    for (const d of due ?? []) {
      // Dedupe: skip if there is already an open inbox item for this decision today
      const today = new Date(); today.setUTCHours(0, 0, 0, 0);
      const { data: exists } = await admin
        .from("inbox_items").select("id")
        .eq("kind", "decision_review")
        .contains("payload", { decision_id: d.id })
        .gte("created_at", today.toISOString())
        .maybeSingle();
      if (exists) continue;

      await admin.from("inbox_items").insert({
        kind: "decision_review",
        severity: "info",
        title: `Döntés értékelése: ${(d.decision_text ?? "").slice(0, 80)}`,
        entity_kind: "decision",
        entity_id: d.id,
        payload: { decision_id: d.id, review_at: d.review_at },
        status: "open",
      });
      created++;
    }

    return new Response(JSON.stringify({ ok: true, created, scanned: due?.length ?? 0 }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("decision-review-tick", e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
