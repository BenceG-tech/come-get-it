
-- Apify runs tracking table
CREATE TABLE public.apify_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_id text NOT NULL,
  actor_name text,
  apify_run_id text,
  status text NOT NULL DEFAULT 'PENDING',
  input jsonb DEFAULT '{}'::jsonb,
  dataset_id text,
  items_count integer DEFAULT 0,
  imported_count integer DEFAULT 0,
  ai_summary text,
  source_query text,
  error_message text,
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.apify_runs TO authenticated;
GRANT ALL ON public.apify_runs TO service_role;

ALTER TABLE public.apify_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage apify_runs"
  ON public.apify_runs
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_apify_runs_updated_at
  BEFORE UPDATE ON public.apify_runs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_apify_runs_user ON public.apify_runs(user_id, created_at DESC);
CREATE INDEX idx_apify_runs_status ON public.apify_runs(status);

-- Lead mockups (AI-generated personalized images)
CREATE TABLE public.lead_mockups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  image_url text NOT NULL,
  storage_path text,
  prompt text,
  variant text NOT NULL DEFAULT 'feed',
  model text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.lead_mockups TO authenticated;
GRANT ALL ON public.lead_mockups TO service_role;

ALTER TABLE public.lead_mockups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage lead_mockups"
  ON public.lead_mockups
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_lead_mockups_partner ON public.lead_mockups(partner_id, created_at DESC);

-- Partners bővítés
ALTER TABLE public.partners
  ADD COLUMN IF NOT EXISTS ai_score integer,
  ADD COLUMN IF NOT EXISTS research_dossier jsonb,
  ADD COLUMN IF NOT EXISTS research_updated_at timestamptz,
  ADD COLUMN IF NOT EXISTS instagram_handle text,
  ADD COLUMN IF NOT EXISTS apify_source_run_id uuid REFERENCES public.apify_runs(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS apify_place_id text,
  ADD COLUMN IF NOT EXISTS google_maps_url text,
  ADD COLUMN IF NOT EXISTS google_rating numeric,
  ADD COLUMN IF NOT EXISTS google_reviews_count integer,
  ADD COLUMN IF NOT EXISTS latitude numeric,
  ADD COLUMN IF NOT EXISTS longitude numeric;

CREATE INDEX IF NOT EXISTS idx_partners_ai_score ON public.partners(ai_score DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_partners_apify_place ON public.partners(apify_place_id) WHERE apify_place_id IS NOT NULL;
