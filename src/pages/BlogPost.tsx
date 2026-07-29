import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, Clock } from "lucide-react";
import ReadingProgressBar from "@/components/blog/ReadingProgressBar";
import TableOfContents from "@/components/blog/TableOfContents";
import EngagementBar from "@/components/blog/EngagementBar";
import CommentsSection from "@/components/blog/CommentsSection";
import NewsletterInline from "@/components/blog/NewsletterInline";
import PrevNextArticles from "@/components/blog/PrevNextArticles";
import RelatedArticles from "@/components/blog/RelatedArticles";
import { CategoryTagChips, AuthorCard } from "@/components/blog/ArticleMeta";

interface Post {
  id: string; title: string; slug: string; summary: string | null; body: string;
  cover_image_url: string | null; published_at: string | null; updated_at: string | null;
  reading_time_minutes: number | null; meta_description: string | null; seo_title: string | null;
  category_id: string | null; author_id: string | null;
}
interface MediaItem { url: string; kind: "image" | "video"; caption: string | null; alt: string | null; }
interface Category { id: string; name: string; slug: string; }
interface Tag { id: string; name: string; slug: string; }
interface Author { display_name: string | null; avatar_url: string | null; bio: string | null; }

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const { data } = await supabase.from("posts").select("*").eq("slug", slug).eq("status", "published").maybeSingle();
      if (!data) { setNotFound(true); setLoading(false); return; }
      setPost(data as Post);
      const [{ data: m }, catRes, tagJoinRes, authorRes] = await Promise.all([
        supabase.from("post_media").select("url,kind,caption,alt").eq("post_id", data.id).order("sort_order"),
        data.category_id ? supabase.from("categories").select("id,name,slug").eq("id", data.category_id).maybeSingle() : Promise.resolve({ data: null }),
        supabase.from("post_tags").select("tag_id").eq("post_id", data.id),
        data.author_id ? supabase.from("profiles").select("display_name,avatar_url,bio").eq("id", data.author_id).maybeSingle() : Promise.resolve({ data: null }),
      ]);
      setMedia((m ?? []) as MediaItem[]);
      setCategory((catRes.data ?? null) as Category | null);
      setAuthor((authorRes.data ?? null) as Author | null);
      const tagIds = ((tagJoinRes.data ?? []) as any[]).map((r) => r.tag_id);
      if (tagIds.length > 0) {
        const { data: tg } = await supabase.from("tags").select("id,name,slug").in("id", tagIds);
        setTags((tg ?? []) as Tag[]);
      }
      setLoading(false);
    })();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  if (notFound || !post)
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-6 pt-32 pb-20 text-center">
          <h1 className="text-2xl font-display mb-4">Post not found</h1>
          <Link to="/blog" className="text-primary">← Back to blog</Link>
        </div>
      </div>
    );

  const canonical = `https://agbajeautomation.me/blog/${post.slug}`;
  const isHtml = /^\s*</.test(post.body);

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{post.seo_title || post.title} — Agbaje Olarewaju</title>
        <meta name="description" content={post.meta_description || post.summary || ""} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.meta_description || post.summary || ""} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="article" />
        {post.cover_image_url && <meta property="og:image" content={post.cover_image_url} />}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            datePublished: post.published_at,
            dateModified: post.updated_at,
            image: post.cover_image_url,
            author: { "@type": "Person", name: author?.display_name ?? "Agbaje Olarewaju" },
          })}
        </script>
      </Helmet>
      <ReadingProgressBar />
      <Header />
      <div className="container mx-auto px-6 pt-28 pb-20">
        <div className="flex gap-8 max-w-6xl mx-auto">
          <article className="flex-1 min-w-0 max-w-3xl mx-auto">
            <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
              <ArrowLeft className="w-4 h-4" /> Back to blog
            </Link>
            <h1 className="text-3xl md:text-5xl font-display font-bold tracking-tight mb-4">{post.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 flex-wrap">
              {post.published_at && <span>{format(new Date(post.published_at), "MMMM d, yyyy")}</span>}
              {post.reading_time_minutes && (
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {post.reading_time_minutes} min read</span>
              )}
              {post.updated_at && post.published_at && new Date(post.updated_at).getTime() - new Date(post.published_at).getTime() > 86400000 && (
                <span>· Updated {format(new Date(post.updated_at), "MMM d, yyyy")}</span>
              )}
            </div>
            <CategoryTagChips category={category} tags={tags} />
            <div className="my-6">
              <EngagementBar postId={post.id} postTitle={post.title} postUrl={canonical} />
            </div>
            {post.cover_image_url && (
              <img src={post.cover_image_url} alt={post.title} className="w-full aspect-[16/9] object-cover rounded-2xl mb-10" />
            )}
            <div id="article-body">
              {isHtml ? (
                <div
                  className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-a:text-primary prose-code:text-secondary prose-code:before:hidden prose-code:after:hidden"
                  dangerouslySetInnerHTML={{ __html: post.body }}
                />
              ) : (
                <div className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-a:text-primary prose-code:text-secondary prose-code:before:hidden prose-code:after:hidden">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
                </div>
              )}
            </div>
            {media.length > 0 && (
              <div className="mt-12 space-y-6">
                {media.map((m, i) => m.kind === "image" ? (
                  <figure key={i}><img src={m.url} alt={m.alt ?? ""} className="w-full rounded-xl" />{m.caption && <figcaption className="text-xs text-muted-foreground mt-2">{m.caption}</figcaption>}</figure>
                ) : (
                  <figure key={i}><video src={m.url} controls className="w-full rounded-xl" />{m.caption && <figcaption className="text-xs text-muted-foreground mt-2">{m.caption}</figcaption>}</figure>
                ))}
              </div>
            )}
            <AuthorCard author={author} />
            <div className="mt-8"><EngagementBar postId={post.id} postTitle={post.title} postUrl={canonical} /></div>
            <NewsletterInline source={`blog:${post.slug}`} />
            <RelatedArticles postId={post.id} categoryId={post.category_id} />
            <PrevNextArticles postId={post.id} publishedAt={post.published_at} />
            <CommentsSection postId={post.id} />
          </article>
          <TableOfContents />
        </div>
      </div>
      <Footer />
    </div>
  );
}
