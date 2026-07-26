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

interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  body: string;
  cover_image_url: string | null;
  published_at: string | null;
  reading_time_minutes: number | null;
  meta_description: string | null;
  seo_title: string | null;
}

interface MediaItem {
  url: string;
  kind: "image" | "video";
  caption: string | null;
  alt: string | null;
}

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle()
      .then(async ({ data }) => {
        if (!data) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        setPost(data as Post);
        const { data: m } = await supabase
          .from("post_media")
          .select("url,kind,caption,alt")
          .eq("post_id", data.id)
          .order("sort_order");
        setMedia((m ?? []) as MediaItem[]);
        setLoading(false);
      });
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
            image: post.cover_image_url,
            author: { "@type": "Person", name: "Agbaje Olarewaju" },
          })}
        </script>
      </Helmet>
      <Header />
      <article className="container mx-auto px-6 pt-28 pb-20 max-w-3xl">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" /> All posts
        </Link>
        <h1 className="text-3xl md:text-5xl font-display font-bold tracking-tight mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
          {post.published_at && <span>{format(new Date(post.published_at), "MMMM d, yyyy")}</span>}
          {post.reading_time_minutes && (
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" /> {post.reading_time_minutes} min read
            </span>
          )}
        </div>
        {post.cover_image_url && (
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="w-full aspect-[16/9] object-cover rounded-2xl mb-10"
          />
        )}
        <div className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-a:text-primary prose-code:text-secondary prose-code:before:hidden prose-code:after:hidden">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
        </div>
        {media.length > 0 && (
          <div className="mt-12 space-y-6">
            {media.map((m, i) =>
              m.kind === "image" ? (
                <figure key={i}>
                  <img src={m.url} alt={m.alt ?? ""} className="w-full rounded-xl" />
                  {m.caption && <figcaption className="text-xs text-muted-foreground mt-2">{m.caption}</figcaption>}
                </figure>
              ) : (
                <figure key={i}>
                  <video src={m.url} controls className="w-full rounded-xl" />
                  {m.caption && <figcaption className="text-xs text-muted-foreground mt-2">{m.caption}</figcaption>}
                </figure>
              )
            )}
          </div>
        )}
      </article>
      <Footer />
    </div>
  );
}
