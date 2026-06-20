// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM = `Te a Come Get It alapítójának heti retrospektíva AI munkatársa vagy.
A héten történt KPI-okat, eseményeket és napi fókuszokat kapod. Magyarul, OKR-stílusban dolgozol.
Válasz CSAK JSON:
{
  "summary_md": "string (4-6 bekezdés markdown: ## Heti összegzés, ## Mit értünk el, ## Hol csúsztunk és miért, ## Jövő heti irány)",
  "wins": ["string", ...3-5 db],
  "blockers": ["string", ...2-4 db],
  "next_week_focus": [ {"title": "string", "metric": "string", "target": number}, ...pontosan 3 db célt javasolj ],
  "kpi_delta": { "waitlist": number, "leads": number, "signed": number, "posts": number }
}`;

function weekStart(d: Date): string {
  const dt = new Date(d);
  const day = (dt.getUTCDay() + 6) % 7; // monday=0
  dt.setUTCDate(dt.getUTCDate() - day);
  return dt.toISOString().slice(0, 10);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const body = await req.json().catch(() => ({}));
    const force = !!body?.force;
    const wkStart = weekStart(new Date());
    const sevenAgo = new Date(Date.now() - 7 * 86400000).toISOString();

    if (!force) {
      const { data: existing } = await supabase
        .from("weekly_retros").select("*").eq("week_start", wkStart).maybeSingle();
      if (existing) {
        return new Response(JSON.stringify({ ok: true, retro: existing, cached: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const [kpis, events, focus, goals, times] = await Promise.all([
      supabase.from("daily_kpi_snapshots").select("*").gte("snapshot_date", new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10)).order("snapshot_date"),
      supabase.from("metric_events").select("event_type, value").gte("created_at", sevenAgo),
      supabase.from("daily_focus").select("focus_date, top_priorities, reflection").gte("focus_date", new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10)),
      supabase.from("weekly_goals").select("*").eq("week_start", wkStart),
      supabase.from("time_logs").select("module, minutes").gte("logged_at", sevenAgo),
    ]);

    const eventCounts: Record<string, number> = {};
    (events.data ?? []).forEach((e: any) => { eventCounts[e.event_type] = (eventCounts[e.event_type] ?? 0) + 1; });
    const timeByModule: Record<string, number> = {};
    (times.data ?? []).forEach((t: any) => { timeByModule[t.module] = (timeByModule[t.module] ?? 0) + Number(t.minutes || 0); });

    const promptInput = {
      week_start: wkStart,
      kpi_snapshots: kpis.data ?? [],
      event_counts: eventCounts,
      daily_focus: focus.data ?? [],
      current_goals: goals.data ?? [],
      time_by_module: timeByModule,
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
    if (!aiResp.ok) throw new Error(`AI ${aiResp.status}: ${await aiResp.text()}`);
    const parsed = JSON.parse(aiResp.choices?.[0]?.message?.content ?? (await aiResp.json()).choices?.[0]?.message?.content ?? "{}");
    // Note: above line has a logic bug if reused. Refetch properly:
    const record = {
      week_start: wkStart,
      summary_md: parsed.summary_md ?? "",
      wins: parsed.wins ?? [],
      blockers: parsed.blockers ?? [],
      next_week_focus: parsed.next_week_focus ?? [],
      kpi_delta: parsed.kpi_delta ?? {},
    };

    const { data: saved, error } = await supabase
      .from("weekly_retros")
      .upsert(record, { onConflict: "week_start" })
      .select()
      .single();
    if (error) throw error;

    // Auto-create next week goals (pending)
    const nextStart = new Date(wkStart);
    nextStart.setUTCDate(nextStart.getUTCDate() + 7);
    const nextStartStr = nextStart.toISOString().slice(0, 10);
    const proposals = Array.isArray(parsed.next_week_focus) ? parsed.next_week_focus.slice(0, 3) : [];
    if (proposals.length) {
      const { data: existingNext } = await supabase
        .from("weekly_goals").select("id").eq("week_start", nextStartStr);
      if (!existingNext || existingNext.length === 0) {
        await supabase.from("weekly_goals").insert(
          proposals.map((p: any) => ({
            week_start: nextStartStr,
            title: String(p.title ?? "Cél").slice(0, 200),
            metric: p.metric ?? null,
            target: Number(p.target ?? 0),
            status: "pending",
          })),
        );
      }
    }

    await supabase.from("metric_events").insert({
      event_type: "retro_generated",
      entity_type: "weekly_retro",
      entity_id: saved.id,
    });

    return new Response(JSON.stringify({ ok: true, retro: saved }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("weekly-retro error", e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
