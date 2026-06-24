// @ts-nocheck
// Classifies an inbound reply (sentiment + intent) and drafts a suggested response.
// Called by inbox-collect when a new reply is detected, or manually from the inbox UI.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { BRAND_CONTEXT } from "../_shared/brand-context.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { enrollment_id, reply_text, reply_subject } = await req.json();
    if (!enrollment_id || !reply_text) {
      return new Response(JSON.stringify({ error: "enrollment_id and reply_text required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Load enrollment + partner + last outgoing event for thread context
    const { data: en } = await admin
      .from("outreach_enrollments")
      .select("id, entity_type, entity_id, sequence_id, current_step, metadata")
      .eq("id", enrollment_id)
      .maybeSingle();
    if (!en) return new Response(JSON.stringify({ error: "enrollment not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { data: partner } = en.entity_type === "partner"
      ? await admin.from("partners").select("company_name, contact_name, city, category, status, notes").eq("id", en.entity_id).maybeSingle()
      : { data: null };

    const { data: lastEvents } = await admin
      .from("outreach_events")
      .select("subject, body_preview, status, step_index")
      .eq("enrollment_id", enrollment_id)
      .order("step_index", { ascending: false })
      .limit(3);

    const sys = `Te a Come Get It outreach asszisztense vagy. Egy beérkezett partneri választ kell besorolnod ÉS magyarul, tegezve egy javasolt válasz-vázlatot írnod.\n\n${BRAND_CONTEXT}\n\nCsak JSON-t adj vissza, semmi mást.`;

    const userMsg = `PARTNER: ${JSON.stringify(partner ?? {}, null, 2)}\n\nUTOLSÓ ÁLTALUNK KÜLDÖTT LÉPÉSEK:\n${JSON.stringify(lastEvents ?? [], null, 2)}\n\nBEÉRKEZETT VÁLASZ TÁRGY: ${reply_subject ?? "(nincs)"}\nBEÉRKEZETT VÁLASZ:\n${String(reply_text).slice(0, 4000)}\n\nVálasz JSON sémában:\n{\n  "sentiment": "positive" | "neutral" | "negative",\n  "intent": "interested" | "questions" | "rejection" | "out_of_office" | "wrong_person" | "spam",\n  "summary": "1 mondat magyarul, mit válaszolt",\n  "suggested_reply": "rövid, magyar, tegező válasz-vázlat — max 120 szó",\n  "next_action": "send_reply" | "schedule_meeting" | "pause_sequence" | "mark_lost"\n}`;

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
      return new Response(JSON.stringify({ error: `AI error ${aiRes.status}: ${t}` }), { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const aij = await aiRes.json();
    const parsed = JSON.parse(aij.choices?.[0]?.message?.content ?? "{}");

    // Persist on the enrollment
    await admin.from("outreach_enrollments").update({
      last_reply_at: new Date().toISOString(),
      reply_sentiment: parsed.sentiment ?? null,
      reply_summary: parsed.summary ?? null,
      suggested_reply: parsed.suggested_reply ?? null,
      status: parsed.next_action === "pause_sequence" || parsed.next_action === "mark_lost" ? "replied" : "replied",
      stop_reason: "auto_reply_detected",
    }).eq("id", enrollment_id);

    return new Response(JSON.stringify(parsed), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
