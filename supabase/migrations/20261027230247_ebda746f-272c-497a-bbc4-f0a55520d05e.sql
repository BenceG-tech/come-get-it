-- 1. Semantic search RPC: internal only (edge function uses service role)
REVOKE ALL ON FUNCTION public.match_document_chunks(vector, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.match_document_chunks(vector, integer) TO service_role;

-- 2. Trigger functions: never callable via the API (triggers still fire; EXECUTE is not checked at fire time)
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.on_outreach_reply_prompt_decision() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.partners_auto_lead_grade() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.content_briefs_sync_calendar() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.marketing_calendar_publish_streak() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user(), public.update_updated_at_column(), public.on_outreach_reply_prompt_decision(),
  public.partners_auto_lead_grade(), public.content_briefs_sync_calendar(), public.marketing_calendar_publish_streak() TO service_role;

-- 3. has_role: signed-in callers may only ask about themselves; service role / internal DB sessions unrestricted
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT (
    _user_id = auth.uid()
    OR coalesce(auth.role(), '') NOT IN ('anon', 'authenticated')
  ) AND EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Policies that evaluated has_role for every role -> scope to signed-in users (same effective access: anon was never admin)
ALTER POLICY "Admins manage import jobs" ON public.lead_import_jobs TO authenticated;
ALTER POLICY "Admins manage templates" ON public.email_templates TO authenticated;
ALTER POLICY "Admins manage partner emails" ON public.partner_emails TO authenticated;

REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;

-- 4. Move pgvector out of the exposed schema
CREATE SCHEMA IF NOT EXISTS extensions;
ALTER EXTENSION vector SET SCHEMA extensions;
ALTER FUNCTION public.match_document_chunks(extensions.vector, integer) SET search_path TO public, extensions;