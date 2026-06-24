INSERT INTO public.outreach_sequences (name, kind, description, steps, active)
SELECT 'Lead quick outreach', 'partner', 'Egy lépéses ad-hoc lead outreach (LeadOutreachModal által használt — nem szerkeszthető manuálisan).',
  '[{"day_offset":0,"channel":"email","subject":"","body":""}]'::jsonb, true
WHERE NOT EXISTS (SELECT 1 FROM public.outreach_sequences WHERE name='Lead quick outreach');