import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Mail } from "lucide-react";

export default function NewsletterInline({ source }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setBusy(true);
    const { data, error } = await supabase.functions.invoke("newsletter-subscribe", { body: { email, source } });
    setBusy(false);
    if (error || data?.error) { toast.error(data?.error ?? "Subscribe failed"); return; }
    setDone(true); setEmail("");
  };

  return (
    <section className="mt-16 glass-card rounded-2xl p-6 md:p-8" aria-label="Newsletter subscription">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-primary/20 shrink-0"><Mail className="w-5 h-5 text-primary" /></div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-xl mb-1">Field notes, in your inbox</h3>
          <p className="text-sm text-muted-foreground mb-4">Automation playbooks, deep dives on n8n and AI agents. No fluff. Unsubscribe anytime.</p>
          {done ? (
            <p className="text-sm text-secondary">Check your inbox to confirm your subscription.</p>
          ) : (
            <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2">
              <input required type="email" aria-label="Email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60" />
              <button disabled={busy} className="cta-glow px-5 py-2.5 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground text-sm font-medium flex items-center justify-center gap-2 active:scale-95">
                {busy && <Loader2 className="w-4 h-4 animate-spin" />} Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
