import { useState } from 'react';
import { motion } from 'framer-motion';
import ProjectCard, { type ProjectCardData } from '@/components/ProjectCard';
import CaseStudyModal from '@/components/CaseStudyModal';
import { useFeaturedProjects } from '@/hooks/useFeaturedProjects';

interface ProjectGridProps {
  projects?: ProjectCardData[];
}

const ProjectGrid = ({ projects }: ProjectGridProps) => {
  const { data } = useFeaturedProjects();
  const list = projects ?? data ?? [];
  const [open, setOpen] = useState<ProjectCardData | null>(null);
  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {list.map((project, i) => (
          <motion.div
            key={project.slug}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
            className="h-full"
          >
            <ProjectCard project={project} onOpenCaseStudy={setOpen} />
          </motion.div>
        ))}
      </div>
      <CaseStudyModal project={open} onClose={() => setOpen(null)} />
    </>
  );
};

export default ProjectGrid;
