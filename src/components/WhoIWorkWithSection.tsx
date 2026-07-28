import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Rocket, Briefcase, HeartPulse, Home, Truck, Scale } from "lucide-react";

const industries = [
  {
    icon: Rocket, name: "Growing Startups",
    challenge: "Founders wearing every hat, manual onboarding, no time to breathe.",
    fix: "Automated onboarding, CRM sync and reporting so the team can focus on growth.",
  },
  {
    icon: Briefcase, name: "Service Businesses",
    challenge: "Chasing quotes, invoices and follow-ups across scattered inboxes.",
    fix: "One connected pipeline from lead to invoice with automated nudges at every stage.",
  },
  {
    icon: HeartPulse, name: "Healthcare Organizations",
    challenge: "Patient intake, reminders and admin work eating clinical hours.",
    fix: "HIPAA-aware intake automation, appointment reminders and referral routing.",
  },
  {
    icon: Home, name: "Real Estate Businesses",
    challenge: "Slow lead response, disconnected listings, deals slipping through cracks.",
    fix: "Instant lead qualification, CRM enrichment and offer-tracking dashboards.",
  },
  {
    icon: Truck, name: "Logistics Companies",
    challenge: "Manual dispatch, missed updates, and reactive customer support.",
    fix: "Realtime job tracking, driver comms and proactive delay notifications.",
  },
  {
    icon: Scale, name: "Professional Services",
    challenge: "Repetitive client work, brittle spreadsheets, hard-to-scale delivery.",
    fix: "Document automation, client portals and structured delivery workflows.",
  },
];

export default function WhoIWorkWithSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <section id="who-i-work-with" className="py-16 md:py-20 relative" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">Who I work best with</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight">Built for teams that are ready to scale</h2>
          <p className="text-muted-foreground mt-3">
            If any of these sound like your operation, we're likely a strong fit.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {industries.map((it, i) => (
            <motion.article
              key={it.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="glass-card rounded-2xl p-5 hover-lift"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <it.icon className="w-5 h-5" />
                </div>
                <h3 className="font-display font-semibold">{it.name}</h3>
              </div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mt-3 mb-1">The challenge</p>
              <p className="text-sm text-foreground/90 mb-3">{it.challenge}</p>
              <p className="text-xs uppercase tracking-wider text-secondary mb-1">How automation helps</p>
              <p className="text-sm text-foreground/90">{it.fix}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
