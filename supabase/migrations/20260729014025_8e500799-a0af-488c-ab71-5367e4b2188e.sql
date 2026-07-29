
REVOKE ALL ON FUNCTION public.bump_comment_like_count(UUID, INT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.bump_comment_like_count(UUID, INT) TO service_role;
