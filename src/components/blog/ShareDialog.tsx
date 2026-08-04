import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link2, Linkedin, Twitter, Facebook, MessageCircle, Send, Mail, Check, X, Share2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  text: string;
  url: string;
}

export default function ShareDialog({ open, onClose, title, text, url }: Props) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;
  const shareText = text ? `${text}\n\nRead the full article:` : "Read the full article:";

  const targets = [
    { name: "LinkedIn", icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}` },
    { name: "X", icon: Twitter, href: `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}` },
    { name: "Facebook", icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}` },
    { name: "WhatsApp", icon: MessageCircle, href: `https://wa.me/?text=${enc(`${title}\n\n${shareText}\n${url}`)}` },
    { name: "Telegram", icon: Send, href: `https://t.me/share/url?url=${enc(url)}&text=${enc(title)}` },
    { name: "Reddit", icon: Share2, href: `https://www.reddit.com/submit?url=${enc(url)}&title=${enc(title)}` },
    { name: "Email", icon: Mail, href: `mailto:?subject=${enc(title)}&body=${enc(`${shareText}\n${url}`)}` },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      toast.success("Link copied");
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-background/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Share this article"
        >
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card w-full max-w-md rounded-t-3xl p-5 sm:rounded-3xl sm:p-6"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-lg font-semibold">Share this article</h3>
                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{title}</p>
              </div>
              <button onClick={onClose} aria-label="Close share dialog" className="rounded-lg p-2 hover:bg-white/5">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {targets.map((t) => (
                <a
                  key={t.name}
                  href={t.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-border/60 bg-background/30 px-2 py-3 text-[11px] text-foreground/90 transition-all hover:border-primary/40 hover:bg-primary/10 active:scale-95"
                >
                  <t.icon className="h-5 w-5 text-primary" />
                  {t.name}
                </a>
              ))}
              <button
                onClick={copy}
                className="flex flex-col items-center gap-2 rounded-2xl border border-border/60 bg-background/30 px-2 py-3 text-[11px] text-foreground/90 transition-all hover:border-secondary/40 hover:bg-secondary/10 active:scale-95"
              >
                {copied ? <Check className="h-5 w-5 text-secondary" /> : <Link2 className="h-5 w-5 text-secondary" />}
                {copied ? "Copied" : "Copy Link"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
