import { TrendingUp, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export interface ProjectKpi {
  value: string;
  label: string;
}

export interface ProjectCardData {
  name: string;
  eyebrow: string;
  headline: string;
  kpis?: ProjectKpi[];
  problem: string;
  solution: string;
  results: string[];
  tags: string[];
  ctaLabel: string;
  ctaHref: string;
  ctaIcon?: React.ComponentType<{ className?: string }>;
  themeClass: string;
}

const ProjectCard = ({ project }: { project: ProjectCardData }) => (
  <Card
    className={`featured-project-card ${project.themeClass} group h-full overflow-hidden rounded-[1.75rem] border-border/70 bg-card/70 shadow-[var(--shadow-elevated)] backdrop-blur-xl transition-transform duration-300 hover:scale-[1.015]`}
  >
    <CardContent className="flex h-full flex-col p-5 sm:p-7">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
            {project.eyebrow}
          </p>
          <h3 className="mt-2 max-w-xl font-display text-lg font-bold leading-tight sm:text-2xl">
            {project.headline}
          </h3>
        </div>
        <div className="featured-project-badge shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]">
          {project.name}
        </div>
      </div>

      {/* KPI Hero Banner */}
      {project.kpis && project.kpis.length > 0 && (
        <div className="mb-5 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/40 sm:grid-cols-3">
          {project.kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="kpi-cell flex flex-col items-center justify-center bg-background/80 px-3 py-4 text-center backdrop-blur-md"
            >
              <span className="kpi-value font-display text-xl font-extrabold tracking-tight text-foreground transition-all duration-300 group-hover:text-primary sm:text-2xl">
                {kpi.value}
              </span>
              <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
                {kpi.label}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            The Client Problem
          </p>
          <p className="text-sm leading-relaxed text-foreground/85 sm:text-[15px]">{project.problem}</p>
        </div>
        <div>
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
            The Solution
          </p>
          <p className="text-sm leading-relaxed text-foreground/85 sm:text-[15px]">{project.solution}</p>
        </div>
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-secondary">
            The Business Result
          </p>
          <ul className="space-y-2">
            {project.results.map((result) => (
              <li
                key={result}
                className="flex items-start gap-2.5 rounded-xl border border-border/50 bg-background/25 px-3 py-2.5 backdrop-blur-md"
              >
                <span className="featured-project-icon mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border/60 bg-background/40">
                  <TrendingUp className="h-3 w-3" />
                </span>
                <span className="text-xs leading-relaxed text-foreground/90 sm:text-sm">{result}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-1.5 border-t border-border/40 pt-4">
        {project.tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="rounded-full border border-border/50 bg-background/30 px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground"
          >
            {tag}
          </Badge>
        ))}
      </div>

      <div className="mt-auto pt-5">
        <Button
          asChild
          size="default"
          className="featured-project-button group/cta min-h-11 w-full rounded-xl px-5 text-sm font-semibold transition-all duration-300 hover:shadow-[0_0_28px_-6px_hsl(var(--primary)/0.65)] active:scale-[0.98] sm:w-auto"
        >
          <a href={project.ctaHref} target="_blank" rel="noreferrer">
            {project.ctaLabel}
            {project.ctaIcon ? (
              <project.ctaIcon className="h-4 w-4 transition-transform duration-300 group-hover/cta:scale-110" />
            ) : (
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
            )}
          </a>
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default ProjectCard;
