
-- Brand Memory: kulcs-érték tár brand DNS-hez (tone, personák, USP, founding offer, stb.)
CREATE TABLE public.brand_knowledge (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  label text,
  description text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.brand_knowledge TO authenticated;
GRANT ALL ON public.brand_knowledge TO service_role;

ALTER TABLE public.brand_knowledge ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage brand knowledge"
ON public.brand_knowledge FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER brand_knowledge_updated_at
BEFORE UPDATE ON public.brand_knowledge
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Aktivitás napló: ki módosított mit, mikor
CREATE TABLE public.activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  entity_label text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX activity_log_created_at_idx ON public.activity_log (created_at DESC);
CREATE INDEX activity_log_entity_idx ON public.activity_log (entity_type, entity_id);

GRANT SELECT, INSERT ON public.activity_log TO authenticated;
GRANT ALL ON public.activity_log TO service_role;

ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read activity"
ON public.activity_log FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated insert own activity"
ON public.activity_log FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Tartalom generációk: multi-format generátor outputjai + A/B variánsok + kedvencek
CREATE TABLE public.content_generations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt text NOT NULL,
  brief text,
  persona text,
  formats jsonb NOT NULL DEFAULT '[]'::jsonb,
  selected_variants jsonb NOT NULL DEFAULT '{}'::jsonb,
  brand_fit_score integer,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX content_generations_created_at_idx ON public.content_generations (created_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_generations TO authenticated;
GRANT ALL ON public.content_generations TO service_role;

ALTER TABLE public.content_generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage content generations"
ON public.content_generations FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER content_generations_updated_at
BEFORE UPDATE ON public.content_generations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed: alap brand_knowledge kulcsok (üresen, hogy az UI tudja listázni)
INSERT INTO public.brand_knowledge (key, label, description, value) VALUES
  ('tone_of_voice', 'Hangnem', 'Tegezős, energikus, tömör mondatok. Példák és tiltott szavak.', '{"examples":[],"avoid":[],"required_ctas":["Csatlakozom","Regisztrálok"]}'::jsonb),
  ('personas', 'Célközönség personák', 'Vendéglátós, italmárka, rewards partner — kinek írunk', '[]'::jsonb),
  ('founding_offer', 'Founding Partner ajánlat', 'A founding partner program lényege, árazás, USP-k', '{"summary":"","pricing":"","perks":[]}'::jsonb),
  ('usps', 'USP-k', 'Egyedi értékajánlatok, miben különbözünk', '[]'::jsonb),
  ('brand_facts', 'Brand tények', 'Domain, email, alapító, kapcsolat, social handle', '{"domain":"come-get-it.app","email":"hello@come-get-it.app","founder":"Bence Gátai","phone":"+36 70 585 2053","social":"@comegetit_app"}'::jsonb),
  ('content_pillars', 'Tartalom-pillérek', 'Fő témák a posztoláshoz', '[]'::jsonb)
ON CONFLICT (key) DO NOTHING;
