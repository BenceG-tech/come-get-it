// AI scrape-tervező: gap-analízist csinál a meglévő partners-en, és
// 3-5 célzott search-string csomagot ad vissza a hiányzó szegmensekre.
// Visszaadja a becsült Apify költséget is.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM = `Te a Come Get It magyar fogyasztói app lead-discovery tervezője vagy.
A Come Get It egy ingyenes ital / loyalty app vendéglátóhelyeken — Budapest belváros (V/VI/VII/VIII/IX kerület) a top fókusz.
Top kategóriák: koktélbár > craft bár > specialty coffee > romkocsma > borbár > bisztró > kávézó > pub.
Adott a már LEFEDETT helyek eloszlása. A te dolgod: kiválasztani 3-5 célzott search-string csomagot az Apify Google Maps Scraper-hez,
ami a HIÁNYZÓ szegmenseket pótolja és kerüli a duplikációt.
Visszaadsz EGY JSON-t pontosan ezzel a szerkezettel:
{
  "rationale": "1-2 mondat magyarul miért ezeket választottad",
  "search_strings": ["string1","string2", ...],
  "location_query": "Budapest, Hungary",
  "max_per_search": 60,
  "focus_segments": ["pl. specialty coffee Budapest VII","craft beer bar VIII",...]
}
Search stringek angolul vagy magyarul (Google Maps mindkettőt érti). Konkrét, NEM túl tág.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const supa = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: authHeader } } });
    const { data: claims } = await supa.auth.getClaims(authHeader.replace("Bearer ", ""));
    if (!claims?.claims?.sub) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const LOVABLE_KEY = Deno.env.get("LOVABLE_API_KEY")!;

    // Gap analízis: meglévő partnerek kategória + város eloszlása
    const { data: existing } = await admin.from("partners").select("category, city, address").eq("type", "venue").limit(2000);
    const catCount: Record<string, number> = {};
    const cityCount: Record<string, number> = {};
    for (const p of existing ?? []) {
      const c = (p.category ?? "ismeretlen").toString().toLowerCase().slice(0, 40);
      catCount[c] = (catCount[c] ?? 0) + 1;
      const ct = (p.city ?? "?").toString();
      cityCount[ct] = (cityCount[ct] ?? 0) + 1;
    }

    const userPrompt = `Eddig lefedett (top 15 kategória): ${JSON.stringify(Object.entries(catCount).sort((a, b) => b[1] - a[1]).slice(0, 15))}.
Városok: ${JSON.stringify(cityCount)}.
Összesen ${existing?.length ?? 0} hely.

Adj 3-5 célzott search-stringet a HIÁNYZÓ vagy ALULREPREZENTÁLT szegmensekre. Ne ismételj olyat ami már bőven lefedett (>80 hely).`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${LOVABLE_KEY}` },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: SYSTEM }, { role: "user", content: userPrompt }],
        response_format: { type: "json_object" },
      }),
    });
    if (!res.ok) throw new Error(`AI ${res.status}: ${await res.text()}`);
    const data = await res.json();
    const plan = JSON.parse(data.choices[0].message.content);

    const numSearches = Array.isArray(plan.search_strings) ? plan.search_strings.length : 0;
    const maxPer = plan.max_per_search ?? 60;
    const expectedPlaces = numSearches * maxPer * 0.7; // realistic capture rate
    const cost = expectedPlaces * 0.004 + expectedPlaces * 0.85 * 0.002; // place + ~85% contact enrichment
    const costCeiling = numSearches * maxPer * (0.004 + 0.002);

    return new Response(JSON.stringify({
      ok: true,
      plan,
      apify_input: {
        searchStringsArray: plan.search_strings,
        locationQuery: plan.location_query ?? "Budapest, Hungary",
        maxCrawledPlacesPerSearch: maxPer,
        language: "hu",
        deeperCityScrape: false,
        scrapeContacts: true,
      },
      cost_estimate_usd: Math.round(cost * 100) / 100,
      cost_ceiling_usd: Math.round(costCeiling * 100) / 100,
      expected_places: Math.round(expectedPlaces),
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: String((e as Error).message) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
