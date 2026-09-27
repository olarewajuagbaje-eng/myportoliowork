import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { ProjectCardData } from '@/components/ProjectCard';
import { featuredProjectsFallback } from '@/data/featuredProjects';

interface Row {
  slug: string; name: string; eyebrow: string; headline: string; problem: string; solution: string;
  results: string[]; tags: string[]; kpis: ProjectCardData['kpis']; theme_class: string;
  cta: ProjectCardData['cta']; secondary_cta: ProjectCardData['secondaryCta'] | null;
}

const toCard = (r: Row): ProjectCardData => ({
  slug: r.slug, name: r.name, eyebrow: r.eyebrow, headline: r.headline, problem: r.problem,
  solution: r.solution, results: r.results ?? [], tags: r.tags ?? [], kpis: r.kpis ?? [],
  themeClass: r.theme_class, cta: r.cta, secondaryCta: r.secondary_cta ?? undefined,
});

export function useFeaturedProjects() {
  return useQuery({
    queryKey: ['featured-projects'],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase.from('featured_projects' as any) as any)
        .select('*').eq('published', true).order('sort_order');
      if (error || !data?.length) return featuredProjectsFallback;
      return (data as Row[]).map(toCard);
    },
    placeholderData: featuredProjectsFallback,
    staleTime: 5 * 60 * 1000,
  });
}
