// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM = `Te a Come Get It (waitlist-alapú, Budapest, vendéglátó hűségprogram) alapítójának napi reggeli AI munkatársa vagy.
Magyarul, tömör, energikus, akcióorientált hangon írsz. A bemenet a tegnapi és heti KPI-ok, nyitott partnerek, aktív naptár-bejegyzések.
Válasz CSAK JSON az alábbi sémával:
{
  "summary_md": "string (3-6 bekezdés markdown: ## Tegnap történt, ## Mai fókusz, ## Figyelmeztetések)",
  "highlights": [ "string", ... 3-5 darab rövid kiemelés ],
  "suggested_focus": [ "string", ... pontosan 3 darab, max 60 karakter, akciók imperatívuszban ]
}`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const body = await req.json().catch(() => ({}));
    const force = !!body?.force;
    const today = new Date().toISOString().slice(0, 10);

    if (!force) {
      const { data: existing } = await supabase
        .from("daily_briefings").select("*").eq("date", today).maybeSingle();
      if (existing) {
        return new Response(JSON.stringify({ ok: true, briefing: existing, cached: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const sevenAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
    const startToday = `${today}T00:00:00Z`;
    const yest = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const startYest = `${yest}T00:00:00Z`;

    const [kpis, openPartners, eventsY, calToday, focusY] = await Promise.all([
      supabase.from("daily_kpi_snapshots").select("*").gte("snapshot_date", sevenAgo).order("snapshot_date", { ascending: true }),
      supabase.from("partners").select("id, company_name, status, next_followup_at, score").not("status", "in", "(signed,lost)").order("next_followup_at", { ascending: true, nullsFirst: false }).limit(15),
      supabase.from("metric_events").select("event_type, entity_type, value").gte("created_at", startYest).lt("created_at", startToday),
      supabase.from("marketing_calendar").select("title, status, scheduled_at").gte("scheduled_at", startToday).lte("scheduled_at", `${today}T23:59:59Z`),
      supabase.from("daily_focus").select("top_priorities, reflection").eq("focus_date", yest).maybeSingle(),
    ]);

    const eventCounts: Record<string, number> = {};
    (eventsY.data ?? []).forEach((e: any) => {
      eventCounts[e.event_type] = (eventCounts[e.event_type] ?? 0) + 1;
    });

    const promptInput = {
      date: today,
      kpi_last_7_days: kpis.data ?? [],
      open_partners: openPartners.data ?? [],
      event_counts_yesterday: eventCounts,
      calendar_today: calToday.data ?? [],
      yesterday_focus: focusY.data ?? null,
    };

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": LOVABLE_API_KEY },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: JSON.stringify(promptInput) },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!aiResp.ok) {
      const t = await aiResp.text();
      throw new Error(`AI ${aiResp.status}: ${t}`);
    }
    const aiJson = await aiResp.json();
    const content = aiJson.choices?.[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(content);

    const record = {
      date: today,
      summary_md: parsed.summary_md ?? "",
      highlights: parsed.highlights ?? [],
      suggested_focus: parsed.suggested_focus ?? [],
    };

    const { data: saved, error } = await supabase
      .from("daily_briefings")
      .upsert(record, { onConflict: "date" })
      .select()
      .single();
    if (error) throw error;

    await supabase.from("metric_events").insert({
      event_type: "briefing_generated",
      entity_type: "daily_briefing",
      entity_id: saved.id,
    });

    return new Response(JSON.stringify({ ok: true, briefing: saved }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("daily-briefing error", e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
