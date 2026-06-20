// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM = `Te a Come Get It dokumentumtár AI cimkézője vagy.
Bemenet: egy dokumentum címe + leírása + (rövidített) tartalma.
Válasz CSAK JSON:
{
  "tags": ["string", ...max 6 cimke, magyarul, rövid: pl. 'Founding pitch', 'Pénzügy', 'Jogi', 'Marketing', 'Email sablon'],
  "hook": "1 rövid magyar mondat ami megmondja mire jó ez a doksi (max 140 char)",
  "relevance_score": 0-100 között szám (mennyire fontos a jelenlegi go-to-market fázishoz)
}`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // admin check
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "");
    if (token) {
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) {
        const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
        if (!isAdmin) return new Response(JSON.stringify({ error: "forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    const { document_id, document_ids } = await req.json();
    const ids: string[] = document_ids ?? (document_id ? [document_id] : []);
    if (!ids.length) throw new Error("document_id(s) required");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const { data: docs } = await supabase.from("documents").select("id,title,description,content,when_to_use").in("id", ids);
    const results: any[] = [];

    for (const d of docs ?? []) {
      const input = {
        title: d.title,
        description: d.description ?? "",
        when_to_use: d.when_to_use ?? "",
        content_excerpt: (d.content ?? "").slice(0, 4000),
      };

      const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Lovable-API-Key": LOVABLE_API_KEY },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM },
            { role: "user", content: JSON.stringify(input) },
          ],
          response_format: { type: "json_object" },
        }),
      });
      if (!aiResp.ok) { results.push({ id: d.id, ok: false, error: await aiResp.text() }); continue; }
      const parsed = JSON.parse(((await aiResp.json()).choices?.[0]?.message?.content) ?? "{}");

      const update = {
        ai_tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 6) : [],
        ai_hook: typeof parsed.hook === "string" ? parsed.hook.slice(0, 200) : null,
        relevance_score: typeof parsed.relevance_score === "number" ? Math.max(0, Math.min(100, Math.round(parsed.relevance_score))) : null,
      };

      const { error } = await supabase.from("documents").update(update).eq("id", d.id);
      if (error) { results.push({ id: d.id, ok: false, error: error.message }); continue; }

      await supabase.from("metric_events").insert({
        event_type: "doc_tagged",
        entity_type: "document",
        entity_id: d.id,
      });
      results.push({ id: d.id, ok: true, ...update });
    }

    return new Response(JSON.stringify({ ok: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("doc-auto-tag error", e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
