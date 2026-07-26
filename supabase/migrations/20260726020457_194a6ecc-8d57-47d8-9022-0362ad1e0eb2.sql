
-- Public read on post-images and post-videos
CREATE POLICY "Public read blog media"
ON storage.objects FOR SELECT
USING (bucket_id IN ('post-images','post-videos'));

-- Admin write
CREATE POLICY "Admins upload blog media"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id IN ('post-images','post-videos') AND public.has_role(auth.uid(),'admin'));

CREATE POLICY "Admins update blog media"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id IN ('post-images','post-videos') AND public.has_role(auth.uid(),'admin'));

CREATE POLICY "Admins delete blog media"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id IN ('post-images','post-videos') AND public.has_role(auth.uid(),'admin'));
