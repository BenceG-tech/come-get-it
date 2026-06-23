ALTER TABLE public.partners
  ADD COLUMN IF NOT EXISTS lead_grade text,
  ADD COLUMN IF NOT EXISTS lead_grade_source text DEFAULT 'auto',
  ADD COLUMN IF NOT EXISTS lead_grade_computed_at timestamptz;

ALTER TABLE public.partners
  DROP CONSTRAINT IF EXISTS partners_lead_grade_check;
ALTER TABLE public.partners
  ADD CONSTRAINT partners_lead_grade_check CHECK (lead_grade IS NULL OR lead_grade IN ('A','B','C','D'));

ALTER TABLE public.partners
  DROP CONSTRAINT IF EXISTS partners_lead_grade_source_check;
ALTER TABLE public.partners
  ADD CONSTRAINT partners_lead_grade_source_check CHECK (lead_grade_source IN ('auto','ai'));

CREATE OR REPLACE FUNCTION public.compute_lead_grade_from_score(score numeric)
RETURNS text
LANGUAGE sql IMMUTABLE
SET search_path = public
AS $$
  SELECT CASE
    WHEN score IS NULL THEN NULL
    WHEN score >= 80 THEN 'A'
    WHEN score >= 60 THEN 'B'
    WHEN score >= 40 THEN 'C'
    ELSE 'D'
  END;
$$;

CREATE OR REPLACE FUNCTION public.partners_auto_lead_grade()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (TG_OP = 'INSERT' OR NEW.ai_score IS DISTINCT FROM OLD.ai_score)
     AND COALESCE(NEW.lead_grade_source, 'auto') <> 'ai' THEN
    NEW.lead_grade := public.compute_lead_grade_from_score(NEW.ai_score);
    NEW.lead_grade_source := 'auto';
    NEW.lead_grade_computed_at := now();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS partners_auto_lead_grade_trg ON public.partners;
CREATE TRIGGER partners_auto_lead_grade_trg
  BEFORE INSERT OR UPDATE OF ai_score ON public.partners
  FOR EACH ROW EXECUTE FUNCTION public.partners_auto_lead_grade();

UPDATE public.partners
SET lead_grade = public.compute_lead_grade_from_score(ai_score),
    lead_grade_source = 'auto',
    lead_grade_computed_at = now()
WHERE ai_score IS NOT NULL AND (lead_grade IS NULL OR lead_grade_source = 'auto');