import { motion } from 'framer-motion';
import { Linkedin, Zap, Cog } from 'lucide-react';

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-10 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-primary-foreground">
              AO
            </div>
            <div>
              <div className="font-display font-semibold">Agbaje Olarewaju</div>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="status-dot bg-secondary" />
                Open for New Projects
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              <Zap className="w-4 h-4" />
              Get a Free System Audit
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg glass-card font-semibold hover:bg-muted transition-colors"
            >
              <Cog className="w-4 h-4" />
              Build My Workflow
            </motion.a>
          </div>

          <div className="flex items-center justify-end gap-4">
            <a
              href="https://www.linkedin.com/in/agbaje-olarewaju"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg glass-card hover:bg-primary/20 transition-colors glow-pulse"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5 text-primary drop-shadow-[0_0_8px_hsl(263,70%,66%)]" />
            </a>
            <a
              href="https://x.com/digital_ab98389"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg glass-card hover:bg-muted transition-colors"
              aria-label="X (Twitter)"
            >
              <XIcon className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {currentYear} Agbaje Olarewaju. Built with precision and automation in mind.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
