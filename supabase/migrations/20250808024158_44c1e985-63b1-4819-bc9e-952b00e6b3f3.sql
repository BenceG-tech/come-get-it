-- Create waitlist_signups table
CREATE TABLE IF NOT EXISTS public.waitlist_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_waitlist_signups_email ON public.waitlist_signups (email);
CREATE INDEX IF NOT EXISTS idx_waitlist_signups_created_at ON public.waitlist_signups (created_at);

-- Enable RLS and define minimal policies (insert-only from public)
ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'waitlist_signups' AND policyname = 'Allow anonymous inserts to waitlist_signups'
  ) THEN
    CREATE POLICY "Allow anonymous inserts to waitlist_signups"
    ON public.waitlist_signups
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);
  END IF;
END $$;

-- Trigger to maintain updated_at
DROP TRIGGER IF EXISTS trg_waitlist_signups_updated_at ON public.waitlist_signups;
CREATE TRIGGER trg_waitlist_signups_updated_at
BEFORE UPDATE ON public.waitlist_signups
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();


-- Create venue_applications table
CREATE TABLE IF NOT EXISTS public.venue_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  venue_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_venue_applications_email ON public.venue_applications (email);
CREATE INDEX IF NOT EXISTS idx_venue_applications_created_at ON public.venue_applications (created_at);

-- Enable RLS and allow public inserts only
ALTER TABLE public.venue_applications ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'venue_applications' AND policyname = 'Allow anonymous inserts to venue_applications'
  ) THEN
    CREATE POLICY "Allow anonymous inserts to venue_applications"
    ON public.venue_applications
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);
  END IF;
END $$;

-- Trigger to maintain updated_at
DROP TRIGGER IF EXISTS trg_venue_applications_updated_at ON public.venue_applications;
CREATE TRIGGER trg_venue_applications_updated_at
BEFORE UPDATE ON public.venue_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
