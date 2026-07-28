import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";

const faqs = [
  {
    q: "How long does an automation project take?",
    a: "Most focused projects run 2–6 weeks, depending on scope. A single-workflow automation can ship in under two weeks. A full revenue-operations rebuild typically runs 4–8 weeks. You'll get a fixed timeline after the discovery call.",
  },
  {
    q: "Can you work with my existing tools?",
    a: "Yes. I've integrated across 100+ tools including HubSpot, GoHighLevel, Salesforce, Airtable, Notion, Slack, Stripe, Shopify, WhatsApp, Gmail, Google Workspace, Supabase and dozens more. If there's an API, we can connect it.",
  },
  {
    q: "What if my business has unique requirements?",
    a: "Unique is what I do best. Every business runs on its own logic, and off-the-shelf tools rarely fit perfectly. I design custom workflows around how you actually work, not the other way around.",
  },
  {
    q: "Do you provide support after deployment?",
    a: "Yes. Every project includes a monitoring and optimization period. I also offer ongoing retainers for teams that want a long-term automation partner rather than a one-off build.",
  },
  {
    q: "Can you automate part of my business before scaling?",
    a: "Absolutely — and it's usually the smartest way to start. We identify the single highest-impact workflow, ship it fast, prove the ROI, then expand from there. No big-bang rewrites.",
  },
  {
    q: "How do you protect my data and systems?",
    a: "All builds follow security best practices: least-privilege API access, encrypted secrets, row-level security on databases, and full audit logging. For regulated industries we implement additional controls together.",
  },
];

export default function FAQBeforeHiringSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <section id="faq" className="py-16 md:py-20 relative" ref={ref}>
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">Frequently asked before hiring me</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight">Questions decision-makers usually ask</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card rounded-2xl p-4 md:p-6"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-white/5">
                <AccordionTrigger className="text-left font-display font-semibold hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#contact"
            className="cta-glow px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground font-medium text-sm active:scale-95 transition-transform"
          >
            Book an Automation Strategy Call
          </a>
          <Link
            to="/blog"
            className="px-6 py-3 rounded-lg border border-white/10 text-sm hover:bg-white/5 active:scale-95 transition-all"
          >
            See What's Possible for Your Business
          </Link>
        </div>
      </div>
    </section>
  );
}
