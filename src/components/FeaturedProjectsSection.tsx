import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Bot, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import ProjectCard, { type ProjectCardData } from '@/components/ProjectCard';
import CaseStudyModal from '@/components/CaseStudyModal';
import { useFeaturedProjects } from '@/hooks/useFeaturedProjects';
import { projects as workflowLibrary } from '@/components/ProjectsSection';

type Cat = 'n8n' | 'ghl' | 'saas';
const CATEGORY: Record<string, Cat> = {
  stockguard: 'n8n', 'docextract-ai': 'n8n', flowdesk: 'saas', vitaflow: 'saas',
  'b2b-sales-engine': 'ghl', 'ror-ai-engine': 'ghl', 'voice-ai-overflow': 'ghl',
  'content-production-engine': 'n8n', 'render-engine': 'n8n', 'jnk-logistics-flow': 'n8n',
  'architecture-masterclass': 'ghl', 'smilecare-dental-ai-voice': 'n8n',
};
const ORDER = ['stockguard','docextract-ai','flowdesk','vitaflow','b2b-sales-engine','ror-ai-engine','voice-ai-overflow','content-production-engine','render-engine','jnk-logistics-flow','architecture-masterclass','smilecare-dental-ai-voice'];
const EXCLUDED = new Set(['automatch']);
const N8N_TITLES = ['Automated Recruitment Pipeline','AI Research & Content Factory','YouTube-to-Social Content Architect','Video Cinematic Engine','The Autonomous Literary Architect'];
const n8nWorkflows: ProjectCardData[] = workflowLibrary
  .filter((p) => N8N_TITLES.includes(p.title))
  .map((p) => ({
    slug: `wf-${p.slug}`,
    name: p.title,
    eyebrow: 'n8n Workflow Automation',
    headline: p.title,
    kpis: p.caseStudy?.metrics.slice(0, 3).map((m) => ({ value: m.value, label: m.label })),
    problem: p.problem,
    solution: p.solution,
    results: p.results ?? (p.roiImpact ? [p.roiImpact] : []),
    tags: p.tools.filter((t) => !/ghl|gohighlevel/i.test(t)),
    themeClass: 'featured-project-service',
    cta: { label: 'View Case Study', actionType: 'modal' },
    secondaryCta: { label: 'Book A Strategy Call', actionType: 'anchor', href: '#contact' },
  }) as ProjectCardData);
const FILTERS: { value: 'all' | Cat; label: string }[] = [
  { value: 'all', label: 'All Projects' }, { value: 'n8n', label: 'n8n' },
  { value: 'ghl', label: 'GHL (GoHighLevel)' }, { value: 'saas', label: 'SaaS' },
];

const AUTOPLAY_MS = 8000;

const FeaturedProjectsSection = () => {
  const isMobile = useIsMobile();
  const [isXl, setIsXl] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1280px)');
    const on = () => setIsXl(mq.matches); on();
    mq.addEventListener('change', on); return () => mq.removeEventListener('change', on);
  }, []);
  const cardsPerView = isMobile ? 1 : isXl ? 3 : 2;
  const [filter, setFilter] = useState<'all' | Cat>('all');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [openProject, setOpenProject] = useState<ProjectCardData | null>(null);
  const { data: rawProjects = [] } = useFeaturedProjects();
  const allProjects = useMemo(() => {
    const core = rawProjects
      .filter((p) => !EXCLUDED.has(p.slug) && CATEGORY[p.slug])
      .sort((a, b) => ORDER.indexOf(a.slug) - ORDER.indexOf(b.slug))
      .map((p) => ({ p, c: CATEGORY[p.slug] }));
    return [...core, ...n8nWorkflows.map((p) => ({ p, c: 'n8n' as Cat }))];
  }, [rawProjects]);
  const counts = useMemo(() => ({
    all: allProjects.length,
    n8n: allProjects.filter((x) => x.c === 'n8n').length,
    ghl: allProjects.filter((x) => x.c === 'ghl').length,
    saas: allProjects.filter((x) => x.c === 'saas').length,
  }), [allProjects]);
  const featuredProjects = useMemo(
    () => allProjects.filter((x) => filter === 'all' || x.c === filter).map((x) => x.p),
    [allProjects, filter],
  );
  const total = featuredProjects.length;
  const maxIndex = Math.max(0, total - cardsPerView);

  const next = () => setActiveIndex((i) => (i >= maxIndex ? 0 : i + 1));
  const prev = () => setActiveIndex((i) => (i <= 0 ? maxIndex : i - 1));

  // Reset index when viewport changes
  useEffect(() => {
    setActiveIndex(0);
  }, [cardsPerView, filter]);

  // Autoplay
  useEffect(() => {
    if (isPaused || openProject) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i >= maxIndex ? 0 : i + 1));
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [isPaused, maxIndex, openProject]);

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

        <div className="mb-6 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Filter projects by category">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              role="tab"
              aria-selected={filter === f.value}
              onClick={() => setFilter(f.value)}
              className={`min-h-[44px] rounded-full border px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                filter === f.value ? 'border-primary bg-primary text-primary-foreground' : 'border-border/70 bg-card/60 text-muted-foreground hover:text-foreground'
              }`}
            >
              {f.label} <span className="ml-1 opacity-70">({counts[f.value]})</span>
            </button>
          ))}
        </div>

        {/* Auto-slider carousel */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsPaused(false); }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
            if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
          }}
          role="region"
          aria-roledescription="carousel"
          aria-label="Featured case studies. Use left and right arrow keys to browse."
        >
          <div className="overflow-hidden -mx-3">
            <motion.div
              className="flex items-stretch touch-pan-y"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x < -50) next();
                else if (info.offset.x > 50) prev();
              }}
              animate={{ x: `-${translatePct}%` }}
              transition={{ type: 'spring', stiffness: 90, damping: 20 }}
            >
              {featuredProjects.map((project, i) => {
                const visible = i >= activeIndex && i < activeIndex + cardsPerView;
                return (
                <div
                  key={project.slug}
                  className="flex shrink-0 px-3 [&>*]:w-full"
                  style={{ width: `${slideWidthPct}%` }}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${total}`}
                  aria-hidden={!visible}
                  {...(!visible ? { inert: '' as unknown as boolean } : {})}
                >
                  <ProjectCard project={project} onOpenCaseStudy={setOpenProject} />
                </div>
                );
              })}
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
                  aria-current={i === activeIndex ? 'true' : undefined}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground tabular-nums" aria-live="polite">
              {Math.min(activeIndex + 1, total)} / {maxIndex + 1}
            </span>

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
      <CaseStudyModal project={openProject} onClose={() => setOpenProject(null)} />
    </section>
  );
};

export default FeaturedProjectsSection;
