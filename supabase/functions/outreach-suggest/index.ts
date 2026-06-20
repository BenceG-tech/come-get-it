// @ts-nocheck
// AI suggests a sequence + personalised first email for a partner/lead.
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
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    const { data: isAdmin } = await sb.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!isAdmin) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: corsHeaders });

    const { entity_type, entity_id } = await req.json();
    if (!entity_type || !entity_id) return new Response(JSON.stringify({ error: "entity_type and entity_id required" }), { status: 400, headers: corsHeaders });

    const { data: entity } = entity_type === "partner"
      ? await sb.from("partners").select("*").eq("id", entity_id).maybeSingle()
      : { data: null };
    if (!entity) return new Response(JSON.stringify({ error: "entity not found" }), { status: 404, headers: corsHeaders });

    const { data: transitions } = await sb.from("pipeline_transitions").select("from_stage_id,to_stage_id,reason,created_at").eq("entity_type", entity_type).eq("entity_id", entity_id).order("created_at", { ascending: false }).limit(10);
    const { data: events } = await sb.from("outreach_events").select("channel,status,sent_at").eq("enrollment_id", "00000000-0000-0000-0000-000000000000"); // placeholder; could fetch via enrollments

    const brandCtx = await loadBrandContext(sb);
    const sys = `Te a Come Get It outreach stratégája vagy. Magyarul, tegezve. Adj egy 3-5 lépéses szekvencia javaslatot + személyre szabott első email draftet a partner adatai alapján.\n\n${brandCtx}\n\nCsak JSON-t adj vissza.`;
    const userMsg = `PARTNER ADATAI:\n${JSON.stringify({
      company: entity.company_name,
      contact: entity.contact_name,
      city: entity.city,
      category: entity.category,
      status: entity.status,
      notes: entity.notes,
      ai_score: entity.ai_score,
      ai_next_action: entity.ai_next_action,
    }, null, 2)}\n\nELŐZMÉNYEK: ${JSON.stringify(transitions ?? [])}\n\nVálasz JSON:\n{\n  "sequence_name": "...",\n  "rationale": "1-2 mondat miért ez a séma",\n  "steps": [\n    { "day_offset": 0, "channel": "email", "subject": "...", "body": "..." },\n    { "day_offset": 3, "channel": "task", "title": "...", "due_offset_days": 1 },\n    { "day_offset": 7, "channel": "email", "subject": "...", "body": "..." }\n  ]\n}`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: sys }, { role: "user", content: userMsg }],
        response_format: { type: "json_object" },
      }),
    });
    if (!aiRes.ok) {
      const t = await aiRes.text();
      return new Response(JSON.stringify({ error: `AI error ${aiRes.status}: ${t}` }), { status: 502, headers: corsHeaders });
    }
    const aij = await aiRes.json();
    const parsed = JSON.parse(aij.choices?.[0]?.message?.content ?? "{}");
    return new Response(JSON.stringify(parsed), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
