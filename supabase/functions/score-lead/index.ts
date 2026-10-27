// Lead scoring: deterministic rubric (transparent) + AI overlay (±10).
// Stores breakdown into partners.score_reasons so the UI popover can show WHY.
import { createClient } from "npm:@supabase/supabase-js@2";
import { computeRubric, gradeFromScore, RUBRIC_VERSION } from "../_shared/lead-score-rubric.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Átlátható képlet: ../_shared/lead-score-rubric.ts (a src/lib/lead-score-rubric.ts másolata).
// Google-értékelés 25 · rejtett kincs 15 · kerület 25 · kategória 20 · elérhetőség 15 = 100.
function computeBaseline(p: any) {
  const r = computeRubric(p);
  const lines = r.lines.map(({ label, points, max, note }) => ({ label, points, max, note }));
  return { baseline: r.total, lines };
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

    const processOne = async (p: any) => {
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
                { role: "system", content: "Te a Come Get It lead-scoring AI overlay. A baseline-t már kiszámoltuk rubrika alapján. A te dolgod ±10 pont korrekció hely-specifikus tényezőkre (új megnyitó, napközbeni bisztró/kávézó jelleg, social buzz, közeli vendég-mágnes). Csak a megadott adatokból dolgozz, ne találj ki tényt. CSAK ezt a JSON-t add vissza: {\"adjustment\": -10..10, \"reasons\": [{\"factor\":\"...\",\"impact\":\"+5\"|\"-3\",\"note\":\"magyarul\"}], \"summary\":\"egy mondat\"}" },
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
      const grade = gradeFromScore(total);
      const score_reasons = {
        version: RUBRIC_VERSION,
        baseline, adjustment, total, grade,
        breakdown: lines,
        ai_overlay: { summary: aiNote, reasons: aiReasons },
      };

      await admin.from("partners").update({
        lead_score: total,
        ai_score: total,
        score_reasons,
        score_updated_at: new Date().toISOString(),
      }).eq("id", p.id);
      return { id: p.id, score: total, grade };
    };

    // Auto-background for big batches (>15) to avoid 504 — or if caller explicitly asks.
    const shouldBackground = background === true || (background !== false && partners.length > 15);

    if (shouldBackground) {
      const runAll = async () => {
        // Process 3 in parallel to stay under AI gateway rate-limits.
        const queue = [...partners];
        const worker = async () => {
          while (queue.length) {
            const p = queue.shift();
            if (!p) break;
            try { await processOne(p); } catch (e) { console.warn("score fail", p.id, e); }
          }
        };
        await Promise.all(Array.from({ length: Math.min(3, partners.length) }, worker));
      };
      // @ts-ignore
      if (typeof EdgeRuntime !== "undefined" && EdgeRuntime?.waitUntil) {
        // @ts-ignore
        EdgeRuntime.waitUntil(runAll());
      } else {
        runAll().catch(() => {});
      }
      return new Response(JSON.stringify({ ok: true, status: "running_in_background", queued: partners.length }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const results: any[] = [];
    for (const p of partners) {
      try { results.push(await processOne(p)); } catch (e) { console.warn(e); }
    }
    return new Response(JSON.stringify({ ok: true, results }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: String((e as Error).message) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
