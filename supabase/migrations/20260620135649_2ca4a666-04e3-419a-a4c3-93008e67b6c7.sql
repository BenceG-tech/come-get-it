ALTER TABLE public.partners 
  ADD COLUMN IF NOT EXISTS ai_score integer,
  ADD COLUMN IF NOT EXISTS ai_score_reason text,
  ADD COLUMN IF NOT EXISTS ai_next_action text,
  ADD COLUMN IF NOT EXISTS ai_scored_at timestamptz;