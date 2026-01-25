import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ArrowLeft, Maximize2, Shield, BookOpen } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import type { Project, ProjectImage } from './ProjectsSection';
import ImageMarquee from './ImageMarquee';

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectDetailModal = ({ project, isOpen, onClose }: ProjectDetailModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

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
    if (!isOpen || !project || project.images.length <= 1 || !isAutoPlaying || isFullscreen) return;
    
    const interval = setInterval(nextImage, 4000);
    return () => clearInterval(interval);
  }, [isOpen, project, isAutoPlaying, nextImage, isFullscreen]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
      setIsAutoPlaying(true);
      setIsFullscreen(false);
    }
  }, [isOpen, project]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose, isFullscreen]);

  if (!project) return null;

  const hasMultipleImages = project.images.length > 1;
  const currentImage = project.images[currentImageIndex];

  // Fullscreen Canvas View
  if (isFullscreen) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-background flex flex-col items-center justify-center"
          onClick={() => setIsFullscreen(false)}
        >
          {/* Return to Canvas Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={(e) => { e.stopPropagation(); setIsFullscreen(false); }}
            className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-lg glass-card text-foreground hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Return to Canvas</span>
          </motion.button>

          {/* Image Label */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg glass-card text-foreground font-medium"
          >
            {currentImage.label}
          </motion.div>

          <motion.img
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            src={currentImage.src}
            alt={`${project.title} - ${currentImage.label}`}
            className="max-w-[95vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Navigation for fullscreen */}
          {hasMultipleImages && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full glass-card hover:bg-muted transition-colors z-20"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full glass-card hover:bg-muted transition-colors z-20"
              >
                <ChevronRight className="w-8 h-8" />
              </button>

              {/* Scrollable Thumbnail Strip */}
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 max-w-[90vw] overflow-x-auto">
                <div className="flex gap-2 p-2 rounded-xl glass-card">
                  {project.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                      className={`relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden transition-all ${
                        idx === currentImageIndex 
                          ? 'ring-2 ring-primary' 
                          : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img 
                        src={img.src} 
                        alt={img.label}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    );
  }

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
            {/* Featured Badge */}
            {project.featured && (
              <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground text-xs font-bold flex items-center gap-1">
                <Shield className="w-3 h-3" />
                FEATURED CASE STUDY
              </div>
            )}

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
                      src={currentImage.src}
                      alt={`${project.title} - ${currentImage.label}`}
                      className="w-full h-full object-cover cursor-pointer"
                      initial={!hasMultipleImages ? { scale: 1 } : {}}
                      animate={!hasMultipleImages ? { scale: 1.05 } : {}}
                      transition={!hasMultipleImages ? { 
                        duration: 10, 
                        repeat: Infinity, 
                        repeatType: "reverse" 
                      } : {}}
                      loading="lazy"
                      onClick={() => setIsFullscreen(true)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                  </motion.div>
                </AnimatePresence>

                {/* Image Label */}
                <motion.div
                  key={`label-${currentImageIndex}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-16 left-4 z-10 px-3 py-1 rounded-lg glass-card text-sm font-medium"
                >
                  {currentImage.label}
                </motion.div>

                {/* View Canvas Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setIsFullscreen(true)}
                  className="absolute top-4 right-14 z-10 flex items-center gap-2 px-3 py-2 rounded-lg glass-card hover:bg-muted transition-colors"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span className="text-sm font-medium">View Canvas</span>
                </motion.button>

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

                    {/* Dots indicator with labels */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {project.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          title={img.label}
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

                {/* Impact Stats for Featured */}
                {project.featured && project.impact && (
                  <div className="grid grid-cols-2 gap-4">
                    {project.impact.timeSaved && (
                      <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/20 text-center">
                        <div className="text-2xl font-bold text-secondary">{project.impact.timeSaved}</div>
                        <div className="text-sm text-muted-foreground">Time Saved Daily</div>
                      </div>
                    )}
                    {project.impact.protection && (
                      <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-center">
                        <div className="text-sm font-bold text-primary">{project.impact.protection}</div>
                      </div>
                    )}
                  </div>
                )}

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

                {/* Zoom into Logic Button - for Revenue Shield */}
                {project.slug === 'revenue-shield' && (
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-primary text-sm">Technical Deep-Dive</h4>
                        <p className="text-xs text-muted-foreground">See the Number() type-casting logic</p>
                      </div>
                      <button
                        onClick={() => {
                          // Find the Number() Type-Casting image index
                          const targetIndex = project.images.findIndex(img => 
                            img.label.toLowerCase().includes('number') || img.label.toLowerCase().includes('type-casting')
                          );
                          if (targetIndex >= 0) {
                            setCurrentImageIndex(targetIndex);
                            setIsFullscreen(true);
                          }
                        }}
                        className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                      >
                        <Maximize2 className="w-4 h-4" />
                        Zoom into Logic
                      </button>
                    </div>
                  </div>
                )}

                {/* CTAs */}
                <div className="flex gap-3 pt-4">
                  {project.caseStudy && (
                    <Link
                      to={`/case-study/${project.slug}`}
                      onClick={onClose}
                      className="flex-1 py-3 px-6 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary font-semibold text-center hover:bg-secondary/20 transition-colors flex items-center justify-center gap-2"
                    >
                      <BookOpen className="w-4 h-4" />
                      Read Case Study
                    </Link>
                  )}
                  <a
                    href="#contact"
                    onClick={onClose}
                    className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold text-center hover:opacity-90 transition-opacity"
                  >
                    Build My Workflow
                  </a>
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
