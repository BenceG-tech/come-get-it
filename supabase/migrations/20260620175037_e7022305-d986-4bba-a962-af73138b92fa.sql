CREATE TABLE public.drive_inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  mime_type TEXT,
  modified_time TIMESTAMPTZ,
  parent_id TEXT,
  previous_parents TEXT[],
  theme TEXT,
  age_signal TEXT,
  suggested_action TEXT,
  duplicate_group TEXT,
  ai_reason TEXT,
  archived BOOLEAN NOT NULL DEFAULT false,
  archived_at TIMESTAMPTZ,
  scanned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.drive_inventory TO authenticated;
GRANT ALL ON public.drive_inventory TO service_role;

ALTER TABLE public.drive_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage drive inventory"
ON public.drive_inventory FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER drive_inventory_updated_at
BEFORE UPDATE ON public.drive_inventory
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_drive_inventory_theme ON public.drive_inventory(theme);
CREATE INDEX idx_drive_inventory_action ON public.drive_inventory(suggested_action) WHERE NOT archived;