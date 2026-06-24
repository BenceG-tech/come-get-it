// @ts-nocheck
// Aggregates signals from across the system into unified inbox_items.
// Idempotent via dedupe_key. Intended to run every 15 minutes via pg_cron.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const items: any[] = [];

  try {
    // 1. Overdue pipeline tasks
    const { data: tasks } = await admin
      .from("pipeline_tasks")
      .select("id, title, due_at, entity_kind, entity_id, status")
      .neq("status", "done")
      .lte("due_at", now.toISOString())
      .limit(50);
    for (const t of tasks ?? []) {
      items.push({
        kind: "task_overdue",
        severity: "warning",
        title: `Lejárt teendő: ${t.title}`,
        entity_kind: t.entity_kind,
        entity_id: t.entity_id,
        payload: { task_id: t.id, due_at: t.due_at },
        dedupe_key: `task_overdue:${t.id}:${today}`,
      });
    }

    // 2. SLA breach
    const { data: stages } = await admin.from("pipeline_stages").select("key, kind, sla_days").not("sla_days", "is", null);
    const slaMap = new Map((stages ?? []).map((s) => [`${s.kind}:${s.key}`, s.sla_days]));
    const { data: parts } = await admin
      .from("partners")
      .select("id, company_name, status, type, status_changed_at")
      .not("status_changed_at", "is", null)
      .limit(500);
    for (const p of parts ?? []) {
      const kind = p.type === "venue" ? "lead" : "partner";
      const sla = slaMap.get(`${kind}:${p.status}`);
      if (!sla) continue;
      const days = (now.getTime() - new Date(p.status_changed_at).getTime()) / 86400000;
      if (days > sla) {
        items.push({
          kind: "sla_breach",
          severity: "warning",
          title: `SLA túllépés: ${p.company_name} (${Math.round(days)} nap)`,
          entity_kind: "partner",
          entity_id: p.id,
          payload: { stage: p.status, sla_days: sla, days: Math.round(days) },
          dedupe_key: `sla_breach:${p.id}:${p.status}:${today}`,
        });
      }
    }

    // 3. Outreach replies in the last 24h — also auto-classify + push lead_replied items
    const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
    const { data: replies } = await admin
      .from("outreach_events")
      .select("id, enrollment_id, status, sent_at, subject, body_preview")
      .eq("status", "replied")
      .gte("sent_at", since)
      .limit(50);

    for (const r of replies ?? []) {
      // Look up the enrollment + partner for richer inbox card
      const { data: en } = await admin
        .from("outreach_enrollments")
        .select("id, entity_type, entity_id, status, reply_sentiment, suggested_reply, last_reply_at")
        .eq("id", r.enrollment_id)
        .maybeSingle();
      if (!en) continue;

      // Auto-classify if not yet processed
      if (!en.reply_sentiment && r.body_preview) {
        try {
          await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/outreach-reply-classify`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}` },
            body: JSON.stringify({ enrollment_id: en.id, reply_text: r.body_preview, reply_subject: r.subject }),
          });
        } catch (e) {
          console.warn("auto-classify failed", e);
        }
      }

      // Auto-pause enrollment + bump partner status
      if (en.status === "active") {
        await admin.from("outreach_enrollments").update({
          status: "replied",
          stop_reason: "auto_reply_detected",
          next_run_at: null,
          last_reply_at: en.last_reply_at ?? new Date().toISOString(),
        }).eq("id", en.id);
      }
      if (en.entity_type === "partner" && en.entity_id) {
        const { data: p } = await admin.from("partners").select("status, company_name").eq("id", en.entity_id).maybeSingle();
        if (p?.status === "contacted") {
          await admin.from("partners").update({ status: "negotiating" }).eq("id", en.entity_id);
        }
        items.push({
          kind: "lead_replied",
          severity: "info",
          title: `Válaszolt: ${p?.company_name ?? "partner"}`,
          entity_kind: "partner",
          entity_id: en.entity_id,
          payload: { event_id: r.id, enrollment_id: en.id, subject: r.subject },
          dedupe_key: `lead_replied:${r.id}`,
        });
      }
    }

    // 4. Stale documents
    const { data: stale } = await admin
      .from("documents")
      .select("id, title, lifecycle_status")
      .eq("lifecycle_status", "stale")
      .limit(20);
    for (const d of stale ?? []) {
      items.push({
        kind: "doc_stale",
        severity: "info",
        title: `Elavuló dokumentum: ${d.title}`,
        entity_kind: "document",
        entity_id: d.id,
        dedupe_key: `doc_stale:${d.id}:${today}`,
      });
    }

    // 5. Doksi review-t NEM teszünk inboxba — automatikusan megy a háttérben
    //    (auto-review-documents edge function + manuális "AI review az összesre" gomb).



    let inserted = 0;
    for (const it of items) {
      const { error } = await admin
        .from("inbox_items")
        .upsert({ ...it, status: "open" }, { onConflict: "dedupe_key", ignoreDuplicates: true });
      if (!error) inserted++;
    }

    return new Response(JSON.stringify({ ok: true, scanned: items.length, upserted: inserted }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("inbox-collect failed", e);
    return new Response(JSON.stringify({ error: String(e?.message ?? e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
