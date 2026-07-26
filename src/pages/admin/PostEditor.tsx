import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAuth } from "@/lib/auth";
import { Loader2, Upload, Image as ImageIcon, Video, X, ArrowLeft, Trash2 } from "lucide-react";

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

const SIGNED_EXPIRY = 60 * 60 * 24 * 365; // 1 year

interface MediaRow {
  id?: string;
  url: string;
  kind: "image" | "video";
  caption: string | null;
  alt: string | null;
  sort_order: number;
}

export default function PostEditor() {
  const { id } = useParams();
  const isNew = !id;
  const nav = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [body, setBody] = useState("");
  const [cover, setCover] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [seoTitle, setSeoTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [media, setMedia] = useState<MediaRow[]>([]);
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState<"write" | "preview">("write");

  useEffect(() => {
    if (isNew) return;
    supabase
      .from("posts")
      .select("*")
      .eq("id", id!)
      .maybeSingle()
      .then(async ({ data, error }) => {
        if (error || !data) { toast.error("Post not found"); nav("/admin"); return; }
        setTitle(data.title);
        setSlug(data.slug);
        setSummary(data.summary ?? "");
        setBody(data.body ?? "");
        setCover(data.cover_image_url ?? "");
        setStatus(data.status);
        setSeoTitle(data.seo_title ?? "");
        setMetaDesc(data.meta_description ?? "");
        const { data: m } = await supabase
          .from("post_media")
          .select("*")
          .eq("post_id", id!)
          .order("sort_order");
        setMedia((m ?? []) as MediaRow[]);
        setLoading(false);
      });
  }, [id, isNew, nav]);

  const uploadFile = async (file: File, kind: "image" | "video"): Promise<string | null> => {
    const bucket = kind === "image" ? "post-images" : "post-videos";
    const path = `${user!.id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, { cacheControl: "31536000" });
    if (error) { toast.error(error.message); return null; }
    const { data, error: se } = await supabase.storage.from(bucket).createSignedUrl(path, SIGNED_EXPIRY);
    if (se || !data?.signedUrl) { toast.error(se?.message ?? "Sign URL failed"); return null; }
    return data.signedUrl;
  };

  const onCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setUploading(true);
    const url = await uploadFile(f, "image");
    setUploading(false);
    if (url) setCover(url);
  };

  const onMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, kind: "image" | "video") => {
    const f = e.target.files?.[0]; if (!f) return;
    setUploading(true);
    const url = await uploadFile(f, kind);
    setUploading(false);
    if (url) setMedia((m) => [...m, { url, kind, caption: "", alt: "", sort_order: m.length }]);
    e.target.value = "";
  };

  const save = async (newStatus?: "draft" | "published") => {
    if (!title.trim()) return toast.error("Title required");
    const finalSlug = slug.trim() || slugify(title);
    const finalStatus = newStatus ?? status;
    const readingTime = Math.max(1, Math.round(body.split(/\s+/).length / 200));

    setSaving(true);
    const payload = {
      title: title.trim(),
      slug: finalSlug,
      summary: summary.trim() || null,
      body,
      cover_image_url: cover || null,
      status: finalStatus,
      seo_title: seoTitle.trim() || null,
      meta_description: metaDesc.trim() || null,
      reading_time_minutes: readingTime,
      author_id: user!.id,
      published_at: finalStatus === "published" ? new Date().toISOString() : null,
    };

    let postId = id;
    if (isNew) {
      const { data, error } = await supabase.from("posts").insert(payload).select("id").single();
      if (error) { setSaving(false); return toast.error(error.message); }
      postId = data.id;
    } else {
      const { error } = await supabase.from("posts").update(payload).eq("id", id!);
      if (error) { setSaving(false); return toast.error(error.message); }
    }

    // Replace media
    await supabase.from("post_media").delete().eq("post_id", postId!);
    if (media.length) {
      await supabase.from("post_media").insert(
        media.map((m, i) => ({
          post_id: postId!,
          url: m.url,
          kind: m.kind,
          caption: m.caption,
          alt: m.alt,
          sort_order: i,
        }))
      );
    }

    setStatus(finalStatus);
    setSaving(false);
    toast.success(finalStatus === "published" ? "Published" : "Saved as draft");
    if (isNew) nav(`/admin/posts/${postId}`);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-muted-foreground" /></div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Posts
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={() => save("draft")} disabled={saving} className="px-4 py-2 rounded-lg border border-white/10 text-sm hover:bg-white/5">
            Save draft
          </button>
          <button onClick={() => save("published")} disabled={saving} className="cta-glow px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground text-sm font-medium flex items-center gap-2">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />} Publish
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <input
          value={title}
          onChange={(e) => { setTitle(e.target.value); if (isNew || !slug) setSlug(slugify(e.target.value)); }}
          placeholder="Post title"
          className="w-full bg-transparent text-3xl md:text-4xl font-display font-bold focus:outline-none placeholder:text-muted-foreground/40"
        />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>/blog/</span>
          <input
            value={slug}
            onChange={(e) => setSlug(slugify(e.target.value))}
            className="bg-black/30 border border-white/10 rounded px-2 py-1 flex-1 max-w-sm focus:outline-none focus:border-primary/60"
          />
          <span className={`ml-auto px-2 py-0.5 rounded text-xs ${status === "published" ? "bg-secondary/20 text-secondary" : "bg-white/10"}`}>{status}</span>
        </div>

        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Short summary (shown on blog list and social previews)"
          rows={2}
          className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60"
        />

        {/* Cover */}
        <div className="glass-card rounded-2xl p-4">
          <label className="text-xs uppercase tracking-wider text-muted-foreground">Cover image</label>
          {cover ? (
            <div className="relative mt-2">
              <img src={cover} alt="cover" className="w-full aspect-[16/9] object-cover rounded-lg" />
              <button onClick={() => setCover("")} className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-black">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="mt-2 flex items-center justify-center gap-2 border border-dashed border-white/10 rounded-lg p-8 cursor-pointer hover:border-primary/40 text-sm text-muted-foreground">
              <Upload className="w-4 h-4" /> Upload cover image
              <input type="file" accept="image/*" className="hidden" onChange={onCoverUpload} />
            </label>
          )}
        </div>

        {/* Body */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="flex border-b border-white/5">
            {(["write", "preview"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 text-sm capitalize ${tab === t ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}
              >
                {t}
              </button>
            ))}
          </div>
          {tab === "write" ? (
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write in Markdown… (# heading, **bold**, [link](url), ```code```, lists, tables all supported)"
              rows={20}
              className="w-full bg-transparent px-5 py-4 font-mono text-sm focus:outline-none resize-y"
            />
          ) : (
            <div className="prose prose-invert max-w-none p-6">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{body || "*Nothing to preview yet.*"}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Extra media */}
        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Additional media (appended after body)</label>
            <div className="flex items-center gap-2">
              <label className="px-3 py-1.5 rounded-lg border border-white/10 text-xs cursor-pointer hover:bg-white/5 flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5" /> Image
                <input type="file" accept="image/*" className="hidden" onChange={(e) => onMediaUpload(e, "image")} />
              </label>
              <label className="px-3 py-1.5 rounded-lg border border-white/10 text-xs cursor-pointer hover:bg-white/5 flex items-center gap-1">
                <Video className="w-3.5 h-3.5" /> Video
                <input type="file" accept="video/*" className="hidden" onChange={(e) => onMediaUpload(e, "video")} />
              </label>
            </div>
          </div>
          {uploading && <p className="text-xs text-muted-foreground mb-2">Uploading…</p>}
          {media.length === 0 ? (
            <p className="text-xs text-muted-foreground">No extra media.</p>
          ) : (
            <div className="space-y-3">
              {media.map((m, i) => (
                <div key={i} className="flex gap-3 border border-white/5 rounded-lg p-3">
                  {m.kind === "image" ? (
                    <img src={m.url} alt="" className="w-24 h-24 object-cover rounded" />
                  ) : (
                    <video src={m.url} className="w-24 h-24 object-cover rounded" />
                  )}
                  <div className="flex-1 space-y-2">
                    <input
                      value={m.caption ?? ""}
                      onChange={(e) => setMedia((arr) => arr.map((x, idx) => idx === i ? { ...x, caption: e.target.value } : x))}
                      placeholder="Caption"
                      className="w-full text-sm bg-black/30 border border-white/10 rounded px-2 py-1 focus:outline-none"
                    />
                    <input
                      value={m.alt ?? ""}
                      onChange={(e) => setMedia((arr) => arr.map((x, idx) => idx === i ? { ...x, alt: e.target.value } : x))}
                      placeholder="Alt text"
                      className="w-full text-sm bg-black/30 border border-white/10 rounded px-2 py-1 focus:outline-none"
                    />
                  </div>
                  <button onClick={() => setMedia((arr) => arr.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SEO */}
        <details className="glass-card rounded-2xl p-4">
          <summary className="cursor-pointer text-sm font-medium">SEO settings</summary>
          <div className="mt-4 space-y-3">
            <input
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="SEO title (defaults to post title)"
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/60"
            />
            <textarea
              value={metaDesc}
              onChange={(e) => setMetaDesc(e.target.value)}
              placeholder="Meta description (defaults to summary)"
              rows={2}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/60"
            />
          </div>
        </details>
      </div>
    </div>
  );
}
