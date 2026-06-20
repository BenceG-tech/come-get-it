import { supabase } from "@/integrations/supabase/client";

export type MetricEventType =
  | "waitlist_signup"
  | "lead_created"
  | "lead_stage_changed"
  | "partner_signed"
  | "partner_email_sent"
  | "post_published"
  | "post_scheduled"
  | "task_completed"
  | "voice_note_created"
  | "doc_processed"
  | "ai_call"
  | "content_generated";

export async function trackEvent(
  event_type: MetricEventType | string,
  opts?: {
    entity_type?: string;
    entity_id?: string;
    value?: number;
    metadata?: Record<string, unknown>;
  },
) {
  try {
    const { data: auth } = await supabase.auth.getUser();
    await supabase.from("metric_events").insert({
      event_type,
      entity_type: opts?.entity_type ?? null,
      entity_id: opts?.entity_id ?? null,
      value: opts?.value ?? null,
      metadata: (opts?.metadata ?? {}) as any,
      created_by: auth.user?.id ?? null,
    });
  } catch (e) {
    console.warn("[track] failed", event_type, e);
  }
}
