import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, ChevronLeft, ChevronRight, PlayCircle, Pause, Play, FileStack } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import ProjectCard, { type ProjectCardData } from '@/components/ProjectCard';

const featuredProjects: ProjectCardData[] = [
  {
    name: 'DocExtract AI',
    eyebrow: 'Logistics Automation',
    headline: 'Automated Shipment Document Extraction',
    kpis: [
      { value: '100%', label: 'Manual Entry Eliminated' },
      { value: '<5s', label: 'Near-Instant Processing' },
      { value: '0', label: 'Data Errors' },
    ],
    problem: 'Logistics companies drown in messy shipping documents, slowing operations and burying staff in repetitive data entry.',
    solution: 'An intelligent extraction system that reads every incoming document, pulls the key fields, and routes clean data directly into the core database without human touch.',
    results: ['Staff freed from manual data entry entirely', 'Documents processed the moment they arrive', 'Clean, verified data in every downstream system'],
    tags: ['n8n', 'Groq', 'Supabase'],
    ctaLabel: 'Explore Solution',
    ctaHref: '#contact',
    themeClass: 'featured-project-service',
    ctaIcon: FileStack,
  },
  {
    name: 'FlowDesk',
    eyebrow: 'Small Business Operations',
    headline: 'FlowDesk: One Place To Run The Whole Business',
    problem: 'Leads, bookings and team messages were scattered across email, WhatsApp and spreadsheets, so enquiries were missed and nobody knew who was following up.',
    solution: 'We brought every enquiry, booking and conversation into one simple hub, alerted the right person instantly, and gave each team member their own access level.',
    results: ['Nothing slips through the cracks', 'Instant alerts on every new enquiry', 'One shared view for the whole team'],
    tags: ['React', 'Supabase', 'CRM Automation', 'SaaS'],
    ctaLabel: 'Explore Solution',
    ctaHref: 'https://getflowdesk.lovable.app',
    themeClass: 'featured-project-service',
  },
  {
    name: 'VitaFlow',
    eyebrow: 'Wellness Operations',
    headline: 'VitaFlow: A Single Platform For Client Wellness',
    problem: 'Clients were juggling several health apps and providers had no clear picture of progress, so engagement dropped and follow-up was inconsistent.',
    solution: 'We replaced the app stack with one platform that guides the client day to day, sends reminders automatically, and gives providers a single dashboard.',
    results: ['Higher client engagement', 'Automatic reminders replace manual follow-up', 'Full visibility for providers'],
    tags: ['AI/ML', 'HealthTech', 'Tailwind CSS', 'Edge Functions'],
    ctaLabel: 'Explore Solution',
    ctaHref: 'https://vita-flow-zen.lovable.app',
    themeClass: 'featured-project-wellness',
  },
  {
    name: 'Sales Engine',
    eyebrow: 'B2B Sales Conversion',
    headline: 'The Automated B2B Sales Conversion Engine',
    problem: 'High value enquiries went cold because the sales team followed up manually, hours or days later, with no clear view of which leads were worth chasing.',
    solution: 'We connected every enquiry into one automated pipeline that scores each buyer, alerts the sales team instantly, and re-engages quiet leads with a polished follow-up sequence.',
    results: ['Leads contacted in under 60 seconds', 'Cold leads recovered automatically', 'Live view of pipeline value and booked calls'],
    tags: ['GoHighLevel (GHL)', 'Custom HTML', 'Pipeline Automation', 'Dynamic Scoring'],
    ctaLabel: 'Watch The Walkthrough',
    ctaHref: 'https://drive.google.com/file/d/1Ct1PmftfwrdmM8NY1q7uHT76PaJVpTEA/view?usp=drivesdk',
    themeClass: 'featured-project-sales',
    ctaIcon: PlayCircle,
  },
  {
    name: 'ROR AI Engine',
    eyebrow: 'Revenue Protection',
    headline: 'AI Triage & CRM Engine',
    problem: 'Website visitors asked the same questions all day, buyers abandoned checkout without anyone noticing, and customer records had to be typed in by hand.',
    solution: 'We added an always-on assistant that answers and qualifies buyers, spots abandoned purchases and follows up automatically, while every detail writes itself into the CRM.',
    results: ['Abandoned sales recovered without staff effort', 'Zero duplicate data entry', 'Every enquiry qualified and summarised for the team'],
    tags: ['n8n', 'CourseCreator 360 (GHL)', 'Groq (Llama 3.3)', 'Google Sheets'],
    ctaLabel: 'Watch The Walkthrough',
    ctaHref: 'https://drive.google.com/file/d/1HEoafNeV5KcFHYNwNeuvxjlgXGgaAC_N/view?usp=drivesdk',
    themeClass: 'featured-project-sales',
    ctaIcon: PlayCircle,
  },
  {
    name: 'Voice AI',
    eyebrow: 'Customer Communication',
    headline: 'Enterprise Voice Assistant For Overflow Calls',
    problem: 'Busy periods and after-hours calls went unanswered at a healthcare business, leaving patients waiting and staff with no record of what was missed.',
    solution: 'A professional voice assistant now answers overflow calls, captures what the caller needs, logs it centrally, and alerts the team the moment something is urgent.',
    results: ['No unanswered calls, day or night', 'Every call logged and searchable', 'Urgent cases escalated in real time'],
    tags: ['Uptiq (GHL)', 'n8n', 'Power Automate', 'SharePoint'],
    ctaLabel: 'See How It Works',
    ctaHref: '#contact',
    themeClass: 'featured-project-wellness',
    ctaIcon: PlayCircle,
  },
  {
    name: 'Content Engine',
    eyebrow: 'Marketing Operations',
    headline: 'Autonomous Content Production Engine',
    problem: 'Publishing consistently required writers, editors and manual uploads, so marketing output stalled whenever the team got busy.',
    solution: 'We built a system that drafts on-brand content, routes it to the right place, and waits for one human approval before publishing everything for you.',
    results: ['Consistent publishing without extra hires', 'Human approval keeps quality in control', 'Weeks of content scheduled in advance'],
    tags: ['n8n', 'Airtable', 'WordPress', 'AI Writing'],
    ctaLabel: 'See How It Works',
    ctaHref: '#contact',
    themeClass: 'featured-project-service',
  },
  {
    name: 'Render Engine',
    eyebrow: 'Brand Visibility',
    headline: 'Autonomous Content & Design Engine',
    problem: 'Staying visible online meant researching topics, writing posts and designing graphics every single day, which no small team can sustain.',
    solution: 'The system now researches what is trending, writes the post, produces a branded graphic and publishes it twice a day, completely hands-off.',
    results: ['Daily brand presence with zero manual effort', 'Branded visuals produced automatically', 'Reliable output even when the team is busy'],
    tags: ['n8n', 'Node.js', 'Supabase', 'AI Content', 'Buffer'],
    ctaLabel: 'View Case Study',
    ctaHref: '#contact',
    themeClass: 'featured-project-sales',
  },
  {
    name: 'AutoMatch',
    eyebrow: 'Brokerage Automation',
    headline: 'AutoMatch: Hands-Off Car Brokerage',
    problem: 'Matching buyers to dealers meant hours of phone calls, spreadsheets and back-and-forth, which limited how many deals the team could handle.',
    solution: 'Buyer requests are now matched automatically, the right dealers are notified instantly, and every step of the deal is tracked in one secure place.',
    results: ['More deals handled with the same team', 'Buyers matched in minutes, not days', 'Complete, auditable record of every transaction'],
    tags: ['n8n', 'Supabase', 'AI Matching'],
    ctaLabel: 'Explore Solution',
    ctaHref: 'https://driveway-dealer.lovable.app',
    themeClass: 'featured-project-wellness',
  },
  {
    name: 'JNK Logistics',
    eyebrow: 'Operations Visibility',
    headline: 'JNK Logistics Flow: Live Dispatch Command Center',
    problem: 'Dispatchers worked from stale spreadsheets, clients called constantly for updates, and duplicate customer records made reporting unreliable.',
    solution: 'We built a live command center where jobs, drivers and revenue update in real time, and gave clients their own tracking portal so they stop calling for status.',
    results: ['Real-time visibility across the fleet', 'Fewer status calls from clients', 'Clean, duplicate-free customer records'],
    tags: ['React', 'Supabase', 'n8n', 'AI Summaries'],
    ctaLabel: 'Explore Solution',
    ctaHref: 'https://jnk-logistics-flow.lovable.app',
    themeClass: 'featured-project-service',
  },
  {
    name: 'Masterclass',
    eyebrow: 'High-Ticket Sales',
    headline: 'Architecture Masterclass Funnel & Infrastructure',
    problem: 'A premium training programme was being sold through a generic page that failed to build trust, so high-ticket buyers hesitated at checkout.',
    solution: 'We designed a premium buying experience that lets prospects preview the programme, then connected checkout to automated onboarding behind the scenes.',
    results: ['Stronger buyer confidence at checkout', 'Onboarding handled automatically after purchase', 'Protected margins on every high-ticket sale'],
    tags: ['GoHighLevel', 'Custom HTML/CSS', 'n8n', 'Supabase'],
    ctaLabel: 'View Case Study',
    ctaHref: 'https://sites.leadconnectorhq.com/preview/WH0tMAV06vMVunjvnmgz?notrack=true',
    themeClass: 'featured-project-masterclass',
  },
];

const AUTOPLAY_MS = 8000;

const FeaturedProjectsSection = () => {
  const isMobile = useIsMobile();
  const cardsPerView = isMobile ? 1 : 2;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const total = featuredProjects.length;
  const maxIndex = Math.max(0, total - cardsPerView);

  const next = () => setActiveIndex((i) => (i >= maxIndex ? 0 : i + 1));
  const prev = () => setActiveIndex((i) => (i <= 0 ? maxIndex : i - 1));

  // Reset index when viewport changes
  useEffect(() => {
    setActiveIndex(0);
  }, [cardsPerView]);

  // Autoplay
  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i >= maxIndex ? 0 : i + 1));
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [isPaused, maxIndex]);

  const slideWidthPct = 100 / cardsPerView;
  const translatePct = activeIndex * slideWidthPct;

  return (
    <section id="featured-projects" className="relative z-10 py-8 sm:py-10">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-6 max-w-3xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-4 py-2 backdrop-blur-xl">
            <Bot className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">Client Work & Case Studies</span>
          </div>
          <h2 className="font-display text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
            Real systems, real revenue, <span className="gradient-text">real business outcomes.</span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            A rotating look at platforms and automations I have built to help clients capture more leads, close more deals, and run leaner operations.
          </p>
        </motion.div>

        {/* Auto-slider carousel */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="overflow-hidden -mx-3">
            <motion.div
              className="flex"
              animate={{ x: `-${translatePct}%` }}
              transition={{ type: 'spring', stiffness: 90, damping: 20 }}
            >
              {featuredProjects.map((project) => (
                <div
                  key={project.name}
                  className="shrink-0 px-3"
                  style={{ width: `${slideWidthPct}%` }}
                >
                  <ProjectCard project={project} />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Navigation controls */}
          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              onClick={prev}
              className="p-2 rounded-full glass-card hover:bg-muted transition-colors"
              aria-label="Previous project"
              style={{ minWidth: '40px', minHeight: '40px' }}
            >
              <ChevronLeft className="w-5 h-5 mx-auto" />
            </button>

            <div className="flex gap-2">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === activeIndex ? 'w-7 bg-primary' : 'w-2 bg-muted-foreground/40 hover:bg-muted-foreground/60'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="p-2 rounded-full glass-card hover:bg-muted transition-colors"
              aria-label="Next project"
              style={{ minWidth: '40px', minHeight: '40px' }}
            >
              <ChevronRight className="w-5 h-5 mx-auto" />
            </button>

            <button
              onClick={() => setIsPaused((p) => !p)}
              className="ml-1 p-2 rounded-full glass-card hover:bg-muted transition-colors hidden sm:inline-flex"
              aria-label={isPaused ? 'Play autoplay' : 'Pause autoplay'}
              style={{ minWidth: '40px', minHeight: '40px' }}
            >
              {isPaused ? <Play className="w-4 h-4 mx-auto" /> : <Pause className="w-4 h-4 mx-auto" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjectsSection;
