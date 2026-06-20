// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SOURCE_URLS = [
  "https://come-get-it.app/",
  "https://come-get-it.app/vendeglatohelyek",
  "https://come-get-it.app/partnerek",
  "https://come-get-it.app/italmarkak",
  "https://come-get-it.app/rewards-partners",
];

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

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

    const body = await req.json().catch(() => ({}));
    const extraText: string = body?.extraText ?? "";

    const chunks: string[] = [];
    for (const url of SOURCE_URLS) {
      try {
        const r = await fetch(url, { headers: { "User-Agent": "ComeGetIt-Brand-Extractor/1.0" } });
        if (r.ok) {
          const html = await r.text();
          const text = stripHtml(html).slice(0, 8000);
          chunks.push(`### ${url}\n${text}`);
        }
      } catch (e) {
        console.error("fetch landing", url, e);
      }
    }

    if (extraText) chunks.push(`### Extra (Drive doksiból / kézi input)\n${extraText.slice(0, 12000)}`);

    if (chunks.length === 0) {
      return new Response(JSON.stringify({ error: "Nem sikerült letölteni a landing tartalmát." }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const corpus = chunks.join("\n\n---\n\n");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
    const sys = `Te a "Come Get It" magyar startup brand-elemzője vagy. Adott landing oldal szövegekből vond ki a brand DNS-t pontosan a megadott JSON sémába, magyarul.
Csak JSON-t adj vissza, semmi mást.`;

    const userMsg = `Elemezd ezeket a Come Get It oldalakat és vond ki a brand DNS-t:

${corpus}

Add vissza PONTOSAN ezt a JSON struktúrát (a meglévő tartalmakat alapul véve, ne találj ki):
{
  "tone_of_voice": {
    "examples": ["max 8 db jellemző mondat/kifejezés a landingről"],
    "avoid": ["max 5 szó/fordulat amit kerülni kell - pl. túl formális vagy off-brand kifejezések"],
    "required_ctas": ["a leggyakoribb CTA-k szó szerint"]
  },
  "personas": [
    { "name": "persona neve", "description": "1-2 mondat", "pain_points": ["..."], "value_offer": "mit kínálunk neki" }
  ],
  "founding_offer": {
    "summary": "founding partner program lényege 2-3 mondatban",
    "pricing": "ha van árazás említve",
    "perks": ["konkrét perkek listája"]
  },
  "usps": ["max 6 USP rövid mondatban"],
  "content_pillars": ["4-6 fő tartalom-téma kulcsszóval"]
}`;

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
      return new Response(JSON.stringify({ error: "AI gateway error", body: t }), { status: aiRes.status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const aiJson = await aiRes.json();
    const content = aiJson?.choices?.[0]?.message?.content ?? "{}";
    let parsed: any = {};
    try { parsed = JSON.parse(content); } catch (e) { parsed = { _raw: content }; }

    return new Response(JSON.stringify({ suggestion: parsed, sources: SOURCE_URLS }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e?.message ?? e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
