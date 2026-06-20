
-- Content Briefs
CREATE TABLE public.content_briefs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  angle text,
  target_audience text,
  channel_mix jsonb NOT NULL DEFAULT '[]'::jsonb,
  key_points jsonb NOT NULL DEFAULT '[]'::jsonb,
  cta text,
  tone text,
  source_type text NOT NULL DEFAULT 'manual',
  source_id text,
  status text NOT NULL DEFAULT 'draft',
  scheduled_for date,
  brand_score integer,
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_briefs TO authenticated;
GRANT ALL ON public.content_briefs TO service_role;
ALTER TABLE public.content_briefs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage content_briefs" ON public.content_briefs
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_content_briefs_updated_at
  BEFORE UPDATE ON public.content_briefs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Snippet performance
CREATE TABLE public.snippet_performance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  snippet_id uuid REFERENCES public.saved_content_snippets(id) ON DELETE CASCADE,
  calendar_id uuid REFERENCES public.marketing_calendar(id) ON DELETE SET NULL,
  channel text NOT NULL,
  impressions integer DEFAULT 0,
  clicks integer DEFAULT 0,
  reactions integer DEFAULT 0,
  comments integer DEFAULT 0,
  shares integer DEFAULT 0,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  source text NOT NULL DEFAULT 'manual',
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.snippet_performance TO authenticated;
GRANT ALL ON public.snippet_performance TO service_role;
ALTER TABLE public.snippet_performance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage snippet_performance" ON public.snippet_performance
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Marketing calendar: link to brief + brand_score
ALTER TABLE public.marketing_calendar
  ADD COLUMN IF NOT EXISTS brief_id uuid REFERENCES public.content_briefs(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS brand_score integer;

-- Content generations: brand_score per generation
ALTER TABLE public.content_generations
  ADD COLUMN IF NOT EXISTS brief_id uuid REFERENCES public.content_briefs(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_content_briefs_status ON public.content_briefs(status);
CREATE INDEX IF NOT EXISTS idx_content_briefs_scheduled ON public.content_briefs(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_marketing_calendar_brief ON public.marketing_calendar(brief_id);
CREATE INDEX IF NOT EXISTS idx_snippet_performance_snippet ON public.snippet_performance(snippet_id);
