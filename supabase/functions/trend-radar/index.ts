// Trend Radar — fetch market signals (Firecrawl search when available) and
// AI-summarize into trend_signals rows. Falls back to AI-only synthesis if
// FIRECRAWL_API_KEY is not configured.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DEFAULT_QUERIES = [
  { q: "magyar HORECA trendek 2026 vendéglátás", category: "horeca" },
  { q: "Gen Z drink preferences Hungary 2026", category: "consumer" },
  { q: "Wolt Foodora partner program changes 2026 Hungary", category: "competitor" },
  { q: "loyalty app F&B benchmarks 2026", category: "loyalty" },
  { q: "Budapest étterem nyitás trend 2026", category: "horeca" },
];

const FIRECRAWL_BASE = "https://api.firecrawl.dev/v2";

async function firecrawlSearch(query: string, apiKey: string) {
  const r = await fetch(`${FIRECRAWL_BASE}/search`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, limit: 5 }),
  });
  if (!r.ok) throw new Error(`firecrawl ${r.status}: ${await r.text()}`);
  const j = await r.json();
  // v2 returns { data: { web: [{title,url,description}] } } or { web: [...] }
  const web = j?.data?.web ?? j?.web ?? j?.data ?? [];
  return Array.isArray(web) ? web : [];
}

async function aiSummarize(query: string, category: string, sources: any[], lovableKey: string) {
  const sourceList = sources.length
    ? sources.map((s: any, i: number) => `[${i + 1}] ${s.title}\n${s.url}\n${s.description ?? ""}`).join("\n\n")
    : "(nincs élő forrás — generálj a 2026-os általános piaci tudásod alapján)";

  const prompt = `Magyar startup founder vagy a Come Get It (drink-rewards app) projekten.
Kategória: ${category}
Query: ${query}

Források:
${sourceList}

Adj vissza JSON-t a következő struktúrában (max 3 jel):
{
  "signals": [
    {
      "title": "Rövid magyar cím (max 80 char)",
      "summary": "2-3 mondat összefoglaló MAGYARUL, konkrét számokkal/példákkal ha van",
      "source_url": "URL vagy null",
      "source_title": "Forrás neve vagy null",
      "relevance_score": 0-100 (mennyire releváns a Come Get It számára),
      "published_at": "ISO date vagy null"
    }
  ]
}

CSAK a JSON-t add vissza, semmi mást.`;

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
  const txt = j?.choices?.[0]?.message?.content ?? "{}";
  try { return JSON.parse(txt); } catch { return { signals: [] }; }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const lovableKey = Deno.env.get("LOVABLE_API_KEY");
    const firecrawlKey = Deno.env.get("FIRECRAWL_API_KEY");
    const sbUrl = Deno.env.get("SUPABASE_URL")!;
    const sbServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    if (!lovableKey) throw new Error("LOVABLE_API_KEY missing");
    const sb = createClient(sbUrl, sbServiceKey);

    const body = await req.json().catch(() => ({}));
    const customQueries: Array<{ q: string; category?: string }> | undefined = body?.queries;
    const queries = customQueries?.length ? customQueries.map(c => ({ q: c.q, category: c.category ?? "custom" })) : DEFAULT_QUERIES;

    const inserted: any[] = [];
    const skipped: string[] = [];
    const hasLiveSearch = Boolean(firecrawlKey);

    for (const { q, category } of queries) {
      let sources: any[] = [];
      if (firecrawlKey) {
        try { sources = await firecrawlSearch(q, firecrawlKey); }
        catch (e) { console.warn("firecrawl fail", q, e); }
      }
      const ai = await aiSummarize(q, category, sources, lovableKey);
      const signals = Array.isArray(ai?.signals) ? ai.signals : [];
      for (const s of signals) {
        const { data } = await sb.from("trend_signals").insert({
          title: String(s.title ?? q).slice(0, 200),
          summary: s.summary ?? null,
          source_url: s.source_url ?? null,
          source_title: s.source_title ?? null,
          category,
          relevance_score: Math.min(100, Math.max(0, Number(s.relevance_score ?? 50))),
          query: q,
          published_at: s.published_at ?? null,
          metadata: { live_search: hasLiveSearch },
        }).select().single();
        if (data) inserted.push(data);
      }
      if (!signals.length) skipped.push(q);
    }

    return new Response(JSON.stringify({ ok: true, inserted: inserted.length, skipped, hasLiveSearch }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("trend-radar", e);
    return new Response(JSON.stringify({ error: String((e as Error).message ?? e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
