import { motion } from 'framer-motion';
import { Search, Map, Repeat, Target } from 'lucide-react';

const points = [
  { icon: Search, title: 'We look at your business first', desc: 'Before any software is chosen, I learn how your business actually operates today.' },
  { icon: Map, title: 'We map your current process', desc: 'Every handoff, approval and follow-up gets written down so nothing is guessed at.' },
  { icon: Repeat, title: 'We find the repetitive work', desc: 'The tasks your team repeats every day are usually where the biggest wins are hiding.' },
  { icon: Target, title: 'Only then do we design', desc: 'The solution is built around your business goals, not around a favourite tool.' },
];

const HowProjectsStartSection = () => (
  <section id="how-projects-start" className="relative z-10 py-10 sm:py-14">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-3xl text-center"
      >
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-primary">How every project starts</p>
        <h2 className="font-display text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
          Every automation starts with <span className="gradient-text">understanding your business.</span>
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
          I never begin by choosing software. The first step is understanding how your business operates today.
          We map your existing process, identify repetitive work, locate bottlenecks, and only then design
          automation that supports your business goals.
        </p>
        <p className="mt-3 text-sm font-medium text-foreground/90 sm:text-base">
          Technology comes last. Business understanding comes first.
        </p>
      </motion.div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {points.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: i * 0.07 }}
            className="glass-card hover-lift rounded-2xl p-5"
          >
            <div className="mb-3 inline-flex rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 p-2.5">
              <p.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="mb-1.5 font-display text-base font-semibold">{p.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowProjectsStartSection;
