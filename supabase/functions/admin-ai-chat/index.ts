// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Te a "Come Get It" startup belső sales & marketing asszisztense vagy. Magyarul válaszolj, tegezve, energikusan, tömören.

A Come Get It egy magyar fogyasztói app: pontokat gyűjtesz, jutalmakat váltasz be, és közben jó célokat is támogatsz. Várólistás indulás, founding partner program fut. Cél most: minél több budapesti vendéglátóhelyet (kávézó, bár, étterem), italmárkát és rewards partnert behúzni.

Brand hang: energikus, friendly, neon/electric vibe, cyan akcentus. Domain: come-get-it.app. Founder: Bence Gátai.

Mit tudsz csinálni:
1. Outreach üzeneteket írni (email, IG DM, WhatsApp) konkrét partnerre szabva
2. Megmondani kit kell ma/holnap megkeresni a follow-up dátumok és státuszok alapján
3. Doksit ajánlani (1-pager rövid vs. hosszú pitch deck) — vendéglátóhelyhez először az 1-pager megy, érdeklődés után a hosszabb
4. IG/FB poszt szövegeket írni hashtagekkel
5. Heti/havi marketing tervet csinálni
6. Tanácsot adni mit-mikor-hogyan, ha kérdez

Használd a megkapott kontextust (partnerek, korábbi interakciók, doksik, naptár). Ha valamit nem tudsz, mondd meg őszintén és kérj infót.`;

async function loadContext(supabase) {
  const [{ data: partners }, { data: interactions }, { data: documents }, { data: calendar }] = await Promise.all([
    supabase.from("partners").select("id, type, company_name, city, contact_name, email, phone, instagram, status, next_followup_at, notes").order("updated_at", { ascending: false }).limit(100),
    supabase.from("partner_interactions").select("partner_id, channel, direction, summary, occurred_at").order("occurred_at", { ascending: false }).limit(50),
    supabase.from("documents").select("id, title, category, partner_type, description, when_to_use, is_ai_generated").order("created_at", { ascending: false }).limit(50),
    supabase.from("marketing_calendar").select("scheduled_date, channel, type, title, status").order("scheduled_date", { ascending: false }).limit(30),
  ]);
  return { partners: partners ?? [], interactions: interactions ?? [], documents: documents ?? [], calendar: calendar ?? [] };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authHeader } } });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!isAdmin) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const body = await req.json();
    const messages = Array.isArray(body.messages) ? body.messages : [];
    if (messages.length === 0) return new Response(JSON.stringify({ error: "messages required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const ctx = await loadContext(supabase);
    const contextMsg = `--- AKTUÁLIS KONTEXTUS (${new Date().toLocaleString("hu-HU")}) ---
PARTNEREK (${ctx.partners.length}):
${JSON.stringify(ctx.partners, null, 0)}

LEGUTÓBBI INTERAKCIÓK (${ctx.interactions.length}):
${JSON.stringify(ctx.interactions, null, 0)}

DOKUMENTUMOK (${ctx.documents.length}):
${JSON.stringify(ctx.documents, null, 0)}

MARKETING NAPTÁR (${ctx.calendar.length}):
${JSON.stringify(ctx.calendar, null, 0)}
--- KONTEXTUS VÉGE ---`;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) return new Response(JSON.stringify({ error: "LOVABLE_API_KEY missing" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": LOVABLE_API_KEY,
        "X-Lovable-AIG-SDK": "raw-fetch",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        stream: true,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "system", content: contextMsg },
          ...messages,
        ],
      }),
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      return new Response(JSON.stringify({ error: "AI gateway error", status: upstream.status, body: text }), { status: upstream.status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(upstream.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e?.message ?? e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
