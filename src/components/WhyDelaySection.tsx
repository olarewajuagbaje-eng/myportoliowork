import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { AlertTriangle, ArrowRight } from "lucide-react";

const items = [
  { problem: "Too much manual work slowing the team down", solution: "I identify the highest-leverage tasks and automate them first — so relief is felt in weeks, not months." },
  { problem: "Slow customer follow-up costing you deals", solution: "Instant lead capture, qualification and routing means every prospect gets a response in under two minutes." },
  { problem: "Disconnected software creating data silos", solution: "I connect your CRM, marketing, ops and finance tools into one clean, real-time data flow." },
  { problem: "Repetitive admin tasks eating leadership time", solution: "Documents, reports, reminders and updates get generated automatically so leaders lead." },
  { problem: "Human error creating costly mistakes", solution: "Validated workflows, audit trails and monitoring catch errors before they reach customers." },
  { problem: "Difficulty scaling operations profitably", solution: "Automation turns growth from a hiring problem into a systems problem — margins improve as you grow." },
];

export default function WhyDelaySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <section id="why-delay" className="py-16 md:py-20 relative" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">Why businesses delay automation</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight">The cost of waiting is bigger than the cost of building</h2>
          <p className="text-muted-foreground mt-3">
            These are the six most common reasons teams put off automation — and how my approach removes each blocker.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {items.map((it, i) => (
            <motion.div
              key={it.problem}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="glass-card rounded-2xl p-5 hover-lift"
            >
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-destructive/10 text-destructive shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-semibold text-sm md:text-base">{it.problem}</h3>
                  <div className="flex items-start gap-2 mt-3">
                    <ArrowRight className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">{it.solution}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
