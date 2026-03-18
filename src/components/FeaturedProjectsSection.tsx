import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Layers3, MessageCircleMore, ShieldCheck, Sparkles, Stethoscope, Pill, Bot, ChevronLeft, ChevronRight } from 'lucide-react';
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
  themeClass: string;
}

const featuredProjects: FeaturedProject[] = [
  {
    name: 'FlowDesk',
    eyebrow: 'CRM & Automation',
    headline: 'FlowDesk: The Small Business Operations Hub',
    subheadline: 'A full-suite CRM designed to automate lead capture and service workflows.',
    features: [
      { icon: MessageCircleMore, text: 'Direct Gmail & Telegram Integration for real-time alerts.' },
      { icon: Layers3, text: 'Embeddable Booking & Chatbot widgets for external sites.' },
      { icon: ShieldCheck, text: 'Multi-user Team Management with Role-Based Access Control.' },
    ],
    tags: ['React', 'Supabase', 'CRM Automation', 'SaaS'],
    ctaLabel: 'Launch App',
    ctaHref: 'https://getflowdesk.lovable.app',
    themeClass: 'featured-project-service',
  },
  {
    name: 'VitaFlow',
    eyebrow: 'Wellness OS',
    headline: 'VitaFlow: AI-Powered Wellness Operating System',
    subheadline: 'An all-in-one health ecosystem replacing fragmented apps with intelligent data.',
    features: [
      { icon: Stethoscope, text: '11 Integrated Modules (Telehealth, Med-Tracking, Nutrition).' },
      { icon: Sparkles, text: 'AI-Generated Recipes and Reflective Journaling insights.' },
      { icon: Pill, text: 'Automated Medication reminders via Telegram bot.' },
    ],
    tags: ['AI/ML', 'HealthTech', 'Tailwind CSS', 'Edge Functions'],
    ctaLabel: 'View Live',
    ctaHref: 'https://vita-flow-zen.lovable.app',
    themeClass: 'featured-project-wellness',
  },
];

const ProjectCardContent = ({ project }: { project: FeaturedProject }) => (
  <CardContent className="flex h-full flex-col p-5 sm:p-8">
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted-foreground">
          {project.eyebrow}
        </p>
        <h3 className="mt-2 max-w-xl font-display text-xl font-bold leading-tight sm:text-3xl">
          {project.headline}
        </h3>
      </div>
      <div className="featured-project-badge shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em]">
        {project.name}
      </div>
    </div>

    <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-lg">
      {project.subheadline}
    </p>

    <div className="mt-6 space-y-3">
      {project.features.map((feature) => {
        const Icon = feature.icon;
        return (
          <div key={feature.text} className="flex items-start gap-3 rounded-2xl border border-border/60 bg-background/20 px-4 py-3">
            <span className="featured-project-icon mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/60 bg-background/40">
              <Icon className="h-4 w-4" />
            </span>
            <p className="text-sm leading-relaxed text-foreground/90">{feature.text}</p>
          </div>
        );
      })}
    </div>

    <div className="mt-6 flex flex-wrap gap-2">
      {project.tags.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className="rounded-full border border-border/60 bg-background/40 px-3 py-1 text-xs font-medium text-foreground/85"
        >
          {tag}
        </Badge>
      ))}
    </div>

    <div className="mt-auto pt-6">
      <Button
        asChild
        size="lg"
        className="featured-project-button min-h-11 w-full rounded-2xl px-6 text-base font-semibold sm:w-auto"
      >
        <a href={project.ctaHref} target="_blank" rel="noreferrer">
          {project.ctaLabel}
          <ArrowUpRight className="h-5 w-5" />
        </a>
      </Button>
    </div>
  </CardContent>
);

const FeaturedProjectsSection = () => {
  const isMobile = useIsMobile();
  const [activeIndex, setActiveIndex] = useState(0);

  const next = () => setActiveIndex((i) => (i + 1) % featuredProjects.length);
  const prev = () => setActiveIndex((i) => (i - 1 + featuredProjects.length) % featuredProjects.length);

  return (
    <section id="featured-projects" className="relative z-10 py-14 sm:py-18">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-10 max-w-3xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-4 py-2 backdrop-blur-xl">
            <Bot className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">Featured Projects</span>
          </div>
          <h2 className="font-display text-2xl font-bold leading-tight sm:text-4xl md:text-5xl">
            Strategic SaaS solutions built to bridge the gap between complex logic and intuitive user experiences.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-lg">
            Two polished product systems designed for clarity, automation depth, and premium end-user experience.
          </p>
        </motion.div>

        {/* Desktop: Side-by-side grid */}
        {!isMobile && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.name}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="h-full"
              >
                <Card
                  className={`featured-project-card ${project.themeClass} group h-full overflow-hidden rounded-[1.75rem] border-border/70 bg-card/70 shadow-[var(--shadow-elevated)] backdrop-blur-xl transition-transform duration-300 hover:scale-[1.02]`}
                >
                  <ProjectCardContent project={project} />
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Mobile: Swipeable card stack */}
        {isMobile && (
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.35 }}
              >
                <Card
                  className={`featured-project-card ${featuredProjects[activeIndex].themeClass} overflow-hidden rounded-[1.75rem] border-border/70 bg-card/70 shadow-[var(--shadow-elevated)] backdrop-blur-xl`}
                >
                  <ProjectCardContent project={featuredProjects[activeIndex]} />
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Navigation controls */}
            <div className="mt-4 flex items-center justify-center gap-4">
              <button
                onClick={prev}
                className="p-2 rounded-full glass-card hover:bg-muted transition-colors"
                aria-label="Previous project"
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                <ChevronLeft className="w-5 h-5 mx-auto" />
              </button>

              <div className="flex gap-2">
                {featuredProjects.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === activeIndex ? 'w-6 bg-primary' : 'w-2 bg-muted-foreground/40'
                    }`}
                    aria-label={`Go to project ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="p-2 rounded-full glass-card hover:bg-muted transition-colors"
                aria-label="Next project"
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                <ChevronRight className="w-5 h-5 mx-auto" />
              </button>
            </div>

            <p className="mt-2 text-center text-xs text-muted-foreground/60">
              Swipe or tap arrows to explore
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProjectsSection;
