import { motion } from 'framer-motion';
import { Briefcase, ShieldCheck, Sparkles, Boxes, LifeBuoy, FileText, Zap, TrendingUp } from 'lucide-react';

const indicators = [
  { icon: Briefcase, title: 'Business-Focused Approach', desc: 'Every decision starts with your goals, not with software.' },
  { icon: ShieldCheck, title: 'Secure Workflows', desc: 'Your data stays protected, with access limited to the right people.' },
  { icon: Sparkles, title: 'AI-Powered Automation', desc: 'Modern AI applied where it genuinely saves time or wins revenue.' },
  { icon: Boxes, title: 'End-To-End Implementation', desc: 'From first conversation to live system, handled for you.' },
  { icon: LifeBuoy, title: 'Ongoing Support', desc: 'I stay available after launch to refine and improve.' },
  { icon: FileText, title: 'Clear Documentation', desc: 'Your team gets plain-English guides for everything we build.' },
  { icon: Zap, title: 'Fast Response', desc: 'Quick replies and short feedback loops throughout the project.' },
  { icon: TrendingUp, title: 'Scalable Architecture', desc: 'Systems designed to keep working as your volume grows.' },
];

const TrustIndicatorsSection = () => (
  <section id="trust-indicators" className="relative z-10 py-10 sm:py-14">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.5 }}
        className="mx-auto mb-8 max-w-2xl text-center"
      >
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-primary">What you can count on</p>
        <h2 className="font-display text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
          Built on <span className="gradient-text">trust and clarity</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {indicators.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="glass-card hover-lift rounded-2xl p-4 sm:p-5"
          >
            <div className="mb-3 inline-flex rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 p-2.5">
              <item.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="mb-1 font-display text-sm font-semibold sm:text-base">{item.title}</h3>
            <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TrustIndicatorsSection;
