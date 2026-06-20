ALTER TABLE public.documents
  ADD COLUMN IF NOT EXISTS ai_review jsonb,
  ADD COLUMN IF NOT EXISTS last_reviewed_at timestamptz;

CREATE TABLE IF NOT EXISTS public.drive_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL,
  source_file_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
  source_file_names jsonb NOT NULL DEFAULT '[]'::jsonb,
  result jsonb,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.drive_analyses TO authenticated;
GRANT ALL ON public.drive_analyses TO service_role;
ALTER TABLE public.drive_analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "drive_analyses admin all" ON public.drive_analyses FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.drive_decisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic text,
  question text NOT NULL,
  answer text,
  source_file_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'open',
  decided_at timestamptz,
  decided_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.drive_decisions TO authenticated;
GRANT ALL ON public.drive_decisions TO service_role;
ALTER TABLE public.drive_decisions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "drive_decisions admin all" ON public.drive_decisions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));