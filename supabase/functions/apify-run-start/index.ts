// Apify — start a run. Accepts either:
//  (a) actor_id + input (manual mode)
//  (b) natural_query → AI builds Google Maps Extractor input (admin-magic mode)
// Records the run in apify_runs, returns run_id for polling.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const APIFY = "https://api.apify.com/v2";

async function aiBuildGoogleMapsInput(query: string, lovableKey: string): Promise<any> {
  const sys = `Te egy Apify Google Maps Extractor (compass/crawler-google-places) input builder vagy.
A user magyar természetes nyelvű query-t ad (pl. "budapesti rooftop bar"). Adj vissza egy JSON-t pontosan ezzel a kulcs-szerkezettel:
{ "searchStringsArray": ["…"], "locationQuery": "Budapest, Hungary", "maxCrawledPlacesPerSearch": 80, "language": "hu", "deeperCityScrape": false, "scrapeContacts": true }
A searchStringsArray 1-3 fókuszált angol+magyar keresési stringet tartalmazzon, ami lefedi a query-t.`;
  const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${lovableKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [{ role: "system", content: sys }, { role: "user", content: query }],
      response_format: { type: "json_object" },
    }),
  });
  if (!r.ok) throw new Error(`AI input build failed ${r.status}`);
  const j = await r.json();
  return JSON.parse(j.choices[0].message.content);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const token = Deno.env.get("APIFY_API_TOKEN");
    if (!token) throw new Error("APIFY_API_TOKEN not configured");
    const lovableKey = Deno.env.get("LOVABLE_API_KEY")!;

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: authHeader } } });
    const { data: claims } = await sb.auth.getClaims(authHeader.replace("Bearer ", ""));
    if (!claims?.claims?.sub) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const userId = claims.claims.sub;
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const body = await req.json();
    let { actor_id, input, natural_query, actor_name } = body;

    if (natural_query && !input) {
      actor_id = actor_id || "compass/crawler-google-places";
      actor_name = actor_name || "Google Maps Extractor";
      input = await aiBuildGoogleMapsInput(natural_query, lovableKey);
    }
    if (!actor_id || !input) throw new Error("actor_id and input required (or natural_query for auto-build)");

    // Apify expects actor id slug with `~` instead of `/` for path
    const actorPath = actor_id.replace("/", "~");
    const startRes = await fetch(`${APIFY}/acts/${actorPath}/runs?token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const startJ = await startRes.json();
    if (!startRes.ok) throw new Error(`Apify start ${startRes.status}: ${JSON.stringify(startJ)}`);

    const run = startJ.data;
    const { data: row, error } = await admin.from("apify_runs").insert({
      user_id: userId,
      actor_id,
      actor_name: actor_name ?? actor_id,
      apify_run_id: run.id,
      status: run.status ?? "RUNNING",
      input,
      dataset_id: run.defaultDatasetId,
      source_query: natural_query ?? null,
    }).select().single();
    if (error) throw error;

    return new Response(JSON.stringify({
      ok: true,
      run_id: row.id,
      apify_run_id: run.id,
      status: run.status,
      input,
      actor_id,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: String((e as Error).message) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
