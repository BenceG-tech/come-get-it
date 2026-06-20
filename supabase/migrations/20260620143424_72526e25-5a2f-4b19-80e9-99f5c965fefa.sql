
-- 1. Verziók tábla
CREATE TABLE public.image_analysis_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  result jsonb NOT NULL,
  is_current boolean NOT NULL DEFAULT false,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.image_analysis_versions TO authenticated;
GRANT ALL ON public.image_analysis_versions TO service_role;

ALTER TABLE public.image_analysis_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage image analysis versions"
ON public.image_analysis_versions
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_iav_doc ON public.image_analysis_versions(document_id, created_at DESC);

-- 2. linked_document_id a documents-en (visszahivatkozás generált md doksinál)
ALTER TABLE public.documents
  ADD COLUMN IF NOT EXISTS linked_document_id uuid REFERENCES public.documents(id) ON DELETE SET NULL;
