import { motion, useReducedMotion } from 'framer-motion';
import { ShoppingBag, Workflow, Database, BellRing } from 'lucide-react';

const NODES = [
  { label: 'Shopify', sub: 'Inventory webhook', Icon: ShoppingBag },
  { label: 'n8n', sub: 'Risk scoring logic', Icon: Workflow },
  { label: 'Airtable', sub: 'Operational DB', Icon: Database },
  { label: 'Team Alert', sub: 'Email notification', Icon: BellRing },
];

const CYCLE = 4; // seconds for one full pass

const WorkflowFlow = () => {
  const reduce = useReducedMotion();
  return (
    <figure aria-label="Data flows from Shopify through n8n into Airtable, then alerts the team">
      {/* Desktop: horizontal */}
      <div className="relative hidden md:block">
        <svg className="pointer-events-none absolute inset-x-[12.5%] top-10 h-2 w-[75%] overflow-visible" preserveAspectRatio="none" viewBox="0 0 300 2" aria-hidden="true">
          <defs>
            <filter id="sg-glow"><feGaussianBlur stdDeviation="2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          </defs>
          <line x1="0" y1="1" x2="300" y2="1" stroke="hsl(var(--primary))" strokeOpacity="0.35" strokeWidth="2" filter="url(#sg-glow)" />
          <motion.line x1="0" y1="1" x2="300" y2="1" stroke="hsl(var(--secondary))" strokeWidth="2" strokeDasharray="6 10"
            animate={reduce ? undefined : { strokeDashoffset: [0, -32] }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
        </svg>
        {!reduce && (
          <motion.span
            aria-hidden="true"
            className="absolute top-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary shadow-[0_0_16px_4px_hsl(var(--secondary)/0.7)]"
            initial={{ left: '12.5%' }}
            animate={{ left: ['12.5%', '37.5%', '62.5%', '87.5%'], opacity: [1, 1, 1, 0] }}
            transition={{ duration: CYCLE, repeat: Infinity, ease: 'easeInOut', times: [0, 0.33, 0.66, 1] }}
          />
        )}
        <ol className="relative grid grid-cols-4 gap-4">
          {NODES.map(({ label, sub, Icon }, i) => (
            <li key={label} className="flex flex-col items-center text-center">
              <motion.div
                className="glass-card flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/30"
                animate={reduce ? undefined : { boxShadow: ['0 0 0 0 hsl(var(--primary)/0)', '0 0 28px 2px hsl(var(--primary)/0.55)', '0 0 0 0 hsl(var(--primary)/0)'] }}
                transition={{ duration: CYCLE, repeat: Infinity, delay: (i * CYCLE) / 3 - 0.3, times: [0, 0.08, 0.2] }}
              >
                <Icon className="h-8 w-8 text-primary" aria-hidden="true" />
              </motion.div>
              <span className="mt-3 font-display font-semibold">{label}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{sub}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Mobile: vertical */}
      <ol className="relative space-y-6 pl-14 md:hidden">
        <span aria-hidden="true" className="absolute bottom-7 left-7 top-7 w-0.5 bg-primary/40 shadow-[0_0_10px_hsl(var(--primary)/0.6)]" />
        {!reduce && (
          <motion.span aria-hidden="true"
            className="absolute left-7 h-3 w-3 -translate-x-1/2 rounded-full bg-secondary shadow-[0_0_14px_4px_hsl(var(--secondary)/0.7)]"
            animate={{ top: ['1.75rem', 'calc(100% - 2.5rem)'], opacity: [1, 1, 0] }}
            transition={{ duration: CYCLE, repeat: Infinity, ease: 'easeInOut', times: [0, 0.9, 1] }} />
        )}
        {NODES.map(({ label, sub, Icon }) => (
          <li key={label} className="relative flex items-center gap-4">
            <div className="glass-card absolute -left-14 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/30">
              <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
            </div>
            <div>
              <p className="font-display font-semibold">{label}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{sub}</p>
            </div>
          </li>
        ))}
      </ol>
    </figure>
  );
};

export default WorkflowFlow;
