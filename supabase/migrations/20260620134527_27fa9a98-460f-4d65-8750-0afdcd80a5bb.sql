ALTER TABLE public.documents
  ADD COLUMN IF NOT EXISTS ai_description text,
  ADD COLUMN IF NOT EXISTS ai_suggested_alt text,
  ADD COLUMN IF NOT EXISTS ai_suggested_caption text,
  ADD COLUMN IF NOT EXISTS ai_use_cases jsonb,
  ADD COLUMN IF NOT EXISTS ai_suggested_copy jsonb,
  ADD COLUMN IF NOT EXISTS ai_tags text[],
  ADD COLUMN IF NOT EXISTS ai_mood text,
  ADD COLUMN IF NOT EXISTS ai_dominant_colors text[],
  ADD COLUMN IF NOT EXISTS ai_analyzed_at timestamptz;