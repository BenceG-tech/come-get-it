-- 1. Cron secret stored in Vault, verifiable only by the service role
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM vault.secrets WHERE name = 'edge_cron_secret') THEN
    PERFORM vault.create_secret(encode(extensions.gen_random_bytes(32), 'hex'), 'edge_cron_secret', 'Shared secret for pg_cron -> edge function calls');
  END IF;
END$$;

CREATE OR REPLACE FUNCTION public.verify_edge_cron_secret(p_secret text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT p_secret IS NOT NULL AND EXISTS (
    SELECT 1 FROM vault.decrypted_secrets
    WHERE name = 'edge_cron_secret' AND decrypted_secret = p_secret
  );
$$;
REVOKE ALL ON FUNCTION public.verify_edge_cron_secret(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.verify_edge_cron_secret(text) TO service_role;

-- 2. Add the secret header to every cron job that calls an edge function (schedules/bodies unchanged)
DO $$
DECLARE j record; v_cmd text;
BEGIN
  FOR j IN SELECT jobid, command FROM cron.job WHERE command LIKE '%/functions/v1/%' AND command NOT LIKE '%edge_cron_secret%' LOOP
    v_cmd := regexp_replace(
      j.command,
      '(headers\s*:=\s*)(''[^'']*''::jsonb|jsonb_build_object\([^)]*\))',
      '\1(\2 || jsonb_build_object(''x-cron-secret'', (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = ''edge_cron_secret'')))'
    );
    IF v_cmd <> j.command THEN
      PERFORM cron.alter_job(job_id := j.jobid, command := v_cmd);
    END IF;
  END LOOP;
END$$;

-- 3. Tighten always-true insert policies
DROP POLICY IF EXISTS "Authenticated insert document_opens" ON public.document_opens;
CREATE POLICY "Authenticated insert own document_opens" ON public.document_opens
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Anyone can insert funnel events" ON public.web_funnel_events;
CREATE POLICY "Anyone can insert bounded funnel events" ON public.web_funnel_events
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(visit_id) BETWEEN 1 AND 100
    AND length(event) BETWEEN 1 AND 80
    AND pg_column_size(props) <= 8192
    AND coalesce(length(path), 0) <= 500
    AND coalesce(length(referrer), 0) <= 1000
    AND coalesce(length(utm_source), 0) <= 200
    AND coalesce(length(utm_medium), 0) <= 200
    AND coalesce(length(utm_campaign), 0) <= 200
    AND coalesce(length(utm_content), 0) <= 200
    AND coalesce(length(device), 0) <= 50
    AND coalesce(length(in_app), 0) <= 50
  );