import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM = `Te a Come Get It magyar fogyasztói app lead-scoring asszisztense vagy. A Come Get It vendéglátóhelyeket (kávézók, bárok, éttermek, koktélbárok) céloz, ahol a felhasználók ingyen italokat / pontokat kapnak. Prioritás: Budapest belváros (V., VI., VII., VIII., IX. kerület) > Budapest külsőbb kerületek > vidéki nagyvárosok. Típus prioritás: koktélbár > craft bár > kávézó/specialty coffee > bisztró/étterem > pub > gyorsétterem. Méret jel: 100+ Google review = jó forgalmú, 500+ = nagyon erős. Visszaadsz EGY JSON objektumot, semmi mást.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const supa = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: authHeader } } });
    const { data: claims } = await supa.auth.getClaims(authHeader.replace("Bearer ",""));
    if (!claims?.claims?.sub) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { partner_ids } = await req.json();
    if (!Array.isArray(partner_ids) || partner_ids.length === 0) return new Response(JSON.stringify({ error: "partner_ids required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { data: partners } = await admin.from("partners").select("*").in("id", partner_ids);
    if (!partners?.length) return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const LOVABLE_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_KEY) return new Response(JSON.stringify({ error: "Missing LOVABLE_API_KEY" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const results: any[] = [];
    for (const p of partners) {
      const userPrompt = `Pontozd ezt a leadet 0-100 között a Come Get It illeszkedés alapján.\n\nAdat:\n${JSON.stringify({ name: p.company_name, type: p.type, category: p.category, city: p.city, address: p.address, rating: p.rating, rating_count: p.rating_count, instagram: p.instagram, website: p.website }, null, 2)}\n\nVálaszolj CSAK ezzel a JSON-nal: {"score": number, "reasons": [{"factor": "string", "impact": "+15"|"-10", "note": "rövid magyar magyarázat"}], "recommendation": "rövid magyar javaslat a következő lépésre"}`;

      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Lovable-API-Key": LOVABLE_KEY },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [{ role: "system", content: SYSTEM }, { role: "user", content: userPrompt }],
          response_format: { type: "json_object" },
        }),
      });

      if (!res.ok) {
        results.push({ id: p.id, error: `AI ${res.status}` });
        continue;
      }
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content ?? "{}";
      let parsed: any = {};
      try { parsed = JSON.parse(content); } catch { parsed = { score: 50, reasons: [], recommendation: content }; }
      const score = Math.max(0, Math.min(100, parseInt(parsed.score) || 50));
      await admin.from("partners").update({
        lead_score: score, score_reasons: parsed, score_updated_at: new Date().toISOString(),
      }).eq("id", p.id);
      results.push({ id: p.id, score, reasons: parsed.reasons });
    }

    return new Response(JSON.stringify({ ok: true, results }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: String((e as Error).message) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
