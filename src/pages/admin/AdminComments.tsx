import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Check, EyeOff, Trash2, Pin } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  id: string; post_id: string; author_name: string; author_email: string | null;
  body: string; status: "pending" | "approved" | "hidden"; pinned: boolean;
  created_at: string; like_count: number;
  posts?: { title: string; slug: string } | null;
}

export default function AdminComments() {
  const [rows, setRows] = useState<Comment[]>([]);
  const [status, setStatus] = useState<"all" | "pending" | "approved" | "hidden">("all");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    let q = supabase
      .from("comments")
      .select("id, post_id, author_name, author_email, body, status, pinned, like_count, created_at, posts(title, slug)")
      .order("pinned", { ascending: false }).order("created_at", { ascending: false }).limit(200);
    if (status !== "all") q = q.eq("status", status);
    const { data } = await q;
    setRows((data ?? []) as any); setLoading(false);
  };
  useEffect(() => { load(); }, [status]);

  const setField = async (id: string, patch: Partial<Comment>) => {
    const { error } = await supabase.from("comments").update(patch).eq("id", id);
    if (error) toast.error(error.message); else load();
  };
  const del = async (id: string) => {
    if (!confirm("Delete comment?")) return;
    const { error } = await supabase.from("comments").delete().eq("id", id);
    if (error) toast.error(error.message); else load();
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-display font-bold mb-6">Comments</h1>
      <div className="flex gap-2 mb-4 text-sm">
        {(["all", "pending", "approved", "hidden"] as const).map((s) => (
          <button key={s} onClick={() => setStatus(s)} className={`px-3 py-1.5 rounded ${status === s ? "bg-primary/20 text-primary" : "hover:bg-white/5"}`}>{s}</button>
        ))}
      </div>
      {loading ? <Loader2 className="animate-spin" /> : rows.length === 0 ? (
        <p className="text-muted-foreground text-sm">No comments.</p>
      ) : (
        <div className="space-y-3">
          {rows.map((c) => (
            <div key={c.id} className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 flex-wrap">
                <span className="font-medium text-foreground">{c.author_name}</span>
                {c.author_email && <span>· {c.author_email}</span>}
                <span>· {formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}</span>
                <span className={`px-2 py-0.5 rounded ${c.status === "approved" ? "bg-secondary/20 text-secondary" : c.status === "pending" ? "bg-yellow-500/20 text-yellow-500" : "bg-white/10"}`}>{c.status}</span>
                {c.pinned && <span className="text-primary">📌 pinned</span>}
                <span>· ♥ {c.like_count}</span>
                {c.posts && <span>· <a href={`/blog/${c.posts.slug}#comments`} target="_blank" className="text-primary hover:underline">{c.posts.title}</a></span>}
              </div>
              <p className="text-sm whitespace-pre-wrap">{c.body}</p>
              <div className="flex gap-2 mt-3 text-xs">
                {c.status !== "approved" && <button onClick={() => setField(c.id, { status: "approved" })} className="flex items-center gap-1 px-2 py-1 rounded bg-secondary/20 text-secondary"><Check className="w-3 h-3" /> Approve</button>}
                {c.status !== "hidden" && <button onClick={() => setField(c.id, { status: "hidden" })} className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/5"><EyeOff className="w-3 h-3" /> Hide</button>}
                <button onClick={() => setField(c.id, { pinned: !c.pinned })} className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/5"><Pin className="w-3 h-3" /> {c.pinned ? "Unpin" : "Pin"}</button>
                <button onClick={() => del(c.id)} className="flex items-center gap-1 px-2 py-1 rounded text-destructive hover:bg-destructive/10"><Trash2 className="w-3 h-3" /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
