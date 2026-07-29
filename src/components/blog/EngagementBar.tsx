import { useEffect, useState } from "react";
import { Heart, Bookmark, Link2, Share2, Linkedin, Twitter, Facebook, MessageCircle, Send, Mail, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

interface Props { postId: string; postTitle: string; postUrl: string; }

export default function EngagementBar({ postId, postTitle, postUrl }: Props) {
  const { user } = useAuth();
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    supabase.functions.invoke("engagement", { body: { action: "post_stats", post_id: postId } })
      .then(({ data }) => { if (data) { setLikes(data.likes); setLiked(data.liked); } });
    if (user) {
      supabase.from("post_bookmarks").select("id").eq("post_id", postId).eq("user_id", user.id).maybeSingle()
        .then(({ data }) => setBookmarked(!!data));
    }
  }, [postId, user]);

  const toggleLike = async () => {
    if (busy) return; setBusy(true);
    const { data, error } = await supabase.functions.invoke("engagement", { body: { action: "like_post", post_id: postId } });
    setBusy(false);
    if (error || !data) { toast.error("Couldn't register your like."); return; }
    setLikes(data.count); setLiked(data.liked);
  };

  const toggleBookmark = async () => {
    if (!user) { toast.info("Sign in to save bookmarks."); return; }
    if (bookmarked) {
      await supabase.from("post_bookmarks").delete().eq("post_id", postId).eq("user_id", user.id);
      setBookmarked(false);
    } else {
      const { error } = await supabase.from("post_bookmarks").insert({ post_id: postId, user_id: user.id });
      if (!error) setBookmarked(true);
    }
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(postUrl); setCopied(true); setTimeout(() => setCopied(false), 1500); toast.success("Link copied"); }
    catch { toast.error("Copy failed"); }
  };

  const enc = encodeURIComponent;
  const shares = [
    { name: "LinkedIn", icon: Linkedin, url: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(postUrl)}` },
    { name: "X", icon: Twitter, url: `https://twitter.com/intent/tweet?url=${enc(postUrl)}&text=${enc(postTitle)}` },
    { name: "Facebook", icon: Facebook, url: `https://www.facebook.com/sharer/sharer.php?u=${enc(postUrl)}` },
    { name: "WhatsApp", icon: MessageCircle, url: `https://wa.me/?text=${enc(postTitle + " " + postUrl)}` },
    { name: "Telegram", icon: Send, url: `https://t.me/share/url?url=${enc(postUrl)}&text=${enc(postTitle)}` },
    { name: "Email", icon: Mail, url: `mailto:?subject=${enc(postTitle)}&body=${enc(postUrl)}` },
  ];

  return (
    <div className="glass-card rounded-2xl p-3 flex items-center gap-1 flex-wrap">
      <button onClick={toggleLike} disabled={busy} aria-pressed={liked} aria-label="Like this post" className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${liked ? "bg-primary/20 text-primary" : "hover:bg-white/5"}`}>
        <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
        <span aria-live="polite" className="tabular-nums">{likes}</span>
      </button>
      <button onClick={toggleBookmark} aria-pressed={bookmarked} aria-label="Bookmark" className={`p-2 rounded-lg text-sm ${bookmarked ? "bg-secondary/20 text-secondary" : "hover:bg-white/5"}`}>
        <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-current" : ""}`} />
      </button>
      <button onClick={copy} aria-label="Copy link" className="p-2 rounded-lg text-sm hover:bg-white/5">
        {copied ? <Check className="w-4 h-4 text-secondary" /> : <Link2 className="w-4 h-4" />}
      </button>
      <div className="relative">
        <button onClick={() => setShareOpen((o) => !o)} aria-label="Share" aria-expanded={shareOpen} className="p-2 rounded-lg text-sm hover:bg-white/5 flex items-center gap-1">
          <Share2 className="w-4 h-4" /> <span className="hidden sm:inline text-xs">Share</span>
        </button>
        {shareOpen && (
          <div className="absolute right-0 top-full mt-2 glass-card rounded-xl p-2 min-w-[180px] z-20">
            {shares.map((s) => (
              <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" onClick={() => setShareOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-sm">
                <s.icon className="w-4 h-4 text-primary" /> {s.name}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
