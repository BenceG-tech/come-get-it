
CREATE TABLE public.task_runs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_signature text,
  task_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'running',
  steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  generated jsonb NOT NULL DEFAULT '[]'::jsonb,
  error text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.task_runs TO authenticated;
GRANT ALL ON public.task_runs TO service_role;
ALTER TABLE public.task_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage task_runs" ON public.task_runs FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER update_task_runs_updated_at BEFORE UPDATE ON public.task_runs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
ALTER PUBLICATION supabase_realtime ADD TABLE public.task_runs;
ALTER TABLE public.task_runs REPLICA IDENTITY FULL;
