// @ts-nocheck
// Loads the Come Get It brand_knowledge table and renders it as a system-prompt fragment.
// Every AI edge function should prepend this to its prompts so output stays on-brand.

export async function loadBrandContext(supabase): Promise<string> {
  try {
    const { data, error } = await supabase
      .from("brand_knowledge")
      .select("key, label, value");
    if (error || !data || data.length === 0) return "";

    const map: Record<string, any> = {};
    for (const row of data) map[row.key] = row.value;

    const lines: string[] = [
      "--- COME GET IT BRAND DNS (ezt KÖTELEZŐ követni minden generált tartalomban) ---",
    ];

    if (map.brand_facts) {
      const f = map.brand_facts;
      lines.push(`Domain: ${f.domain ?? "come-get-it.app"} · Email: ${f.email ?? "hello@come-get-it.app"} · Social: ${f.social ?? "@comegetit_app"} · Alapító: ${f.founder ?? "Bence Gátai"}`);
    }
    if (map.tone_of_voice) {
      const t = map.tone_of_voice;
      lines.push("HANGNEM: tegezős, energikus, tömör, neon/electric vibe.");
      if (Array.isArray(t.examples) && t.examples.length) lines.push(`Példa mondatok: ${t.examples.slice(0, 6).map((s) => `"${s}"`).join(" · ")}`);
      if (Array.isArray(t.avoid) && t.avoid.length) lines.push(`TILTOTT szavak/fordulatok: ${t.avoid.join(", ")}`);
      if (Array.isArray(t.required_ctas) && t.required_ctas.length) lines.push(`Preferált CTA-k: ${t.required_ctas.join(" / ")}`);
    }
    if (Array.isArray(map.usps) && map.usps.length) {
      lines.push(`USP-k: ${map.usps.map((u: any) => (typeof u === "string" ? u : u?.title ?? "")).filter(Boolean).join(" · ")}`);
    }
    if (Array.isArray(map.content_pillars) && map.content_pillars.length) {
      lines.push(`Tartalom-pillérek: ${map.content_pillars.join(" · ")}`);
    }
    if (Array.isArray(map.personas) && map.personas.length) {
      lines.push("PERSONÁK:");
      for (const p of map.personas.slice(0, 8)) {
        if (typeof p === "string") lines.push(`- ${p}`);
        else if (p?.name) lines.push(`- ${p.name}${p.description ? ` — ${p.description}` : ""}`);
      }
    }
    if (map.founding_offer) {
      const f = map.founding_offer;
      lines.push("FOUNDING PARTNER AJÁNLAT:");
      if (f.summary) lines.push(`  Lényeg: ${f.summary}`);
      if (f.pricing) lines.push(`  Árazás: ${f.pricing}`);
      if (Array.isArray(f.perks) && f.perks.length) lines.push(`  Perkek: ${f.perks.join(" · ")}`);
    }

    lines.push("--- BRAND DNS VÉGE ---");
    return lines.join("\n");
  } catch (e) {
    console.error("loadBrandContext error", e);
    return "";
  }
}
