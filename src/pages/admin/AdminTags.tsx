import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Save } from "lucide-react";

interface Tag { id: string; name: string; slug: string; }

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

export default function AdminTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => { setLoading(true); const { data } = await supabase.from("tags").select("*").order("name"); setTags((data ?? []) as Tag[]); setLoading(false); };
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!name.trim()) return;
    const { error } = await supabase.from("tags").insert({ name: name.trim(), slug: slugify(name) });
    if (error) toast.error(error.message); else { setName(""); load(); }
  };
  const save = async (t: Tag) => {
    const { error } = await supabase.from("tags").update({ name: t.name, slug: t.slug }).eq("id", t.id);
    if (error) toast.error(error.message); else toast.success("Saved");
  };
  const del = async (id: string) => {
    if (!confirm("Delete tag?")) return;
    const { error } = await supabase.from("tags").delete().eq("id", id);
    if (error) toast.error(error.message); else load();
  };

  const filtered = tags.filter((t) => !q || t.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-display font-bold mb-6">Tags</h1>
      <div className="glass-card rounded-2xl p-4 mb-6 flex gap-2">
        <input placeholder="New tag name" value={name} onChange={(e) => setName(e.target.value)} className="flex-1 bg-black/30 border border-white/10 rounded px-3 py-2 text-sm" />
        <button onClick={create} className="cta-glow px-3 py-2 rounded bg-gradient-to-r from-primary to-secondary text-primary-foreground text-sm flex items-center gap-1"><Plus className="w-4 h-4" /> Create</button>
      </div>
      <input placeholder="Search tags…" value={q} onChange={(e) => setQ(e.target.value)} className="mb-4 w-full max-w-sm bg-black/30 border border-white/10 rounded px-3 py-2 text-sm" />
      {loading ? <Loader2 className="animate-spin" /> : (
        <div className="space-y-2">
          {filtered.map((t) => (
            <div key={t.id} className="glass-card rounded-xl p-3 grid grid-cols-[1fr_1fr_auto_auto] gap-2 items-center">
              <input value={t.name} onChange={(e) => setTags((all) => all.map((x) => x.id === t.id ? { ...x, name: e.target.value } : x))} className="bg-black/30 border border-white/10 rounded px-2 py-1.5 text-sm" />
              <input value={t.slug} onChange={(e) => setTags((all) => all.map((x) => x.id === t.id ? { ...x, slug: slugify(e.target.value) } : x))} className="bg-black/30 border border-white/10 rounded px-2 py-1.5 text-sm" />
              <button onClick={() => save(t)} className="p-2 rounded hover:bg-white/5"><Save className="w-4 h-4 text-primary" /></button>
              <button onClick={() => del(t.id)} className="p-2 rounded hover:bg-white/5"><Trash2 className="w-4 h-4 text-destructive" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
