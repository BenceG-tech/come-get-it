// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { loadBrandContext } from "../_shared/brand-context.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SIZE_BY_FORMAT: Record<string, string> = {
  ig_caption: "1024x1024",
  ig_story: "1024x1536",
  fb_post: "1536x1024",
  linkedin: "1536x1024",
  email_body: "1536x1024",
  default: "1024x1024",
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

    const { text, format_key, style_hint } = await req.json();
    if (!text) return new Response(JSON.stringify({ error: "text required" }), { status: 400, headers: corsHeaders });

    const brandCtx = await loadBrandContext(supabase);
    const size = SIZE_BY_FORMAT[format_key] ?? SIZE_BY_FORMAT.default;

    const prompt = `Cinematic editorial photograph for Come Get It — a Budapest nightlife reward app.
Visual DNA: dark moody atmosphere, electric cyan #00bcd4 neon glow, deep blacks, glass and chrome reflections, shallow depth of field, 35mm lens, photoreal.
Subject context (translate visually, DO NOT render any text or words in the image): "${text.slice(0, 400)}"
${style_hint ? `Extra style note: ${style_hint}` : ""}
Composition rules:
- LEAVE the top-left 25% area visually calm (subtle darker gradient) so a logo can be overlaid by the app.
- No text, no captions, no logos, no watermarks, no UI mockups, no QR codes inside the image.
- Avoid stock-photo cliches, avoid faces of identifiable real people.
Brand reference (background context only, do not render literally): ${brandCtx.slice(0, 600)}`;

    const apiKey = Deno.env.get("LOVABLE_API_KEY")!;
    const imgResp = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai/gpt-image-2",
        prompt,
        size,
        quality: "low",
        n: 1,
      }),
    });

    if (!imgResp.ok) {
      const errTxt = await imgResp.text();
      return new Response(JSON.stringify({ error: `Image gen: ${imgResp.status} ${errTxt.slice(0, 400)}` }), { status: imgResp.status, headers: corsHeaders });
    }

    const j = await imgResp.json();
    const b64 = j?.data?.[0]?.b64_json;
    if (!b64) return new Response(JSON.stringify({ error: "No image returned" }), { status: 500, headers: corsHeaders });

    const bin = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    const path = `post-images/${user.id}/${Date.now()}.png`;
    const { error: upErr } = await supabase.storage.from("admin-docs").upload(path, bin, {
      contentType: "image/png",
      upsert: false,
    });
    if (upErr) throw new Error(upErr.message);

    const { data: docRow, error: insErr } = await supabase.from("documents").insert({
      title: `AI poszt-kép · ${new Date().toISOString().slice(0, 10)}`,
      folder: "AI posztképek",
      category: "marketing",
      mime_type: "image/png",
      storage_path: path,
      ai_description: text.slice(0, 500),
      ai_suggested_caption: text.slice(0, 220),
      ai_analyzed_at: new Date().toISOString(),
      is_ai_generated: true,
      created_by: user.id,
    }).select("id").single();
    if (insErr) throw new Error(insErr.message);

    const { data: pub } = supabase.storage.from("admin-docs").getPublicUrl(path);

    return Response.json({ id: docRow.id, url: pub.publicUrl, storage_path: path, size }, { headers: corsHeaders });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
