
-- ============ pipeline_stages ============
CREATE TABLE public.pipeline_stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL CHECK (kind IN ('lead','partner')),
  key text NOT NULL,
  label text NOT NULL,
  "order" integer NOT NULL DEFAULT 0,
  color text DEFAULT '#00bcd4',
  sla_days integer DEFAULT 7,
  win_probability numeric(4,2) DEFAULT 0,
  is_terminal boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(kind, key)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pipeline_stages TO authenticated;
GRANT ALL ON public.pipeline_stages TO service_role;
ALTER TABLE public.pipeline_stages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin manage pipeline_stages" ON public.pipeline_stages FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_pipeline_stages_updated BEFORE UPDATE ON public.pipeline_stages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- partners.stage_id
ALTER TABLE public.partners ADD COLUMN stage_id uuid REFERENCES public.pipeline_stages(id) ON DELETE SET NULL;

-- ============ pipeline_transitions ============
CREATE TABLE public.pipeline_transitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL CHECK (entity_type IN ('lead','partner')),
  entity_id uuid NOT NULL,
  from_stage_id uuid REFERENCES public.pipeline_stages(id) ON DELETE SET NULL,
  to_stage_id uuid REFERENCES public.pipeline_stages(id) ON DELETE SET NULL,
  by_user uuid,
  reason text,
  ai_suggested boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_pt_entity ON public.pipeline_transitions(entity_type, entity_id, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pipeline_transitions TO authenticated;
GRANT ALL ON public.pipeline_transitions TO service_role;
ALTER TABLE public.pipeline_transitions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin manage pipeline_transitions" ON public.pipeline_transitions FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============ pipeline_tasks ============
CREATE TABLE public.pipeline_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL CHECK (entity_type IN ('lead','partner')),
  entity_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  due_at timestamptz,
  owner uuid,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','done','cancelled')),
  source text NOT NULL DEFAULT 'manual' CHECK (source IN ('manual','ai','sla','voice','outreach')),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  completed_at timestamptz,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_ptasks_entity ON public.pipeline_tasks(entity_type, entity_id, status);
CREATE INDEX idx_ptasks_due ON public.pipeline_tasks(due_at) WHERE status IN ('open','in_progress');
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pipeline_tasks TO authenticated;
GRANT ALL ON public.pipeline_tasks TO service_role;
ALTER TABLE public.pipeline_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin manage pipeline_tasks" ON public.pipeline_tasks FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_ptasks_updated BEFORE UPDATE ON public.pipeline_tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ outreach_sequences ============
CREATE TABLE public.outreach_sequences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  kind text NOT NULL DEFAULT 'partner' CHECK (kind IN ('lead','partner')),
  steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  active boolean NOT NULL DEFAULT true,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.outreach_sequences TO authenticated;
GRANT ALL ON public.outreach_sequences TO service_role;
ALTER TABLE public.outreach_sequences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin manage outreach_sequences" ON public.outreach_sequences FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_oseq_updated BEFORE UPDATE ON public.outreach_sequences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ outreach_enrollments ============
CREATE TABLE public.outreach_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id uuid NOT NULL REFERENCES public.outreach_sequences(id) ON DELETE CASCADE,
  entity_type text NOT NULL CHECK (entity_type IN ('lead','partner')),
  entity_id uuid NOT NULL,
  current_step integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','paused','done','stopped')),
  stop_reason text,
  next_run_at timestamptz,
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_oe_next_run ON public.outreach_enrollments(next_run_at) WHERE status='active';
CREATE INDEX idx_oe_entity ON public.outreach_enrollments(entity_type, entity_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.outreach_enrollments TO authenticated;
GRANT ALL ON public.outreach_enrollments TO service_role;
ALTER TABLE public.outreach_enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin manage outreach_enrollments" ON public.outreach_enrollments FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_oe_updated BEFORE UPDATE ON public.outreach_enrollments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ outreach_events ============
CREATE TABLE public.outreach_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id uuid NOT NULL REFERENCES public.outreach_enrollments(id) ON DELETE CASCADE,
  step_index integer NOT NULL,
  channel text NOT NULL,
  status text NOT NULL DEFAULT 'sent' CHECK (status IN ('sent','opened','clicked','replied','bounced','failed','skipped')),
  subject text,
  body_preview text,
  external_id text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  sent_at timestamptz NOT NULL DEFAULT now(),
  opened_at timestamptz,
  clicked_at timestamptz,
  replied_at timestamptz
);
CREATE INDEX idx_oev_enrollment ON public.outreach_events(enrollment_id, sent_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.outreach_events TO authenticated;
GRANT ALL ON public.outreach_events TO service_role;
ALTER TABLE public.outreach_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin manage outreach_events" ON public.outreach_events FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============ entity_scores ============
CREATE TABLE public.entity_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL CHECK (entity_type IN ('lead','partner')),
  entity_id uuid NOT NULL,
  score integer NOT NULL CHECK (score BETWEEN 0 AND 100),
  reasons jsonb NOT NULL DEFAULT '[]'::jsonb,
  next_action text,
  model text,
  computed_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_es_entity ON public.entity_scores(entity_type, entity_id, computed_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.entity_scores TO authenticated;
GRANT ALL ON public.entity_scores TO service_role;
ALTER TABLE public.entity_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin manage entity_scores" ON public.entity_scores FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============ Seed pipeline stages ============
INSERT INTO public.pipeline_stages (kind,key,label,"order",color,sla_days,win_probability,is_terminal) VALUES
  ('lead','new','Új lead',1,'#00bcd4',2,0.10,false),
  ('lead','contacted','Kapcsolatfelvéve',2,'#3b82f6',5,0.25,false),
  ('lead','demo','Demó/megbeszélés',3,'#8b5cf6',7,0.45,false),
  ('lead','proposal','Ajánlat kiküldve',4,'#f59e0b',7,0.60,false),
  ('lead','won','Megnyert',5,'#10b981',0,1.00,true),
  ('lead','lost','Elveszett',6,'#6b7280',0,0.00,true),
  ('partner','onboarding','Onboarding',1,'#00bcd4',14,0.50,false),
  ('partner','active','Aktív',2,'#10b981',30,0.95,false),
  ('partner','at_risk','Veszélyben',3,'#f59e0b',7,0.40,false),
  ('partner','churned','Lemorzsolódott',4,'#ef4444',0,0.00,true);
