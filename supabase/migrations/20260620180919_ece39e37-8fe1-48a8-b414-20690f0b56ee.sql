
-- Saved snippets for Content Studio
CREATE TABLE public.saved_content_snippets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  format_key TEXT NOT NULL,
  format_label TEXT NOT NULL,
  text TEXT NOT NULL,
  notes TEXT,
  brief TEXT,
  persona TEXT,
  generation_id UUID REFERENCES public.content_generations(id) ON DELETE SET NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  linked_image_doc_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
  scheduled_calendar_id UUID,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_content_snippets TO authenticated;
GRANT ALL ON public.saved_content_snippets TO service_role;

ALTER TABLE public.saved_content_snippets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage saved snippets"
  ON public.saved_content_snippets FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER set_saved_snippets_updated_at
  BEFORE UPDATE ON public.saved_content_snippets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_saved_snippets_format ON public.saved_content_snippets(format_key);
CREATE INDEX idx_saved_snippets_created ON public.saved_content_snippets(created_at DESC);

-- marketing_calendar bővítés
ALTER TABLE public.marketing_calendar
  ADD COLUMN IF NOT EXISTS scheduled_time TIME,
  ADD COLUMN IF NOT EXISTS image_doc_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS saved_snippet_id UUID REFERENCES public.saved_content_snippets(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS assistant_rationale TEXT,
  ADD COLUMN IF NOT EXISTS goal TEXT;
