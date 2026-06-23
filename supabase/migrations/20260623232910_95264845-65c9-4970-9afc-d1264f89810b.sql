
-- B6: content_briefs -> marketing_calendar auto-link
CREATE OR REPLACE FUNCTION public.content_briefs_sync_calendar()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_channel text;
  v_existing uuid;
BEGIN
  -- pick first channel from channel_mix (jsonb array), fallback 'instagram'
  v_channel := COALESCE(
    NULLIF((NEW.channel_mix->>0), ''),
    CASE WHEN jsonb_typeof(NEW.channel_mix) = 'array' AND jsonb_array_length(NEW.channel_mix) > 0
         THEN trim(both '"' from (NEW.channel_mix->0)::text) ELSE NULL END,
    'instagram'
  );

  IF NEW.scheduled_for IS NOT NULL THEN
    SELECT id INTO v_existing FROM public.marketing_calendar WHERE brief_id = NEW.id LIMIT 1;
    IF v_existing IS NULL THEN
      INSERT INTO public.marketing_calendar (
        scheduled_date, channel, type, title, status, brief_id, created_by
      ) VALUES (
        NEW.scheduled_for, v_channel, 'post', NEW.title, 'draft', NEW.id, NEW.created_by
      );
    ELSE
      UPDATE public.marketing_calendar
      SET scheduled_date = NEW.scheduled_for,
          title = NEW.title,
          updated_at = now()
      WHERE id = v_existing
        AND status IN ('idea','draft','ready');
    END IF;
  ELSIF TG_OP = 'UPDATE' AND OLD.scheduled_for IS NOT NULL AND NEW.scheduled_for IS NULL THEN
    DELETE FROM public.marketing_calendar
    WHERE brief_id = NEW.id AND status IN ('idea','draft');
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS content_briefs_sync_calendar_trg ON public.content_briefs;
CREATE TRIGGER content_briefs_sync_calendar_trg
AFTER INSERT OR UPDATE OF scheduled_for, title, channel_mix
ON public.content_briefs
FOR EACH ROW EXECUTE FUNCTION public.content_briefs_sync_calendar();

-- B8: marketing_calendar.published_at + streak sync
ALTER TABLE public.marketing_calendar
  ADD COLUMN IF NOT EXISTS published_at timestamptz;

CREATE OR REPLACE FUNCTION public.marketing_calendar_publish_streak()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user uuid;
  v_existing public.user_streaks%ROWTYPE;
  v_today date := current_date;
  v_dow int;
  v_monday date;
  v_new_streak int;
BEGIN
  -- Only act on transitions to 'posted'
  IF NEW.status::text <> 'posted' THEN RETURN NEW; END IF;
  IF TG_OP = 'UPDATE' AND OLD.status::text = 'posted' THEN RETURN NEW; END IF;

  -- Set published_at if missing
  IF NEW.published_at IS NULL THEN
    NEW.published_at := now();
  END IF;

  v_user := NEW.created_by;
  IF v_user IS NULL THEN RETURN NEW; END IF;

  v_dow := (EXTRACT(ISODOW FROM v_today)::int - 1);
  v_monday := v_today - v_dow;

  SELECT * INTO v_existing FROM public.user_streaks WHERE user_id = v_user;

  IF NOT FOUND THEN
    INSERT INTO public.user_streaks (user_id, current_streak, longest_streak, last_action_date, weekly_goal, weekly_progress, week_start)
    VALUES (v_user, 1, 1, v_today, 7, 1, v_monday);
    RETURN NEW;
  END IF;

  -- streak calc
  IF v_existing.last_action_date = v_today THEN
    v_new_streak := v_existing.current_streak;
  ELSIF v_existing.last_action_date = v_today - 1 THEN
    v_new_streak := COALESCE(v_existing.current_streak, 0) + 1;
  ELSE
    v_new_streak := 1;
  END IF;

  UPDATE public.user_streaks
  SET current_streak = v_new_streak,
      longest_streak = GREATEST(COALESCE(longest_streak, 0), v_new_streak),
      last_action_date = v_today,
      weekly_progress = CASE WHEN week_start = v_monday THEN COALESCE(weekly_progress, 0) + 1 ELSE 1 END,
      week_start = v_monday,
      updated_at = now()
  WHERE user_id = v_user;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS marketing_calendar_publish_streak_trg ON public.marketing_calendar;
CREATE TRIGGER marketing_calendar_publish_streak_trg
BEFORE INSERT OR UPDATE OF status
ON public.marketing_calendar
FOR EACH ROW EXECUTE FUNCTION public.marketing_calendar_publish_streak();

-- Realtime for user_streaks so DailyStreakBar can subscribe
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_streaks;
