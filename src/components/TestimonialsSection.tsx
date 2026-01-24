import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Quote, CheckCircle2, Zap, TrendingUp } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  quote: string;
  metric: {
    value: string;
    label: string;
  };
  integrations: string[];
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Michael O.",
    role: "Founder",
    company: "TechScale Africa",
    quote: "Reduced our manual data entry by 90% via Agbaje's n8n systems. What used to take 4 hours now happens automatically while we sleep.",
    metric: {
      value: "90%",
      label: "Data Entry Reduced"
    },
    integrations: ["n8n", "Google Sheets", "Gmail"]
  },
  {
    id: 2,
    name: "Sarah K.",
    role: "Operations Lead",
    company: "E-Commerce Pro",
    quote: "The Revenue Shield eliminated our underpayment issues completely. We've recovered thousands in what would have been lost revenue.",
    metric: {
      value: "100%",
      label: "Revenue Protected"
    },
    integrations: ["Paystack", "Webhooks", "n8n"]
  },
  {
    id: 3,
    name: "David A.",
    role: "CEO",
    company: "Recruit Hub",
    quote: "Our hiring process went from weeks to days. The AI screening is incredibly accurate and our HR team can now focus on high-value interviews.",
    metric: {
      value: "80%",
      label: "Faster Hiring"
    },
    integrations: ["Groq AI", "Google Calendar", "Gmail"]
  },
  {
    id: 4,
    name: "Jennifer T.",
    role: "Content Director",
    company: "Digital Creators Co.",
    quote: "The YouTube-to-LinkedIn pipeline saves me 5 hours every week. My content now reaches 3x more people with zero extra effort.",
    metric: {
      value: "5 hrs/week",
      label: "Time Saved"
    },
    integrations: ["YouTube", "AI Agent", "Telegram"]
  },
  {
    id: 5,
    name: "Emmanuel B.",
    role: "Executive",
    company: "Finance Group",
    quote: "Having an AI Chief of Staff is like having a full-time assistant who never sleeps. It handles 90% of my email drafting automatically.",
    metric: {
      value: "15+ hrs",
      label: "Saved Weekly"
    },
    integrations: ["Telegram Bot", "Gmail", "AI Agent"]
  },
  {
    id: 6,
    name: "Amara N.",
    role: "Sales Manager",
    company: "SaaS Solutions",
    quote: "Lead follow-up rate went from 60% to 100%. The orchestrator ensures no opportunity slips through the cracks.",
    metric: {
      value: "100%",
      label: "Follow-up Rate"
    },
    integrations: ["Gmail", "Multi-Agent", "Google Sheets"]
  },
];

const TestimonialCard = ({ testimonial, index, isInView }: { testimonial: Testimonial; index: number; isInView: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    className="glass-card p-6 relative overflow-hidden group"
  >
    {/* Verified Badge */}
    <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium">
      <CheckCircle2 className="w-3 h-3" />
      Verified Integration
    </div>

    {/* Quote Icon */}
    <div className="absolute top-4 left-4 text-primary/10">
      <Quote className="w-8 h-8" />
    </div>

    <div className="pt-8 space-y-4">
      {/* Quote */}
      <p className="text-muted-foreground leading-relaxed italic">
        "{testimonial.quote}"
      </p>

      {/* Metric */}
      <div className="p-3 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">{testimonial.metric.label}</span>
          </div>
          <span className="text-xl font-bold text-secondary">{testimonial.metric.value}</span>
        </div>
      </div>

      {/* Author */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div>
          <p className="font-semibold">{testimonial.name}</p>
          <p className="text-sm text-muted-foreground">{testimonial.role} at {testimonial.company}</p>
        </div>
      </div>

      {/* Integrations */}
      <div className="flex flex-wrap gap-2">
        {testimonial.integrations.map((integration) => (
          <span
            key={integration}
            className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground flex items-center gap-1"
          >
            <Zap className="w-3 h-3 text-primary" />
            {integration}
          </span>
        ))}
      </div>
    </div>
  </motion.div>
);

const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="testimonials" className="py-32 relative" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
            Client <span className="gradient-text">Success Stories</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real results from businesses that automated their workflows with me
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-6 px-8 py-4 rounded-2xl glass-card">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">20+</div>
              <div className="text-sm text-muted-foreground">Workflows Built</div>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">500+ hrs</div>
              <div className="text-sm text-muted-foreground">Client Hours Saved</div>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Client Satisfaction</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
