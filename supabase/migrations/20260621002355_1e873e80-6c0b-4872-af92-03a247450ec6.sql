-- Decision Journal table
CREATE TABLE public.decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_text TEXT NOT NULL,
  expected_outcome TEXT,
  entity_type TEXT,
  entity_id UUID,
  context TEXT,
  decided_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  review_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '30 days'),
  outcome JSONB,
  outcome_rating INT CHECK (outcome_rating BETWEEN 1 AND 5),
  outcome_note TEXT,
  reviewed_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.decisions TO authenticated;
GRANT ALL ON public.decisions TO service_role;

ALTER TABLE public.decisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage decisions" ON public.decisions
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_decisions_updated_at
  BEFORE UPDATE ON public.decisions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_decisions_review_at ON public.decisions(review_at) WHERE outcome IS NULL;
CREATE INDEX idx_decisions_entity ON public.decisions(entity_type, entity_id);