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
    <footer className="pt-6 pb-4 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-5 items-center">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-primary-foreground">
              AO
            </div>
            <div>
              <div className="font-display font-semibold leading-tight">Agbaje Olarewaju</div>
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <span className="status-dot bg-secondary" />
                Open for New Projects
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <motion.a
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              <Zap className="w-4 h-4" />
              Get a Free System Audit
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg glass-card font-semibold text-sm hover:bg-muted transition-colors"
            >
              <Cog className="w-4 h-4" />
              Build My Workflow
            </motion.a>
          </div>

          {/* Social Icons — grouped horizontal flex row */}
          <div className="flex items-center justify-center md:justify-end gap-2.5">
            <a
              href="https://www.linkedin.com/in/agbaje-olarewaju"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg glass-card hover:bg-primary/20 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4.5 h-4.5 text-primary" />
            </a>
            <a
              href="https://x.com/digital_ab98389"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg glass-card hover:bg-muted transition-colors"
              aria-label="X (Twitter)"
            >
              <XIcon className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border/60 text-center text-xs text-muted-foreground">
          <p>© {currentYear} Agbaje Olarewaju. Built with precision and automation in mind.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
