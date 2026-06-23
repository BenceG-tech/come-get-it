// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!isAdmin) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const body = await req.json();
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const titleHint: string = body.title || "";
    if (messages.length === 0) return new Response(JSON.stringify({ error: "messages required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const transcript = messages
      .map((m: any) => `**${m.role === "user" ? "Te" : "AI"}:** ${m.content}`)
      .join("\n\n");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    let title = titleHint.trim();
    let summary = "";

    if (LOVABLE_API_KEY) {
      try {
        const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Lovable-API-Key": LOVABLE_API_KEY, "X-Lovable-AIG-SDK": "raw-fetch" },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [
              { role: "system", content: "Magyarul válaszolj. Adj egy JSON-t: {\"title\":\"max 60 karakteres cím\",\"summary\":\"3-5 mondatos összefoglaló markdownban\"}. Csak JSON-t adj vissza, semmi mást." },
              { role: "user", content: `Foglald össze ezt a beszélgetést:\n\n${transcript.slice(0, 8000)}` },
            ],
          }),
        });
        if (resp.ok) {
          const j = await resp.json();
          const raw = j.choices?.[0]?.message?.content ?? "";
          const match = raw.match(/\{[\s\S]*\}/);
          if (match) {
            const parsed = JSON.parse(match[0]);
            if (!title) title = parsed.title ?? "";
            summary = parsed.summary ?? "";
          }
        }
      } catch {}
    }

    if (!title) title = `AI beszélgetés — ${new Date().toLocaleDateString("hu-HU")}`;
    const content = `${summary ? `## Összefoglaló\n\n${summary}\n\n---\n\n` : ""}## Beszélgetés\n\n${transcript}`;

    const { data: doc, error } = await supabase
      .from("documents")
      .insert({
        title,
        category: "ai_chat",
        folder: "AI beszélgetések",
        description: summary || transcript.slice(0, 200),
        content,
        created_by: user.id,
      })
      .select("id, title")
      .single();

    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    return new Response(JSON.stringify({ id: doc.id, title: doc.title }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
