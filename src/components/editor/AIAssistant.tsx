import { useState } from "react";
import { Sparkles, Loader2, Wand2, Feather, Minimize, Maximize, BookOpen, Type, Tags, Image as ImgIcon, MessageSquareQuote, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Action =
  | "rewrite" | "grammar" | "expand" | "shorten" | "readability" | "summary"
  | "seo_title" | "meta_description" | "keywords" | "alt_text" | "tone" | "continue";

const actions: { id: Action; label: string; icon: any; desc: string }[] = [
  { id: "rewrite", label: "Rewrite", icon: Wand2, desc: "Rephrase for clarity" },
  { id: "grammar", label: "Fix grammar", icon: Feather, desc: "Polish spelling & grammar" },
  { id: "expand", label: "Expand", icon: Maximize, desc: "Add depth and detail" },
  { id: "shorten", label: "Shorten", icon: Minimize, desc: "Tighten the copy" },
  { id: "readability", label: "Improve readability", icon: BookOpen, desc: "Simpler, clearer sentences" },
  { id: "summary", label: "Summarise", icon: MessageSquareQuote, desc: "One-paragraph TL;DR" },
  { id: "seo_title", label: "SEO title", icon: Type, desc: "Under 60 chars, keyword-forward" },
  { id: "meta_description", label: "Meta description", icon: Type, desc: "120–160 chars, benefit-led" },
  { id: "keywords", label: "Suggest keywords", icon: Tags, desc: "5 focus keyword ideas" },
  { id: "alt_text", label: "Image alt text", icon: ImgIcon, desc: "Describe last image" },
  { id: "tone", label: "Improve tone", icon: Sparkles, desc: "Confident, professional" },
  { id: "continue", label: "Continue writing", icon: ArrowRight, desc: "Extend from cursor" },
];

interface Props {
  getContext: () => { selection: string; body: string; title: string; lastImageAlt?: string };
  onReplaceSelection: (text: string) => void;
  onSetField: (field: "seo_title" | "meta_description", value: string) => void;
  onAppend: (text: string) => void;
}

export default function AIAssistant({ getContext, onReplaceSelection, onSetField, onAppend }: Props) {
  const [busy, setBusy] = useState<Action | null>(null);
  const [result, setResult] = useState<{ action: Action; text: string } | null>(null);

  const run = async (action: Action) => {
    const ctx = getContext();
    setBusy(action);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("ai-writer", {
        body: { action, ...ctx },
      });
      if (error) throw error;
      const text = (data?.text as string) ?? "";
      if (!text.trim()) throw new Error("Empty response");
      setResult({ action, text });
      if (action === "seo_title") onSetField("seo_title", text.replace(/^["']|["']$/g, "").trim());
      else if (action === "meta_description") onSetField("meta_description", text.replace(/^["']|["']$/g, "").trim());
    } catch (e: any) {
      toast.error(e.message ?? "AI assistant failed");
    } finally {
      setBusy(null);
    }
  };

  const apply = () => {
    if (!result) return;
    if (result.action === "continue") onAppend("\n\n" + result.text);
    else onReplaceSelection(result.text);
    setResult(null);
    toast.success("Applied");
  };

  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg bg-primary/20"><Sparkles className="w-4 h-4 text-primary" /></div>
        <div>
          <div className="text-sm font-semibold">AI Assistant</div>
          <div className="text-[10px] text-muted-foreground">Select text, then pick an action</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {actions.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => run(a.id)}
            disabled={!!busy}
            title={a.desc}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/5 text-xs text-left disabled:opacity-40"
          >
            {busy === a.id ? <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" /> : <a.icon className="w-3.5 h-3.5 text-primary shrink-0" />}
            <span className="truncate">{a.label}</span>
          </button>
        ))}
      </div>

      {result && (
        <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-3">
          <div className="text-[10px] uppercase tracking-wider text-primary mb-2">{actions.find((a) => a.id === result.action)?.label}</div>
          <div className="text-sm text-foreground max-h-56 overflow-auto whitespace-pre-wrap">{result.text}</div>
          <div className="flex items-center justify-end gap-2 mt-3">
            <button onClick={() => setResult(null)} className="px-3 py-1 rounded text-xs text-muted-foreground hover:text-foreground">Discard</button>
            {result.action !== "seo_title" && result.action !== "meta_description" && (
              <button onClick={apply} className="px-3 py-1 rounded bg-primary text-primary-foreground text-xs font-medium">
                {result.action === "continue" ? "Append" : "Replace"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
