import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ExternalLink, ArrowLeft } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

interface Project {
  id: number;
  title: string;
  description: string;
  problem: string;
  solution: string;
  tools: string[];
  images: string[];
  link?: string;
}

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectDetailModal = ({ project, isOpen, onClose }: ProjectDetailModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextImage = useCallback(() => {
    if (project && project.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
    }
  }, [project]);

  const prevImage = () => {
    if (project && project.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? project.images.length - 1 : prev - 1
      );
    }
  };

  // Auto-play carousel
  useEffect(() => {
    if (!isOpen || !project || project.images.length <= 1 || !isAutoPlaying) return;
    
    const interval = setInterval(nextImage, 4000);
    return () => clearInterval(interval);
  }, [isOpen, project, isAutoPlaying, nextImage]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
      setIsAutoPlaying(true);
    }
  }, [isOpen, project]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!project) return null;

  const hasMultipleImages = project.images.length > 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-xl overflow-y-auto"
          onClick={onClose}
        >
          {/* Fixed Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={onClose}
            className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-lg glass-card text-foreground hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </motion.button>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto glass-card rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-background/80 hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid lg:grid-cols-2 gap-0">
              {/* Image Gallery */}
              <div 
                className="relative aspect-video lg:aspect-auto lg:min-h-[500px] overflow-hidden bg-muted"
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    {/* Parallax/Zoom effect for single images */}
                    <motion.img
                      src={project.images[currentImageIndex]}
                      alt={`${project.title} - Image ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                      initial={!hasMultipleImages ? { scale: 1 } : {}}
                      animate={!hasMultipleImages ? { scale: 1.05 } : {}}
                      transition={!hasMultipleImages ? { 
                        duration: 10, 
                        repeat: Infinity, 
                        repeatType: "reverse" 
                      } : {}}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                  </motion.div>
                </AnimatePresence>

                {/* Carousel Controls */}
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full glass-card hover:bg-muted transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full glass-card hover:bg-muted transition-colors"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Dots indicator */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {project.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === currentImageIndex 
                              ? 'bg-primary w-6' 
                              : 'bg-foreground/30 hover:bg-foreground/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Content */}
              <div className="p-8 lg:p-10 space-y-6">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold font-display mb-3">
                    {project.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Problem vs Solution */}
                <div className="grid gap-4">
                  <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                    <h3 className="font-semibold text-destructive mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-destructive" />
                      The Problem
                    </h3>
                    <p className="text-sm text-muted-foreground">{project.problem}</p>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/20">
                    <h3 className="font-semibold text-secondary mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-secondary" />
                      The Solution
                    </h3>
                    <p className="text-sm text-muted-foreground">{project.solution}</p>
                  </div>
                </div>

                {/* Tools */}
                <div>
                  <h4 className="font-semibold mb-3">Tools & Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tools.map((tool) => (
                      <span
                        key={tool}
                        className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary border border-primary/20"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="flex gap-3 pt-4">
                  <a
                    href="#contact"
                    onClick={onClose}
                    className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold text-center hover:opacity-90 transition-opacity"
                  >
                    Build My Workflow
                  </a>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl glass-card hover:bg-muted transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectDetailModal;
