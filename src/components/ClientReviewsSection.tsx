import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import Marquee from './Marquee';

interface Review {
  quote: string;
  name: string;
  role: string;
  company: string;
  accent: 'primary' | 'secondary';
}

const reviews: Review[] = [
  {
    quote: "Agbaje didn't just automate our intake, he completely re engineered our legal workflow using n8n. It's saving our paralegals over 20 hours a week and eliminated data entry errors.",
    name: 'Managing Partner',
    role: 'Managing Partner',
    company: 'JCL Law',
    accent: 'primary',
  },
  {
    quote: 'The Autonomous Literary Architect pipeline is a game changer. The way he integrated Airtable with Stability AI and Groq to dynamically generate book metadata and hyper realistic covers is nothing short of genius.',
    name: 'Operations Director',
    role: 'Operations Director',
    company: 'Independent Publishing',
    accent: 'secondary',
  },
  {
    quote: 'Implementing the Uptiq Voice Agent with SharePoint sync meant our after hours calls were handled with empathy and perfect data logging. A flawless, enterprise grade architecture.',
    name: 'Healthcare Administrator',
    role: 'Healthcare Administrator',
    company: 'ProCare',
    accent: 'primary',
  },
  {
    quote: "We needed a robust lead qualification system that didn't feel like a standard bot. The custom Lovable and Supabase backend he built captured and qualified high ticket inquiries autonomously. Incredible ROI.",
    name: 'CEO',
    role: 'CEO',
    company: 'KBS Solutions',
    accent: 'secondary',
  },
  {
    quote: "Our Jira and Discord task tracking was chaotic. The n8n accountability engine he orchestrated brought total visibility and automated coaching to our remote team's performance.",
    name: 'Director of Operations',
    role: 'Director of Operations',
    company: 'Remote Team',
    accent: 'primary',
  },
];

const ReviewCard = ({ review }: { review: Review }) => (
  <article
    className="glass-card relative w-[300px] sm:w-[340px] md:w-[380px] shrink-0 rounded-2xl p-5 sm:p-6 mx-3"
  >
    <div className="absolute -top-3 -left-1 opacity-40">
      <Quote className={`w-8 h-8 ${review.accent === 'primary' ? 'text-primary' : 'text-secondary'}`} />
    </div>
    <div className="flex items-center gap-1 mb-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-secondary text-secondary" />
      ))}
    </div>
    <p className="text-sm sm:text-[15px] leading-relaxed text-foreground/90 italic mb-5">
      "{review.quote}"
    </p>
    <div className="flex items-center gap-3 pt-4 border-t border-border/60">
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
          review.accent === 'primary'
            ? 'bg-primary/15 text-primary border border-primary/30'
            : 'bg-secondary/15 text-secondary border border-secondary/30'
        }`}
      >
        {review.company.charAt(0)}
      </div>
      <div>
        <div className="text-sm font-semibold text-foreground">{review.role}</div>
        <div className="text-xs text-muted-foreground">{review.company}</div>
      </div>
    </div>
  </article>
);

const ClientReviewsSection = () => {
  return (
    <section id="reviews" className="relative py-10 sm:py-14 overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-4 py-2 backdrop-blur-xl mb-4">
            <Star className="w-4 h-4 text-secondary fill-secondary" />
            <span className="text-sm text-muted-foreground">Verified Client Outcomes</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold leading-tight">
            Client <span className="gradient-text">Impact & Reviews</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            Real words from operators who replaced manual chaos with autonomous, AI driven systems.
          </p>
        </motion.div>
      </div>

      <div className="relative">
        {/* Edge fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 z-10 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 z-10 bg-gradient-to-l from-background to-transparent" />

        <Marquee
          speed={60}
          items={reviews.map((r, i) => <ReviewCard key={i} review={r} />)}
        />
      </div>
    </section>
  );
};

export default ClientReviewsSection;
