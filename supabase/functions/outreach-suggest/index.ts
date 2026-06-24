// @ts-nocheck
// AI suggests a sequence + personalised first email for a partner/lead.
// Now with A/B feedback loop: feeds the AI recent subject performance and persists
// new winning subject lines into outreach_sequences.subject_library.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { BRAND_CONTEXT } from "../_shared/brand-context.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type SubjectStat = { subject: string; sent: number; opened: number; replied: number; open_rate: number; reply_rate: number };

async function loadSubjectStats(sb: any, days = 30): Promise<{ top: SubjectStat[]; weak: SubjectStat[] }> {
  const since = new Date(Date.now() - days * 86400000).toISOString();
  const { data } = await sb
    .from("outreach_events")
    .select("subject, status, opened_at, replied_at, sent_at")
    .gte("sent_at", since)
    .not("subject", "is", null)
    .limit(2000);
  const rows: any[] = data ?? [];
  const map = new Map<string, { sent: number; opened: number; replied: number }>();
  for (const r of rows) {
    const key = (r.subject ?? "").trim();
    if (!key) continue;
    const e = map.get(key) ?? { sent: 0, opened: 0, replied: 0 };
    if (r.status === "sent" || r.sent_at) e.sent++;
    if (r.opened_at) e.opened++;
    if (r.replied_at) e.replied++;
    map.set(key, e);
  }
  const stats: SubjectStat[] = [];
  for (const [subject, e] of map.entries()) {
    if (e.sent < 2) continue;
    stats.push({
      subject, sent: e.sent, opened: e.opened, replied: e.replied,
      open_rate: e.opened / e.sent,
      reply_rate: e.replied / e.sent,
    });
  }
  const top = [...stats].sort((a, b) => (b.open_rate + b.reply_rate * 2) - (a.open_rate + a.reply_rate * 2)).slice(0, 10);
  const weak = [...stats].sort((a, b) => a.open_rate - b.open_rate).slice(0, 5);
  return { top, weak };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const sbAdmin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    const { data: isAdmin } = await sb.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!isAdmin) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: corsHeaders });

    const { entity_type, entity_id, sequence_id } = await req.json();
    if (!entity_type || !entity_id) return new Response(JSON.stringify({ error: "entity_type and entity_id required" }), { status: 400, headers: corsHeaders });

    const { data: entity } = entity_type === "partner"
      ? await sb.from("partners").select("*").eq("id", entity_id).maybeSingle()
      : { data: null };
    if (!entity) return new Response(JSON.stringify({ error: "entity not found" }), { status: 404, headers: corsHeaders });

    const { data: transitions } = await sb.from("pipeline_transitions")
      .select("from_stage_id,to_stage_id,reason,created_at")
      .eq("entity_type", entity_type).eq("entity_id", entity_id)
      .order("created_at", { ascending: false }).limit(10);

    const { top, weak } = await loadSubjectStats(sbAdmin, 30);
    const fmt = (s: SubjectStat) =>
      `"${s.subject}" — ${s.sent} küldés, open ${(s.open_rate * 100).toFixed(0)}%, reply ${(s.reply_rate * 100).toFixed(0)}%`;
    const subjectLearnings = (top.length || weak.length)
      ? `\n\nA/B TANULSÁGOK (utolsó 30 nap):\nTOP subjectek (kövesd ezt a stílust):\n${top.map(fmt).join("\n") || "—"}\n\nGYENGE subjectek (kerüld ezt a stílust):\n${weak.map(fmt).join("\n") || "—"}`
      : "";

    const sys = `Te a Come Get It outreach stratégája vagy. Magyarul, tegezve. Adj egy 3-5 lépéses szekvencia javaslatot + személyre szabott első email draftet a partner adatai alapján.\n\n${BRAND_CONTEXT}${subjectLearnings}\n\nCsak JSON-t adj vissza.`;
    const userMsg = `PARTNER ADATAI:\n${JSON.stringify({
      company: entity.company_name,
      contact: entity.contact_name,
      city: entity.city,
      category: entity.category,
      status: entity.status,
      notes: entity.notes,
      ai_score: entity.ai_score,
      ai_next_action: entity.ai_next_action,
    }, null, 2)}\n\nELŐZMÉNYEK: ${JSON.stringify(transitions ?? [])}\n\nVálasz JSON:\n{\n  "sequence_name": "...",\n  "rationale": "1-2 mondat miért ez a séma",\n  "subject_variants": ["3 alternatív subject az 1. lépéshez, mind 40-60 char, A/B tanulságokra építve"],\n  "steps": [\n    { "day_offset": 0, "channel": "email", "subject": "...", "body": "..." },\n    { "day_offset": 3, "channel": "task", "title": "...", "due_offset_days": 1 },\n    { "day_offset": 7, "channel": "email", "subject": "...", "body": "..." }\n  ]\n}`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: sys }, { role: "user", content: userMsg }],
        response_format: { type: "json_object" },
      }),
    });
    if (!aiRes.ok) {
      const t = await aiRes.text();
      return new Response(JSON.stringify({ error: `AI error ${aiRes.status}: ${t}` }), { status: 502, headers: corsHeaders });
    }
    const aij = await aiRes.json();
    const parsed = JSON.parse(aij.choices?.[0]?.message?.content ?? "{}");

    // Persist new subject variants into the sequence's subject_library (FIFO, max 20)
    if (sequence_id && Array.isArray(parsed?.subject_variants) && parsed.subject_variants.length) {
      try {
        const { data: seq } = await sbAdmin.from("outreach_sequences").select("subject_library").eq("id", sequence_id).maybeSingle();
        const existing: any[] = Array.isArray((seq as any)?.subject_library) ? (seq as any).subject_library : [];
        const now = new Date().toISOString();
        const additions = parsed.subject_variants
          .filter((s: any) => typeof s === "string" && s.trim())
          .map((s: string) => ({ subject: s.trim(), source: "ai_suggest", created_at: now }));
        const seen = new Set(existing.map((e: any) => (e?.subject ?? "").toLowerCase()));
        const merged = [...existing];
        for (const a of additions) {
          if (!seen.has(a.subject.toLowerCase())) { merged.push(a); seen.add(a.subject.toLowerCase()); }
        }
        const trimmed = merged.slice(-20);
        await sbAdmin.from("outreach_sequences").update({ subject_library: trimmed as any }).eq("id", sequence_id);
      } catch (e) {
        console.error("subject_library upsert failed", e);
      }
    }

    return new Response(JSON.stringify({ ...parsed, subject_stats: { top, weak } }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
