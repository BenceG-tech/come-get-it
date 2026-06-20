// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { loadBrandContext } from "../_shared/brand-context.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    const { goal = "általános brand-építés", count = 5 } = await req.json().catch(() => ({}));

    const brandCtx = await loadBrandContext(supabase);

    // Gather signal sources
    const today = new Date().toISOString().slice(0, 10);
    const [{ data: upcoming }, { data: recentSaved }, { data: recentGen }, { data: topDocs }] = await Promise.all([
      supabase.from("marketing_calendar").select("scheduled_date, channel, type, title, goal").gte("scheduled_date", today).order("scheduled_date").limit(20),
      supabase.from("saved_content_snippets").select("format_label, text, brief").order("created_at", { ascending: false }).limit(10),
      supabase.from("content_generations").select("brief, persona").order("created_at", { ascending: false }).limit(8),
      supabase.from("documents").select("title, folder, tldr, ai_description").not("tldr", "is", null).limit(15),
    ]);

    const sys = `Te a Come Get It (Budapest nightlife reward app) marketing stratégája vagy. Magyarul, tegezve, konkrétan. A feladat: készíts ${count} db ÉLES, KONKRÉT, BEÜTEMEZHETŐ tartalom-briefet, ami a felhasználó kampánycéljához passzol.

${brandCtx}

A briefek legyenek VÁLTOZATOSAK: különböző tartalmi pillérek, különböző personák, különböző csatornák. NE ismételd a már meglévő naptár-bejegyzéseket és NE javasolj olyat, amit az utóbbi 10 mentett snippet már lefedett.

KIZÁRÓLAG JSON-t adj vissza, semmilyen prózát.`;

    const userMsg = `Kampánycél: ${goal}

Már beütemezett naptár (kerüld az átfedést):
${JSON.stringify(upcoming ?? [])}

Utóbbi mentett snippetek (ne ismételd):
${JSON.stringify((recentSaved ?? []).map((s) => ({ fmt: s.format_label, brief: s.brief?.slice(0, 100) })))}

Utóbbi briefek (új szöget keress):
${JSON.stringify((recentGen ?? []).map((g) => g.brief?.slice(0, 100)))}

Releváns belső doksik (használd inspirációnak / tényekért):
${JSON.stringify((topDocs ?? []).map((d) => ({ title: d.title, tldr: d.tldr?.slice(0, 200) })))}

Add vissza PONTOSAN ezt:
{
  "briefs": [
    {
      "title": "rövid címke (max 60 char)",
      "brief": "2-4 mondatos brief, amit a Content Studio AI-nak átadhatok — konkrét üzenet, ki a célközönség, milyen érzelmi szöget használjon, mi a CTA",
      "strategy": "1 mondat: miért ez a poszt működik most stratégiailag",
      "audience": "persona / célcsoport (pl. 'belvárosi craft beer szerelmesek, 25-35')",
      "channel": "instagram|facebook|linkedin|email|tiktok",
      "recommended_time": "pl. 'csütörtök 19:30' vagy 'péntek 18:00'",
      "creative_direction": "mit mutasson a kép / vizuál (1-2 mondat)",
      "cta": "pontos call-to-action"
    }
  ]
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
      return new Response(JSON.stringify({ error: `AI: ${resp.status} ${errTxt.slice(0, 300)}` }), { status: resp.status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const j = await resp.json();
    let parsed: any = { briefs: [] };
    try { parsed = JSON.parse(j.choices[0].message.content); } catch {}
    return Response.json(parsed, { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
