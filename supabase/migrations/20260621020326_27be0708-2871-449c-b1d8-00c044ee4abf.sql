
ALTER TABLE public.inbox_items ADD COLUMN IF NOT EXISTS snoozed_until timestamptz;

ALTER TABLE public.metric_events 
  ADD COLUMN IF NOT EXISTS input_tokens int,
  ADD COLUMN IF NOT EXISTS output_tokens int,
  ADD COLUMN IF NOT EXISTS model text,
  ADD COLUMN IF NOT EXISTS cost_huf numeric;

ALTER TABLE public.trend_signals 
  ADD COLUMN IF NOT EXISTS source_url text,
  ADD COLUMN IF NOT EXISTS scraped_at timestamptz,
  ADD COLUMN IF NOT EXISTS query text,
  ADD COLUMN IF NOT EXISTS ai_cost_estimate numeric;

ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS research_notes jsonb;

CREATE INDEX IF NOT EXISTS idx_inbox_items_snoozed ON public.inbox_items(snoozed_until) WHERE snoozed_until IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_metric_events_model ON public.metric_events(model) WHERE model IS NOT NULL;
