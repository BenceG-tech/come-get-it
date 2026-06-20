ALTER TABLE public.documents
  ADD COLUMN IF NOT EXISTS tldr text,
  ADD COLUMN IF NOT EXISTS key_points jsonb,
  ADD COLUMN IF NOT EXISTS faq jsonb,
  ADD COLUMN IF NOT EXISTS suggested_questions jsonb,
  ADD COLUMN IF NOT EXISTS last_summarized_at timestamptz;