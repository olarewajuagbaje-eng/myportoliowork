import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Save } from "lucide-react";

interface Category { id: string; name: string; slug: string; description: string | null; parent_id: string | null; }

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

export default function AdminCategories() {
  const [cats, setCats] = useState<Category[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState({ name: "", slug: "", description: "", parent_id: "" });

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("categories").select("*").order("name");
    setCats((data ?? []) as Category[]); setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const save = async (c: Category) => {
    const { error } = await supabase.from("categories").update({ name: c.name, slug: c.slug, description: c.description, parent_id: c.parent_id || null }).eq("id", c.id);
    if (error) toast.error(error.message); else toast.success("Saved");
  };
  const del = async (id: string) => {
    if (!confirm("Delete category?")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  };
  const create = async () => {
    if (!creating.name.trim()) return;
    const slug = creating.slug || slugify(creating.name);
    const { error } = await supabase.from("categories").insert({ name: creating.name.trim(), slug, description: creating.description || null, parent_id: creating.parent_id || null });
    if (error) toast.error(error.message); else { setCreating({ name: "", slug: "", description: "", parent_id: "" }); load(); }
  };

  const filtered = cats.filter((c) => !q || c.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-display font-bold mb-6">Categories</h1>
      <div className="glass-card rounded-2xl p-4 mb-6 grid md:grid-cols-4 gap-2">
        <input placeholder="Name" value={creating.name} onChange={(e) => setCreating((c) => ({ ...c, name: e.target.value, slug: c.slug || slugify(e.target.value) }))} className="bg-black/30 border border-white/10 rounded px-3 py-2 text-sm" />
        <input placeholder="slug" value={creating.slug} onChange={(e) => setCreating((c) => ({ ...c, slug: slugify(e.target.value) }))} className="bg-black/30 border border-white/10 rounded px-3 py-2 text-sm" />
        <select value={creating.parent_id} onChange={(e) => setCreating((c) => ({ ...c, parent_id: e.target.value }))} className="bg-black/30 border border-white/10 rounded px-3 py-2 text-sm">
          <option value="">No parent</option>
          {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button onClick={create} className="cta-glow px-3 py-2 rounded bg-gradient-to-r from-primary to-secondary text-primary-foreground text-sm flex items-center justify-center gap-1"><Plus className="w-4 h-4" /> Create</button>
        <input placeholder="Description (optional)" value={creating.description} onChange={(e) => setCreating((c) => ({ ...c, description: e.target.value }))} className="bg-black/30 border border-white/10 rounded px-3 py-2 text-sm md:col-span-4" />
      </div>

      <input placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} className="mb-4 w-full max-w-sm bg-black/30 border border-white/10 rounded px-3 py-2 text-sm" />

      {loading ? <Loader2 className="animate-spin" /> : (
        <div className="space-y-2">
          {filtered.map((c) => (
            <div key={c.id} className="glass-card rounded-xl p-3 grid md:grid-cols-[1fr_1fr_1fr_auto_auto] gap-2 items-center">
              <input value={c.name} onChange={(e) => setCats((all) => all.map((x) => x.id === c.id ? { ...x, name: e.target.value } : x))} className="bg-black/30 border border-white/10 rounded px-2 py-1.5 text-sm" />
              <input value={c.slug} onChange={(e) => setCats((all) => all.map((x) => x.id === c.id ? { ...x, slug: slugify(e.target.value) } : x))} className="bg-black/30 border border-white/10 rounded px-2 py-1.5 text-sm" />
              <select value={c.parent_id ?? ""} onChange={(e) => setCats((all) => all.map((x) => x.id === c.id ? { ...x, parent_id: e.target.value || null } : x))} className="bg-black/30 border border-white/10 rounded px-2 py-1.5 text-sm">
                <option value="">No parent</option>
                {cats.filter((x) => x.id !== c.id).map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
              </select>
              <button onClick={() => save(c)} className="p-2 rounded hover:bg-white/5" aria-label="Save"><Save className="w-4 h-4 text-primary" /></button>
              <button onClick={() => del(c.id)} className="p-2 rounded hover:bg-white/5" aria-label="Delete"><Trash2 className="w-4 h-4 text-destructive" /></button>
              <input value={c.description ?? ""} onChange={(e) => setCats((all) => all.map((x) => x.id === c.id ? { ...x, description: e.target.value } : x))} placeholder="Description" className="bg-black/30 border border-white/10 rounded px-2 py-1.5 text-sm md:col-span-5" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
