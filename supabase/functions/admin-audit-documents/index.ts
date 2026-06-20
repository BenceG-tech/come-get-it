// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const AUDIT_SYSTEM = `Te a Come Get It belső dokumentum-auditora vagy. Egy doksi metaadatait + szöveges tartalmát kapod meg.
Pontozd 1-10 között 6 dimenzió szerint, majd add meg az összpontot 1-10 átlagolva (egy tizedesig).
Adj rövid, konkrét, magyar nyelvű kritikát: mit kéne javítani.

VÁLASZ KIZÁRÓLAG JSON:
{"score": <1-10 number, 1 tizedes>, "notes": "<2-4 mondat magyarul>"}`;

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

    const body = await req.json().catch(() => ({}));
    const onlyMissing = body.onlyMissing !== false; // default true
    const docIds: string[] | null = Array.isArray(body.docIds) ? body.docIds : null;

    let query = supabase.from("documents").select("id, title, category, folder, description, when_to_use, content, mime_type, quality_score");
    if (docIds) query = query.in("id", docIds);
    else if (onlyMissing) query = query.is("quality_score", null);
    const { data: docs, error } = await query.limit(50);
    if (error) throw error;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const results: any[] = [];
    for (const d of docs ?? []) {
      const payload = {
        title: d.title,
        category: d.category,
        folder: d.folder,
        description: d.description,
        when_to_use: d.when_to_use,
        mime_type: d.mime_type,
        content: d.content ? String(d.content).slice(0, 6000) : null,
      };
      try {
        const up = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Lovable-API-Key": LOVABLE_API_KEY },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [
              { role: "system", content: AUDIT_SYSTEM },
              { role: "user", content: `Doksi:\n${JSON.stringify(payload)}` },
            ],
            response_format: { type: "json_object" },
          }),
        });
        if (!up.ok) {
          const t = await up.text();
          results.push({ id: d.id, error: t.slice(0, 200) });
          continue;
        }
        const j = await up.json();
        const txt = j?.choices?.[0]?.message?.content ?? "{}";
        const parsed = JSON.parse(txt);
        const score = typeof parsed.score === "number" ? Math.max(1, Math.min(10, parsed.score)) : null;
        const notes = typeof parsed.notes === "string" ? parsed.notes.slice(0, 500) : null;
        if (score != null) {
          await supabase.from("documents").update({ quality_score: score, quality_notes: notes }).eq("id", d.id);
        }
        results.push({ id: d.id, score, notes });
      } catch (e) {
        results.push({ id: d.id, error: String(e?.message ?? e) });
      }
    }

    return new Response(JSON.stringify({ count: results.length, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e?.message ?? e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
