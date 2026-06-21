// Trend → Content Brief: egy trend_signal alapján generál egy content_briefs sort,
// hogy reaktív poszt készülhessen rá. AI-szintézis + opcionális Firecrawl scrape.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { signal_id } = await req.json();
    if (!signal_id) throw new Error("signal_id required");

    const lovableKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableKey) throw new Error("LOVABLE_API_KEY missing");
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data: signal, error } = await sb.from("trend_signals").select("*").eq("id", signal_id).maybeSingle();
    if (error || !signal) throw new Error("signal not found");

    const prompt = `Magyar startup (Come Get It — drink rewards app vendéglátóhelyeknek és fogyasztóknak).
Az alábbi trend jel alapján adj vissza JSON content brief-et reaktív posztra:

JEL: ${signal.title}
ÖSSZEFOGLALÓ: ${signal.summary ?? "—"}
KATEGÓRIA: ${signal.category ?? "—"}
FORRÁS: ${signal.source_url ?? "—"}

JSON output:
{
  "title": "Rövid magyar brief cím (max 80 char)",
  "angle": "1 mondat — milyen szögből reagáljon a Come Get It erre",
  "key_points": ["max 4 pont magyarul (első a hook)"],
  "cta": "Konkrét CTA javaslat magyarul",
  "tone": "playful|insightful|urgent|inspiring",
  "target_audience": "kihez szól (1 mondat)",
  "channels": ["instagram", "linkedin", "newsletter"]
}

CSAK JSON.`;

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
    const brief = JSON.parse(j?.choices?.[0]?.message?.content ?? "{}");

    const { data: auth } = await sb.auth.getUser();
    const { data: inserted, error: insErr } = await sb.from("content_briefs").insert({
      title: (brief.title ?? `Trend reakció: ${signal.title}`).slice(0, 200),
      angle: brief.angle ?? null,
      key_points: brief.key_points ?? [],
      cta: brief.cta ?? null,
      tone: brief.tone ?? "insightful",
      target_audience: brief.target_audience ?? null,
      channel_mix: { channels: brief.channels ?? ["instagram"] },
      status: "draft",
      source_type: "trend_signal",
      source_id: signal_id,
      notes: `Forrás: ${signal.source_url ?? signal.title}`,
      created_by: auth?.user?.id ?? null,
    }).select().single();

    if (insErr) throw insErr;

    await sb.from("trend_signals").update({
      metadata: { ...(signal.metadata ?? {}), converted_to_brief: inserted.id },
    }).eq("id", signal_id);

    return new Response(JSON.stringify({ ok: true, brief_id: inserted.id, brief: inserted }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("trend-to-brief", e);
    return new Response(JSON.stringify({ error: String((e as Error).message ?? e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

