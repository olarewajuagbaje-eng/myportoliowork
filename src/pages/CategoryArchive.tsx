import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, Clock } from "lucide-react";

interface Post { id: string; title: string; slug: string; summary: string | null; cover_image_url: string | null; published_at: string | null; reading_time_minutes: number | null; }

export default function CategoryArchive() {
  const { slug } = useParams();
  const [cat, setCat] = useState<{ id: string; name: string; description: string | null } | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const { data: c } = await supabase.from("categories").select("id,name,description").eq("slug", slug).maybeSingle();
      if (!c) { setLoading(false); return; }
      setCat(c);
      const { data: p } = await supabase.from("posts").select("id,title,slug,summary,cover_image_url,published_at,reading_time_minutes").eq("status", "published").eq("category_id", c.id).order("published_at", { ascending: false });
      setPosts((p ?? []) as Post[]); setLoading(false);
    })();
  }, [slug]);

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{cat ? `${cat.name} — Blog` : "Category"} | Agbaje Olarewaju</title>
        <meta name="description" content={cat?.description ?? `Articles in ${cat?.name ?? "this category"}`} />
        <link rel="canonical" href={`https://agbajeautomation.me/blog/category/${slug}`} />
      </Helmet>
      <Header />
      <main className="container mx-auto px-6 pt-32 pb-20">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"><ArrowLeft className="w-4 h-4" /> All posts</Link>
        {loading ? <p className="text-muted-foreground">Loading…</p> : !cat ? (
          <p className="text-muted-foreground">Category not found.</p>
        ) : (
          <>
            <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">Category</p>
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight">{cat.name}</h1>
            {cat.description && <p className="text-muted-foreground mt-3 max-w-2xl">{cat.description}</p>}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
              {posts.map((p) => (
                <Link key={p.id} to={`/blog/${p.slug}`} className="glass-card rounded-2xl overflow-hidden hover-lift group">
                  {p.cover_image_url && <div className="aspect-[16/9] bg-black/40 overflow-hidden"><img src={p.cover_image_url} alt={p.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform" /></div>}
                  <div className="p-6">
                    <h2 className="font-display font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{p.title}</h2>
                    {p.summary && <p className="text-sm text-muted-foreground line-clamp-3">{p.summary}</p>}
                    <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                      {p.published_at && <span>{format(new Date(p.published_at), "MMM d, yyyy")}</span>}
                      {p.reading_time_minutes && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {p.reading_time_minutes} min</span>}
                    </div>
                  </div>
                </Link>
              ))}
              {posts.length === 0 && <p className="text-muted-foreground">No posts in this category yet.</p>}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
