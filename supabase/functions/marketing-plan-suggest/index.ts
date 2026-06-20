// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { loadBrandContext } from "../_shared/brand-context.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BUDAPEST_BEST_PRACTICE = `BUDAPEST NIGHTLIFE POSZTOLÁSI HEURISZTIKA (alapszabály, ettől csak okkal térj el):
- Instagram poszt/reel: csü 19:00-21:00, pé 18:00-20:00, vas 20:00 (heti rekap)
- Instagram Story: napi 1-3 db, hétfőn 9:00, csü+pé 17:00 (estét beharangoz), szo 23:00 (utólagos hangulat)
- Facebook poszt: ke+csü 18:00 (idősebb demográfia)
- LinkedIn poszt (B2B / partneri sztori): ke 9:00, sze 10:00, csü 11:00 — soha hétvégén
- Email kampány: ke 10:00 vagy csü 14:00
- Outreach DM/email hullám partnereknek: ke-cs 9:30-11:00
- Ne tegyél 2 IG posztot 24 órán belül, és ne posztolj vasárnap d.e. 11 előtt`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!isAdmin) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: corsHeaders });

    const { range = "next_week", goal = "", channels } = await req.json();
    const today = new Date();
    const daysAhead = range === "next_month" ? 30 : 7;
    const endDate = new Date(today.getTime() + daysAhead * 86400000);

    const { data: existing } = await supabase
      .from("marketing_calendar")
      .select("scheduled_date, scheduled_time, channel, type, title")
      .gte("scheduled_date", today.toISOString().slice(0, 10))
      .lte("scheduled_date", endDate.toISOString().slice(0, 10));

    const brandCtx = await loadBrandContext(supabase);

    const sys = `Te a Come Get It (Budapest nightlife reward app) marketing igazgatója vagy. Készíts egy KONKRÉT, beütemezhető poszt-tervet a következő ${daysAhead} napra.

${brandCtx}

${BUDAPEST_BEST_PRACTICE}

A terv legyen változatos (különböző tartalmi pillérek), ne ismétlődjön és ne ütközzön a meglévő bejegyzésekkel. Mindegyik elem konkrét legyen, ne általánosság. Csak JSON.`;

    const userMsg = `Mai dátum: ${today.toISOString().slice(0, 10)} (${today.toLocaleDateString("hu-HU", { weekday: "long" })}).
Időszak vége: ${endDate.toISOString().slice(0, 10)}.
${goal ? `Kampány-cél: ${goal}` : "Általános brand-építés + waitlist növelés + founding partner toborzás."}
${Array.isArray(channels) && channels.length ? `Csak ezeken a csatornákon: ${channels.join(", ")}` : ""}

Meglévő, már beütemezett bejegyzések (ezekkel ne ütközz):
${JSON.stringify(existing ?? [])}

Add vissza PONTOSAN ezt:
{
  "plan": [
    {
      "scheduled_date": "YYYY-MM-DD",
      "scheduled_time": "HH:MM",
      "channel": "instagram|facebook|linkedin|email|tiktok",
      "type": "post|story|reel|campaign|outreach",
      "title": "rövid címke (max 60 char)",
      "theme": "melyik content pillérhez tartozik",
      "brief": "2-3 mondatos brief a Content Studio-nak — mit írjon a copywriter AI",
      "rationale": "miért EKKOR és miért EZ a téma"
    }
  ],
  "summary": "1-2 mondat: mi a stratégia ezzel a tervvel"
}`;

    const apiKey = Deno.env.get("LOVABLE_API_KEY")!;
    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        response_format: { type: "json_object" },
        messages: [{ role: "system", content: sys }, { role: "user", content: userMsg }],
      }),
    });

    if (!resp.ok) {
      const errTxt = await resp.text();
      return new Response(JSON.stringify({ error: `AI: ${resp.status} ${errTxt.slice(0, 300)}` }), { status: 500, headers: corsHeaders });
    }
    const j = await resp.json();
    let parsed: any = { plan: [], summary: "" };
    try { parsed = JSON.parse(j.choices[0].message.content); } catch {}
    return Response.json(parsed, { headers: corsHeaders });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
