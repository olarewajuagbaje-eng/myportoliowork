import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, AlertTriangle, CheckCircle2, Clock, Zap } from 'lucide-react';

const caseStudies = [
  {
    title: 'E-Commerce Order Fulfillment',
    before: {
      pain: 'Manual order verification, frequent underpayments slipping through, 4+ hours daily on data entry.',
      stats: [
        { label: 'Manual Hours/Day', value: '4+' },
        { label: 'Revenue Leakage', value: '~8%' },
      ],
    },
    after: {
      solution: 'Autonomous Paystack webhook verification with Number() type-casting, auto-fulfillment, and real-time inventory sync.',
      stats: [
        { label: 'Processing Time', value: '<2 sec' },
        { label: 'Revenue Protected', value: '100%' },
      ],
    },
  },
  {
    title: 'Recruitment & Hiring Pipeline',
    before: {
      pain: 'HR manually reviews 100+ CVs, schedules interviews via email chains, loses candidates to slow response times.',
      stats: [
        { label: 'CV Review Time', value: '3 hrs/day' },
        { label: 'Candidate Dropout', value: '40%' },
      ],
    },
    after: {
      solution: 'AI-powered CV scoring with Groq, auto-scheduling via Google Calendar, and instant Gmail notifications.',
      stats: [
        { label: 'Hiring Time Cut', value: '80%' },
        { label: 'Response Time', value: '<1 min' },
      ],
    },
  },
  {
    title: 'Content Production at Scale',
    before: {
      pain: 'Writers spend hours researching topics, drafting articles, and publishing across platforms manually.',
      stats: [
        { label: 'Articles/Week', value: '2-3' },
        { label: 'Research Time', value: '5 hrs/article' },
      ],
    },
    after: {
      solution: 'Automated research via Tavily API, Groq AI content generation, and auto-publish to Google Sheets CMS.',
      stats: [
        { label: 'Articles/Week', value: '20+' },
        { label: 'Research Time', value: '0 min' },
      ],
    },
  },
];

const BeforeAfterSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="before-after" className="py-32 relative" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
            Before vs. <span className="gradient-text">After</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The measurable transformation automation delivers
          </p>
        </motion.div>

        <div className="space-y-8">
          {caseStudies.map((study, i) => (
            <motion.div
              key={study.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="glass-card p-6 md:p-8"
            >
              <h3 className="text-lg md:text-xl font-bold font-display mb-6 text-center">
                {study.title}
              </h3>
              <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-stretch">
                {/* Before */}
                <div className="rounded-xl bg-destructive/5 border border-destructive/20 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                    <span className="text-xs font-mono uppercase tracking-wider text-destructive">Before</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{study.before.pain}</p>
                  <div className="flex gap-3">
                    {study.before.stats.map((s) => (
                      <div key={s.label} className="flex-1 p-3 rounded-lg bg-background/50">
                        <div className="text-lg font-bold text-destructive flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {s.value}
                        </div>
                        <div className="text-[10px] text-muted-foreground">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex items-center justify-center">
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-8 h-8 text-secondary" />
                  </motion.div>
                </div>
                <div className="flex md:hidden items-center justify-center py-1">
                  <motion.div
                    animate={{ y: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="rotate-90"
                  >
                    <ArrowRight className="w-6 h-6 text-secondary" />
                  </motion.div>
                </div>

                {/* After */}
                <div className="rounded-xl bg-secondary/5 border border-secondary/20 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                    <span className="text-xs font-mono uppercase tracking-wider text-secondary">After</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{study.after.solution}</p>
                  <div className="flex gap-3">
                    {study.after.stats.map((s) => (
                      <div key={s.label} className="flex-1 p-3 rounded-lg bg-background/50">
                        <div className="text-lg font-bold text-secondary flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          {s.value}
                        </div>
                        <div className="text-[10px] text-muted-foreground">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterSection;
