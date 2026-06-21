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
  | "content_generated"
  | "briefing_generated"
  | "retro_generated"
  | "goal_progress"
  | "brief_created"
  | "brief_approved"
  | "brief_to_posts_generated"
  | "calendar_autofilled"
  | "snippet_reused"
  | "brand_check_warning"
  | "sequence_enrolled"
  | "sequence_step_sent"
  | "sequence_reply"
  | "stage_transition"
  | "sla_breach"
  | "pipeline_task_created"
  | "pipeline_task_completed"
  | "doc_tagged"
  | "doc_embedded"
  | "doc_semantic_search"
  | "doc_entity_linked"
  | "doc_archived_suggested"
  | "doc_opened"
  | "inbox_item_resolved"
  | "inbox_item_snoozed"
  | "simulator_run"
  | "decision_created"
  | "decision_reviewed"
  | "entity_drawer_opened"
  | "doc_chat_v2_used"
  | "health_radar_viewed"
  | "command_palette_used"
  | "trend_radar_run"
  | "trend_signal_saved"
  | "lead_auto_research"
  | "premortem_run"
  | "ai_brief_generated"
  | "quick_action_used";

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
