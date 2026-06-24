// @ts-nocheck
// Generate 3 quick email drafts (founding_pitch / warm_intro / short_nudge) for a partner.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { BRAND_CONTEXT } from "../_shared/brand-context.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function loadTopSubjects(sb: any) {
  try {
    const since = new Date(Date.now() - 30 * 86400000).toISOString();
    const { data } = await sb.from("outreach_events")
      .select("subject, opened_at, replied_at, sent_at")
      .gte("sent_at", since).not("subject", "is", null).limit(1000);
    const map = new Map<string, { s: number; o: number; r: number }>();
    for (const r of (data ?? []) as any[]) {
      const k = (r.subject ?? "").trim(); if (!k) continue;
      const e = map.get(k) ?? { s: 0, o: 0, r: 0 };
      if (r.sent_at) e.s++; if (r.opened_at) e.o++; if (r.replied_at) e.r++;
      map.set(k, e);
    }
    const arr = [...map.entries()].filter(([, e]) => e.s >= 2)
      .map(([subject, e]) => ({ subject, open_rate: e.o / e.s, reply_rate: e.r / e.s }));
    return arr.sort((a, b) => (b.open_rate + b.reply_rate * 2) - (a.open_rate + a.reply_rate * 2)).slice(0, 5);
  } catch { return []; }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const { data: isAdmin } = await sb.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!isAdmin) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { partner_id, extra } = await req.json();
    if (!partner_id) return new Response(JSON.stringify({ error: "partner_id required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const sbAdmin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: partner } = await sbAdmin.from("partners")
      .select("company_name, contact_name, city, category, notes, ai_score, ai_next_action")
      .eq("id", partner_id).maybeSingle();
    if (!partner) return new Response(JSON.stringify({ error: "partner not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const tops = await loadTopSubjects(sbAdmin);
    const topHint = tops.length
      ? `\nTOP MŰKÖDŐ subjectek (kövesd a stílust): ${tops.map((t) => `"${t.subject}" (open ${(t.open_rate * 100).toFixed(0)}%)`).join(", ")}`
      : "";

    const sys = `Te a Come Get It outreach copywritere vagy. Magyarul, tegezve. Adj 3 alternatív első emailt egy vendéglátós lead-nek. Mindegyik más hangnem: founding_pitch (limitált founding kör, magabiztos), warm_intro (személyes, 1 konkrét részlet a partnerről, kávé-CTA), short_nudge (max 60 szó follow-up, 1 kérdés).
${BRAND_CONTEXT}${topHint}

Subject: 40-60 char. Body: 80-150 szó (kivéve short_nudge: max 60 szó). Használj {{first_name}}, {{company_name}}, {{city}} placeholdereket ha illik. Csak JSON-t adj vissza.`;
    const userMsg = `PARTNER:\n${JSON.stringify(partner, null, 2)}${extra ? `\n\nEXTRA INSTRUKCIÓ: ${extra}` : ""}\n\nJSON: { "drafts": [{ "tone": "founding_pitch", "subject": "...", "body": "..." }, { "tone": "warm_intro", ... }, { "tone": "short_nudge", ... }] }`;

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
    const drafts = Array.isArray(parsed?.drafts) ? parsed.drafts.filter((d: any) => d?.subject && d?.body) : [];
    if (drafts.length === 0) {
      return new Response(JSON.stringify({ error: "AI nem adott vissza draft-okat" }), { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    return new Response(JSON.stringify({ drafts }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
