ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS file_hash text;
CREATE INDEX IF NOT EXISTS documents_file_hash_idx ON public.documents(file_hash) WHERE file_hash IS NOT NULL;