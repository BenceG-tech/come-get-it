-- Remove anonymous INSERT policies that allow direct REST API abuse
DROP POLICY IF EXISTS "Allow anonymous inserts to waitlist_signups" ON public.waitlist_signups;
DROP POLICY IF EXISTS "Allow anonymous inserts to venue_applications" ON public.venue_applications;

-- Create rate limiting table for anti-abuse protection
CREATE TABLE IF NOT EXISTS public.lead_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  ip_address TEXT,
  request_type TEXT NOT NULL, -- 'user_signup' or 'venue_application'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on the rate limiting table
ALTER TABLE public.lead_requests ENABLE ROW LEVEL SECURITY;

-- Create index for efficient rate limiting queries
CREATE INDEX IF NOT EXISTS idx_lead_requests_email_created_at ON public.lead_requests(email, created_at);
CREATE INDEX IF NOT EXISTS idx_lead_requests_ip_created_at ON public.lead_requests(ip_address, created_at);

-- No public policies on lead_requests - only service role can access