import { useMemo } from "react";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";

export interface SEOData {
  seoTitle: string;
  metaDesc: string;
  slug: string;
  focusKeyword: string;
  canonicalUrl: string;
  ogImage: string;
  ogTitle: string;
  twitterCard: "summary" | "summary_large_image";
  robots: "index,follow" | "noindex,follow" | "noindex,nofollow";
  schemaType: "Article" | "BlogPosting" | "NewsArticle";
}

interface Props {
  data: SEOData;
  onChange: (patch: Partial<SEOData>) => void;
  bodyText: string;
  title: string;
}

function stripHtml(html: string) {
  if (typeof document === "undefined") return html.replace(/<[^>]+>/g, " ");
  const d = document.createElement("div");
  d.innerHTML = html;
  return d.textContent || "";
}

function readabilityScore(text: string) {
  const words = text.split(/\s+/).filter(Boolean).length;
  const sentences = Math.max(1, (text.match(/[.!?]+/g) ?? []).length);
  const avg = words / sentences;
  if (avg < 12) return { label: "Very easy", score: 95 };
  if (avg < 16) return { label: "Easy", score: 85 };
  if (avg < 20) return { label: "Good", score: 75 };
  if (avg < 25) return { label: "Fair", score: 60 };
  return { label: "Difficult", score: 40 };
}

const CharCount = ({ value, min, max }: { value: string; min: number; max: number }) => {
  const n = value.length;
  const ok = n >= min && n <= max;
  return (
    <span className={`text-[10px] tabular-nums ${ok ? "text-secondary" : n > max ? "text-destructive" : "text-muted-foreground"}`}>
      {n}/{max}
    </span>
  );
};

const Row = ({ label, ok, warn, children }: any) => (
  <div className="flex items-start gap-2 text-xs">
    {ok ? <CheckCircle2 className="w-3.5 h-3.5 text-secondary shrink-0 mt-0.5" /> :
      warn ? <AlertCircle className="w-3.5 h-3.5 text-yellow-500 shrink-0 mt-0.5" /> :
      <XCircle className="w-3.5 h-3.5 text-destructive shrink-0 mt-0.5" />}
    <div>
      <div className={ok ? "text-muted-foreground" : "text-foreground"}>{label}</div>
      {children && <div className="text-muted-foreground/70 mt-0.5">{children}</div>}
    </div>
  </div>
);

export default function SEOSidebar({ data, onChange, bodyText, title }: Props) {
  const plain = useMemo(() => stripHtml(bodyText), [bodyText]);
  const readability = useMemo(() => readabilityScore(plain), [plain]);

  const kw = data.focusKeyword.trim().toLowerCase();
  const checks = useMemo(() => {
    const t = (data.seoTitle || title).toLowerCase();
    const md = data.metaDesc.toLowerCase();
    const body = plain.toLowerCase();
    return {
      hasTitle: (data.seoTitle || title).length >= 20 && (data.seoTitle || title).length <= 60,
      hasMeta: data.metaDesc.length >= 120 && data.metaDesc.length <= 160,
      hasKw: kw.length > 0,
      kwInTitle: kw && t.includes(kw),
      kwInMeta: kw && md.includes(kw),
      kwInBody: kw && body.includes(kw),
      kwInSlug: kw && data.slug.toLowerCase().includes(kw.replace(/\s+/g, "-")),
      hasOgImage: data.ogImage.length > 0,
      wordCount: plain.split(/\s+/).filter(Boolean).length,
    };
  }, [data, plain, title, kw]);

  const seoScore = useMemo(() => {
    let s = 0;
    if (checks.hasTitle) s += 15;
    if (checks.hasMeta) s += 15;
    if (checks.hasKw) s += 10;
    if (checks.kwInTitle) s += 15;
    if (checks.kwInMeta) s += 10;
    if (checks.kwInBody) s += 15;
    if (checks.kwInSlug) s += 10;
    if (checks.hasOgImage) s += 5;
    if (checks.wordCount >= 300) s += 5;
    return s;
  }, [checks]);

  const scoreColor = seoScore >= 80 ? "text-secondary" : seoScore >= 60 ? "text-yellow-500" : "text-destructive";
  const input = "w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/60";

  return (
    <aside className="space-y-4">
      {/* Score card */}
      <div className="glass-card rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">SEO Score</span>
          <span className={`text-2xl font-display font-bold ${scoreColor}`}>{seoScore}</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div className={`h-full transition-all ${seoScore >= 80 ? "bg-secondary" : seoScore >= 60 ? "bg-yellow-500" : "bg-destructive"}`} style={{ width: `${seoScore}%` }} />
        </div>
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Readability</span>
          <span className="text-foreground">{readability.label}</span>
        </div>
        <div className="mt-1 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Words</span>
          <span className="text-foreground tabular-nums">{checks.wordCount}</span>
        </div>
      </div>

      {/* Analysis */}
      <div className="glass-card rounded-2xl p-4 space-y-2">
        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Analysis</div>
        <Row ok={checks.hasTitle}>Title length 20–60 chars</Row>
        <Row ok={checks.hasMeta}>Meta description 120–160 chars</Row>
        <Row ok={!!checks.kwInTitle} warn={checks.hasKw && !checks.kwInTitle}>Focus keyword in title</Row>
        <Row ok={!!checks.kwInMeta} warn={checks.hasKw && !checks.kwInMeta}>Focus keyword in meta description</Row>
        <Row ok={!!checks.kwInBody} warn={checks.hasKw && !checks.kwInBody}>Focus keyword in body</Row>
        <Row ok={!!checks.kwInSlug} warn={checks.hasKw && !checks.kwInSlug}>Focus keyword in slug</Row>
        <Row ok={checks.hasOgImage} warn>Open Graph image set</Row>
        <Row ok={checks.wordCount >= 300} warn={checks.wordCount < 300}>At least 300 words</Row>
      </div>

      {/* SEO fields */}
      <div className="glass-card rounded-2xl p-4 space-y-3">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Search Appearance</div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-muted-foreground">Focus keyword</label>
          </div>
          <input value={data.focusKeyword} onChange={(e) => onChange({ focusKeyword: e.target.value })} placeholder="e.g. n8n automation" className={input} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-muted-foreground">SEO title</label>
            <CharCount value={data.seoTitle} min={20} max={60} />
          </div>
          <input value={data.seoTitle} onChange={(e) => onChange({ seoTitle: e.target.value })} placeholder="Defaults to post title" className={input} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-muted-foreground">Meta description</label>
            <CharCount value={data.metaDesc} min={120} max={160} />
          </div>
          <textarea value={data.metaDesc} onChange={(e) => onChange({ metaDesc: e.target.value })} rows={3} className={input} />
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Canonical URL</label>
          <input value={data.canonicalUrl} onChange={(e) => onChange({ canonicalUrl: e.target.value })} placeholder="Auto-generated if empty" className={input} />
        </div>
      </div>

      {/* Social */}
      <div className="glass-card rounded-2xl p-4 space-y-3">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Social preview</div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Open Graph title</label>
          <input value={data.ogTitle} onChange={(e) => onChange({ ogTitle: e.target.value })} placeholder="Defaults to SEO title" className={input} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Open Graph image URL</label>
          <input value={data.ogImage} onChange={(e) => onChange({ ogImage: e.target.value })} placeholder="1200×630 image URL" className={input} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Twitter card</label>
          <select value={data.twitterCard} onChange={(e) => onChange({ twitterCard: e.target.value as any })} className={input}>
            <option value="summary_large_image">Large image</option>
            <option value="summary">Summary</option>
          </select>
        </div>
      </div>

      {/* Advanced */}
      <div className="glass-card rounded-2xl p-4 space-y-3">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Advanced</div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Robots</label>
          <select value={data.robots} onChange={(e) => onChange({ robots: e.target.value as any })} className={input}>
            <option value="index,follow">Index, follow</option>
            <option value="noindex,follow">No-index, follow</option>
            <option value="noindex,nofollow">No-index, no-follow</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Schema type</label>
          <select value={data.schemaType} onChange={(e) => onChange({ schemaType: e.target.value as any })} className={input}>
            <option value="Article">Article</option>
            <option value="BlogPosting">BlogPosting</option>
            <option value="NewsArticle">NewsArticle</option>
          </select>
        </div>
      </div>
    </aside>
  );
}
