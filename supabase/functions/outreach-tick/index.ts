// @ts-nocheck
// Cron-driven outreach engine: processes active enrollments whose next_run_at <= now()
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  try {
    const { data: due, error } = await admin
      .from("outreach_enrollments")
      .select("id, sequence_id, entity_type, entity_id, current_step, metadata")
      .eq("status", "active")
      .lte("next_run_at", new Date().toISOString())
      .limit(50);
    if (error) throw error;

    const results: any[] = [];

    for (const en of due ?? []) {
      const { data: seq } = await admin.from("outreach_sequences").select("steps, active, kind").eq("id", en.sequence_id).maybeSingle();
      if (!seq || !seq.active) {
        await admin.from("outreach_enrollments").update({ status: "stopped", stop_reason: "sequence_inactive", next_run_at: null }).eq("id", en.id);
        continue;
      }
      const steps = Array.isArray(seq.steps) ? seq.steps : [];
      const baseStep = steps[en.current_step];
      if (!baseStep) {
        await admin.from("outreach_enrollments").update({ status: "done", finished_at: new Date().toISOString(), next_run_at: null }).eq("id", en.id);
        continue;
      }

      // Per-enrollment overrides: metadata.personalized_steps[idx] = { subject, body, preheader }
      const overrides = (en.metadata as any)?.personalized_steps ?? [];
      const override = Array.isArray(overrides) ? overrides[en.current_step] : null;
      // Legacy: metadata.personalized for first step only
      const legacy = en.current_step === 0 ? (en.metadata as any)?.personalized : null;
      const step = {
        ...baseStep,
        subject: override?.subject || legacy?.subject || baseStep.subject,
        body: override?.body || legacy?.body || baseStep.body,
      };

      // Load entity (only partners supported for now; leads share table when implemented)
      const { data: entity } = en.entity_type === "partner"
        ? await admin.from("partners").select("id, company_name, contact_name, email").eq("id", en.entity_id).maybeSingle()
        : { data: null };

      let eventStatus = "sent";
      let bodyPreview = "";
      let subject = step.subject ?? null;

      try {
        if (step.channel === "email") {
          if (!entity?.email) {
            eventStatus = "skipped";
            bodyPreview = "no_email";
          } else {
            // Render template via send-partner-email if template_id, else direct subject/body from step
            const payload = {
              partner_id: entity.id,
              template_id: step.template_id ?? null,
              subject: step.subject ?? null,
              body: step.body ?? null,
              context: { sequence_id: en.sequence_id, step_index: en.current_step },
            };
            const r = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-partner-email`, {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}` },
              body: JSON.stringify(payload),
            });
            if (!r.ok) {
              eventStatus = "failed";
              bodyPreview = `send_failed_${r.status}`;
            } else {
              const j = await r.json().catch(() => ({}));
              bodyPreview = (j?.subject ?? step.subject ?? "").slice(0, 200);
              subject = j?.subject ?? subject;
            }
          }
        } else if (step.channel === "task") {
          await admin.from("pipeline_tasks").insert({
            entity_type: en.entity_type,
            entity_id: en.entity_id,
            title: step.title ?? "Outreach feladat",
            description: step.description ?? null,
            due_at: step.due_offset_days
              ? new Date(Date.now() + step.due_offset_days * 86400000).toISOString()
              : null,
            source: "outreach",
            metadata: { sequence_id: en.sequence_id, step_index: en.current_step },
          });
          bodyPreview = step.title ?? "task";
        } else if (step.channel === "wait") {
          eventStatus = "skipped";
          bodyPreview = "wait";
        } else {
          eventStatus = "skipped";
          bodyPreview = `unknown_channel_${step.channel}`;
        }
      } catch (e: any) {
        eventStatus = "failed";
        bodyPreview = (e?.message ?? String(e)).slice(0, 200);
      }

      await admin.from("outreach_events").insert({
        enrollment_id: en.id,
        step_index: en.current_step,
        channel: step.channel,
        status: eventStatus,
        subject,
        body_preview: bodyPreview,
      });

      // Schedule next step
      const nextIdx = en.current_step + 1;
      const nextStep = steps[nextIdx];
      if (!nextStep) {
        await admin.from("outreach_enrollments").update({
          current_step: nextIdx,
          status: "done",
          finished_at: new Date().toISOString(),
          next_run_at: null,
        }).eq("id", en.id);
      } else {
        const waitDays = Number(nextStep.day_offset ?? nextStep.wait_days ?? 1);
        const nextRun = new Date(Date.now() + waitDays * 86400000).toISOString();
        await admin.from("outreach_enrollments").update({
          current_step: nextIdx,
          next_run_at: nextRun,
        }).eq("id", en.id);
      }

      results.push({ enrollment_id: en.id, step: en.current_step, status: eventStatus });
    }

    return new Response(JSON.stringify({ processed: results.length, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
