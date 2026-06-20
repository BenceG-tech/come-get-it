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

    const { text, format_key } = await req.json();
    if (!text || typeof text !== "string") return new Response(JSON.stringify({ error: "text required" }), { status: 400, headers: corsHeaders });

    const { data: images } = await supabase
      .from("documents")
      .select("id, title, ai_description, ai_tags, ai_mood, ai_suggested_caption, storage_path, mime_type, folder")
      .like("mime_type", "image/%")
      .order("ai_analyzed_at", { ascending: false, nullsFirst: false })
      .limit(80);

    const candidates = (images ?? []).filter((i) => i.storage_path);
    if (candidates.length === 0) return Response.json({ matches: [] }, { headers: corsHeaders });

    const compact = candidates.map((c, i) => ({
      i,
      id: c.id,
      title: c.title,
      desc: c.ai_description?.slice(0, 200) ?? "",
      tags: c.ai_tags ?? [],
      mood: c.ai_mood ?? "",
    }));

    const apiKey = Deno.env.get("LOVABLE_API_KEY")!;
    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "Te a Come Get It (Budapest nightlife reward app) marketing képválasztó AI-ja vagy. Választj a megadott képek közül azokat, amelyek vizuálisan ÉS hangulatilag a legjobban passzolnak az adott közösségi poszthoz. Részesítsd előnyben a brand-tone illeszkedést (cyan/neon, éjszaka, baráti hangulat). Csak JSON: {\"matches\":[{\"i\":<idx>,\"score\":1-100,\"reason\":\"...\"}]} top 5." },
          { role: "user", content: `Formátum: ${format_key ?? "social_post"}\n\nPoszt szöveg:\n${text}\n\nElérhető képek (max top 5 választható):\n${JSON.stringify(compact)}` },
        ],
      }),
    });

    if (!resp.ok) {
      const errTxt = await resp.text();
      return new Response(JSON.stringify({ error: `AI: ${resp.status} ${errTxt.slice(0, 200)}` }), { status: 500, headers: corsHeaders });
    }

    const j = await resp.json();
    let parsed: any = { matches: [] };
    try { parsed = JSON.parse(j.choices[0].message.content); } catch {}
    const matches = (parsed.matches ?? []).slice(0, 5).map((m: any) => {
      const c = candidates[m.i];
      if (!c) return null;
      const { data: pub } = supabase.storage.from("admin-docs").getPublicUrl(c.storage_path);
      return {
        id: c.id,
        title: c.title,
        url: pub.publicUrl,
        storage_path: c.storage_path,
        score: m.score,
        reason: m.reason,
        ai_description: c.ai_description,
      };
    }).filter(Boolean);

    return Response.json({ matches }, { headers: corsHeaders });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
