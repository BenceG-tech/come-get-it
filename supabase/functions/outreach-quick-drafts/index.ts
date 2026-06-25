// @ts-nocheck
// Generate 3 persuasive email drafts (founding_pitch / warm_intro / short_nudge) for a hospitality lead.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { BRAND_CONTEXT, TONE_GUIDES } from "../_shared/brand-context.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function loadTopSubjects(sb: any) {
  try {
    const since = new Date(Date.now() - 30 * 86400000).toISOString();
    const { data } = await sb.from("outreach_events")
      .select("subject, opened_at, replied_at, sent_at")
      .gte("sent_at", since).not("subject", "is", null).limit(1000);
    const map = new Map<string, { s: number; o: number; r: number }>();
    for (const r of (data ?? []) as any[]) {
      const k = (r.subject ?? "").trim(); if (!k) continue;
      const e = map.get(k) ?? { s: 0, o: 0, r: 0 };
      if (r.sent_at) e.s++; if (r.opened_at) e.o++; if (r.replied_at) e.r++;
      map.set(k, e);
    }
    const arr = [...map.entries()].filter(([, e]) => e.s >= 2)
      .map(([subject, e]) => ({ subject, open_rate: e.o / e.s, reply_rate: e.r / e.s }));
    return arr.sort((a, b) => (b.open_rate + b.reply_rate * 2) - (a.open_rate + a.reply_rate * 2)).slice(0, 5);
  } catch { return []; }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const { data: isAdmin } = await sb.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!isAdmin) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { partner_id, extra } = await req.json();
    if (!partner_id) return new Response(JSON.stringify({ error: "partner_id required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const sbAdmin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: partner } = await sbAdmin.from("partners")
      .select("company_name, contact_name, city, category, address, website, instagram, notes, ai_summary, ai_next_action, lead_score, lead_grade, rating")
      .eq("id", partner_id).maybeSingle();
    if (!partner) return new Response(JSON.stringify({ error: "partner not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { data: interactions } = await sbAdmin.from("partner_interactions")
      .select("channel, direction, summary, occurred_at")
      .eq("partner_id", partner_id)
      .order("occurred_at", { ascending: false })
      .limit(3);

    const tops = await loadTopSubjects(sbAdmin);
    const topHint = tops.length
      ? `\nTOP MŰKÖDŐ subjectek az elmúlt 30 napban (kövesd a stílust, ne másold szó szerint): ${tops.map((t) => `"${t.subject}" (open ${(t.open_rate * 100).toFixed(0)}%, reply ${(t.reply_rate * 100).toFixed(0)}%)`).join(" | ")}`
      : "";

    const interactionsHint = (interactions && interactions.length)
      ? `\nKORÁBBI INTERAKCIÓK (legutóbbi 3): ${interactions.map((i: any) => `[${i.channel}/${i.direction}] ${(i.summary ?? "").slice(0, 120)}`).join(" || ")}`
      : "";

    const sys = `Te a Come Get It outreach copywritere vagy. Founder hangján írsz: tegező, magyar, energikus, baráti — NEM ügynökség, NEM corporate. Adj 3 alternatív első emailt egy budapesti vendéglátós leadnek.

${BRAND_CONTEXT}

${TONE_GUIDES.founding_pitch}
${TONE_GUIDES.warm_intro}
${TONE_GUIDES.short_nudge}
${topHint}${interactionsHint}

KEMÉNY SZABÁLYOK:
1. SOHA ne kezdj "Tisztelt…" / "Kedves Uram/Hölgyem" / "Üdvözlöm" formával. Kezdj egy konkrét megfigyeléssel a helyről (név, kategória, város, rating, instagram, notes — abból, amit a partner adatokban LÁTSZ).
2. Ha a partner adatokban nincs konkrét adat (pl. rating, IG bio), NE találj ki — használj általánosabb, de személyes hangot ("láttam, hogy ${'$'}{city}-i bár vagytok…").
3. TILTOTT KIFEJEZÉSEK: "remek lehetőség", "izgalmas együttműködés", "win-win", "forradalmasítjuk", "game-changer", "innovatív megoldás", "platformunk", "szinergiák". Ha ilyet írsz, írd át.
4. NE ígérj forgalom-növekedést számokkal. NE hivatkozz létező userbase-re vagy demo videóra.
5. Minden draftban legyen 1 konkrét value prop a founding körből (lifetime kedvezményes fee / co-marketing / limitált launch line-up / közös termék-shaping) — NEM mind, csak 1-2 ami illik.
6. CTA mindig KONKRÉT és alacsony súrlódású: vagy "15 perces hívás" konkrét időpont-javaslattal (pl. "csütörtök 10:00 vagy péntek 14:00"), vagy "beugrok hozzátok egy kávéra jövő héten" — DE csak EGY CTA per email.
7. Subject 35-65 karakter, kis kezdőbetű OK, tartalmazza vagy a cégnevet vagy a várost vagy egy konkrét horgot. Példák jó stílusra: "Grumpy + Come Get It — 15 perc?", "budapesti bárok founding köre", "kávé jövő héten, ${'$'}{first_name}?".
8. Hosszak: founding_pitch 90-140 szó, warm_intro 70-110 szó, short_nudge MAX 50 szó (1 kérdés, semmi P.S.).
9. Aláírás MINDEN draftban: "Bence — Come Get It" (új sorban). Ne tegyél email/telefon aláírást, azt a sequence rakja rá.
10. Használhatsz {{first_name}}, {{company_name}}, {{city}} placeholdert HA tényleg személyre szabottabb lesz tőle — különben írd ki a konkrét adatot.

MIELŐTT VISSZAADOD: nézd át mind a 3 draftot. Ha bármelyikben tiltott kifejezés, "Tisztelt", számoló ígéret, vagy 2+ CTA van — írd át. Csak ezután válaszolj.

Kizárólag JSON-t adj vissza.`;

    const userMsg = `PARTNER ADATOK:\n${JSON.stringify(partner, null, 2)}${extra ? `\n\nEXTRA INSTRUKCIÓ A FELHASZNÁLÓTÓL: ${extra}` : ""}\n\nVÁRT JSON SÉMA:\n{ "drafts": [\n  { "tone": "founding_pitch", "subject": "...", "body": "..." },\n  { "tone": "warm_intro", "subject": "...", "body": "..." },\n  { "tone": "short_nudge", "subject": "...", "body": "..." }\n] }`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Lovable-API-Key": Deno.env.get("LOVABLE_API_KEY")!, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: sys }, { role: "user", content: userMsg }],
        response_format: { type: "json_object" },
      }),
    });
    if (aiRes.status === 429) return new Response(JSON.stringify({ error: "Rate limit — várj és próbáld újra." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (aiRes.status === 402) return new Response(JSON.stringify({ error: "AI kredit elfogyott." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!aiRes.ok) {
      const t = await aiRes.text();
      return new Response(JSON.stringify({ error: `AI error ${aiRes.status}: ${t.slice(0, 300)}` }), { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const aij = await aiRes.json();
    const parsed = JSON.parse(aij.choices?.[0]?.message?.content ?? "{}");
    const drafts = Array.isArray(parsed?.drafts) ? parsed.drafts.filter((d: any) => d?.subject && d?.body) : [];
    if (drafts.length === 0) {
      return new Response(JSON.stringify({ error: "AI nem adott vissza draft-okat" }), { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    return new Response(JSON.stringify({ drafts }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
