import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import {
  Compass,
  ClipboardList,
  Wrench,
  Rocket,
  LifeBuoy,
  Building2,
  ShoppingBag,
  Stethoscope,
  Briefcase,
  GraduationCap,
  Truck,
  ShieldCheck,
  Clock,
  TrendingUp,
  HeartHandshake,
  Plus,
  Minus,
  Banknote,
  Ruler,
  Factory,
  HardHat,
  Cloud,
  Megaphone,
  Users,
  Store,
  MessagesSquare,
} from 'lucide-react';

const processSteps = [
  {
    icon: Compass,
    title: 'Discovery Call',
    description: 'We start with a conversation about your business, your goals, and where your team is losing time or revenue today.',
  },
  {
    icon: ClipboardList,
    title: 'Automation Assessment',
    description: 'I map your current workflows, identify the highest-impact opportunities, and share a clear plan with expected outcomes.',
  },
  {
    icon: Wrench,
    title: 'Build & Integrate',
    description: 'I design and build your system, connect it to the tools you already use, and test everything against real business scenarios.',
  },
  {
    icon: Rocket,
    title: 'Launch & Handover',
    description: 'We roll it out with your team, document how it works, and confirm the numbers we agreed on are actually moving.',
  },
  {
    icon: LifeBuoy,
    title: 'Ongoing Partnership',
    description: 'I stay involved to refine, expand, and evolve your systems as your business grows and priorities change.',
  },
];

const industries = [
  { icon: Stethoscope, name: 'Healthcare', desc: 'Automated patient intake, reminders and referrals free up clinical hours.' },
  { icon: Building2, name: 'Real Estate', desc: 'Instant lead response and listing updates keep deals from going cold.' },
  { icon: Truck, name: 'Logistics', desc: 'Live job tracking and proactive updates reduce status calls and delays.' },
  { icon: Banknote, name: 'Finance', desc: 'Document collection, approvals and reporting run without manual chasing.' },
  { icon: Ruler, name: 'Engineering', desc: 'Project documentation, approvals and handovers stay organised automatically.' },
  { icon: Factory, name: 'Manufacturing', desc: 'Orders, stock levels and supplier updates stay in sync without spreadsheets.' },
  { icon: Briefcase, name: 'Professional Services', desc: 'Client onboarding, delivery and invoicing move through one clean pipeline.' },
  { icon: HardHat, name: 'Construction', desc: 'Quotes, site reports and subcontractor coordination happen in one flow.' },
  { icon: GraduationCap, name: 'Education', desc: 'Enrolment, scheduling and student communication run on autopilot.' },
  { icon: Cloud, name: 'SaaS', desc: 'Trials, onboarding and customer health alerts are handled automatically.' },
  { icon: ShoppingBag, name: 'E-commerce', desc: 'Orders, abandoned carts and support replies are recovered without staff time.' },
  { icon: Compass, name: 'Consulting', desc: 'Proposals, reporting and client updates stop eating billable hours.' },
  { icon: Megaphone, name: 'Marketing Agencies', desc: 'Reporting, content delivery and client approvals are streamlined end to end.' },
  { icon: Users, name: 'Recruitment', desc: 'Candidate screening, scheduling and follow-up run continuously in the background.' },
  { icon: Store, name: 'Small Businesses', desc: 'Enquiries, bookings and invoices are handled without hiring extra admin.' },
  { icon: Rocket, name: 'Startups', desc: 'Founders get repeatable systems instead of doing everything by hand.' },
];

const whyChoose = [
  {
    icon: Briefcase,
    title: 'Business First',
    description: 'I understand how your business operates before suggesting any technology.',
  },
  {
    icon: HeartHandshake,
    title: 'Long-Term Support',
    description: "I don't disappear after deployment. I help improve your automation as your business grows.",
  },
  {
    icon: Wrench,
    title: 'Practical Solutions',
    description: 'Every workflow solves a real business problem, not just a technical challenge.',
  },
  {
    icon: MessagesSquare,
    title: 'Transparent Communication',
    description: "You'll always understand what's happening and why, in plain language.",
  },
  {
    icon: TrendingUp,
    title: 'Scalable Systems',
    description: 'Your automation grows with your business instead of breaking under volume.',
  },
  {
    icon: ShieldCheck,
    title: 'Reliable Delivery',
    description: 'Clean documentation, testing, monitoring and ongoing improvements as standard.',
  },
];

const faqs = [
  {
    q: 'I am not technical. Can we still work together?',
    a: 'Absolutely. Most of my clients are founders and executives, not engineers. My job is to translate what your business needs into a system that works, and to explain everything in plain language.',
  },
  {
    q: 'Which tools do you work with?',
    a: 'I work with the platforms most modern businesses already use, including CRMs like GoHighLevel, databases and web platforms, email and calendar tools, and AI providers for chat, voice and content. I pick the right tool for your goal, not the other way around.',
  },
  {
    q: 'How long does a typical project take?',
    a: 'Focused automations usually take 1 to 3 weeks. Larger sales, CRM or operations systems typically take 4 to 8 weeks, depending on scope. You will always have a clear timeline before we start.',
  },
  {
    q: 'What does it cost?',
    a: 'Pricing is scoped to your specific project after the discovery call. I will only recommend work where the expected business impact clearly outweighs the investment.',
  },
  {
    q: 'What happens after launch?',
    a: 'You get documentation, a walkthrough for your team, and the option of an ongoing partnership for maintenance, improvements and new automations as your business evolves.',
  },
  {
    q: 'Is my data safe?',
    a: 'Yes. I follow security best practices, use trusted platforms, and set up permissions so that only the right people in your business can access sensitive information.',
  },
];

const FaqItem = ({ q, a, index }: { q: string; a: string; index: number }) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="glass-card overflow-hidden"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-sm sm:text-base font-medium text-foreground">{q}</span>
        <span className="shrink-0 p-1.5 rounded-full bg-primary/10 text-primary">
          {open ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </span>
      </button>
      {open && (
        <div className="px-5 pb-5 -mt-1 text-sm text-muted-foreground leading-relaxed">
          {a}
        </div>
      )}
    </motion.div>
  );
};

const TrustSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const handleCta = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="trust" className="py-14 sm:py-16 relative" ref={ref}>
      <div className="container mx-auto px-6 space-y-16">
        {/* Process */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-3">
              How We <span className="gradient-text">Work Together</span>
            </h2>
            <p className="text-muted-foreground">
              A clear, low-friction process from first conversation to a system your team actually uses.
            </p>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            {processSteps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass-card p-5 hover-lift"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20">
                    <step.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-secondary">
                    Step 0{i + 1}
                  </span>
                </div>
                <h3 className="font-semibold text-base mb-1.5">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Why Choose Me */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-3">
              Why Clients <span className="gradient-text">Choose Me</span>
            </h2>
            <p className="text-muted-foreground">
              I focus on the outcomes that show up on your P&L, not on shipping technology for its own sake.
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {whyChoose.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass-card p-6 hover-lift cyber-border"
              >
                <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 inline-flex mb-4">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Industries */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-3">
              Industries <span className="gradient-text">I Serve</span>
            </h2>
            <p className="text-muted-foreground">
              If there is a repeatable, manual process in your business, there is almost certainly a better way to run it.
            </p>
          </motion.div>

          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {industries.map((ind, i) => (
              <motion.div
                key={ind.name}
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
                className="glass-card hover-lift p-4 sm:p-5 rounded-2xl"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="inline-flex rounded-lg bg-primary/10 p-1.5 text-primary">
                    <ind.icon className="w-4 h-4" />
                  </span>
                  <span className="text-sm font-semibold text-foreground">{ind.name}</span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">{ind.desc}</p>
              </motion.div>
            ))}
          </div>

        </div>

        {/* FAQ */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-3">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <p className="text-muted-foreground">
              A few things founders and executives usually want to know before we speak.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((f, i) => (
              <FaqItem key={f.q} q={f.q} a={f.a} index={i} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={handleCta}
              className="cta-glow px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold hover:opacity-95 transition-all inline-flex items-center gap-2 active:scale-[0.98]"
            >
              Request an Automation Assessment
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
