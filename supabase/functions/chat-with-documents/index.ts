// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM = `Te a Come Get It belső "Chat a doksikkal" asszisztense vagy (NotebookLM-stílus).
Magyarul, tegezve, tömören válaszolj. KIZÁRÓLAG a megadott doksik tartalmából dolgozz.
Ha nincs elég infó a doksikban, mondd: "A megadott doksikban nincs erre adat." — ne találj ki dolgokat.
Minden állítás után jelöld a forrást szögletes zárójelben így: [doc: <doksi címe>].
Markdownban válaszolj (címek, bulletek, kód, idézet ha kell).`;

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

    const { documentIds, message, history } = await req.json();
    if (!Array.isArray(documentIds) || documentIds.length === 0) {
      return new Response(JSON.stringify({ error: "documentIds required" }), { status: 400, headers: corsHeaders });
    }
    if (typeof message !== "string" || !message.trim()) {
      return new Response(JSON.stringify({ error: "message required" }), { status: 400, headers: corsHeaders });
    }

    const { data: docs, error } = await supabase
      .from("documents")
      .select("id, title, folder, category, description, when_to_use, content, tldr, key_points")
      .in("id", documentIds.slice(0, 20));
    if (error) throw error;

    const context = (docs ?? []).map((d) => {
      const body = d.content ? String(d.content).slice(0, 8000) : (d.tldr ?? d.description ?? "");
      return `### [doc: ${d.title}]
Mappa: ${d.folder ?? "-"} · Kategória: ${d.category ?? "-"}
${d.description ? `Leírás: ${d.description}\n` : ""}${d.when_to_use ? `Mikor használd: ${d.when_to_use}\n` : ""}${d.key_points ? `Kulcspontok: ${JSON.stringify(d.key_points)}\n` : ""}
Tartalom:
${body}`;
    }).join("\n\n---\n\n");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const messages = [
      { role: "system", content: SYSTEM },
      { role: "system", content: `KONTEXTUS DOKSIK:\n\n${context}` },
      ...(Array.isArray(history) ? history.filter((m: any) => m?.role && m?.content).slice(-12) : []),
      { role: "user", content: message },
    ];

    const up = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": LOVABLE_API_KEY },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages,
        stream: true,
      }),
    });

    if (up.status === 429) return new Response(JSON.stringify({ error: "Túl sok kérés, próbáld újra később." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (up.status === 402) return new Response(JSON.stringify({ error: "AI kredit elfogyott, tölts fel kreditet." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!up.ok || !up.body) throw new Error(`AI error ${up.status}: ${(await up.text()).slice(0, 300)}`);

    return new Response(up.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
