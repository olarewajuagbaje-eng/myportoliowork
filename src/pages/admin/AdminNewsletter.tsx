import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Download, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface Sub { id: string; email: string; status: string; source: string | null; created_at: string; confirmed_at: string | null; }

export default function AdminNewsletter() {
  const [rows, setRows] = useState<Sub[]>([]);
  const [status, setStatus] = useState<"all" | "pending" | "confirmed" | "unsubscribed">("all");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    let q = supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false });
    if (status !== "all") q = q.eq("status", status);
    const { data } = await q;
    setRows((data ?? []) as Sub[]); setLoading(false);
  };
  useEffect(() => { load(); }, [status]);

  const del = async (id: string) => {
    if (!confirm("Remove subscriber?")) return;
    const { error } = await supabase.from("newsletter_subscribers").delete().eq("id", id);
    if (error) toast.error(error.message); else load();
  };

  const exportCsv = () => {
    const header = "email,status,source,created_at,confirmed_at\n";
    const body = rows.map((r) => [r.email, r.status, r.source ?? "", r.created_at, r.confirmed_at ?? ""].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-3xl font-display font-bold">Newsletter</h1>
        <button onClick={exportCsv} className="cta-glow px-4 py-2 rounded bg-gradient-to-r from-primary to-secondary text-primary-foreground text-sm flex items-center gap-2"><Download className="w-4 h-4" /> Export CSV</button>
      </div>
      <div className="flex gap-2 mb-4 text-sm flex-wrap">
        {(["all", "pending", "confirmed", "unsubscribed"] as const).map((s) => (
          <button key={s} onClick={() => setStatus(s)} className={`px-3 py-1.5 rounded ${status === s ? "bg-primary/20 text-primary" : "hover:bg-white/5"}`}>{s}</button>
        ))}
        <span className="ml-auto text-xs text-muted-foreground self-center">{rows.length} subscriber{rows.length === 1 ? "" : "s"}</span>
      </div>
      {loading ? <Loader2 className="animate-spin" /> : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5"><tr className="text-left"><th className="p-3">Email</th><th className="p-3">Status</th><th className="p-3">Source</th><th className="p-3">Joined</th><th className="p-3"></th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-white/5">
                  <td className="p-3">{r.email}</td>
                  <td className="p-3"><span className={`px-2 py-0.5 rounded text-xs ${r.status === "confirmed" ? "bg-secondary/20 text-secondary" : r.status === "pending" ? "bg-yellow-500/20 text-yellow-500" : "bg-white/10"}`}>{r.status}</span></td>
                  <td className="p-3 text-muted-foreground">{r.source ?? "-"}</td>
                  <td className="p-3 text-muted-foreground">{format(new Date(r.created_at), "MMM d, yyyy")}</td>
                  <td className="p-3"><button onClick={() => del(r.id)} className="p-1.5 rounded hover:bg-white/5" aria-label="Delete"><Trash2 className="w-4 h-4 text-destructive" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
