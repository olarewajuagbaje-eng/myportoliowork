import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Clock } from "lucide-react";

interface Post {
  id: string; title: string; slug: string; summary: string | null;
  cover_image_url: string | null; published_at: string | null; reading_time_minutes: number | null;
  category_id: string | null;
}
interface Category { id: string; name: string; slug: string; }
interface Tag { id: string; name: string; slug: string; }

export default function BlogList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ data: p }, { data: c }, { data: t }] = await Promise.all([
        supabase.from("posts").select("id,title,slug,summary,cover_image_url,published_at,reading_time_minutes,category_id").eq("status", "published").order("published_at", { ascending: false }),
        supabase.from("categories").select("id,name,slug").order("name"),
        supabase.from("tags").select("id,name,slug").order("name").limit(30),
      ]);
      setPosts((p ?? []) as Post[]);
      setCats((c ?? []) as Category[]);
      setTags((t ?? []) as Tag[]);
      setLoading(false);
    })();
  }, []);

  const filtered = posts.filter((p) =>
    (!categoryId || p.category_id === categoryId) &&
    (!q || p.title.toLowerCase().includes(q.toLowerCase()) || (p.summary ?? "").toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Blog — Agbaje Olarewaju | AI Automation Insights</title>
        <meta name="description" content="Field notes on n8n, AI agents, and revenue automation architecture." />
        <link rel="canonical" href="https://agbajeautomation.me/blog" />
      </Helmet>
      <Header />
      <main className="container mx-auto px-6 pt-32 pb-20">
        <div className="max-w-3xl mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">Insights</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight">The Automation Journal</h1>
          <p className="text-muted-foreground mt-3">Field notes on n8n, AI agent orchestration, and revenue automation.</p>
          <input
            type="search" placeholder="Search posts…" value={q} onChange={(e) => setQ(e.target.value)}
            className="mt-6 w-full max-w-md bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary/60"
          />
        </div>

        {cats.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button onClick={() => setCategoryId(null)} className={`text-xs px-3 py-1.5 rounded-full ${!categoryId ? "bg-primary/20 text-primary" : "border border-white/10 text-muted-foreground hover:text-foreground"}`}>All</button>
            {cats.map((c) => (
              <button key={c.id} onClick={() => setCategoryId(c.id)} className={`text-xs px-3 py-1.5 rounded-full ${categoryId === c.id ? "bg-primary/20 text-primary" : "border border-white/10 text-muted-foreground hover:text-foreground"}`}>{c.name}</button>
            ))}
          </div>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-10">
            {tags.map((t) => (
              <Link key={t.id} to={`/blog/tag/${t.slug}`} className="text-[11px] px-2 py-1 rounded border border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20">#{t.name}</Link>
            ))}
          </div>
        )}

        {loading ? <p className="text-muted-foreground">Loading…</p> : filtered.length === 0 ? (
          <p className="text-muted-foreground">No posts match your filters.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <Link key={p.id} to={`/blog/${p.slug}`} className="glass-card rounded-2xl overflow-hidden hover-lift group">
                {p.cover_image_url && (
                  <div className="aspect-[16/9] overflow-hidden bg-black/40">
                    <img src={p.cover_image_url} alt={p.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
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
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
