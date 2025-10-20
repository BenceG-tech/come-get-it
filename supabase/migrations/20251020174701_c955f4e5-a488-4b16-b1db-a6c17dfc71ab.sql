-- Add new columns to venue_applications table for minimal enhancement
ALTER TABLE public.venue_applications 
ADD COLUMN venue_type text,
ADD COLUMN address_city text,
ADD COLUMN daily_customer_count text;

-- Add a comment to document the new fields
COMMENT ON COLUMN public.venue_applications.venue_type IS 'Type of venue (Étterem, Bár, Kávézó, etc.)';
COMMENT ON COLUMN public.venue_applications.address_city IS 'City where the venue is located';
COMMENT ON COLUMN public.venue_applications.daily_customer_count IS 'Estimated daily customer count range';