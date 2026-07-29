import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MessageCircle, Heart, Pin, Reply, Edit2, Trash2, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  id: string; post_id: string; parent_id: string | null;
  author_name: string; body: string; like_count: number;
  pinned: boolean; created_at: string; edited_at: string | null;
  status: string;
}

const secretsKey = (id: string) => `cmt_secret_${id}`;

export default function CommentsSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState(() => localStorage.getItem("cmt_name") ?? "");
  const [email, setEmail] = useState(() => localStorage.getItem("cmt_email") ?? "");
  const [body, setBody] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBody, setEditBody] = useState("");

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("comments").select("*").eq("post_id", postId).eq("status", "approved").order("pinned", { ascending: false }).order("created_at");
    setComments((data ?? []) as Comment[]);
    setLoading(false);
  };
  useEffect(() => { load(); }, [postId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !body.trim()) { toast.error("Name and comment are required"); return; }
    setSubmitting(true);
    const { data, error } = await supabase.functions.invoke("engagement", {
      body: { action: "add_comment", post_id: postId, parent_id: replyTo, name, email, body, honeypot },
    });
    setSubmitting(false);
    if (error || data?.error) { toast.error(data?.error ?? "Couldn't post your comment."); return; }
    localStorage.setItem("cmt_name", name);
    if (email) localStorage.setItem("cmt_email", email);
    if (data?.edit_secret && data?.comment?.id) localStorage.setItem(secretsKey(data.comment.id), data.edit_secret);
    setBody(""); setReplyTo(null);
    toast.success("Comment posted");
    load();
  };

  const like = async (id: string) => {
    const { data } = await supabase.functions.invoke("engagement", { body: { action: "like_comment", comment_id: id } });
    if (data?.count != null) setComments((c) => c.map((x) => x.id === id ? { ...x, like_count: data.count } : x));
  };

  const startEdit = (c: Comment) => { setEditingId(c.id); setEditBody(c.body); };
  const submitEdit = async (id: string) => {
    const secret = localStorage.getItem(secretsKey(id));
    if (!secret) { toast.error("Edit window expired"); return; }
    const { data, error } = await supabase.functions.invoke("engagement", { body: { action: "edit_comment", comment_id: id, body: editBody, edit_secret: secret } });
    if (error || data?.error) { toast.error(data?.error ?? "Edit failed"); return; }
    setEditingId(null); load();
  };
  const remove = async (id: string) => {
    const secret = localStorage.getItem(secretsKey(id));
    if (!secret) { toast.error("You can only delete your own comments within 15 minutes"); return; }
    if (!confirm("Delete this comment?")) return;
    const { data, error } = await supabase.functions.invoke("engagement", { body: { action: "delete_comment", comment_id: id, edit_secret: secret } });
    if (error || data?.error) { toast.error(data?.error ?? "Delete failed"); return; }
    localStorage.removeItem(secretsKey(id));
    load();
  };

  const roots = comments.filter((c) => !c.parent_id);
  const childrenOf = (id: string) => comments.filter((c) => c.parent_id === id);

  const renderComment = (c: Comment, depth = 0) => {
    const mine = !!localStorage.getItem(secretsKey(c.id));
    const canEdit = mine && (Date.now() - new Date(c.created_at).getTime() < 15 * 60_000);
    const isEditing = editingId === c.id;
    return (
      <div key={c.id} className={`glass-card rounded-xl p-4 ${depth > 0 ? "ml-4 md:ml-8" : ""}`}>
        <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{c.author_name}</span>
          <span>· {formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}</span>
          {c.edited_at && <span>· edited</span>}
          {c.pinned && <span className="flex items-center gap-1 text-primary"><Pin className="w-3 h-3" /> pinned</span>}
        </div>
        {isEditing ? (
          <>
            <textarea value={editBody} onChange={(e) => setEditBody(e.target.value)} rows={3} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm" />
            <div className="flex gap-2 mt-2">
              <button onClick={() => submitEdit(c.id)} className="px-3 py-1 rounded bg-primary text-primary-foreground text-xs">Save</button>
              <button onClick={() => setEditingId(null)} className="px-3 py-1 rounded text-xs text-muted-foreground">Cancel</button>
            </div>
          </>
        ) : (
          <p className="text-sm whitespace-pre-wrap">{c.body}</p>
        )}
        <div className="flex items-center gap-3 mt-3 text-xs">
          <button onClick={() => like(c.id)} className="flex items-center gap-1 text-muted-foreground hover:text-primary"><Heart className="w-3.5 h-3.5" /> {c.like_count}</button>
          {depth < 2 && <button onClick={() => setReplyTo(c.id)} className="flex items-center gap-1 text-muted-foreground hover:text-foreground"><Reply className="w-3.5 h-3.5" /> Reply</button>}
          {canEdit && <button onClick={() => startEdit(c)} className="flex items-center gap-1 text-muted-foreground hover:text-foreground"><Edit2 className="w-3.5 h-3.5" /> Edit</button>}
          {mine && <button onClick={() => remove(c.id)} className="flex items-center gap-1 text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /> Delete</button>}
        </div>
        {childrenOf(c.id).length > 0 && (
          <div className="mt-3 space-y-3">
            {childrenOf(c.id).map((ch) => renderComment(ch, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="mt-16" id="comments" aria-label="Comments">
      <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-primary" /> Comments <span className="text-sm text-muted-foreground font-normal">({comments.length})</span>
      </h2>
      <form onSubmit={submit} className="glass-card rounded-2xl p-4 mb-8 space-y-3">
        {replyTo && (
          <div className="text-xs text-muted-foreground flex items-center justify-between">
            <span>Replying to a comment</span>
            <button type="button" onClick={() => setReplyTo(null)} className="text-primary">Cancel</button>
          </div>
        )}
        <div className="grid sm:grid-cols-2 gap-3">
          <input aria-label="Your name" required maxLength={80} placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/60" />
          <input aria-label="Your email" type="email" placeholder="Email (optional, not published)" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/60" />
        </div>
        <textarea aria-label="Comment" required maxLength={4000} rows={3} placeholder="Share your thoughts…" value={body} onChange={(e) => setBody(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/60" />
        <input type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} className="hidden" aria-hidden />
        <div className="flex justify-end">
          <button disabled={submitting} className="cta-glow px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground text-sm font-medium flex items-center gap-2 active:scale-95">
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />} Post comment
          </button>
        </div>
      </form>

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading comments…</p>
      ) : roots.length === 0 ? (
        <p className="text-muted-foreground text-sm">Be the first to comment.</p>
      ) : (
        <div className="space-y-4">{roots.map((c) => renderComment(c))}</div>
      )}
    </section>
  );
}
