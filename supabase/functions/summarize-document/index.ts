// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM = `Te a Come Get It belső dokumentum-összefoglalója vagy. Magyarul, tömören, üzletfókuszúan dolgozol.
Egy doksi metaadatát + tartalmát kapod. Készítsd el:
- tldr: 2-3 mondatos összefoglaló
- key_points: 3-6 db rövid bullet (max 12 szó/db), a legfontosabb állítások
- faq: 3-5 db {q, a} pár — gyakori kérdések és tömör válaszok
- suggested_questions: 3-5 db rövid kérdés, amit egy olvasó feltehet a doksiról AI-nak

VÁLASZ KIZÁRÓLAG JSON, ez a séma:
{"tldr": string, "key_points": string[], "faq": [{"q": string, "a": string}], "suggested_questions": string[]}`;

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

    const { docId } = await req.json();
    if (!docId) return new Response(JSON.stringify({ error: "docId required" }), { status: 400, headers: corsHeaders });

    const { data: d, error } = await supabase.from("documents").select("*").eq("id", docId).maybeSingle();
    if (error || !d) throw new Error(error?.message ?? "Document not found");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const payload = {
      title: d.title,
      category: d.category,
      folder: d.folder,
      description: d.description,
      when_to_use: d.when_to_use,
      mime_type: d.mime_type,
      content: d.content ? String(d.content).slice(0, 12000) : null,
    };

    if (!payload.content && !payload.description) {
      return new Response(JSON.stringify({ error: "Nincs szöveges tartalom amit össze lehetne foglalni." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const up = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": LOVABLE_API_KEY },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: `Doksi:\n${JSON.stringify(payload)}` },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (up.status === 429) return new Response(JSON.stringify({ error: "Túl sok kérés, próbáld újra később." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (up.status === 402) return new Response(JSON.stringify({ error: "AI kredit elfogyott, tölts fel a Lovable workspace beállításokban." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!up.ok) throw new Error(`AI error ${up.status}: ${(await up.text()).slice(0, 300)}`);

    const j = await up.json();
    const txt = j?.choices?.[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(txt);

    const update = {
      tldr: typeof parsed.tldr === "string" ? parsed.tldr.slice(0, 1000) : null,
      key_points: Array.isArray(parsed.key_points) ? parsed.key_points.slice(0, 10) : null,
      faq: Array.isArray(parsed.faq) ? parsed.faq.slice(0, 8) : null,
      suggested_questions: Array.isArray(parsed.suggested_questions) ? parsed.suggested_questions.slice(0, 8) : null,
      last_summarized_at: new Date().toISOString(),
    };
    await supabase.from("documents").update(update).eq("id", docId);

    return new Response(JSON.stringify({ ok: true, ...update }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
