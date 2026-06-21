
CREATE TABLE public.trend_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  summary text,
  source_url text,
  source_title text,
  category text,
  relevance_score integer DEFAULT 50,
  query text,
  published_at timestamptz,
  ingested_at timestamptz NOT NULL DEFAULT now(),
  saved_to_decision_id uuid REFERENCES public.decisions(id) ON DELETE SET NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.trend_signals TO authenticated;
GRANT ALL ON public.trend_signals TO service_role;

ALTER TABLE public.trend_signals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins manage trend_signals"
  ON public.trend_signals FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trend_signals_updated_at
  BEFORE UPDATE ON public.trend_signals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_trend_signals_ingested ON public.trend_signals (ingested_at DESC);
CREATE INDEX idx_trend_signals_category ON public.trend_signals (category);

-- Partners bővítés
ALTER TABLE public.partners
  ADD COLUMN IF NOT EXISTS research_notes jsonb,
  ADD COLUMN IF NOT EXISTS last_researched_at timestamptz;
