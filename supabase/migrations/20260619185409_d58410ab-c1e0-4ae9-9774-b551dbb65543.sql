
-- 1. Assign admin role to Bence
INSERT INTO public.user_roles (user_id, role)
VALUES ('b0898f87-e7e6-4ff6-9adb-15cd331604b8', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- 2. Enums
CREATE TYPE public.partner_type AS ENUM ('venue', 'drink_brand', 'rewards_partner', 'other');
CREATE TYPE public.partner_status AS ENUM ('lead', 'contacted', 'negotiating', 'proposal_sent', 'signed', 'rejected', 'paused');
CREATE TYPE public.interaction_channel AS ENUM ('email', 'instagram_dm', 'phone', 'in_person', 'whatsapp', 'other');
CREATE TYPE public.interaction_direction AS ENUM ('outbound', 'inbound');
CREATE TYPE public.document_category AS ENUM ('one_pager_venue', 'long_pitch_venue', 'drink_brand_deck', 'rewards_onboarding', 'email_template', 'social_post', 'ai_generated', 'other');
CREATE TYPE public.calendar_status AS ENUM ('idea', 'draft', 'ready', 'posted', 'cancelled');

-- 3. partners
CREATE TABLE public.partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type partner_type NOT NULL DEFAULT 'venue',
  company_name TEXT NOT NULL,
  city TEXT,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  instagram TEXT,
  website TEXT,
  status partner_status NOT NULL DEFAULT 'lead',
  next_followup_at TIMESTAMPTZ,
  notes TEXT,
  source TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.partners TO authenticated;
GRANT ALL ON public.partners TO service_role;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage partners" ON public.partners FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_partners_updated BEFORE UPDATE ON public.partners
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_partners_status ON public.partners(status);
CREATE INDEX idx_partners_type ON public.partners(type);
CREATE INDEX idx_partners_followup ON public.partners(next_followup_at);

-- 4. partner_interactions
CREATE TABLE public.partner_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  channel interaction_channel NOT NULL,
  direction interaction_direction NOT NULL DEFAULT 'outbound',
  summary TEXT NOT NULL,
  full_content TEXT,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.partner_interactions TO authenticated;
GRANT ALL ON public.partner_interactions TO service_role;
ALTER TABLE public.partner_interactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage interactions" ON public.partner_interactions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE INDEX idx_interactions_partner ON public.partner_interactions(partner_id, occurred_at DESC);

-- 5. documents
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category document_category NOT NULL DEFAULT 'other',
  partner_type partner_type,
  description TEXT,
  when_to_use TEXT,
  storage_path TEXT,
  content TEXT,
  is_ai_generated BOOLEAN NOT NULL DEFAULT false,
  related_partner_id UUID REFERENCES public.partners(id) ON DELETE SET NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.documents TO authenticated;
GRANT ALL ON public.documents TO service_role;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage documents" ON public.documents FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_documents_updated BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_documents_category ON public.documents(category);

-- 6. partner_documents_sent
CREATE TABLE public.partner_documents_sent (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  channel interaction_channel,
  notes TEXT,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.partner_documents_sent TO authenticated;
GRANT ALL ON public.partner_documents_sent TO service_role;
ALTER TABLE public.partner_documents_sent ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage documents sent" ON public.partner_documents_sent FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE INDEX idx_docsent_partner ON public.partner_documents_sent(partner_id, sent_at DESC);

-- 7. ai_conversations
CREATE TABLE public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT 'Új beszélgetés',
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_conversations TO authenticated;
GRANT ALL ON public.ai_conversations TO service_role;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage own conversations" ON public.ai_conversations FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') AND user_id = auth.uid())
  WITH CHECK (public.has_role(auth.uid(), 'admin') AND user_id = auth.uid());
CREATE TRIGGER trg_ai_conv_updated BEFORE UPDATE ON public.ai_conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 8. ai_messages
CREATE TABLE public.ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  message JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_messages TO authenticated;
GRANT ALL ON public.ai_messages TO service_role;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage own messages" ON public.ai_messages FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') AND EXISTS (
    SELECT 1 FROM public.ai_conversations c WHERE c.id = conversation_id AND c.user_id = auth.uid()
  ))
  WITH CHECK (public.has_role(auth.uid(), 'admin') AND EXISTS (
    SELECT 1 FROM public.ai_conversations c WHERE c.id = conversation_id AND c.user_id = auth.uid()
  ));
CREATE INDEX idx_ai_messages_conv ON public.ai_messages(conversation_id, created_at);

-- 9. marketing_calendar
CREATE TABLE public.marketing_calendar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheduled_date DATE NOT NULL,
  channel TEXT NOT NULL DEFAULT 'instagram',
  type TEXT NOT NULL DEFAULT 'post',
  title TEXT NOT NULL,
  content_draft TEXT,
  hashtags TEXT,
  status calendar_status NOT NULL DEFAULT 'idea',
  related_document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marketing_calendar TO authenticated;
GRANT ALL ON public.marketing_calendar TO service_role;
ALTER TABLE public.marketing_calendar ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage calendar" ON public.marketing_calendar FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_calendar_updated BEFORE UPDATE ON public.marketing_calendar
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_calendar_date ON public.marketing_calendar(scheduled_date);
