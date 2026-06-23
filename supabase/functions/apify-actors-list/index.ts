// Apify — list user's actors + saved tasks (one APIFY_API_TOKEN covers the whole account, every actor).
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const APIFY = "https://api.apify.com/v2";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const token = Deno.env.get("APIFY_API_TOKEN");
    if (!token) throw new Error("APIFY_API_TOKEN not configured");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: authHeader } } });
    const { data: claims } = await sb.auth.getClaims(authHeader.replace("Bearer ", ""));
    if (!claims?.claims?.sub) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    // Saved tasks
    const tasksRes = await fetch(`${APIFY}/actor-tasks?token=${token}&limit=100&desc=true`);
    const tasksJ = tasksRes.ok ? await tasksRes.json() : { data: { items: [] } };
    // User's actors (custom-built); we also expose curated public picks
    const actorsRes = await fetch(`${APIFY}/acts?token=${token}&limit=100&desc=true`);
    const actorsJ = actorsRes.ok ? await actorsRes.json() : { data: { items: [] } };

    const curated = [
      { id: "compass/crawler-google-places", name: "Google Maps Extractor", description: "Helyek scrape-elése Google Maps-ből (név, cím, telefon, email, rating, photos)" },
      { id: "apify/instagram-scraper", name: "Instagram Scraper", description: "IG profilok / posztok / hashtagek" },
      { id: "apify/website-content-crawler", name: "Website Content Crawler", description: "Egy weboldal teljes tartalmának scrape-elése" },
      { id: "apify/contact-info-scraper", name: "Contact Info Scraper", description: "Email / telefon / social linkek kinyerése bármely URL-ből" },
    ];

    return new Response(JSON.stringify({
      tasks: (tasksJ.data?.items ?? []).map((t: any) => ({ id: t.id, name: t.name, actorId: t.actId, modifiedAt: t.modifiedAt })),
      actors: (actorsJ.data?.items ?? []).map((a: any) => ({ id: a.id, name: a.name, title: a.title, username: a.username })),
      curated,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: String((e as Error).message) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
