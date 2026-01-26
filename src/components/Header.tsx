import { motion } from 'framer-motion';
import { Zap, Linkedin } from 'lucide-react';

const Header = () => {
  const handleAuditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        if ((window as any).triggerAuditRequest) {
          (window as any).triggerAuditRequest();
        }
      }, 800);
    }
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50"
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-primary-foreground">
            AO
          </div>
          <span className="font-display font-semibold text-lg">Agbaje Olarewaju</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
          <a href="#projects" className="text-muted-foreground hover:text-foreground transition-colors">Projects</a>
          <a href="#skills" className="text-muted-foreground hover:text-foreground transition-colors">Skills</a>
          <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
          <a 
            href="https://www.linkedin.com/in/agbaje-olarewaju" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 transition-colors relative"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5 drop-shadow-[0_0_8px_hsl(263,70%,66%)]" />
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="status-dot bg-secondary" />
            <span className="text-muted-foreground hidden sm:inline">Systems Operational</span>
          </div>
          <button
            onClick={handleAuditClick}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Free Audit
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
