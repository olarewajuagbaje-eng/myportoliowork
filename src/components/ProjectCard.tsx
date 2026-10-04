import { useEffect, useRef, useId } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ArrowUpRight, PlayCircle, FileStack, BookOpen, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { trackProjectEvent } from '@/lib/projectAnalytics';
import ProjectMediaShowcase, { type ProjectMedia } from '@/components/ProjectMediaShowcase';

export interface ProjectKpi {
  value: string;
  label: string;
}

export type CtaActionType = 'external' | 'anchor' | 'route' | 'modal';
export type CtaIconName = 'PlayCircle' | 'FileStack' | 'BookOpen' | 'Calendar' | 'ArrowUpRight';

export interface ProjectCta {
  label: string;
  actionType: CtaActionType;
  href?: string;
  icon?: CtaIconName;
}

export interface ProjectCardData {
  slug: string;
  name: string;
  eyebrow: string;
  headline: string;
  kpis?: ProjectKpi[];
  problem: string;
  solution: string;
  results: string[];
  tags: string[];
  themeClass: string;
  cta: ProjectCta;
  secondaryCta?: ProjectCta;
  media?: ProjectMedia[];
  architecture?: string[];
}

const ICONS = { PlayCircle, FileStack, BookOpen, Calendar, ArrowUpRight };

interface Props {
  project: ProjectCardData;
  onOpenCaseStudy?: (project: ProjectCardData) => void;
}

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background';

const CtaAction = ({
  cta, project, variant, onOpenCaseStudy,
}: { cta: ProjectCta; project: ProjectCardData; variant: 'primary' | 'secondary'; onOpenCaseStudy?: Props['onOpenCaseStudy'] }) => {
  const Icon = cta.icon ? ICONS[cta.icon] : cta.actionType === 'modal' ? BookOpen : ArrowUpRight;
  const eventType = variant === 'primary' ? 'cta_click' : 'secondary_click';
  const track = () => trackProjectEvent(project.slug, eventType);
  const external = cta.actionType === 'external';
  const ariaLabel = `${cta.label}: ${project.headline}${external ? ' (opens in a new tab)' : ''}`;
  const className =
    variant === 'primary'
      ? `featured-project-button group/cta min-h-11 w-full rounded-xl px-5 text-sm font-semibold transition-all duration-300 hover:shadow-[0_0_28px_-6px_hsl(var(--primary)/0.65)] active:scale-[0.98] sm:w-auto ${focusRing}`
      : `group/cta min-h-11 w-full rounded-xl px-5 text-sm font-medium sm:w-auto ${focusRing}`;
  const icon = <Icon className="h-4 w-4 transition-transform duration-300 group-hover/cta:scale-110" aria-hidden="true" />;

  if (cta.actionType === 'modal') {
    return (
      <Button
        type="button"
        variant={variant === 'primary' ? 'default' : 'outline'}
        className={className}
        aria-haspopup="dialog"
        aria-label={ariaLabel}
        onClick={() => { track(); onOpenCaseStudy?.(project); }}
      >
        {cta.label}{icon}
      </Button>
    );
  }
  const href = cta.href ?? '#contact';
  return (
    <Button asChild variant={variant === 'primary' ? 'default' : 'outline'} className={className}>
      {cta.actionType === 'route' ? (
        <Link to={href} onClick={track} aria-label={ariaLabel}>{cta.label}{icon}</Link>
      ) : (
        <a href={href} onClick={track} aria-label={ariaLabel} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          {cta.label}{icon}
        </a>
      )}
    </Button>
  );
};

const ProjectCard = ({ project, onOpenCaseStudy }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const uid = useId();
  const titleId = `${uid}-title`;

  // Impression tracking for conversion-rate baseline
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { trackProjectEvent(project.slug, 'impression'); io.disconnect(); } },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [project.slug]);

  return (
    <Card
      ref={ref}
      role="article"
      aria-labelledby={titleId}
      className={`featured-project-card ${project.themeClass} group overflow-hidden rounded-[1.75rem] border-border/70 bg-card/70 shadow-[var(--shadow-elevated)] backdrop-blur-xl transition-transform duration-300 hover:scale-[1.015] focus-within:ring-1 focus-within:ring-primary/50`}
    >
      <CardContent className="flex flex-col p-5 sm:p-7">
        {project.media && project.media.length > 0 && (
          <ProjectMediaShowcase media={project.media} projectTitle={project.headline} compact />
        )}
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">{project.eyebrow}</p>
            <h3 id={titleId} className="mt-2 max-w-xl font-display text-lg font-bold leading-tight sm:text-2xl">
              {project.headline}
            </h3>
          </div>
          <div className="featured-project-badge shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]" aria-hidden="true">
            {project.name}
          </div>
        </div>

        {project.kpis && project.kpis.length > 0 && (
          <dl
            aria-label={`Key results for ${project.name}`}
            className="mb-5 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/40 sm:grid-cols-3"
          >
            {project.kpis.map((kpi) => (
              <div
                key={kpi.label}
                tabIndex={0}
                aria-label={`${kpi.value} ${kpi.label}`}
                className={`kpi-cell flex flex-col-reverse items-center justify-center bg-background/80 px-3 py-4 text-center backdrop-blur-md ${focusRing} focus-visible:ring-inset focus-visible:ring-offset-0`}
              >
                <dt className="mt-1 font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">{kpi.label}</dt>
                <dd className="kpi-value font-display text-xl font-extrabold tracking-tight text-foreground transition-all duration-300 group-hover:text-primary sm:text-2xl">
                  {kpi.value}
                </dd>
              </div>
            ))}
          </dl>
        )}

        <div className="space-y-4">
          <section aria-label="The client problem">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">The Client Problem</p>
            <p className="text-sm leading-relaxed text-foreground/85 sm:text-[15px]">{project.problem}</p>
          </section>
          <section aria-label="The solution">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">The Solution</p>
            <p className="text-sm leading-relaxed text-foreground/85 sm:text-[15px]">{project.solution}</p>
          </section>
          <section aria-label="The business result">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-secondary">The Business Result</p>
            <ul className="space-y-2">
              {project.results.map((result) => (
                <li key={result} className="flex items-start gap-2.5 rounded-xl border border-border/50 bg-background/25 px-3 py-2.5 backdrop-blur-md">
                  <span className="featured-project-icon mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border/60 bg-background/40" aria-hidden="true">
                    <TrendingUp className="h-3 w-3" />
                  </span>
                  <span className="text-xs leading-relaxed text-foreground/90 sm:text-sm">{result}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <ul aria-label="Technologies used" className="mt-5 flex flex-wrap gap-1.5 border-t border-border/40 pt-4">
          {project.tags.map((tag) => (
            <li key={tag}>
              <Badge variant="secondary" className="rounded-full border border-border/50 bg-background/30 px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                {tag}
              </Badge>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-2 pt-5 sm:flex-row sm:flex-wrap">
          <CtaAction cta={project.cta} project={project} variant="primary" onOpenCaseStudy={onOpenCaseStudy} />
          {project.secondaryCta && (
            <CtaAction cta={project.secondaryCta} project={project} variant="secondary" onOpenCaseStudy={onOpenCaseStudy} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
