
-- daily_briefings
CREATE TABLE public.daily_briefings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL UNIQUE,
  summary_md text NOT NULL,
  highlights jsonb NOT NULL DEFAULT '[]'::jsonb,
  suggested_focus jsonb NOT NULL DEFAULT '[]'::jsonb,
  email_sent boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.daily_briefings TO authenticated;
GRANT ALL ON public.daily_briefings TO service_role;
ALTER TABLE public.daily_briefings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage briefings" ON public.daily_briefings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- voice_notes
CREATE TABLE public.voice_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  transcript text NOT NULL,
  structured jsonb NOT NULL DEFAULT '{}'::jsonb,
  intent text,
  target_table text,
  target_id uuid,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.voice_notes TO authenticated;
GRANT ALL ON public.voice_notes TO service_role;
ALTER TABLE public.voice_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage voice notes" ON public.voice_notes FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- weekly_goals
CREATE TABLE public.weekly_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  week_start date NOT NULL,
  title text NOT NULL,
  metric text,
  target numeric NOT NULL DEFAULT 0,
  actual numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.weekly_goals TO authenticated;
GRANT ALL ON public.weekly_goals TO service_role;
ALTER TABLE public.weekly_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage weekly goals" ON public.weekly_goals FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_weekly_goals_updated BEFORE UPDATE ON public.weekly_goals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- weekly_retros
CREATE TABLE public.weekly_retros (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week_start date NOT NULL UNIQUE,
  summary_md text NOT NULL,
  wins jsonb NOT NULL DEFAULT '[]'::jsonb,
  blockers jsonb NOT NULL DEFAULT '[]'::jsonb,
  next_week_focus jsonb NOT NULL DEFAULT '[]'::jsonb,
  kpi_delta jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.weekly_retros TO authenticated;
GRANT ALL ON public.weekly_retros TO service_role;
ALTER TABLE public.weekly_retros ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage weekly retros" ON public.weekly_retros FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- cron jobs
SELECT cron.schedule(
  'daily-briefing-05utc',
  '0 5 * * *',
  $$ select net.http_post(
    url:='https://siefyekwetkywwgaqqhv.supabase.co/functions/v1/daily-briefing',
    headers:='{"Content-Type":"application/json","apikey":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpZWZ5ZWt3ZXRreXd3Z2FxcWh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4ODc3NDgsImV4cCI6MjA2NjQ2Mzc0OH0.ZK7J7DrMW_RD5tpJbvr3zmVYpPWyPQpxOBc7Aoa0s2A"}'::jsonb,
    body:='{"scheduled":true}'::jsonb
  ); $$
);

SELECT cron.schedule(
  'weekly-retro-sat-18utc',
  '0 18 * * 6',
  $$ select net.http_post(
    url:='https://siefyekwetkywwgaqqhv.supabase.co/functions/v1/weekly-retro',
    headers:='{"Content-Type":"application/json","apikey":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpZWZ5ZWt3ZXRreXd3Z2FxcWh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4ODc3NDgsImV4cCI6MjA2NjQ2Mzc0OH0.ZK7J7DrMW_RD5tpJbvr3zmVYpPWyPQpxOBc7Aoa0s2A"}'::jsonb,
    body:='{"scheduled":true}'::jsonb
  ); $$
);
