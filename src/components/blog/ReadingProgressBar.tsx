import { useEffect, useState } from "react";

export default function ReadingProgressBar() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      setP(total > 0 ? Math.min(100, (h.scrollTop / total) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div aria-hidden className="fixed top-0 left-0 right-0 h-0.5 z-[60] bg-transparent pointer-events-none">
      <div className="h-full bg-gradient-to-r from-primary via-secondary to-primary transition-[width] duration-150" style={{ width: `${p}%` }} />
    </div>
  );
}
