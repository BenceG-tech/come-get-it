
-- Extend partners
ALTER TABLE public.partners
  ADD COLUMN IF NOT EXISTS lead_score INT,
  ADD COLUMN IF NOT EXISTS score_reasons JSONB,
  ADD COLUMN IF NOT EXISTS score_updated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS assigned_to UUID,
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS lat NUMERIC,
  ADD COLUMN IF NOT EXISTS lng NUMERIC,
  ADD COLUMN IF NOT EXISTS google_place_id TEXT,
  ADD COLUMN IF NOT EXISTS rating NUMERIC,
  ADD COLUMN IF NOT EXISTS rating_count INT,
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS category TEXT;

CREATE INDEX IF NOT EXISTS idx_partners_status_score ON public.partners(status, lead_score DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_partners_city ON public.partners(city);
CREATE INDEX IF NOT EXISTS idx_partners_tags ON public.partners USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_partners_place ON public.partners(google_place_id) WHERE google_place_id IS NOT NULL;

-- Import jobs
CREATE TABLE IF NOT EXISTS public.lead_import_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  filename TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  total_rows INT DEFAULT 0,
  imported_rows INT DEFAULT 0,
  duplicate_rows INT DEFAULT 0,
  error_rows INT DEFAULT 0,
  errors JSONB DEFAULT '[]'::jsonb,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lead_import_jobs TO authenticated;
GRANT ALL ON public.lead_import_jobs TO service_role;
ALTER TABLE public.lead_import_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage import jobs" ON public.lead_import_jobs FOR ALL
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Email templates
CREATE TABLE IF NOT EXISTS public.email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body_md TEXT NOT NULL,
  variables JSONB DEFAULT '[]'::jsonb,
  category TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.email_templates TO authenticated;
GRANT ALL ON public.email_templates TO service_role;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage templates" ON public.email_templates FOR ALL
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_email_templates_updated BEFORE UPDATE ON public.email_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Sent emails log
CREATE TABLE IF NOT EXISTS public.partner_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.email_templates(id) ON DELETE SET NULL,
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body_html TEXT,
  status TEXT NOT NULL DEFAULT 'sent',
  resend_id TEXT,
  opened_at TIMESTAMPTZ,
  sent_by UUID,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.partner_emails TO authenticated;
GRANT ALL ON public.partner_emails TO service_role;
ALTER TABLE public.partner_emails ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage partner emails" ON public.partner_emails FOR ALL
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE INDEX IF NOT EXISTS idx_partner_emails_partner ON public.partner_emails(partner_id, sent_at DESC);

-- Seed initial templates
INSERT INTO public.email_templates (name, subject, body_md, category) VALUES
  ('Első megkeresés - vendéglátóhely', 'Csatlakozz a Come Get It Founding Partner programhoz', E'Kedves {{contact_name}}!\n\nGátai Bence vagyok, a Come Get It alapítója. A {{company_name}} helyét nézegettem és úgy érzem, tökéletesen passzolna az appunkhoz.\n\nA Come Get It egy fogyasztói app, ahol a felhasználók pontokat gyűjtenek, jutalmakat kapnak és jó ügyeket támogatnak. A Founding Partner programunkba most korlátozott számban várjuk a legjobb helyeket Magyarországról.\n\nMikor lenne 15 perced egy rövid hívásra?\n\nÜdv,\nBence\n+36 70 585 2053', 'outreach'),
  ('Emlékeztető - 1 hét után', 'Re: Come Get It partnerség', E'Szia {{contact_name}}!\n\nMúlt héten írtam a {{company_name}} kapcsán a Founding Partner programunkról. Tudom, sok dolgod van — csak gyors emlékeztető, hátha elcsúszott a postafiókodban.\n\nÉrdekel egy 15 perces beszélgetés?\n\nBence', 'followup'),
  ('Founding Partner ajánlat', 'Founding Partner ajánlat — Come Get It', E'Szia {{contact_name}}!\n\nKöszi a beszélgetést. Itt küldöm röviden a Founding Partner csomagunk részleteit:\n\n- 0% jutalék az első 6 hónapban\n- Kiemelt megjelenés az appban\n- Saját onboarding\n- Co-marketing kampányok\n\nMellékeltem a részletes dokumentumot. Várom a visszajelzésed!\n\nBence', 'offer')
ON CONFLICT DO NOTHING;
