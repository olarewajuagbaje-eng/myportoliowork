import { useEffect, useState } from "react";
import { List, X } from "lucide-react";

interface Heading { id: string; text: string; level: number; }

export default function TableOfContents({ containerSelector = "#article-body" }: { containerSelector?: string }) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = document.querySelector(containerSelector);
    if (!el) return;
    const nodes = Array.from(el.querySelectorAll("h2, h3")) as HTMLElement[];
    const list: Heading[] = nodes.map((n, i) => {
      if (!n.id) n.id = `h-${i}-${(n.textContent ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}`;
      return { id: n.id, text: n.textContent ?? "", level: n.tagName === "H2" ? 2 : 3 };
    });
    setHeadings(list);
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-30% 0px -60% 0px" }
    );
    nodes.forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, [containerSelector]);

  if (headings.length < 2) return null;

  const List_ = (
    <nav aria-label="Table of contents" className="text-sm space-y-1">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">On this page</div>
      {headings.map((h) => (
        <a
          key={h.id}
          href={`#${h.id}`}
          onClick={() => setOpen(false)}
          className={`block py-1 border-l-2 transition-colors ${
            active === h.id ? "border-primary text-primary" : "border-white/10 text-muted-foreground hover:text-foreground"
          } ${h.level === 3 ? "pl-6" : "pl-3"}`}
        >
          {h.text}
        </a>
      ))}
    </nav>
  );

  return (
    <>
      <aside className="hidden xl:block sticky top-24 self-start w-64 shrink-0 max-h-[calc(100vh-8rem)] overflow-auto pr-2">
        {List_}
      </aside>
      <button
        aria-label="Open table of contents"
        onClick={() => setOpen(true)}
        className="xl:hidden fixed bottom-24 right-4 z-40 glass-card rounded-full p-3 shadow-lg active:scale-95"
      >
        <List className="w-5 h-5" />
      </button>
      {open && (
        <div className="xl:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="absolute bottom-0 left-0 right-0 glass-card rounded-t-3xl p-6 max-h-[70vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <span className="font-display font-semibold">Contents</span>
              <button onClick={() => setOpen(false)} aria-label="Close"><X className="w-5 h-5" /></button>
            </div>
            {List_}
          </div>
        </div>
      )}
    </>
  );
}
