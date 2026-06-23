// AI-generated personalized app mockup for a lead. Uses Lovable AI Gateway image model.
// Stores into admin-docs bucket under /lead-mockups/{partner_id}/, returns public URL.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const lovableKey = Deno.env.get("LOVABLE_API_KEY")!;
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: authHeader } } });
    const { data: claims } = await sb.auth.getClaims(authHeader.replace("Bearer ", ""));
    if (!claims?.claims?.sub) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const userId = claims.claims.sub;
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { partner_id, variant = "feed", custom_prompt } = await req.json();
    if (!partner_id) throw new Error("partner_id required");

    const { data: partner } = await admin.from("partners").select("*").eq("id", partner_id).maybeSingle();
    if (!partner) throw new Error("partner not found");

    const venueName = (partner as any).company_name;
    const category = (partner as any).category ?? "vendéglátóhely";
    const city = (partner as any).city ?? "Budapest";

    const promptByVariant: Record<string, string> = {
      feed: `Photorealistic iPhone 15 Pro screenshot mockup of a modern mobile app called "Come Get It". The phone is held in a hand against a dark moody background with neon cyan glow. The app screen shows a deal card for "${venueName}" — a ${category} in ${city}. The card has a beautiful venue photo at top, large neon cyan headline reading "INGYEN KOKTÉL", venue name "${venueName}" prominently displayed, a "BEVÁLTOM" button in glowing cyan. Dark UI (#050505 background), Hungarian text. Cinematic lighting. Ultra-realistic, 4K, marketing-quality.`,
      story: `Vertical 9:16 Instagram Story creative for "${venueName}" (${category} in ${city}). Top half: bold neon cyan text "ÚJ" over a dark blurred bar interior. Middle: an iPhone mockup showing the "Come Get It" app deal card for "${venueName}" with "Ingyen koktél" offer. Bottom: cyan "swipe up" CTA on dark background. Dark moody aesthetic, cinematic, vertical composition.`,
      dm: `Square 1:1 social card for Instagram DM preview. Center: stylized iPhone mockup with the "Come Get It" app open, showing a deal card for "${venueName}" — venue name large, neon cyan accents on dark #050505 background. Below the phone: white Hungarian text "Így néznél ki a Come Get It appban 👇" Floating cyan particles. Premium marketing aesthetic.`,
    };
    const prompt = custom_prompt || promptByVariant[variant] || promptByVariant.feed;

    // Lovable AI Gateway image generation (Gemini image / nano-banana)
    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${lovableKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [{ role: "user", content: prompt }],
        modalities: ["image", "text"],
      }),
    });
    if (!r.ok) {
      const err = await r.text();
      throw new Error(`Image gen failed ${r.status}: ${err}`);
    }
    const j = await r.json();
    const imgUrl: string = j.choices?.[0]?.message?.images?.[0]?.image_url?.url ?? j.choices?.[0]?.message?.images?.[0]?.url;
    if (!imgUrl) throw new Error("no image returned");

    // Convert data URL → bytes → upload to admin-docs storage
    let publicUrl = imgUrl;
    let storagePath: string | null = null;
    if (imgUrl.startsWith("data:")) {
      const [meta, b64] = imgUrl.split(",");
      const mime = meta.match(/data:(.*?);/)?.[1] ?? "image/png";
      const ext = mime.includes("jpeg") ? "jpg" : mime.includes("webp") ? "webp" : "png";
      const bin = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
      const path = `lead-mockups/${partner_id}/${variant}-${Date.now()}.${ext}`;
      const { error: upErr } = await admin.storage.from("admin-docs").upload(path, bin, { contentType: mime, upsert: false });
      if (upErr) throw upErr;
      storagePath = path;
      const { data: signed } = await admin.storage.from("admin-docs").createSignedUrl(path, 60 * 60 * 24 * 365);
      publicUrl = signed?.signedUrl ?? imgUrl;
    }

    const { data: mock, error } = await admin.from("lead_mockups").insert({
      partner_id,
      user_id: userId,
      image_url: publicUrl,
      storage_path: storagePath,
      prompt,
      variant,
      model: "google/gemini-2.5-flash-image-preview",
    }).select().single();
    if (error) throw error;

    return new Response(JSON.stringify({ ok: true, mockup: mock }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: String((e as Error).message) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
