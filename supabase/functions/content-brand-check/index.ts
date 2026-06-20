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

    const { text, channel = "generic" } = await req.json();
    if (!text || typeof text !== "string") return new Response(JSON.stringify({ error: "text required" }), { status: 400, headers: corsHeaders });

    const brandCtx = await loadBrandContext(supabase);

    const sys = `Te a Come Get It brand-őre vagy. A megadott szöveget értékeled brand-tone, csatorna fit és banned phrases szempontjából. Magyarul.\n\n${brandCtx}\n\nCSAK JSON-t adj vissza.`;
    const userMsg = `CSATORNA: ${channel}\n\nSZÖVEG:\n${text}\n\nVálasz JSON pontosan így:\n{\n  "score": 0-100 szám,\n  "tone_match": "high"|"medium"|"low",\n  "banned_hits": ["banned phrase ami benne van"],\n  "issues": ["rövid leírások mi nem stimmel"],\n  "suggestions": ["átírási javaslatok"],\n  "rewrite": "egy javított verzió"\n}`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
        "Content-Type": "application/json",
      },
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

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
