ALTER TABLE public.task_runs
  ADD COLUMN IF NOT EXISTS recipe_type text,
  ADD COLUMN IF NOT EXISTS recipe_params jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS result_items jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS progress jsonb DEFAULT '{}'::jsonb;