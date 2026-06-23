
CREATE TABLE public.user_streaks (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak integer NOT NULL DEFAULT 0,
  longest_streak integer NOT NULL DEFAULT 0,
  last_action_date date,
  weekly_goal integer NOT NULL DEFAULT 7,
  weekly_progress integer NOT NULL DEFAULT 0,
  week_start date,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_streaks TO authenticated;
GRANT ALL ON public.user_streaks TO service_role;

ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own streak"
  ON public.user_streaks
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER user_streaks_set_updated_at
  BEFORE UPDATE ON public.user_streaks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
