// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { loadBrandContext } from "../_shared/brand-context.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FORMAT_SPECS: Record<string, string> = {
  ig_caption: "Instagram caption (max 220 karakter), 1 sor hook + 2-3 sor érték + CTA, max 6 hashtag a végén külön sorban",
  ig_story: "Instagram Story script: 3 slide, mindegyiknél 1 mondat + visual instrukció szögletes zárójelben",
  fb_post: "Facebook poszt (300-500 karakter), barátságos, 1 emoji max, CTA linkkel a végén",
  linkedin: "LinkedIn poszt (600-900 karakter), szakmai de melegszívű, 1. személyű sztori → tanulság → CTA",
  email_subject: "Email subject (max 60 karakter) — pattern-interrupt, ne legyen clickbait",
  email_body: "Email body magyar (150-250 szó), tegező, P.S.-szel a végén",
  dm_opener: "DM nyitó üzenet (max 280 karakter) — személyre szabott, NEM eladós, 1 kérdéssel zárul",
  whatsapp: "WhatsApp üzenet (max 250 karakter) — közvetlen, baráti, 1 emoji",
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
    const brief: string = String(body?.brief ?? "").trim();
    const persona: string = String(body?.persona ?? "").trim();
    const formats: string[] = Array.isArray(body?.formats) ? body.formats : Object.keys(FORMAT_SPECS);
    const variantCount: number = Math.min(Math.max(Number(body?.variantCount ?? 3), 1), 5);

    if (!brief) return new Response(JSON.stringify({ error: "brief required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const brandCtx = await loadBrandContext(supabase);

    const formatInstructions = formats
      .filter((k) => FORMAT_SPECS[k])
      .map((k) => `- "${k}": ${FORMAT_SPECS[k]}`)
      .join("\n");

    const sys = `Te a Come Get It magyar startup tartalom-gyártója vagy. Magyarul írj, tegezve, energikusan, tömören. Soha NE használj generikus AI fordulatot ("a mai rohanó világban", "lépj velünk kapcsolatba", "ne hagyd ki"). Soha NE magázz.

${brandCtx}

Most ${variantCount} darab MERŐBEN ELTÉRŐ variánst kell írnod minden formátumhoz. A variánsok különböző szögből közelítsenek: pl. 1) érzelmi sztori, 2) konkrét szám/adat, 3) kérdéssel nyit/provokatív.`;

    const personaLine = persona ? `\nCélközönség persona: ${persona}` : "";

    const userMsg = `Brief: ${brief}${personaLine}

Készíts ${variantCount} variánst minden formátumhoz. Formátumok:
${formatInstructions}

Add vissza PONTOSAN ezt a JSON-t (semmi mást, csak JSON):
{
  "formats": [
    {
      "key": "ig_caption",
      "label": "Instagram caption",
      "variants": [
        { "label": "v1 — érzelmi sztori", "text": "...", "notes": "miért működhet" },
        { "label": "v2 — adat-vezérelt", "text": "...", "notes": "..." },
        { "label": "v3 — provokatív kérdés", "text": "...", "notes": "..." }
      ]
    }
  ],
  "brand_fit_score": 85,
  "brand_fit_notes": "rövid önreflexió: hol erős, hol lehetne jobb"
}`;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": LOVABLE_API_KEY },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: sys },
          { role: "user", content: userMsg },
        ],
        response_format: { type: "json_object" },
      }),
    });
    if (!aiRes.ok) {
      const t = await aiRes.text();
      return new Response(JSON.stringify({ error: "AI gateway error", status: aiRes.status, body: t }), { status: aiRes.status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const aiJson = await aiRes.json();
    const content = aiJson?.choices?.[0]?.message?.content ?? "{}";
    let parsed: any = {};
    try { parsed = JSON.parse(content); } catch { parsed = { _raw: content }; }

    // Persist generation
    const { data: saved } = await supabase
      .from("content_generations")
      .insert({
        prompt: brief,
        brief,
        persona: persona || null,
        formats: parsed.formats ?? [],
        brand_fit_score: parsed.brand_fit_score ?? null,
        created_by: user.id,
      })
      .select("id")
      .single();

    // Activity log
    await supabase.from("activity_log").insert({
      user_id: user.id,
      action: "generate",
      entity_type: "content_generation",
      entity_id: saved?.id ?? null,
      entity_label: brief.slice(0, 60),
      metadata: { formats: formats, persona: persona || null },
    });

    return new Response(JSON.stringify({ id: saved?.id, ...parsed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e?.message ?? e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
