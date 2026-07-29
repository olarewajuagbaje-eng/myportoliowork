import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface P { id: string; slug: string; title: string; summary: string | null; cover_image_url: string | null; }

export default function RelatedArticles({ postId, categoryId }: { postId: string; categoryId: string | null }) {
  const [posts, setPosts] = useState<P[]>([]);
  useEffect(() => {
    (async () => {
      let q = supabase.from("posts").select("id,slug,title,summary,cover_image_url").eq("status", "published").neq("id", postId).order("published_at", { ascending: false }).limit(3);
      if (categoryId) q = q.eq("category_id", categoryId);
      const { data } = await q;
      setPosts((data ?? []) as P[]);
    })();
  }, [postId, categoryId]);
  if (posts.length === 0) return null;
  return (
    <section className="mt-16" aria-label="Related articles">
      <h2 className="text-2xl font-display font-bold mb-6">Related reading</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {posts.map((p) => (
          <Link key={p.id} to={`/blog/${p.slug}`} className="glass-card rounded-xl overflow-hidden hover-lift group">
            {p.cover_image_url && <div className="aspect-[16/9] bg-black/40 overflow-hidden"><img src={p.cover_image_url} alt="" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition" /></div>}
            <div className="p-4">
              <div className="font-display font-semibold mb-1 group-hover:text-primary transition line-clamp-2">{p.title}</div>
              {p.summary && <div className="text-xs text-muted-foreground line-clamp-2">{p.summary}</div>}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
