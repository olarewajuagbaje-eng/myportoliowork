-- Posts: split public/admin read so anon never evaluates has_role
DROP POLICY IF EXISTS "Published posts are public" ON public.posts;
CREATE POLICY "Published posts are public"
  ON public.posts FOR SELECT TO anon
  USING (status = 'published');
CREATE POLICY "Posts readable by signed-in"
  ON public.posts FOR SELECT TO authenticated
  USING (status = 'published' OR public.has_role(auth.uid(), 'admin'));

-- Comments: same split
DROP POLICY IF EXISTS "comments public read approved" ON public.comments;
CREATE POLICY "comments public read approved"
  ON public.comments FOR SELECT TO anon
  USING (status = 'approved');
CREATE POLICY "comments readable by signed-in"
  ON public.comments FOR SELECT TO authenticated
  USING (status = 'approved' OR public.has_role(auth.uid(), 'admin'));