import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface P { id: string; slug: string; title: string; published_at: string | null; }

export default function PrevNextArticles({ postId, publishedAt }: { postId: string; publishedAt: string | null }) {
  const [prev, setPrev] = useState<P | null>(null);
  const [next, setNext] = useState<P | null>(null);

  useEffect(() => {
    if (!publishedAt) return;
    (async () => {
      const [{ data: p }, { data: n }] = await Promise.all([
        supabase.from("posts").select("id,slug,title,published_at").eq("status", "published").lt("published_at", publishedAt).order("published_at", { ascending: false }).limit(1).maybeSingle(),
        supabase.from("posts").select("id,slug,title,published_at").eq("status", "published").gt("published_at", publishedAt).order("published_at", { ascending: true }).limit(1).maybeSingle(),
      ]);
      setPrev(p as P | null); setNext(n as P | null);
    })();
  }, [postId, publishedAt]);

  if (!prev && !next) return null;
  return (
    <nav className="mt-12 grid sm:grid-cols-2 gap-4" aria-label="Previous and next article">
      {prev ? (
        <Link to={`/blog/${prev.slug}`} className="glass-card rounded-xl p-4 hover-lift group">
          <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1"><ArrowLeft className="w-3 h-3" /> Previous</div>
          <div className="font-display font-semibold group-hover:text-primary transition-colors">{prev.title}</div>
        </Link>
      ) : <div />}
      {next ? (
        <Link to={`/blog/${next.slug}`} className="glass-card rounded-xl p-4 hover-lift group text-right">
          <div className="text-xs text-muted-foreground flex items-center gap-1 justify-end mb-1">Next <ArrowRight className="w-3 h-3" /></div>
          <div className="font-display font-semibold group-hover:text-primary transition-colors">{next.title}</div>
        </Link>
      ) : <div />}
    </nav>
  );
}
