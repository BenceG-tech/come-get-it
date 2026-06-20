
ALTER TABLE public.documents
  ADD COLUMN IF NOT EXISTS folder text,
  ADD COLUMN IF NOT EXISTS file_size_bytes bigint,
  ADD COLUMN IF NOT EXISTS mime_type text;

CREATE INDEX IF NOT EXISTS documents_folder_idx ON public.documents(folder);

DROP POLICY IF EXISTS "Admins read admin-docs" ON storage.objects;
CREATE POLICY "Admins read admin-docs" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'admin-docs' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins insert admin-docs" ON storage.objects;
CREATE POLICY "Admins insert admin-docs" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'admin-docs' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins update admin-docs" ON storage.objects;
CREATE POLICY "Admins update admin-docs" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'admin-docs' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'admin-docs' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins delete admin-docs" ON storage.objects;
CREATE POLICY "Admins delete admin-docs" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'admin-docs' AND public.has_role(auth.uid(), 'admin'));
