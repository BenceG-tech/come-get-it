// Lead scoring: deterministic rubric (transparent) + AI overlay (±10).
// Stores breakdown into partners.score_reasons so the UI popover can show WHY.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Mirror of src/lib/lead-score-rubric.ts — keep in sync.
const CENTRAL = ["v.", "vi.", "vii.", "viii.", "ix.", "1051","1052","1053","1054","1055","1056","1061","1062","1063","1064","1065","1066","1067","1068","1071","1072","1073","1074","1075","1076","1077","1078","1081","1082","1083","1084","1085","1086","1087","1088","1089","1091","1092","1093","1094","1095"];
const BIG_CITIES = ["debrecen","szeged","miskolc","pécs","pecs","győr","gyor","nyíregyháza","nyiregyhaza","kecskemét","kecskemet","székesfehérvár","szekesfehervar"];

function cat(p: any) {
  const t = `${p.category ?? ""} ${p.type ?? ""}`.toLowerCase();
  if (/koktél|cocktail/.test(t)) return { pts: 30, note: "koktélbár — top fit" };
  if (/craft|sörfőzde|brewery/.test(t)) return { pts: 28, note: "craft bár" };
  if (/specialty|third.?wave/.test(t)) return { pts: 25, note: "specialty coffee" };
  if (/rom(kocsma|bar)|ruin/.test(t)) return { pts: 26, note: "romkocsma" };
  if (/wine|bor/.test(t) && /bár|bar/.test(t)) return { pts: 24, note: "borbár" };
  if (/bisztró|bistro|gastropub/.test(t)) return { pts: 22, note: "bisztró/gastropub" };
  if (/kávézó|coffee|cafe|kávé/.test(t)) return { pts: 20, note: "kávézó" };
  if (/étterem|restaurant/.test(t)) return { pts: 16, note: "étterem" };
  if (/pub|söröző/.test(t)) return { pts: 14, note: "pub/söröző" };
  if (/bar|bár/.test(t)) return { pts: 22, note: "bár" };
  if (/gyors|fast.?food/.test(t)) return { pts: 5, note: "gyorsétterem" };
  return { pts: 0, note: "egyéb" };
}
function loc(p: any) {
  const s = `${p.city ?? ""} ${p.address ?? ""}`.toLowerCase();
  if (CENTRAL.some((d) => s.includes(d))) return { pts: 25, note: "Budapest belváros" };
  if (/budapest/.test(s)) return { pts: 18, note: "Budapest, külső kerület" };
  if (BIG_CITIES.some((c) => s.includes(c))) return { pts: 8, note: "vidéki nagyváros" };
  return { pts: 3, note: "egyéb / ismeretlen" };
}
function traffic(p: any) {
  const r = p.rating_count ?? p.google_reviews_count ?? 0;
  if (r >= 500) return { pts: 20, note: `${r} review — nagyon erős` };
  if (r >= 200) return { pts: 16, note: `${r} review — erős` };
  if (r >= 100) return { pts: 12, note: `${r} review — jó` };
  if (r >= 50) return { pts: 8, note: `${r} review — közepes` };
  if (r >= 20) return { pts: 4, note: `${r} review — alacsony` };
  return { pts: 1, note: `${r} review — új/ismeretlen` };
}
function quality(p: any) {
  const r = p.rating ?? p.google_rating ?? 0;
  if (r >= 4.6) return { pts: 10, note: `${r}★ — kiváló` };
  if (r >= 4.3) return { pts: 7, note: `${r}★ — jó` };
  if (r >= 4.0) return { pts: 4, note: `${r}★ — átlagos` };
  if (r > 0) return { pts: 1, note: `${r}★ — gyenge` };
  return { pts: 0, note: "nincs rating" };
}
function reach(p: any) {
  let pts = 0; const parts: string[] = [];
  if (p.email) { pts += 6; parts.push("email +6"); }
  if (p.website) { pts += 5; parts.push("website +5"); }
  if (p.instagram_handle || p.instagram) { pts += 4; parts.push("instagram +4"); }
  return { pts, note: parts.join(", ") || "nincs csatorna" };
}

function computeBaseline(p: any) {
  const c = cat(p), l = loc(p), t = traffic(p), q = quality(p), r = reach(p);
  const lines = [
    { label: "Kategória illeszkedés", points: c.pts, max: 30, note: c.note },
    { label: "Lokáció", points: l.pts, max: 25, note: l.note },
    { label: "Forgalom (Google review)", points: t.pts, max: 20, note: t.note },
    { label: "Minőség (Google rating)", points: q.pts, max: 10, note: q.note },
    { label: "Elérhetőség", points: r.pts, max: 15, note: r.note },
  ];
  const baseline = lines.reduce((a, x) => a + x.points, 0);
  return { baseline, lines };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const token = authHeader.replace("Bearer ", "");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    // Allow service-role calls (used by lead-bulk-process) to bypass user claim check.
    if (token !== serviceKey) {
      const supa = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: authHeader } } });
      const { data: claims } = await supa.auth.getClaims(token);
      if (!claims?.claims?.sub) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const admin = createClient(Deno.env.get("SUPABASE_URL")!, serviceKey);
    const { partner_ids, background } = await req.json();
    if (!Array.isArray(partner_ids) || partner_ids.length === 0)
      return new Response(JSON.stringify({ error: "partner_ids required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { data: partners } = await admin.from("partners").select("*").in("id", partner_ids);
    if (!partners?.length) return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const LOVABLE_KEY = Deno.env.get("LOVABLE_API_KEY");
    const results: any[] = [];

    for (const p of partners) {
      const { baseline, lines } = computeBaseline(p);
      let adjustment = 0;
      let aiNote = "";
      let aiReasons: any[] = [];

      if (LOVABLE_KEY) {
        try {
          const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${LOVABLE_KEY}` },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash",
              messages: [
                { role: "system", content: "Te a Come Get It lead-scoring AI overlay. A baseline-t már kiszámoltuk rubrika alapján. A te dolgod ±10 pont korrekció hely-specifikus tényezőkre (student-favorite, új megnyitó, brand momentum, social buzz, közeli versenytárs/vendég-mágnes). CSAK ezt a JSON-t add vissza: {\"adjustment\": -10..10, \"reasons\": [{\"factor\":\"...\",\"impact\":\"+5\"|\"-3\",\"note\":\"magyarul\"}], \"summary\":\"egy mondat\"}" },
                { role: "user", content: `Hely:\n${JSON.stringify({ name: p.company_name, category: p.category, city: p.city, address: p.address, rating: p.rating, reviews: p.rating_count, ig: p.instagram_handle, website: p.website }, null, 2)}\n\nBaseline: ${baseline}/100\nRubrika: ${JSON.stringify(lines)}` },
              ],
              response_format: { type: "json_object" },
            }),
          });
          if (res.ok) {
            const j = await res.json();
            const parsed = JSON.parse(j.choices[0].message.content);
            adjustment = Math.max(-10, Math.min(10, Number(parsed.adjustment) || 0));
            aiNote = String(parsed.summary ?? "");
            aiReasons = Array.isArray(parsed.reasons) ? parsed.reasons : [];
          }
        } catch (e) {
          console.error("AI overlay fail", e);
        }
      }

      const total = Math.max(0, Math.min(100, baseline + adjustment));
      const grade = total >= 80 ? "A" : total >= 60 ? "B" : total >= 40 ? "C" : "D";
      const score_reasons = {
        baseline,
        adjustment,
        total,
        grade,
        breakdown: lines,
        ai_overlay: { summary: aiNote, reasons: aiReasons },
      };

      await admin.from("partners").update({
        lead_score: total,
        ai_score: total,
        score_reasons,
        score_updated_at: new Date().toISOString(),
      }).eq("id", p.id);
      results.push({ id: p.id, score: total, grade });
    }

    return new Response(JSON.stringify({ ok: true, results }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: String((e as Error).message) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
