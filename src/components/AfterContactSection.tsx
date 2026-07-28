import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  PhoneCall, ClipboardList, Compass, LayoutDashboard, Code2, ShieldCheck, Rocket, HeartHandshake,
} from "lucide-react";

const steps = [
  { icon: PhoneCall, title: "Discovery Call", desc: "A 30-minute conversation to understand your business, goals and where automation will move the needle." },
  { icon: ClipboardList, title: "Business Process Review", desc: "I audit your current workflows, tools and handoffs to find bottlenecks, duplication and revenue leaks." },
  { icon: Compass, title: "Automation Strategy", desc: "You get a clear roadmap: what to automate first, expected impact, integrations required and a realistic timeline." },
  { icon: LayoutDashboard, title: "System Design", desc: "I architect the solution end-to-end — data model, workflows, integrations, AI logic and monitoring." },
  { icon: Code2, title: "Development", desc: "I build the system on production-grade tooling (n8n, Supabase, GHL, custom code) with clean documentation." },
  { icon: ShieldCheck, title: "Testing", desc: "Every workflow is tested against real-world scenarios, edge cases and failure modes before it goes live." },
  { icon: Rocket, title: "Deployment", desc: "We roll it out to your team with training, playbooks and safe fallbacks so nothing breaks." },
  { icon: HeartHandshake, title: "Ongoing Support", desc: "I stay engaged — monitoring, optimizing and evolving the system as your business grows." },
];

export default function AfterContactSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <section id="process" className="py-16 md:py-20 relative" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">What happens after you reach out</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight">A clear, predictable engagement</h2>
          <p className="text-muted-foreground mt-3">
            No black boxes. You'll know exactly what to expect at every stage of the project.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="glass-card rounded-2xl p-5 hover-lift relative"
            >
              <span className="absolute top-3 right-3 text-[10px] font-mono text-muted-foreground/60">0{i + 1}</span>
              <div className="p-2 rounded-xl bg-secondary/10 text-secondary inline-flex mb-3">
                <s.icon className="w-5 h-5" />
              </div>
              <h3 className="font-display font-semibold mb-1">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
