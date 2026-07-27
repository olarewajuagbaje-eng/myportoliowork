import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Layers3, MessageCircleMore, ShieldCheck, Sparkles, Stethoscope, Pill, Bot, ChevronLeft, ChevronRight, PlayCircle, Gauge, Ghost, LineChart, Workflow, Brain, ShoppingCart, RefreshCw, Bell, Pause, Play, PhoneCall, Webhook, FileStack, Users2, ShieldAlert, MapPin, CalendarRange, UserCheck, Send, Rss, Cpu, Image as ImageIcon, CloudUpload, RotateCcw, Car, Database, Radio, Truck, Route, Lock, LayoutTemplate, Code2, CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

interface FeaturedProject {
  name: string;
  eyebrow: string;
  headline: string;
  subheadline: string;
  features: { icon: React.ComponentType<{ className?: string }>; text: string }[];
  tags: string[];
  ctaLabel: string;
  ctaHref: string;
  ctaIcon?: React.ComponentType<{ className?: string }>;
  themeClass: string;
}

const featuredProjects: FeaturedProject[] = [
  {
    name: 'FlowDesk',
    eyebrow: 'CRM & Automation',
    headline: 'FlowDesk: The Small Business Operations Hub',
    subheadline: 'A full suite CRM designed to automate lead capture and service workflows.',
    features: [
      { icon: MessageCircleMore, text: 'Direct Gmail & Telegram Integration for real time alerts.' },
      { icon: Layers3, text: 'Embeddable Booking & Chatbot widgets for external sites.' },
      { icon: ShieldCheck, text: 'Multi user Team Management with Role Based Access Control.' },
    ],
    tags: ['React', 'Supabase', 'CRM Automation', 'SaaS'],
    ctaLabel: 'Launch App',
    ctaHref: 'https://getflowdesk.lovable.app',
    themeClass: 'featured-project-service',
  },
  {
    name: 'VitaFlow',
    eyebrow: 'Wellness OS',
    headline: 'VitaFlow: AI Powered Wellness Operating System',
    subheadline: 'An all in one health ecosystem replacing fragmented apps with intelligent data.',
    features: [
      { icon: Stethoscope, text: '11 Integrated Modules (Telehealth, Med Tracking, Nutrition).' },
      { icon: Sparkles, text: 'AI Generated Recipes and Reflective Journaling insights.' },
      { icon: Pill, text: 'Automated Medication reminders via Telegram bot.' },
    ],
    tags: ['AI/ML', 'HealthTech', 'Tailwind CSS', 'Edge Functions'],
    ctaLabel: 'View Live',
    ctaHref: 'https://vita-flow-zen.lovable.app',
    themeClass: 'featured-project-wellness',
  },
  {
    name: 'Sales Engine',
    eyebrow: 'B2B Conversion OS',
    headline: 'The Automated B2B Sales Conversion Engine',
    subheadline: 'A closed loop sales engine that eliminates the "Leaky Funnel", capturing, scoring, and routing leads from inquiry to booked discovery call with zero drop off.',
    features: [
      { icon: Workflow, text: 'Instant Pipeline Routing. Auto generates deal cards with monetary values (e.g. €4,500) and pushes them to the executive dashboard.' },
      { icon: Gauge, text: 'Dynamic Lead Scoring. Background math operations grade prospects on engagement (+10 inquiry, +20 booking).' },
      { icon: Ghost, text: 'The "Ghost Trap" Engine. A 1 hour time delayed logic gate that deploys a premium HTML nurture sequence to recapture cold leads.' },
      { icon: LineChart, text: 'Executive Dashboarding. Live visibility into pipeline value, conversion rates, and scheduled appointments.' },
    ],
    tags: ['GoHighLevel (GHL)', 'Custom HTML', 'Pipeline Automation', 'Dynamic Scoring'],
    ctaLabel: 'Watch Video Demo',
    ctaHref: 'https://drive.google.com/file/d/1Ct1PmftfwrdmM8NY1q7uHT76PaJVpTEA/view?usp=drivesdk',
    themeClass: 'featured-project-sales',
    ctaIcon: PlayCircle,
  },
  {
    name: 'ROR AI Engine',
    eyebrow: 'B2B Conversion OS',
    headline: 'AI Triage & GHL CRM Engine',
    subheadline: "A high performance 'Ghost Sales Team' designed to maximize direct to purchase funnel ROI by combining clinical AI diagnostics with autonomous recovery logic.",
    features: [
      { icon: Brain, text: 'AI Triage Agent. A custom prompted advisor that extracts lead data via natural conversation and syncs directly to the CRM.' },
      { icon: ShoppingCart, text: 'Behavioral Cart Recovery. An n8n orchestrated loop that identifies abandoned checkouts and triggers AI generated email sequences.' },
      { icon: RefreshCw, text: 'GHL CRM Integration. Real time synchronization between chat sessions, order forms, and master databases.' },
      { icon: Bell, text: 'Enterprise Notifications. Branded HTML team alerts providing instant lead summaries and clinical diagnostics.' },
    ],
    tags: ['n8n', 'CourseCreator 360 (GHL)', 'Groq (Llama 3.3)', 'Google Sheets'],
    ctaLabel: 'Watch Demo',
    ctaHref: 'https://drive.google.com/file/d/1HEoafNeV5KcFHYNwNeuvxjlgXGgaAC_N/view?usp=drivesdk',
    themeClass: 'featured-project-sales',
    ctaIcon: PlayCircle,
  },
  {
    name: 'Voice AI',
    eyebrow: 'Enterprise Voice OS',
    headline: 'Enterprise Voice AI Overflow System',
    subheadline: 'Engineered an autonomous voice agent ("Violet") to handle after hours healthcare calls with empathy, accuracy, and enterprise grade logging.',
    features: [
      { icon: PhoneCall, text: 'Uptiq Voice Capture. Violet greets callers, gathers patient inquiries, and captures structured intake data inside the GHL ecosystem.' },
      { icon: Webhook, text: 'Secure n8n Routing. Structured JSON payloads flow through an authenticated n8n webhook for orchestration and enrichment.' },
      { icon: FileStack, text: 'SharePoint Logging. Power Automate writes call summaries, custom fields, and escalation statuses into a SharePoint database of record.' },
      { icon: Users2, text: 'Teams Escalation. Critical calls instantly notify the response team in Microsoft Teams with rich, branded alert cards.' },
    ],
    tags: ['Uptiq (GHL)', 'n8n', 'Power Automate', 'SharePoint'],
    ctaLabel: 'Watch Demo',
    ctaHref: '#contact',
    themeClass: 'featured-project-wellness',
    ctaIcon: PlayCircle,
  },
  {
    name: 'Content Engine',
    eyebrow: 'Autonomous Publishing OS',
    headline: 'Autonomous Content Production Engine',
    subheadline: 'A decoupled, state machine architecture that transforms raw social links into a fully formatted, human verified WordPress publishing pipeline with zero junk data.',
    features: [
      { icon: ShieldAlert, text: 'Gatekeeper Trigger. Airtable Active/Pending status eliminates runaway API costs and junk scraping.' },
      { icon: MapPin, text: 'Dynamic City Routing. Event Resource tags route payloads to correct WordPress categories with no hardcoding.' },
      { icon: CalendarRange, text: '8 Week Multiplier. Detects recurring events and auto calculates the next 8 weeks of unique dates.' },
      { icon: UserCheck, text: 'HITL Staging. AI text is wrapped in HTML inside Airtable Rich Text for human approval before publishing.' },
      { icon: Send, text: 'Decoupled Publisher. A segregated 5 minute polling workflow pushes only approved content to live WordPress.' },
    ],
    tags: ['n8n', 'Airtable', 'WordPress REST API', 'OpenAI / Claude'],
    ctaLabel: 'View Architecture',
    ctaHref: '#contact',
    themeClass: 'featured-project-service',
  },
  {
    name: 'Render Engine',
    eyebrow: 'Content & Render Pipeline',
    headline: 'Autonomous AI Content & Render Engine',
    subheadline: 'A 100% autonomous bi daily pipeline that researches trends, drafts framework driven copy, and renders branded PNGs via a custom Puppeteer microservice.',
    features: [
      { icon: Rss, text: 'Intelligent Research. Scrapes Hacker News, TechCrunch, and OpenAI RSS to aggregate trending data.' },
      { icon: Cpu, text: 'AI Content Brain. Dynamically selects one of 8 frameworks (Tutorial, Workflow, Checklist, Case Study, more).' },
      { icon: ImageIcon, text: 'Custom Render Microservice. Node.js/Puppeteer injects JSON payloads into HTML/SVG templates for hi res PNGs.' },
      { icon: CloudUpload, text: 'Storage & Distribution. Uploads to Supabase storage and distributes via Buffer API.' },
      { icon: RotateCcw, text: 'Idempotent Retries. 3 strike loops with 5s delays absorb cold starts for maximum uptime.' },
    ],
    tags: ['n8n', 'Node.js / Puppeteer', 'Supabase', 'Groq / OpenAI', 'Buffer API'],
    ctaLabel: 'View Case Study',
    ctaHref: '#contact',
    themeClass: 'featured-project-sales',
  },
  {
    name: 'AutoMatch',
    eyebrow: 'AI Car Brokerage',
    headline: 'AutoMatch: Zero Touch AI Car Brokerage',
    subheadline: 'A production grade platform that automates the full lead to deal workflow with a multi model AI consensus engine, removing manual dealer coordination.',
    features: [
      { icon: Brain, text: 'AI Consensus Engine. Cross validates Groq, Gemini, and OpenAI outputs to lock in high confidence matches.' },
      { icon: Workflow, text: 'Zero Touch Pipeline. n8n orchestrates intake, scoring, dealer routing, and buyer notifications end to end.' },
      { icon: Database, text: 'Supabase Backbone. Postgres, Realtime, and RLS power a secure, auditable transaction ledger.' },
      { icon: Car, text: 'Lead to Deal Automation. Converts raw buyer intent into a closed loop brokerage workflow with zero manual ops.' },
    ],
    tags: ['n8n', 'Supabase', 'Groq', 'Gemini', 'OpenAI'],
    ctaLabel: 'Launch App',
    ctaHref: 'https://driveway-dealer.lovable.app',
    themeClass: 'featured-project-wellness',
  },
  {
    name: 'JNK Logistics',
    eyebrow: 'RevOps Command Center',
    headline: 'JNK Logistics Flow: Real Time Dispatch & CRM Command Center',
    subheadline: 'A high density dispatch and client portal built on Supabase Realtime, with AI assisted internal comms and airtight identity integrity for high volume bookings.',
    features: [
      { icon: ShieldCheck, text: 'Identity & Data Integrity. Email based upsert logic eliminates database leakage and duplicate CRM records.' },
      { icon: Route, text: 'Live Client Portal. Dynamic state machine with SVG routing animations and conditional POD document gating.' },
      { icon: Truck, text: 'RevOps Command Center. Enterprise dispatch UI with Supabase Realtime fleet and revenue sync, no page reloads.' },
      { icon: Lock, text: 'Secure Enterprise Messaging. RLS governed comms hub with an integrated Groq AI summarization assistant.' },
    ],
    tags: ['Lovable (React)', 'Supabase (Postgres, Realtime, RLS)', 'n8n', 'Groq (Llama 3)'],
    ctaLabel: 'View Live Demo',
    ctaHref: 'https://jnk-logistics-flow.lovable.app',
    themeClass: 'featured-project-service',
  },
  {
    name: 'Masterclass',
    eyebrow: 'High-Ticket Funnel',
    headline: 'Architecture Masterclass Funnel & Infrastructure',
    subheadline: 'Built a high-ticket conversion funnel and automated customer acquisition infrastructure with custom-coded dark-mode UI, interactive module previews, secure checkout styling, and automated backend routing.',
    features: [
      { icon: Code2, text: 'Custom-coded dark-mode UI engineered for premium brand trust and conversion.' },
      { icon: LayoutTemplate, text: 'Interactive module previews that let prospects experience the curriculum before buying.' },
      { icon: CreditCard, text: 'Secure checkout styling and trust signals for high-ticket course transactions.' },
      { icon: Workflow, text: 'Automated backend routing between GoHighLevel, n8n, and Supabase.' },
    ],
    tags: ['GoHighLevel', 'Custom HTML/CSS', 'n8n', 'Supabase'],
    ctaLabel: 'View Live Preview',
    ctaHref: 'https://sites.leadconnectorhq.com/preview/WH0tMAV06vMVunjvnmgz?notrack=true',
    themeClass: 'featured-project-masterclass',
  },
];

const ProjectCardContent = ({ project }: { project: FeaturedProject }) => (
  <CardContent className="flex h-full flex-col p-5 sm:p-6">
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
          {project.eyebrow}
        </p>
        <h3 className="mt-1.5 max-w-xl font-display text-lg font-bold leading-tight sm:text-2xl">
          {project.headline}
        </h3>
      </div>
      <div className="featured-project-badge shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]">
        {project.name}
      </div>
    </div>

    <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
      {project.subheadline}
    </p>

    <div className="mt-4 space-y-2">
      {project.features.map((feature) => {
        const Icon = feature.icon;
        return (
          <div key={feature.text} className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-background/30 px-3 py-2.5 backdrop-blur-md">
            <span className="featured-project-icon mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border/60 bg-background/40">
              <Icon className="h-3.5 w-3.5" />
            </span>
            <p className="text-xs leading-relaxed text-foreground/90 sm:text-sm">{feature.text}</p>
          </div>
        );
      })}
    </div>

    <div className="mt-4 flex flex-wrap gap-1.5">
      {project.tags.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className="rounded-full border border-border/60 bg-background/40 px-2.5 py-0.5 text-[11px] font-medium text-foreground/85"
        >
          {tag}
        </Badge>
      ))}
    </div>

    <div className="mt-auto pt-5">
      <Button
        asChild
        size="default"
        className="featured-project-button min-h-10 w-full rounded-xl px-5 text-sm font-semibold sm:w-auto"
      >
        <a href={project.ctaHref} target="_blank" rel="noreferrer">
          {project.ctaLabel}
          {project.ctaIcon ? <project.ctaIcon className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
        </a>
      </Button>
    </div>
  </CardContent>
);

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
                  <Card
                    className={`featured-project-card ${project.themeClass} group h-full overflow-hidden rounded-[1.75rem] border-border/70 bg-card/70 shadow-[var(--shadow-elevated)] backdrop-blur-xl transition-transform duration-300 hover:scale-[1.015]`}
                  >
                    <ProjectCardContent project={project} />
                  </Card>
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
