// Lead Auto-Research — uses Firecrawl (if available) to scrape a lead's website
// and search reviews, then AI-summarizes into partners.research_notes.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FIRECRAWL_BASE = "https://api.firecrawl.dev/v2";

async function firecrawlScrape(url: string, apiKey: string) {
  const r = await fetch(`${FIRECRAWL_BASE}/scrape`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ url, formats: ["markdown", "summary"], onlyMainContent: true }),
  });
  if (!r.ok) throw new Error(`firecrawl ${r.status}`);
  return await r.json();
}

async function firecrawlSearch(query: string, apiKey: string) {
  const r = await fetch(`${FIRECRAWL_BASE}/search`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, limit: 4 }),
  });
  if (!r.ok) return [];
  const j = await r.json();
  return j?.data?.web ?? j?.web ?? [];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { partner_id } = await req.json();
    if (!partner_id) throw new Error("partner_id required");
    const lovableKey = Deno.env.get("LOVABLE_API_KEY")!;
    const firecrawlKey = Deno.env.get("FIRECRAWL_API_KEY");
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data: partner, error } = await sb.from("partners").select("*").eq("id", partner_id).maybeSingle();
    if (error || !partner) throw new Error("partner not found");

    const websiteUrl = (partner as any).website || null;
    const companyName = (partner as any).company_name;
    const city = (partner as any).city ?? "";

    let scrapeData: any = null;
    let reviews: any[] = [];
    const hasLive = Boolean(firecrawlKey);
    if (firecrawlKey) {
      if (websiteUrl) { try { scrapeData = await firecrawlScrape(websiteUrl, firecrawlKey); } catch (e) { console.warn(e); } }
      try { reviews = await firecrawlSearch(`${companyName} ${city} vélemények reviews`, firecrawlKey); } catch (e) { console.warn(e); }
    }

    const ctx = `Cégnév: ${companyName}\nVáros: ${city}\nKategória: ${(partner as any).category ?? "—"}\nWeboldal: ${websiteUrl ?? "—"}\n\nWebsite scrape:\n${scrapeData?.data?.summary ?? scrapeData?.summary ?? "(nincs)"}\n\nReview források:\n${reviews.map((r: any, i: number) => `[${i + 1}] ${r.title} - ${r.url}\n${r.description ?? ""}`).join("\n")}`;

    const prompt = `Magyar vendéglátóhely lead-kutatás a Come Get It (drink rewards) számára.

${ctx}

JSON output:
{
  "snapshot": "2-3 mondat: mi ez a hely, kinek szól",
  "opportunity_score": 0-100,
  "fit_reasons": ["max 3 ok, miért jó fit a CGI-nek"],
  "risks": ["max 2 kockázat / red flag"],
  "talking_points": ["max 3 konkrét nyitó-mondat outreach-hez magyarul"],
  "review_sentiment": "positive|mixed|negative|unknown",
  "active_on_social": true/false,
  "next_action": "1 konkrét javasolt következő lépés"
}

CSAK a JSON-t add vissza.`;

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${lovableKey}` },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }),
    });
    if (!r.ok) throw new Error(`ai ${r.status}: ${await r.text()}`);
    const j = await r.json();
    const notes = JSON.parse(j?.choices?.[0]?.message?.content ?? "{}");

    await sb.from("partners").update({
      research_notes: { ...notes, _live_search: hasLive, _researched_at: new Date().toISOString() },
      last_researched_at: new Date().toISOString(),
    }).eq("id", partner_id);

    return new Response(JSON.stringify({ ok: true, notes, hasLive }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("lead-auto-research", e);
    return new Response(JSON.stringify({ error: String((e as Error).message ?? e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
