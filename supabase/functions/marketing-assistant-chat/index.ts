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

    const { messages } = await req.json();
    if (!Array.isArray(messages)) return new Response(JSON.stringify({ error: "messages required" }), { status: 400, headers: corsHeaders });

    const today = new Date().toISOString().slice(0, 10);
    const { data: upcoming } = await supabase
      .from("marketing_calendar")
      .select("scheduled_date, scheduled_time, channel, type, title, status")
      .gte("scheduled_date", today)
      .order("scheduled_date").limit(20);

    const brandCtx = await loadBrandContext(supabase);

    const sys = `Te a Come Get It marketing AI asszisztense vagy. Magyarul válaszolj, tegezve, tömören, konkrétan. Soha ne adj "AI-os" mellébeszélést.

${brandCtx}

KÖZELGŐ POSZTOK (${today}-tól):
${JSON.stringify(upcoming ?? [])}

Ha a felhasználó kér egy poszt-ötletet/időpontot, adj konkrét javaslatot (csatorna + dátum + idő + 1-2 mondat brief). Ha kérdés a stratégiáról, légy direkt.`;

    const apiKey = Deno.env.get("LOVABLE_API_KEY")!;
    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: sys }, ...messages],
      }),
    });

    if (!resp.ok) {
      const errTxt = await resp.text();
      return new Response(JSON.stringify({ error: `AI: ${resp.status} ${errTxt.slice(0, 300)}` }), { status: 500, headers: corsHeaders });
    }
    const j = await resp.json();
    return Response.json({ reply: j.choices?.[0]?.message?.content ?? "" }, { headers: corsHeaders });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
