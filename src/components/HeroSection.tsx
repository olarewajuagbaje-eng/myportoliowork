import { motion } from 'framer-motion';
import { Sparkles, Zap, Cog } from 'lucide-react';
import Marquee from './Marquee';
import { Button } from '@/components/ui/button';

const techStack = [
  'n8n',
  'GoHighLevel',
  'AI Voice Agents',
  'CRM Automation',
  'REST APIs',
  'Cloud Databases',
  'React',
  'Webhook Orchestration',
];

const proofPoints = [
  { value: '10,000+', label: 'Hours eliminated' },
  { value: '150+', label: 'Workflows built' },
  { value: '99.8%', label: 'System uptime' },
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
      <div className="hero-focus-glow pointer-events-none absolute left-1/2 top-1/4 h-[600px] w-[800px] -translate-x-1/2 rounded-full opacity-30 blur-3xl" />

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
            <span className="text-sm text-foreground/80">AI Automation Architect for founders and growth teams</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mb-4 text-4xl font-bold leading-[1.02] sm:text-5xl md:text-7xl"
          >
            AI Automation Systems That Turn{' '}
            <span className="gradient-text">Manual Work Into Revenue</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mx-auto mb-6 max-w-3xl text-base font-normal leading-relaxed text-foreground/75 md:text-lg"
          >
            I design and build production-ready AI agents, CRM workflows and connected business systems that capture leads, accelerate follow-up, protect revenue and give teams back their time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              onClick={handleAuditClick}
              className="cta-glow group h-auto min-h-12 rounded-xl bg-gradient-to-r from-primary to-secondary px-8 py-3.5 text-base font-semibold text-primary-foreground hover:opacity-95 sm:text-lg"
            >
              <Zap className="w-5 h-5 group-hover:animate-pulse" />
              Book a Strategy Call
            </Button>
            <Button asChild variant="outline" className="glass-card cyber-border h-auto min-h-12 rounded-xl px-8 py-3.5 text-base font-semibold sm:text-lg">
              <a href="#featured-projects"><Cog className="w-5 h-5" />See Client Results</a>
            </Button>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, duration: 0.7 }}
            className="mx-auto mt-8 grid max-w-2xl grid-cols-3 divide-x divide-border/70 border-y border-border/70 py-4"
            aria-label="Selected business impact"
          >
            {proofPoints.map((point) => (
              <div key={point.label} className="px-2 text-center sm:px-4">
                <dt className="mt-1 text-[9px] uppercase text-muted-foreground sm:text-xs">{point.label}</dt>
                <dd className="text-lg font-extrabold text-foreground sm:text-2xl">{point.value}</dd>
              </div>
            ))}
          </motion.dl>

          {/* Tech Stack Marquee */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="mt-6"
          >
            <Marquee
              speed={55}
              items={techStack.map((t) => (
                <span key={t} className="font-mono text-xs font-medium text-foreground/75 sm:text-sm">
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
            className="mt-4"
          >
            <div className="glass-card rounded-2xl px-4 py-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <span className="inline-flex shrink-0 items-center gap-1.5 self-start sm:self-auto px-2.5 py-1 rounded-full bg-secondary/15 border border-secondary/30 text-[10px] font-mono uppercase tracking-[0.2em] text-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                Real Business Outcomes
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
