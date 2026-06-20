
ALTER TABLE public.documents
  ADD COLUMN IF NOT EXISTS quality_score INTEGER,
  ADD COLUMN IF NOT EXISTS quality_notes TEXT,
  ADD COLUMN IF NOT EXISTS duplicate_group TEXT,
  ADD COLUMN IF NOT EXISTS duplicate_recommendation TEXT,
  ADD COLUMN IF NOT EXISTS keep_status TEXT DEFAULT 'unreviewed';

CREATE INDEX IF NOT EXISTS documents_dup_group_idx ON public.documents(duplicate_group);
CREATE INDEX IF NOT EXISTS documents_keep_status_idx ON public.documents(keep_status);
