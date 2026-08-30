import { motion } from 'framer-motion';
import ProjectCard, { type ProjectCardData } from '@/components/ProjectCard';

interface ProjectGridProps {
  projects: ProjectCardData[];
}

const ProjectGrid = ({ projects }: ProjectGridProps) => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
    {projects.map((project, i) => (
      <motion.div
        key={project.name}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
        className="h-full"
      >
        <ProjectCard project={project} />
      </motion.div>
    ))}
  </div>
);

export default ProjectGrid;
