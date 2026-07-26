import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { toast } from "sonner";
import { Edit3, Trash2, PlusCircle, ExternalLink } from "lucide-react";

interface Row {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  updated_at: string;
  published_at: string | null;
}

export default function AdminPosts() {
  const [posts, setPosts] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("id,title,slug,status,updated_at,published_at")
      .order("updated_at", { ascending: false });
    if (error) toast.error(error.message);
    setPosts((data ?? []) as Row[]);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const del = async (id: string) => {
    if (!confirm("Delete this post permanently?")) return;
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold">Posts</h1>
          <p className="text-sm text-muted-foreground">Manage your blog content.</p>
        </div>
        <Link
          to="/admin/posts/new"
          className="cta-glow px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground text-sm font-medium flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" /> New post
        </Link>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading…</p>
      ) : posts.length === 0 ? (
        <div className="glass-card p-10 rounded-2xl text-center">
          <p className="text-muted-foreground mb-4">No posts yet.</p>
          <Link to="/admin/posts/new" className="text-primary hover:underline">Write your first post →</Link>
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-white/5 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="text-left p-4">Title</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4 hidden md:table-cell">Updated</th>
                <th className="p-4 w-32"></th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                  <td className="p-4">
                    <div className="font-medium">{p.title}</div>
                    <div className="text-xs text-muted-foreground">/{p.slug}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-xs ${p.status === "published" ? "bg-secondary/20 text-secondary" : "bg-white/10 text-muted-foreground"}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 hidden md:table-cell text-muted-foreground">
                    {format(new Date(p.updated_at), "MMM d, yyyy")}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 justify-end">
                      {p.status === "published" && (
                        <Link to={`/blog/${p.slug}`} target="_blank" className="p-2 hover:text-primary" title="View">
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      )}
                      <Link to={`/admin/posts/${p.id}`} className="p-2 hover:text-primary" title="Edit">
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <button onClick={() => del(p.id)} className="p-2 hover:text-destructive" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
