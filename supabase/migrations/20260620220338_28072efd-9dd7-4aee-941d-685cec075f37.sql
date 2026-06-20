
-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- documents enrichment columns
ALTER TABLE public.documents
  ADD COLUMN IF NOT EXISTS ai_tags text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS ai_hook text,
  ADD COLUMN IF NOT EXISTS relevance_score int,
  ADD COLUMN IF NOT EXISTS last_opened_at timestamptz,
  ADD COLUMN IF NOT EXISTS lifecycle_status text DEFAULT 'fresh';

-- document_chunks
CREATE TABLE IF NOT EXISTS public.document_chunks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  chunk_index int NOT NULL,
  text text NOT NULL,
  token_count int,
  embedding vector(1536),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.document_chunks TO authenticated;
GRANT ALL ON public.document_chunks TO service_role;

ALTER TABLE public.document_chunks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage document_chunks"
  ON public.document_chunks FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS document_chunks_doc_idx ON public.document_chunks(document_id);
CREATE INDEX IF NOT EXISTS document_chunks_embedding_idx
  ON public.document_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- document_entity_links (Drive -> CRM bridge)
CREATE TABLE IF NOT EXISTS public.document_entity_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  entity_type text NOT NULL CHECK (entity_type IN ('partner','lead')),
  entity_id uuid NOT NULL,
  confidence numeric,
  source text NOT NULL DEFAULT 'ai' CHECK (source IN ('ai','manual')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (document_id, entity_type, entity_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.document_entity_links TO authenticated;
GRANT ALL ON public.document_entity_links TO service_role;

ALTER TABLE public.document_entity_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage document_entity_links"
  ON public.document_entity_links FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS document_entity_links_entity_idx
  ON public.document_entity_links(entity_type, entity_id);

-- document_opens
CREATE TABLE IF NOT EXISTS public.document_opens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  user_id uuid,
  opened_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.document_opens TO authenticated;
GRANT ALL ON public.document_opens TO service_role;

ALTER TABLE public.document_opens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read document_opens"
  ON public.document_opens FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated insert document_opens"
  ON public.document_opens FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS document_opens_doc_idx ON public.document_opens(document_id, opened_at DESC);

-- match_document_chunks function for semantic search
CREATE OR REPLACE FUNCTION public.match_document_chunks(
  query_embedding vector(1536),
  match_count int DEFAULT 20
)
RETURNS TABLE (
  chunk_id uuid,
  document_id uuid,
  chunk_index int,
  text text,
  similarity float
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT
    dc.id AS chunk_id,
    dc.document_id,
    dc.chunk_index,
    dc.text,
    1 - (dc.embedding <=> query_embedding) AS similarity
  FROM public.document_chunks dc
  WHERE dc.embedding IS NOT NULL
  ORDER BY dc.embedding <=> query_embedding
  LIMIT match_count;
$$;
