
ALTER TABLE public.partners
  ADD COLUMN IF NOT EXISTS facebook_url text,
  ADD COLUMN IF NOT EXISTS linkedin_url text,
  ADD COLUMN IF NOT EXISTS contacts_blob jsonb;

ALTER TABLE public.apify_runs
  ADD COLUMN IF NOT EXISTS estimated_cost_usd numeric,
  ADD COLUMN IF NOT EXISTS actual_cost_usd numeric;

-- Background poller cron: ticks every 2 minutes
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'apify-runs-tick') THEN
    PERFORM cron.unschedule('apify-runs-tick');
  END IF;
END$$;

SELECT cron.schedule(
  'apify-runs-tick',
  '*/2 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://siefyekwetkywwgaqqhv.supabase.co/functions/v1/apify-runs-tick',
    headers := jsonb_build_object(
      'Content-Type','application/json',
      'apikey','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpZWZ5ZWt3ZXRreXd3Z2FxcWh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4ODc3NDgsImV4cCI6MjA2NjQ2Mzc0OH0.ZK7J7DrMW_RD5tpJbvr3zmVYpPWyPQpxOBc7Aoa0s2A',
      'Authorization','Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpZWZ5ZWt3ZXRreXd3Z2FxcWh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4ODc3NDgsImV4cCI6MjA2NjQ2Mzc0OH0.ZK7J7DrMW_RD5tpJbvr3zmVYpPWyPQpxOBc7Aoa0s2A'
    ),
    body := jsonb_build_object('source','cron')
  );
  $$
);
