// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { loadBrandContext } from "../_shared/brand-context.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CHANNEL_SPECS: Record<string, string> = {
  instagram: "Instagram caption (max 220 karakter), 1 hook + 2-3 sor érték + CTA, max 6 hashtag külön sorban.",
  facebook: "Facebook poszt (300-500 karakter), barátságos, max 1 emoji, CTA linkkel.",
  linkedin: "LinkedIn poszt (600-900 karakter), szakmai melegszívű 1. személyű sztori → tanulság → CTA.",
  email: "Email subject (max 60 karakter) + body (150-250 szó) JSON: { subject, body }.",
  blog: "Blog intro (300-400 szó), H1 cím + 3 alcím vázlat, SEO-friendly első bekezdés.",
  tiktok: "TikTok script: 3 jelenet hook→insight→CTA, mindegyiknél 1 mondat + visual instrukció.",
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

    const { brief_id } = await req.json();
    if (!brief_id) return new Response(JSON.stringify({ error: "brief_id required" }), { status: 400, headers: corsHeaders });

    const { data: brief, error: be } = await supabase.from("content_briefs").select("*").eq("id", brief_id).maybeSingle();
    if (be || !brief) return new Response(JSON.stringify({ error: be?.message ?? "Brief not found" }), { status: 404, headers: corsHeaders });

    const channels: string[] = Array.isArray(brief.channel_mix) && brief.channel_mix.length
      ? brief.channel_mix
      : ["instagram", "facebook", "linkedin"];

    const brandCtx = await loadBrandContext(supabase);
    const { data: recentSnippets } = await supabase
      .from("saved_content_snippets")
      .select("format_label, text")
      .order("created_at", { ascending: false })
      .limit(5);

    const channelInstr = channels
      .filter((c) => CHANNEL_SPECS[c])
      .map((c) => `- "${c}": ${CHANNEL_SPECS[c]}`)
      .join("\n");

    const sys = `Te a Come Get It marketing copywritere vagy. Magyarul, tegezve. A brief alapján csatornánként 1 kész posztot készíts.\n\n${brandCtx}\n\nCSAK JSON-t adj vissza, semmi mást.`;

    const userMsg = `BRIEF:\nCím: ${brief.title}\nSzög: ${brief.angle ?? "—"}\nCélközönség: ${brief.target_audience ?? "—"}\nKulcspontok: ${JSON.stringify(brief.key_points ?? [])}\nCTA: ${brief.cta ?? "—"}\nHangnem: ${brief.tone ?? "default brand tone"}\n\nCSATORNA SPECS:\n${channelInstr}\n\nUtóbbi snippetek (kerüld az ismétlést):\n${JSON.stringify((recentSnippets ?? []).map((s) => s.text?.slice(0, 80)))}\n\nVálasz JSON pontosan így:\n{ "posts": [ { "channel": "instagram", "text": "…", "hashtags": "#a #b", "image_idea": "rövid leírás" } ] }`;

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
    const posts: any[] = Array.isArray(parsed.posts) ? parsed.posts : [];

    // Save as content_generations row + optional snippets
    const formats = posts.map((p) => ({
      key: p.channel,
      label: p.channel,
      variants: [{ label: p.channel, text: p.text + (p.hashtags ? `\n\n${p.hashtags}` : ""), notes: p.image_idea }],
    }));
    const { data: gen } = await supabase.from("content_generations").insert({
      brief: `[Brief: ${brief.title}]\n${brief.angle ?? ""}`,
      persona: brief.target_audience,
      formats,
      brief_id: brief.id,
      created_by: user.id,
    }).select("id").maybeSingle();

    // Mark brief as in_production
    await supabase.from("content_briefs").update({ status: "in_production" }).eq("id", brief.id);

    return new Response(JSON.stringify({ posts, generation_id: gen?.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
