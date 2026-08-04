import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Timer, MessageSquareWarning, PhoneMissed, Shuffle, FileStack, EyeOff, TrendingUp } from "lucide-react";

const signs = [
  { icon: Timer, text: "Too much manual work" },
  { icon: PhoneMissed, text: "Slow customer response" },
  { icon: MessageSquareWarning, text: "Missed follow-ups" },
  { icon: Shuffle, text: "Information scattered across different tools" },
  { icon: FileStack, text: "Repetitive administrative work" },
  { icon: EyeOff, text: "Lack of visibility" },
  { icon: TrendingUp, text: "Difficulty scaling operations" },
];

export default function WhoIWorkWithSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <section id="who-i-work-with" className="relative py-10 sm:py-14" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-8 max-w-2xl text-center"
        >
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-primary">Who I work best with</p>
          <h2 className="font-display text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
            Built for teams <span className="gradient-text">ready to scale</span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            I work with businesses that are growing faster than their current way of working can handle.
            When the team is busy but the process has not caught up, small problems start showing up every day.
          </p>
        </motion.div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {signs.map((s, i) => (
            <motion.div
              key={s.text}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="glass-card hover-lift flex items-center gap-3 rounded-2xl p-4 sm:p-5"
            >
              <span className="inline-flex rounded-xl bg-primary/10 p-2 text-primary">
                <s.icon className="h-5 w-5" />
              </span>
              <p className="text-sm font-medium text-foreground/90 sm:text-base">{s.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-7 text-center text-base font-medium text-foreground sm:text-lg"
        >
          If any of these sound familiar, automation can help.
        </motion.p>
      </div>
    </section>
  );
}
