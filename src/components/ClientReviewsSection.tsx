import { motion } from 'framer-motion';
import { Quote, TrendingUp, Clock, Building2 } from 'lucide-react';
import Marquee from './Marquee';

interface Outcome {
  business: string;
  problem: string;
  solution: string;
  result: string;
  timeSaved: string;
  impact: string;
  accent: 'primary' | 'secondary';
}

const outcomes: Outcome[] = [
  {
    business: 'Law Firm',
    problem: 'Paralegals retyped client intake details into three different systems every day.',
    solution: 'One connected intake flow that captures details once and files them everywhere automatically.',
    result: 'Data entry errors eliminated across the intake process.',
    timeSaved: '20+ hours saved every week',
    impact: 'Paralegals now spend their time on billable client work.',
    accent: 'primary',
  },
  {
    business: 'Independent Publisher',
    problem: 'Preparing each new title took days of manual writing, formatting and design work.',
    solution: 'An automated production line that drafts the listing details and produces cover artwork on request.',
    result: 'New titles go to market in hours instead of days.',
    timeSaved: 'Days cut from every launch',
    impact: 'More titles published each month with the same small team.',
    accent: 'secondary',
  },
  {
    business: 'Healthcare Practice',
    problem: 'After-hours calls went unanswered and urgent cases were only discovered the next morning.',
    solution: 'A voice assistant answers overflow calls, records what is needed and alerts staff when it is urgent.',
    result: 'Every call is answered and logged, day or night.',
    timeSaved: 'No missed calls out of hours',
    impact: 'Patients feel looked after and nothing urgent is delayed.',
    accent: 'primary',
  },
  {
    business: 'B2B Services Company',
    problem: 'High value enquiries sat in an inbox until someone had time to reply.',
    solution: 'Enquiries are now qualified automatically and pushed to the sales team the moment they arrive.',
    result: 'New leads receive a response in under 60 seconds.',
    timeSaved: 'Follow-up time reduced to near zero',
    impact: 'More booked calls from the same amount of traffic.',
    accent: 'secondary',
  },
  {
    business: 'Remote Operations Team',
    problem: 'Task progress lived in scattered chats, so managers had no reliable view of delivery.',
    solution: 'Automated tracking that pulls updates together and nudges owners when something is slipping.',
    result: 'Complete visibility of who is doing what, in one place.',
    timeSaved: 'Manual status chasing removed',
    impact: 'Deadlines are met without daily check-in meetings.',
    accent: 'primary',
  },
];

const OutcomeCard = ({ outcome }: { outcome: Outcome }) => {
  const accentText = outcome.accent === 'primary' ? 'text-primary' : 'text-secondary';
  return (
    <article className="glass-card relative mx-3 w-[300px] shrink-0 rounded-2xl p-5 sm:w-[360px] sm:p-6">
      <div className="absolute -left-1 -top-3 opacity-30">
        <Quote className={`h-8 w-8 ${accentText}`} />
      </div>
      <div className="mb-4 flex items-center gap-2">
        <span className={`inline-flex rounded-lg bg-background/40 p-1.5 ${accentText}`}>
          <Building2 className="h-4 w-4" />
        </span>
        <span className="text-sm font-semibold text-foreground">{outcome.business}</span>
      </div>

      <div className="space-y-3 text-left">
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Problem</p>
          <p className="text-sm leading-relaxed text-foreground/85">{outcome.problem}</p>
        </div>
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Solution</p>
          <p className="text-sm leading-relaxed text-foreground/85">{outcome.solution}</p>
        </div>
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-secondary">Result</p>
          <p className="text-sm leading-relaxed text-foreground/85">{outcome.result}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2 border-t border-border/60 pt-4">
        <div className="flex items-start gap-2 text-xs text-foreground/90">
          <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary" />
          {outcome.timeSaved}
        </div>
        <div className="flex items-start gap-2 text-xs text-foreground/90">
          <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
          {outcome.impact}
        </div>
      </div>
    </article>
  );
};

const ClientReviewsSection = () => {
  return (
    <section id="reviews" className="relative overflow-hidden py-10 sm:py-14">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-8 max-w-3xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-4 py-2 backdrop-blur-xl">
            <TrendingUp className="h-4 w-4 text-secondary" />
            <span className="text-sm text-muted-foreground">Measured Client Outcomes</span>
          </div>
          <h2 className="font-display text-2xl font-bold leading-tight sm:text-4xl md:text-5xl">
            Client <span className="gradient-text">Outcomes</span>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Short success stories showing the problem, what we changed, and the result the business saw.
          </p>
        </motion.div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent sm:w-24" />

        <Marquee speed={60} items={outcomes.map((o, i) => <OutcomeCard key={i} outcome={o} />)} />
      </div>
    </section>
  );
};

export default ClientReviewsSection;
