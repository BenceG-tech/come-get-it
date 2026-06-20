
-- Enable scheduling extensions for later cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- ============== metric_events ==============
CREATE TABLE public.metric_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  value NUMERIC,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX metric_events_type_created_idx ON public.metric_events (event_type, created_at DESC);
CREATE INDEX metric_events_created_idx ON public.metric_events (created_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.metric_events TO authenticated;
GRANT ALL ON public.metric_events TO service_role;
ALTER TABLE public.metric_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage metric_events" ON public.metric_events
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============== daily_focus ==============
CREATE TABLE public.daily_focus (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  focus_date DATE NOT NULL,
  top_priorities JSONB NOT NULL DEFAULT '[]'::jsonb,
  reflection TEXT,
  energy_level INT CHECK (energy_level BETWEEN 1 AND 5),
  briefing_acknowledged_at TIMESTAMPTZ,
  briefing_payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, focus_date)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.daily_focus TO authenticated;
GRANT ALL ON public.daily_focus TO service_role;
ALTER TABLE public.daily_focus ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage daily_focus" ON public.daily_focus
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER daily_focus_updated_at
  BEFORE UPDATE ON public.daily_focus
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============== time_logs ==============
CREATE TABLE public.time_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  log_date DATE NOT NULL,
  module TEXT NOT NULL,
  minutes INT NOT NULL CHECK (minutes >= 0),
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX time_logs_user_date_idx ON public.time_logs (user_id, log_date DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.time_logs TO authenticated;
GRANT ALL ON public.time_logs TO service_role;
ALTER TABLE public.time_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage time_logs" ON public.time_logs
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER time_logs_updated_at
  BEFORE UPDATE ON public.time_logs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============== daily_kpi_snapshots ==============
CREATE TABLE public.daily_kpi_snapshots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  snapshot_date DATE NOT NULL UNIQUE,
  waitlist_total INT NOT NULL DEFAULT 0,
  waitlist_delta INT NOT NULL DEFAULT 0,
  leads_total INT NOT NULL DEFAULT 0,
  leads_new INT NOT NULL DEFAULT 0,
  qualified_total INT NOT NULL DEFAULT 0,
  signed_total INT NOT NULL DEFAULT 0,
  signed_new INT NOT NULL DEFAULT 0,
  posts_published INT NOT NULL DEFAULT 0,
  posts_scheduled INT NOT NULL DEFAULT 0,
  docs_processed INT NOT NULL DEFAULT 0,
  avg_brand_fit NUMERIC,
  ai_cost_estimate NUMERIC NOT NULL DEFAULT 0,
  extra JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX daily_kpi_snapshots_date_idx ON public.daily_kpi_snapshots (snapshot_date DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.daily_kpi_snapshots TO authenticated;
GRANT ALL ON public.daily_kpi_snapshots TO service_role;
ALTER TABLE public.daily_kpi_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage daily_kpi_snapshots" ON public.daily_kpi_snapshots
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
