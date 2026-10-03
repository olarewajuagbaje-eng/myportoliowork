import { useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ProjectCardData } from '@/components/ProjectCard';
import { trackProjectEvent } from '@/lib/projectAnalytics';
import ProjectMediaShowcase from '@/components/ProjectMediaShowcase';
import ConversionPrompt from '@/components/ConversionPrompt';

interface Props {
  project: ProjectCardData | null;
  onClose: () => void;
}

const CaseStudyModal = ({ project, onClose }: Props) => {
  useEffect(() => { if (project) trackProjectEvent(project.slug, 'modal_open'); }, [project]);

  return (
    <Dialog open={!!project} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="glass-card max-h-[90dvh] max-w-2xl overflow-y-auto rounded-3xl border-border/70">
        {project && (
          <>
            <DialogHeader className="text-left">
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">{project.eyebrow}</p>
              <DialogTitle className="font-display text-xl sm:text-2xl">{project.headline}</DialogTitle>
              <DialogDescription className="sr-only">Case study: problem, solution, result and technologies.</DialogDescription>
            </DialogHeader>

            {project.media && project.media.length > 0 && (
              <ProjectMediaShowcase media={project.media} projectTitle={project.headline} />
            )}

            {project.kpis && project.kpis.length > 0 && (
              <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/40 sm:grid-cols-3">
                {project.kpis.map((k) => (
                  <div key={k.label} className="flex flex-col-reverse items-center bg-background/80 px-3 py-3 text-center">
                    <dt className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">{k.label}</dt>
                    <dd className="font-display text-xl font-extrabold">{k.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="space-y-4">
              <section className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
                <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-destructive">Problem</h3>
                <p className="text-sm leading-relaxed text-foreground/85">{project.problem}</p>
              </section>
              <section className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Solution</h3>
                <p className="text-sm leading-relaxed text-foreground/85">{project.solution}</p>
              </section>
              <section className="rounded-2xl border border-secondary/20 bg-secondary/5 p-4">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Result</h3>
                <ul className="space-y-2">
                  {project.results.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-sm text-foreground/90">
                      <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />{r}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {project.architecture && project.architecture.length > 0 && (
              <section className="rounded-2xl border border-border/70 bg-background/40 p-4">
                <h3 className="mb-3 text-xs font-semibold uppercase text-primary">System architecture</h3>
                <ul className="space-y-2">
                  {project.architecture.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-foreground/85">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <ul aria-label="Technologies used" className="flex flex-wrap gap-1.5">
              {project.tags.map((t) => (
                <li key={t}><Badge variant="secondary" className="rounded-full">{t}</Badge></li>
              ))}
            </ul>

            <ConversionPrompt onBefore={() => { trackProjectEvent(project.slug, 'cta_click'); onClose(); }} />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CaseStudyModal;
