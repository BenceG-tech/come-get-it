
ALTER TABLE public.task_runs ADD COLUMN IF NOT EXISTS goal text;
ALTER TABLE public.task_runs ADD COLUMN IF NOT EXISTS iterations jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.task_runs ADD COLUMN IF NOT EXISTS human_prompt jsonb;
ALTER TABLE public.task_runs ADD COLUMN IF NOT EXISTS human_response jsonb;
ALTER TABLE public.task_runs ADD COLUMN IF NOT EXISTS tool_calls_count int NOT NULL DEFAULT 0;
ALTER TABLE public.task_runs ADD COLUMN IF NOT EXISTS max_iterations int NOT NULL DEFAULT 8;
ALTER TABLE public.task_runs ADD COLUMN IF NOT EXISTS final_summary text;
ALTER TABLE public.task_runs ADD COLUMN IF NOT EXISTS loop_kind text NOT NULL DEFAULT 'classic';
