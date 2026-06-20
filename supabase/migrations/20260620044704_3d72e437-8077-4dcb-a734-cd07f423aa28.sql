
CREATE TABLE IF NOT EXISTS public.checklist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'todo',
  notes TEXT,
  related_document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.checklist_items TO authenticated;
GRANT ALL ON public.checklist_items TO service_role;

ALTER TABLE public.checklist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage checklist" ON public.checklist_items FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_checklist_updated BEFORE UPDATE ON public.checklist_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS checklist_category_idx ON public.checklist_items(category, sort_order);

-- Seed the master checklist
INSERT INTO public.checklist_items (category, title, description, priority, sort_order) VALUES
-- Jogi
('Jogi', 'ÁSZF (Általános Szerződési Feltételek)', 'Az app használatára vonatkozó ÁSZF magyar nyelven, GDPR-konform.', 'high', 10),
('Jogi', 'Adatkezelési tájékoztató', 'GDPR adatkezelési tájékoztató: milyen adatokat kezelünk, miért, meddig.', 'high', 20),
('Jogi', 'Cookie szabályzat', 'Cookie banner + részletes cookie szabályzat oldal.', 'high', 30),
('Jogi', 'Partneri szerződés (vendéglátóhely)', 'Standard vendéglátóhely partneri szerződés sablon.', 'high', 40),
('Jogi', 'Rewards partner szerződés', 'Rewards partner standard szerződés sablon.', 'medium', 50),
('Jogi', 'Founding Partner megállapodás', 'Founding Partner exkluzív feltételek + ellenértékek.', 'high', 60),
('Jogi', 'Italmárka együttműködési szerződés', 'Italmárka brand partnership keretszerződés.', 'medium', 70),
('Jogi', 'Befektetői LOI / Term sheet', 'Standard letter of intent és term sheet sablon.', 'medium', 80),
('Jogi', 'Munkavállalói / freelancer szerződés', 'Csapattagokkal kötendő alap szerződés.', 'low', 90),
('Jogi', 'NDA sablon', 'Titoktartási megállapodás külső partnerekhez.', 'low', 100),

-- Partner sales
('Partner sales', '1-pager — vendéglátóhely', 'Rövid, 1 oldalas pitch vendéglátóhelyeknek.', 'high', 10),
('Partner sales', '1-pager — italmárka', 'Rövid, 1 oldalas pitch italmárkáknak.', 'high', 20),
('Partner sales', '1-pager — rewards partner', 'Rövid, 1 oldalas pitch rewards partnereknek.', 'high', 30),
('Partner sales', 'Hosszú pitch deck — vendéglátóhely', 'Részletes 2. körös pitch.', 'high', 40),
('Partner sales', 'Hosszú pitch deck — italmárka', 'Részletes 2. körös pitch.', 'medium', 50),
('Partner sales', 'Hosszú pitch deck — rewards partner', 'Részletes 2. körös pitch.', 'medium', 60),
('Partner sales', 'Cold email pack', 'Bevezető email sablonok partnertípusonként.', 'high', 70),
('Partner sales', 'Follow-up email sablonok', '2., 3., 4. körös email sablonok.', 'high', 80),
('Partner sales', 'IG DM sablonok', 'Specialty kávézó, bár, étterem DM kezdő üzenetek.', 'high', 90),
('Partner sales', 'WhatsApp sablonok', 'Gyors WhatsApp üzenet sablonok.', 'medium', 100),
('Partner sales', 'Objection handling guide', 'Gyakori ellenvetések és válaszok.', 'medium', 110),
('Partner sales', 'In-venue print kit', 'Asztali matrica, plakát, QR kártya nyomtatható verzió.', 'medium', 120),
('Partner sales', 'Onboarding playbook', 'Új partner első 30 napja lépésről lépésre.', 'high', 130),

-- App / termék
('App / termék', 'Felhasználói flow dokumentáció', 'Regisztrációtól a reward beváltásig minden képernyő.', 'high', 10),
('App / termék', 'Pontgyűjtés szabályai', 'Hány pont mit ér, hogyan jár, lejár-e.', 'high', 20),
('App / termék', 'Reward katalógus szabályok', 'Milyen rewardok lehetnek, hogy kerülnek be.', 'high', 30),
('App / termék', 'Admin folyamatok dokumentáció', 'Backoffice folyamatok admin oldalra.', 'medium', 40),
('App / termék', 'Roadmap (3, 6, 12 hó)', 'Fejlesztési roadmap időtávra bontva.', 'high', 50),
('App / termék', 'Hibakezelési playbook', 'Hibák, support eszkaláció.', 'medium', 60),
('App / termék', 'Push notification stratégia', 'Mikor, miért, milyen üzenetet küldünk.', 'low', 70),
('App / termék', 'App Store / Play Store leírások', 'Store optimalizált címek, leírások, kulcsszavak.', 'medium', 80),

-- Marketing
('Marketing', 'Launch terv', 'Indulási kampány lépésről lépésre.', 'high', 10),
('Marketing', 'Social content kalendárium', '4 hetes előre tervezett content terv.', 'high', 20),
('Marketing', 'Influencer / UGC stratégia', 'Kiket célzunk meg, milyen feltételekkel.', 'medium', 30),
('Marketing', 'Brand image guideline', 'Színek, fontok, tone of voice, képi világ.', 'high', 40),
('Marketing', 'Venue activation playbook', 'Hogyan aktiváljuk a partner helyszínt élőben.', 'medium', 50),
('Marketing', 'PR / sajtó pack', 'Sajtóközlemény, founder bio, képek.', 'medium', 60),
('Marketing', 'Referral / friend-invite mechanika', 'Felhasználói ajánlás rendszer leírása.', 'medium', 70),

-- Üzleti / befektetői
('Üzleti / befektetői', 'Master overview', 'Egyben minden, amit a Come Get It-ről tudni kell.', 'high', 10),
('Üzleti / befektetői', 'Pénzügyi terv (3 év)', '3 éves pénzügyi modell.', 'high', 20),
('Üzleti / befektetői', 'Unit economics', 'Egy user / egy venue gazdaságosság.', 'high', 30),
('Üzleti / befektetői', 'Growth stratégia', 'Hogyan skálázunk Budapestről tovább.', 'high', 40),
('Üzleti / befektetői', 'Versenytárs elemzés', 'Dusk és egyéb konkurensek SWOT.', 'medium', 50),
('Üzleti / befektetői', 'Milestone & KPI tábla', 'Mit, mikorra, hogyan mérünk.', 'high', 60),
('Üzleti / befektetői', 'Befektetői 1-pager', 'Tömör befektetői összefoglaló.', 'high', 70),
('Üzleti / befektetői', 'Cap table', 'Tulajdonosi szerkezet aktuális állapot.', 'medium', 80),

-- Operáció
('Operáció', 'Partner onboarding checklist', 'Új partner aktiválási checklist.', 'high', 10),
('Operáció', 'Support folyamatok', 'Hogyan kezelünk user/partner kérdéseket.', 'medium', 20),
('Operáció', 'Belső felelősségi lista (RACI)', 'Ki miért felel.', 'medium', 30),
('Operáció', 'Heti / havi riport sablon', 'Standard belső riport.', 'low', 40),
('Operáció', 'Eszközlista (SaaS, fiókok)', 'Minden használt eszköz + hozzáférés.', 'medium', 50),
('Operáció', 'Backup & biztonsági mentés terv', 'Adatmentés rendszer.', 'medium', 60),

-- GIVE / CSR
('GIVE / CSR', 'GIVE partner kiválasztás', 'Melyik jótékony szervezetekkel dolgozunk.', 'high', 10),
('GIVE / CSR', 'GIVE flow dokumentáció', 'Hogyan működik a felhasználói oldalról a felajánlás.', 'high', 20),
('GIVE / CSR', 'GIVE transzparencia riport sablon', 'Negyedéves közzétételi riport.', 'medium', 30);
