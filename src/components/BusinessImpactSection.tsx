import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Clock, Workflow, Zap, TrendingUp, Users, Target } from "lucide-react";

const metrics = [
  { icon: Clock, value: "10,000+", label: "Hours of manual work eliminated", accent: "text-primary" },
  { icon: Workflow, value: "150+", label: "Business workflows automated", accent: "text-secondary" },
  { icon: Zap, value: "< 2 min", label: "Average lead response time", accent: "text-primary" },
  { icon: TrendingUp, value: "3–5×", label: "Faster sales pipeline velocity", accent: "text-secondary" },
  { icon: Users, value: "40+", label: "Growth-stage teams supported", accent: "text-primary" },
  { icon: Target, value: "99.8%", label: "Automation uptime across systems", accent: "text-secondary" },
];

export default function BusinessImpactSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="impact" className="py-16 md:py-20 relative" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">Business Impact</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight">Measurable outcomes, not just tools</h2>
          <p className="text-muted-foreground mt-3">
            The numbers below reflect the operational lift my automation systems have delivered for clients across
            SaaS, healthcare, real estate, logistics and professional services.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="glass-card rounded-2xl p-5 md:p-6 hover-lift"
            >
              <div className={`p-2 rounded-xl bg-white/5 inline-flex mb-3 ${m.accent}`}>
                <m.icon className="w-5 h-5" />
              </div>
              <div className="text-2xl md:text-3xl font-display font-bold">{m.value}</div>
              <div className="text-xs md:text-sm text-muted-foreground mt-1">{m.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
