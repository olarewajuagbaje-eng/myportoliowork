import { motion } from 'framer-motion';
import { Sparkles, Zap, Cog } from 'lucide-react';
import Marquee from './Marquee';

const techStack = [
  'Lead Capture',
  'Sales Automation',
  'CRM Orchestration',
  'AI Customer Support',
  'Ops Efficiency',
  'Revenue Recovery',
  'Reporting & Insights',
  'Client Onboarding',
  'Multi-Channel Workflows',
];

const impactResults = [
  'Recovered 100% of lost revenue from missed transactions.',
  'Cut hiring cycle time by 80% for a growing team.',
  'Freed executives from 15+ hours of weekly admin work.',
  'Grew qualified lead capture by 45% with 24/7 response.',
  'Delivered 20+ market-ready articles per week without a writing team.',
];

const HeroSection = () => {
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
    <section className="relative overflow-hidden pt-24 pb-8 sm:pt-28 sm:pb-12">
      {/* Gradient Glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, hsl(263 70% 66% / 0.3) 0%, transparent 70%)' }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-5"
          >
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-sm text-muted-foreground">Automation for founders, executives & growth teams</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold font-display leading-[1.02] mb-4 tracking-[-0.03em]"
          >
            Turn Manual Work Into{' '}
            <span className="gradient-text">Predictable Revenue</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-base md:text-lg text-muted-foreground mb-6 font-light max-w-2xl mx-auto leading-relaxed"
          >
            I help business owners, founders and executives remove the manual work slowing their teams down. From lead capture to customer follow-up, I design AI-powered systems that run quietly in the background, protect revenue, and give you back your time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={handleAuditClick}
              className="cta-glow group px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold text-lg hover:opacity-95 transition-all flex items-center gap-2"
            >
              <Zap className="w-5 h-5 group-hover:animate-pulse" />
              Book a Strategy Call
            </button>
            <a
              href="#projects"
              className="px-8 py-4 rounded-xl glass-card text-foreground font-semibold text-lg hover-lift cyber-border flex items-center gap-2"
            >
              <Cog className="w-5 h-5" />
              See Client Results
            </a>
          </motion.div>

          {/* Tech Stack Marquee */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="mt-10"
          >
            <Marquee
              speed={55}
              items={techStack.map((t) => (
                <span key={t} className="font-mono text-sm sm:text-base font-medium text-foreground/85 tracking-wide">
                  {t}
                </span>
              ))}
              separator={<span className="text-primary/70">•</span>}
            />
          </motion.div>

          {/* Measurable Impact Marquee */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.15, duration: 0.8 }}
            className="mt-5"
          >
            <div className="glass-card rounded-2xl px-4 py-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <span className="inline-flex shrink-0 items-center gap-1.5 self-start sm:self-auto px-2.5 py-1 rounded-full bg-secondary/15 border border-secondary/30 text-[10px] font-mono uppercase tracking-[0.2em] text-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                Measurable Impact
              </span>
              <div className="flex-1 min-w-0">
                <Marquee
                  speed={70}
                  items={impactResults.map((r) => (
                    <span key={r} className="text-sm sm:text-base text-foreground/90">
                      <span className="text-secondary mr-2">▸</span>
                      {r}
                    </span>
                  ))}
                  separator={<span className="text-muted-foreground/50">·</span>}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default HeroSection;
