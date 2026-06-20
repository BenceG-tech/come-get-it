// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM = `Te a Come Get It B2B lead scoring AI-ja vagy. Magyar piacot ismersz (vendéglátás, italmárkák, rewards partnerek Budapesten és vidéken).
Egy partner profilt + interakciós előzményeket kapsz. Pontozd 0-100 között a lead minőségét (mennyire valószínű hogy üzlet lesz belőle), és adj javasolt következő lépést.
Faktorok: típus (venue/drink_brand/rewards_partner), aktuális státusz, interakciók frissessége és iránya (outbound vs inbound), elérhetőség (email/insta/telefon megvan-e), megjegyzések tartalma (érdeklődés jelei), méret/relevancia ha kiderül.

VÁLASZ KIZÁRÓLAG JSON, ez a séma:
{"score": number (0-100), "reason": string (1-2 mondat magyar indoklás), "next_action": string (1 konkrét lépés magyar, max 20 szó, pl. "Hívd fel hétfőn 14:00-kor, ajánlj demo-t.")}`;

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

    const { partnerId } = await req.json();
    if (!partnerId) return new Response(JSON.stringify({ error: "partnerId required" }), { status: 400, headers: corsHeaders });

    const [{ data: partner }, { data: interactions }, { data: docsSent }] = await Promise.all([
      supabase.from("partners").select("*").eq("id", partnerId).maybeSingle(),
      supabase.from("partner_interactions").select("channel,direction,summary,occurred_at").eq("partner_id", partnerId).order("occurred_at", { ascending: false }).limit(20),
      supabase.from("partner_documents_sent").select("sent_at,documents(title)").eq("partner_id", partnerId).limit(10),
    ]);
    if (!partner) throw new Error("Partner not found");

    const payload = {
      partner: {
        name: partner.name,
        type: partner.type,
        status: partner.status,
        city: partner.city,
        has_email: !!partner.email,
        has_phone: !!partner.phone,
        has_instagram: !!partner.instagram_handle,
        notes: partner.notes,
        tags: partner.tags,
      },
      interactions: interactions ?? [],
      documents_sent_count: docsSent?.length ?? 0,
    };

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const up = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": LOVABLE_API_KEY! },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: JSON.stringify(payload) },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (up.status === 429) return new Response(JSON.stringify({ error: "Túl sok kérés." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (up.status === 402) return new Response(JSON.stringify({ error: "AI kredit elfogyott." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!up.ok) throw new Error(`AI ${up.status}`);

    const j = await up.json();
    const raw = j?.choices?.[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw);
    const score = Math.max(0, Math.min(100, Math.round(Number(parsed.score) || 0)));
    const reason = String(parsed.reason ?? "").slice(0, 500);
    const next_action = String(parsed.next_action ?? "").slice(0, 300);

    await supabase.from("partners").update({
      ai_score: score,
      ai_score_reason: reason,
      ai_next_action: next_action,
      ai_scored_at: new Date().toISOString(),
    }).eq("id", partnerId);

    return new Response(JSON.stringify({ score, reason, next_action }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
