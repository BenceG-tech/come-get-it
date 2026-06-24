-- 1) outreach_sequences kiegészítése autopilot küszöbökkel
ALTER TABLE public.outreach_sequences
  ADD COLUMN IF NOT EXISTS auto_send_min_grade text,
  ADD COLUMN IF NOT EXISTS auto_send_min_confidence numeric DEFAULT 0.75,
  ADD COLUMN IF NOT EXISTS daily_cap integer DEFAULT 30;

-- 2) system_settings — globális kapcsolók
CREATE TABLE IF NOT EXISTS public.system_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.system_settings TO authenticated;
GRANT ALL ON public.system_settings TO service_role;

ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read system_settings" ON public.system_settings;
CREATE POLICY "Admins can read system_settings"
  ON public.system_settings FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can write system_settings" ON public.system_settings;
CREATE POLICY "Admins can write system_settings"
  ON public.system_settings FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE TRIGGER system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- seed defaults
INSERT INTO public.system_settings (key, value) VALUES
  ('apify_daily_autopilot', '{"enabled": false, "cap_usd": 3.0, "hour_utc": 6}'::jsonb),
  ('outreach_daily_cap', '{"email": 30, "instagram_manual": 20}'::jsonb)
ON CONFLICT (key) DO NOTHING;