// @ts-nocheck
// auto-review-documents — batch háttér review.
// Lefuttatja a `review-document` logikát X doksin (default: csak amik content/description-nel rendelkeznek és nincs még ai_review).
// Body: { limit?: number, doc_ids?: string[], force?: boolean }
// Válasz: { processed, succeeded, failed, errors: [{id, error}] }

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

const SYSTEM = `Te a Come Get It belső doksi-reviewer AI-ja vagy. Magyarul, közvetlen, üzletfókuszú hangon dolgozol.
Egy doksi metaadatát + tartalmát kapod. Vizsgáld meg NÉGY szempontból, mindegyikre adj 1-10 pontot és KONKRÉT észrevételeket:

1. content_accuracy — Tartalmi pontosság: ellentmondások, hiányzó adatok, elavult állítások
2. brand_tone — Brand & hangnem: Come Get It magyar tegező, energikus
3. legal_risk — Jogi/üzleti kockázat
4. marketing_power — Marketing erő: hook, CTA, érzelmi hatás

Mindegyik szempontnál: score (1-10), summary (1 mondat), issues (2-5 db: location, problem, fix).
Plusz: overall (1-2 mondat), top_actions (3-5 string).

VÁLASZ KIZÁRÓLAG JSON.`;

async function reviewOne(doc: any): Promise<{ ok: boolean; error?: string }> {
  const payload = {
    title: doc.title,
    category: doc.category,
    folder: doc.folder,
    description: doc.description,
    when_to_use: doc.when_to_use,
    tldr: doc.tldr,
    content: doc.content ? String(doc.content).slice(0, 14000) : null,
  };
  if (!payload.content && !payload.description) {
    return { ok: false, error: "no_text_content" };
  }

  const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${LOVABLE_API_KEY}` },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: `Doksi:\n${JSON.stringify(payload)}` },
      ],
    }),
  });
  if (r.status === 429) return { ok: false, error: "rate_limit" };
  if (r.status === 402) return { ok: false, error: "credits_exhausted" };
  if (!r.ok) return { ok: false, error: `ai_${r.status}` };

  const j = await r.json();
  const text = j?.choices?.[0]?.message?.content ?? "{}";
  let parsed: any;
  try { parsed = JSON.parse(text); } catch { return { ok: false, error: "parse_failed" }; }

  const { error: upErr } = await admin.from("documents").update({
    ai_review: parsed,
    last_reviewed_at: new Date().toISOString(),
  }).eq("id", doc.id);
  if (upErr) return { ok: false, error: upErr.message };
  return { ok: true };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    // Auth: admin only
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const userClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const { data: isAdmin } = await userClient.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!isAdmin) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const body = await req.json().catch(() => ({}));
    const limit = Math.min(Math.max(1, Number(body.limit) || 10), 25);
    const force = !!body.force;
    const docIds: string[] | undefined = Array.isArray(body.doc_ids) ? body.doc_ids : undefined;

    let q = admin.from("documents").select("id, title, category, folder, description, when_to_use, tldr, content, ai_review");
    if (docIds?.length) q = q.in("id", docIds);
    else {
      if (!force) q = q.is("ai_review", null);
      // Skip pure image/video (no text content) — filter in code below since OR is awkward
      q = q.order("updated_at", { ascending: false }).limit(limit);
    }
    const { data: docs, error } = await q;
    if (error) throw error;

    const eligible = (docs ?? []).filter((d: any) => d.content || d.description);
    const skipped = (docs ?? []).length - eligible.length;

    const errors: { id: string; title?: string; error: string }[] = [];
    let succeeded = 0;
    for (const d of eligible) {
      const res = await reviewOne(d);
      if (res.ok) succeeded++;
      else errors.push({ id: d.id, title: d.title, error: res.error ?? "unknown" });
    }

    return new Response(JSON.stringify({
      processed: eligible.length,
      succeeded,
      failed: errors.length,
      skipped_no_text: skipped,
      errors,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
