import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, ExternalLink } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          {/* Logo & Status */}
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

          {/* CTA */}
          <div className="text-center">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://www.workana.com/freelancer/e981109bbe37ec5cdc520ecad7213947"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              Hire on Workana
              <ExternalLink className="w-4 h-4" />
            </motion.a>
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-end gap-4">
            <a 
              href="#" 
              className="p-3 rounded-lg glass-card hover:bg-muted transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="p-3 rounded-lg glass-card hover:bg-muted transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="p-3 rounded-lg glass-card hover:bg-muted transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
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
