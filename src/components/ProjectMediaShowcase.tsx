import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ProjectMedia {
  label: string;
  embedUrl: string;
  sourceUrl: string;
}

interface Props {
  media: ProjectMedia[];
  projectTitle: string;
  compact?: boolean;
}

const ProjectMediaShowcase = ({ media, projectTitle, compact = false }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => setActiveIndex(0), [projectTitle]);

  if (!media.length) return null;

  const active = media[activeIndex];
  const previous = () => setActiveIndex((index) => (index === 0 ? media.length - 1 : index - 1));
  const next = () => setActiveIndex((index) => (index + 1) % media.length);

  return (
    <div className={`overflow-hidden border border-border/70 bg-background/60 ${compact ? 'mb-5 rounded-2xl' : 'rounded-2xl'}`}>
      <div className="relative aspect-video bg-muted">
        <iframe
          key={active.embedUrl}
          src={active.embedUrl}
          title={`${projectTitle}: ${active.label}`}
          className="h-full w-full border-0"
          loading="lazy"
          allow="autoplay; fullscreen"
          allowFullScreen
        />

        {media.length > 1 && (
          <>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={previous}
              className="absolute left-3 top-1/2 min-h-11 min-w-11 -translate-y-1/2 rounded-full border-border/70 bg-background/90 backdrop-blur-md"
              aria-label={`Previous media for ${projectTitle}`}
            >
              <ChevronLeft aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={next}
              className="absolute right-3 top-1/2 min-h-11 min-w-11 -translate-y-1/2 rounded-full border-border/70 bg-background/90 backdrop-blur-md"
              aria-label={`Next media for ${projectTitle}`}
            >
              <ChevronRight aria-hidden="true" />
            </Button>
          </>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div>
          <p className="text-xs font-semibold text-foreground">{active.label}</p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">{activeIndex + 1} of {media.length}</p>
        </div>
        <div className="flex items-center gap-2">
          {media.length > 1 && (
            <div className="flex gap-1.5" aria-label="Media slides">
              {media.map((item, index) => (
                <button
                  key={item.embedUrl}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`h-2 rounded-full transition-all ${index === activeIndex ? 'w-6 bg-primary' : 'w-2 bg-muted-foreground/40 hover:bg-muted-foreground/70'}`}
                  aria-label={`Show ${item.label}`}
                  aria-current={index === activeIndex ? 'true' : undefined}
                />
              ))}
            </div>
          )}
          <Button asChild variant="ghost" size="sm" className="min-h-10 rounded-lg text-xs">
            <a href={active.sourceUrl} target="_blank" rel="noopener noreferrer">
              Open source <ExternalLink aria-hidden="true" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectMediaShowcase;