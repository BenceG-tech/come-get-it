
ALTER TABLE public.outreach_enrollments
  ADD COLUMN IF NOT EXISTS last_reply_at timestamptz,
  ADD COLUMN IF NOT EXISTS reply_sentiment text,
  ADD COLUMN IF NOT EXISTS reply_summary text,
  ADD COLUMN IF NOT EXISTS suggested_reply text,
  ADD COLUMN IF NOT EXISTS founding_deal_status text;

ALTER TABLE public.outreach_events
  ADD COLUMN IF NOT EXISTS skipped_reason text;

ALTER TABLE public.outreach_sequences
  ADD COLUMN IF NOT EXISTS guardrails jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS subject_library jsonb NOT NULL DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS outreach_enrollments_entity_idx
  ON public.outreach_enrollments(entity_type, entity_id);

CREATE INDEX IF NOT EXISTS outreach_events_enrollment_idx
  ON public.outreach_events(enrollment_id);
