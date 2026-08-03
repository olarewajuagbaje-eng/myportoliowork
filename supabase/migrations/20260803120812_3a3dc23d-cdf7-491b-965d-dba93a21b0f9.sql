-- 1. Least privilege on functions
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.grant_admin_for_owner_email() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_leads_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.bump_comment_like_count(uuid, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.bump_comment_like_count(uuid, integer) TO service_role;

-- has_role is required by RLS policies evaluated as the signed-in role
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- 2. Comments: hide private columns from clients
REVOKE SELECT ON public.comments FROM anon, authenticated;
GRANT SELECT (id, post_id, parent_id, author_name, author_user_id, body, status, pinned, like_count, edited_at, created_at) ON public.comments TO anon;
GRANT SELECT (id, post_id, parent_id, author_name, author_email, author_user_id, body, status, pinned, like_count, edited_at, created_at) ON public.comments TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.comments TO authenticated;
GRANT ALL ON public.comments TO service_role;

-- 3. Like tables carry visitor fingerprints: server-only
DROP POLICY IF EXISTS "post_likes public read" ON public.post_likes;
DROP POLICY IF EXISTS "comment_likes public read" ON public.comment_likes;
REVOKE ALL ON public.post_likes FROM anon, authenticated;
REVOKE ALL ON public.comment_likes FROM anon, authenticated;
GRANT ALL ON public.post_likes TO service_role;
GRANT ALL ON public.comment_likes TO service_role;
CREATE POLICY "post_likes admin read" ON public.post_likes FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "comment_likes admin read" ON public.comment_likes FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 4. Newsletter subscribers: admin/service only
REVOKE ALL ON public.newsletter_subscribers FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.newsletter_subscribers TO authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;

-- 5. Leads: drop always-true policy, admin read only
DROP POLICY IF EXISTS "Service role can manage leads" ON public.leads;
REVOKE ALL ON public.leads FROM anon, authenticated;
GRANT SELECT ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;
CREATE POLICY "Admins read leads" ON public.leads FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 6. Tighten remaining public grants to read-only where appropriate
REVOKE INSERT, UPDATE, DELETE ON public.posts, public.categories, public.tags, public.post_tags, public.post_media, public.profiles FROM anon;
GRANT SELECT ON public.posts, public.categories, public.tags, public.post_tags, public.post_media, public.profiles TO anon;