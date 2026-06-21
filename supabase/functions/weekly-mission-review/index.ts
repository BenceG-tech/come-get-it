// Generates a 1-page weekly mission review PDF and returns it as application/pdf.
// Founding Pitch style: black bg, cyan borders, Liberation Sans-like (Helvetica fallback).
import { createClient } from "npm:@supabase/supabase-js@2";
import { jsPDF } from "npm:jspdf@2.5.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BG = "#050505";
const CYAN = "#00bcd4";
const TEXT = "#e6e6e6";
const MUTED = "#8a8a8a";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const lovableKey = Deno.env.get("LOVABLE_API_KEY")!;

    const now = new Date();
    const weekAgo = new Date(Date.now() - 7 * 86400000);
    const weekAgoIso = weekAgo.toISOString();

    const [loiNow, signedNow, wlNow, wlWeek, newPartners, topSources, snapshotsRes] = await Promise.all([
      admin.from("partners").select("id", { count: "exact", head: true }).in("status", ["proposal_sent", "negotiating", "signed"]),
      admin.from("partners").select("id", { count: "exact", head: true }).eq("status", "signed"),
      admin.from("waitlist_signups").select("id", { count: "exact", head: true }),
      admin.from("waitlist_signups").select("id, source, created_at").gte("created_at", weekAgoIso),
      admin.from("partners").select("company_name, status, created_at").gte("created_at", weekAgoIso).limit(5),
      admin.from("waitlist_signups").select("source").gte("created_at", weekAgoIso),
      admin.from("daily_kpi_snapshots").select("snapshot_date, qualified_total, waitlist_total").gte("snapshot_date", weekAgo.toISOString().slice(0, 10)).order("snapshot_date"),
    ]);

    const sourceCounts: Record<string, number> = {};
    (topSources.data ?? []).forEach((r: any) => {
      const s = r.source || "direct";
      sourceCounts[s] = (sourceCounts[s] ?? 0) + 1;
    });
    const topSourceList = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

    const snaps = snapshotsRes.data ?? [];
    const loiWeekStart = snaps[0]?.qualified_total ?? loiNow.count ?? 0;
    const wlWeekStart = snaps[0]?.waitlist_total ?? (wlNow.count ?? 0) - (wlWeek.data?.length ?? 0);

    // AI: 3 next-week focus tasks
    const prompt = `Magyar founder hetente egyszer review-zik. Misszió: szept. 1-ig 20 partner LOI + 500 waitlist.
Heti adatok:
- Partner LOI most: ${loiNow.count}, hét eleje: ${loiWeekStart}
- Aláírt: ${signedNow.count}
- Waitlist most: ${wlNow.count}, +${wlWeek.data?.length ?? 0} ezen a héten
- Új partnerek: ${(newPartners.data ?? []).map((p: any) => p.company_name).join(", ") || "—"}
- Top waitlist források: ${topSourceList.map(([s, c]) => `${s}(${c})`).join(", ") || "—"}

Adj vissza JSON-t: {"next_focus":["t1","t2","t3"]} — pontosan 3 jövő heti fókusz, rövid magyar mondat.`;

    let nextFocus: string[] = [];
    try {
      const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Lovable-API-Key": lovableKey, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
        }),
      });
      const aiJson = await aiRes.json();
      const parsed = JSON.parse(aiJson.choices?.[0]?.message?.content ?? "{}");
      nextFocus = Array.isArray(parsed.next_focus) ? parsed.next_focus.slice(0, 3) : [];
    } catch (e) {
      console.error("AI focus failed", e);
      nextFocus = ["Növeld a partner-outreach tempót", "Indíts egy waitlist-növelő kampányt", "Készítsd elő az italszponzor pitch-et"];
    }

    // ===== PDF =====
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();

    // Background
    doc.setFillColor(BG);
    doc.rect(0, 0, W, H, "F");

    // Header
    doc.setTextColor(CYAN);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Come Get It — Heti misszió review", 40, 60);
    doc.setTextColor(MUTED);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`${weekAgo.toLocaleDateString("hu-HU")} → ${now.toLocaleDateString("hu-HU")} · Hét ${getWeekNumber(now)}`, 40, 78);

    // Big number cards (3)
    const cardY = 110;
    const cardH = 110;
    const cardW = (W - 80 - 20 * 2) / 3;
    const cards = [
      { label: "Partner LOI", value: loiNow.count ?? 0, target: 20, delta: (loiNow.count ?? 0) - loiWeekStart },
      { label: "Waitlist", value: wlNow.count ?? 0, target: 500, delta: wlWeek.data?.length ?? 0 },
      { label: "Aláírt partner", value: signedNow.count ?? 0, target: null, delta: null },
    ];
    cards.forEach((c, i) => {
      const x = 40 + i * (cardW + 20);
      // border
      doc.setDrawColor(CYAN);
      doc.setLineWidth(1.5);
      doc.roundedRect(x, cardY, cardW, cardH, 8, 8, "S");
      doc.setTextColor(MUTED);
      doc.setFontSize(9);
      doc.text(c.label.toUpperCase(), x + 16, cardY + 22);
      doc.setTextColor(CYAN);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(36);
      doc.text(String(c.value), x + 16, cardY + 64);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(TEXT);
      if (c.target != null) doc.text(`/ ${c.target} cél`, x + 16, cardY + 84);
      if (c.delta != null) {
        const sign = c.delta >= 0 ? "+" : "";
        doc.setTextColor(c.delta > 0 ? CYAN : MUTED);
        doc.text(`${sign}${c.delta} ezen a héten`, x + 16, cardY + 100);
      }
    });

    // Section: Új partnerek
    let y = cardY + cardH + 36;
    doc.setTextColor(CYAN);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("✓ Új partnerek a héten", 40, y);
    y += 18;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(TEXT);
    doc.setFontSize(10);
    const np = newPartners.data ?? [];
    if (np.length === 0) doc.text("— nincs új", 50, y), y += 14;
    else np.forEach((p: any) => { doc.text(`• ${p.company_name} (${p.status})`, 50, y); y += 14; });

    // Section: Top waitlist sources
    y += 16;
    doc.setTextColor(CYAN);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("✓ Top waitlist-források", 40, y);
    y += 18;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(TEXT);
    doc.setFontSize(10);
    if (topSourceList.length === 0) doc.text("— nincs", 50, y), y += 14;
    else topSourceList.forEach(([s, c]) => { doc.text(`• ${s}: ${c} signup`, 50, y); y += 14; });

    // Section: Italszponzor readiness
    y += 16;
    doc.setTextColor(CYAN);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("✓ Italszponzor pitch readiness", 40, y);
    y += 18;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(TEXT);
    doc.setFontSize(10);
    const ready = (loiNow.count ?? 0) >= 10 && (wlNow.count ?? 0) >= 300;
    doc.text(`Status: ${ready ? "READY TO PITCH" : "Még gyűjtjük az adatokat"}`, 50, y); y += 14;
    doc.text(`Kell: ${Math.max(0, 10 - (loiNow.count ?? 0))} LOI · ${Math.max(0, 300 - (wlNow.count ?? 0))} signup`, 50, y); y += 14;

    // Section: Jövő hét fókusz
    y += 16;
    doc.setTextColor(CYAN);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("→ Jövő hét 3 fókusza (AI)", 40, y);
    y += 18;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(TEXT);
    doc.setFontSize(10);
    nextFocus.forEach((t, i) => {
      const lines = doc.splitTextToSize(`${i + 1}. ${t}`, W - 100);
      doc.text(lines, 50, y);
      y += lines.length * 14;
    });

    // Footer
    doc.setDrawColor(CYAN);
    doc.setLineWidth(0.5);
    doc.line(40, H - 50, W - 40, H - 50);
    doc.setTextColor(MUTED);
    doc.setFontSize(9);
    doc.text(`Come Get It · come-get-it.app · generálva: ${now.toLocaleString("hu-HU")}`, 40, H - 30);

    const pdfBytes = doc.output("arraybuffer");
    return new Response(pdfBytes, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="heti-mission-review-${now.toISOString().slice(0, 10)}.pdf"`,
      },
    });
  } catch (e) {
    console.error("weekly-mission-review error", e);
    return new Response(JSON.stringify({ error: String(e?.message ?? e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function getWeekNumber(d: Date) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
