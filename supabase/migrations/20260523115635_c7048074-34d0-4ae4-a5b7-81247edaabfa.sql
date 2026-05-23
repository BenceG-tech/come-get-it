-- Explicit restrictive INSERT policy on user_roles to prevent privilege escalation
-- Even though the ALL policy has WITH CHECK, add a defense-in-depth RESTRICTIVE policy
CREATE POLICY "Block non-admin inserts to user_roles"
ON public.user_roles
AS RESTRICTIVE
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Block non-admin updates to user_roles"
ON public.user_roles
AS RESTRICTIVE
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Block non-admin deletes from user_roles"
ON public.user_roles
AS RESTRICTIVE
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Revoke execute on has_role from anon/authenticated to satisfy linter;
-- it is used inside RLS policies which run with the policy owner's privileges.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated, public;