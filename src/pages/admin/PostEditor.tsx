import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { Loader2, ArrowLeft, Upload, X, Eye, EyeOff } from "lucide-react";
import RichEditor from "@/components/editor/RichEditor";
import SEOSidebar, { SEOData } from "@/components/editor/SEOSidebar";
import AIAssistant from "@/components/editor/AIAssistant";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

const SIGNED_EXPIRY = 60 * 60 * 24 * 365;

const looksLikeHtml = (s: string) => /^\s*</.test(s);

const mdToHtmlPlaceholder = (md: string) => md; // Tiptap handles HTML; keep legacy MD as-is until user re-saves.

function stripHtml(html: string) {
  if (typeof document === "undefined") return html.replace(/<[^>]+>/g, " ");
  const d = document.createElement("div");
  d.innerHTML = html;
  return d.textContent || "";
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
  const [legacyMarkdown, setLegacyMarkdown] = useState<string | null>(null);
  const [cover, setCover] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [autoSavedAt, setAutoSavedAt] = useState<Date | null>(null);
  const bodyRef = useRef(body);
  bodyRef.current = body;

  const [seo, setSeo] = useState<SEOData>({
    seoTitle: "", metaDesc: "", slug: "", focusKeyword: "", canonicalUrl: "",
    ogImage: "", ogTitle: "", twitterCard: "summary_large_image",
    robots: "index,follow", schemaType: "Article",
  });
  const updateSeo = (patch: Partial<SEOData>) => setSeo((s) => ({ ...s, ...patch }));

  useEffect(() => { updateSeo({ slug }); }, [slug]);
  useEffect(() => { if (cover && !seo.ogImage) updateSeo({ ogImage: cover }); }, [cover]);

  useEffect(() => {
    if (isNew) return;
    supabase.from("posts").select("*").eq("id", id!).maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) { toast.error("Post not found"); nav("/admin"); return; }
        setTitle(data.title);
        setSlug(data.slug);
        setSummary(data.summary ?? "");
        const b = data.body ?? "";
        if (b && !looksLikeHtml(b)) {
          setLegacyMarkdown(b);
          setBody("");
        } else {
          setBody(b);
        }
        setCover(data.cover_image_url ?? "");
        setStatus(data.status);
        setSeo((s) => ({
          ...s,
          seoTitle: data.seo_title ?? "",
          metaDesc: data.meta_description ?? "",
          slug: data.slug,
        }));
        setLoading(false);
      });
  }, [id, isNew, nav]);

  const uploadFile = useCallback(async (file: File, kind: "image" | "video" = "image"): Promise<string | null> => {
    if (!user) return null;
    const bucket = kind === "image" ? "post-images" : "post-videos";
    const path = `${user.id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, { cacheControl: "31536000" });
    if (error) { toast.error(error.message); return null; }
    const { data, error: se } = await supabase.storage.from(bucket).createSignedUrl(path, SIGNED_EXPIRY);
    if (se || !data?.signedUrl) { toast.error(se?.message ?? "Sign URL failed"); return null; }
    return data.signedUrl;
  }, [user]);

  const onCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setUploading(true);
    const url = await uploadFile(f);
    setUploading(false);
    if (url) setCover(url);
  };

  const migrateLegacy = () => {
    if (!legacyMarkdown) return;
    // Convert markdown into HTML by rendering off-screen via a temporary container
    // (react-markdown output). For simplicity, we wrap in a <div> and let Tiptap parse.
    // A basic pass: preserve paragraphs; user can re-format in the editor.
    const html = legacyMarkdown
      .split(/\n{2,}/)
      .map((p) => `<p>${p.replace(/\n/g, "<br/>")}</p>`)
      .join("");
    setBody(html);
    setLegacyMarkdown(null);
    toast.success("Legacy content loaded — formatting preserved as paragraphs");
  };

  const save = async (newStatus?: "draft" | "published", silent = false) => {
    if (!title.trim()) { if (!silent) toast.error("Title required"); return; }
    const finalSlug = slug.trim() || slugify(title);
    const finalStatus = newStatus ?? status;
    const plain = stripHtml(body);
    const readingTime = Math.max(1, Math.round(plain.split(/\s+/).filter(Boolean).length / 200));

    if (!silent) setSaving(true);
    const payload = {
      title: title.trim(),
      slug: finalSlug,
      summary: summary.trim() || null,
      body,
      cover_image_url: cover || null,
      status: finalStatus,
      seo_title: seo.seoTitle.trim() || null,
      meta_description: seo.metaDesc.trim() || null,
      reading_time_minutes: readingTime,
      author_id: user!.id,
      published_at: finalStatus === "published" ? new Date().toISOString() : null,
    };

    let postId = id;
    if (isNew) {
      const { data, error } = await supabase.from("posts").insert(payload).select("id").single();
      if (error) { if (!silent) { setSaving(false); toast.error(error.message); } return; }
      postId = data.id;
    } else {
      const { error } = await supabase.from("posts").update(payload).eq("id", id!);
      if (error) { if (!silent) { setSaving(false); toast.error(error.message); } return; }
    }

    setStatus(finalStatus);
    if (!silent) {
      setSaving(false);
      toast.success(finalStatus === "published" ? "Published" : "Saved");
    }
    setAutoSavedAt(new Date());
    if (isNew && postId) nav(`/admin/posts/${postId}`);
  };

  // Auto-save every 30s when editing existing posts
  useEffect(() => {
    if (isNew || !title) return;
    const t = setInterval(() => { save(status, true); }, 30000);
    return () => clearInterval(t);
  }, [isNew, title, status, body, summary, cover, seo]);

  const getContext = () => {
    const sel = typeof window !== "undefined" ? window.getSelection()?.toString() ?? "" : "";
    return { selection: sel, body: stripHtml(bodyRef.current), title };
  };

  const onReplaceSelection = (text: string) => {
    // Basic strategy: append when nothing is selected; otherwise wrap in paragraph
    const sel = typeof window !== "undefined" ? window.getSelection()?.toString() ?? "" : "";
    if (!sel) {
      setBody((b) => b + `<p>${text.replace(/\n{2,}/g, "</p><p>").replace(/\n/g, "<br/>")}</p>`);
    } else {
      // Let user paste manually — we surface the AI text below the editor
      setBody((b) => b + `<blockquote><p>${text}</p></blockquote>`);
    }
  };

  const onAppend = (text: string) => {
    setBody((b) => b + text.split(/\n{2,}/).map((p) => `<p>${p.replace(/\n/g, "<br/>")}</p>`).join(""));
  };

  const onSetField = (field: "seo_title" | "meta_description", value: string) => {
    if (field === "seo_title") updateSeo({ seoTitle: value });
    else updateSeo({ metaDesc: value });
    toast.success("Applied to SEO");
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-muted-foreground" /></div>;

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Posts
        </Link>
        <div className="flex items-center gap-3">
          {autoSavedAt && <span className="text-xs text-muted-foreground hidden sm:inline">Auto-saved {autoSavedAt.toLocaleTimeString()}</span>}
          <button onClick={() => setShowPreview((p) => !p)} className="px-3 py-2 rounded-lg border border-white/10 text-sm hover:bg-white/5 flex items-center gap-1.5">
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="hidden sm:inline">{showPreview ? "Edit" : "Preview"}</span>
          </button>
          <button onClick={() => save("draft")} disabled={saving} className="px-4 py-2 rounded-lg border border-white/10 text-sm hover:bg-white/5">
            Save draft
          </button>
          <button onClick={() => save("published")} disabled={saving} className="cta-glow px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground text-sm font-medium flex items-center gap-2">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />} Publish
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-4 min-w-0">
          <input
            value={title}
            onChange={(e) => { setTitle(e.target.value); if (isNew || !slug) setSlug(slugify(e.target.value)); }}
            placeholder="Post title"
            className="w-full bg-transparent text-3xl md:text-4xl font-display font-bold focus:outline-none placeholder:text-muted-foreground/40"
          />
          <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
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
                <Upload className="w-4 h-4" /> {uploading ? "Uploading…" : "Upload cover image"}
                <input type="file" accept="image/*" className="hidden" onChange={onCoverUpload} />
              </label>
            )}
          </div>

          {legacyMarkdown !== null && (
            <div className="glass-card rounded-2xl p-4 border-yellow-500/30">
              <p className="text-sm text-yellow-500 mb-2">This post uses the legacy Markdown editor.</p>
              <p className="text-xs text-muted-foreground mb-3">Import it into the new rich editor to keep formatting editable. The blog will keep rendering the current Markdown until you save with the new editor.</p>
              <div className="flex gap-2">
                <button onClick={migrateLegacy} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium">Import to rich editor</button>
              </div>
            </div>
          )}

          {/* Editor / Preview */}
          {showPreview ? (
            <article className="glass-card rounded-2xl p-6">
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">{title || "Untitled"}</h1>
              {cover && <img src={cover} alt="" className="w-full aspect-[16/9] object-cover rounded-xl mb-6" />}
              {body ? (
                <div className="prose prose-invert prose-lg max-w-none prose-headings:font-display" dangerouslySetInnerHTML={{ __html: body }} />
              ) : legacyMarkdown ? (
                <div className="prose prose-invert prose-lg max-w-none prose-headings:font-display">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{legacyMarkdown}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">Nothing to preview yet.</p>
              )}
            </article>
          ) : (
            <RichEditor
              value={body}
              onChange={setBody}
              onUploadImage={uploadFile}
              placeholder="Start writing your story…"
            />
          )}
        </div>

        <div className="space-y-4">
          <AIAssistant
            getContext={getContext}
            onReplaceSelection={onReplaceSelection}
            onSetField={onSetField}
            onAppend={onAppend}
          />
          <SEOSidebar data={seo} onChange={updateSeo} bodyText={body} title={title} />
        </div>
      </div>
    </div>
  );
}
