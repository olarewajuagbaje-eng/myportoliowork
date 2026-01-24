import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Clock, Shield, Target, Zap } from 'lucide-react';
import { projects } from '@/components/ProjectsSection';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import N8nWorkflowBackground from '@/components/N8nWorkflowBackground';

const CaseStudy = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find(p => p.slug === slug);

  if (!project || !project.caseStudy) {
    return <Navigate to="/" replace />;
  }

  const { caseStudy } = project;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <N8nWorkflowBackground />
      <Header />
      
      <main className="relative z-10">
        {/* Hero Section with Background Image */}
        <section className="relative min-h-[70vh] flex items-center justify-center">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src={caseStudy.heroImage}
              alt={project.title}
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
          </div>

          <div className="container mx-auto px-6 py-32 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Back Link */}
              <Link
                to="/#projects"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Projects
              </Link>

              {/* Featured Badge */}
              {project.featured && (
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground text-xs font-bold mb-4">
                  <Shield className="w-3 h-3" />
                  FEATURED CASE STUDY
                </div>
              )}

              <h1 className="text-4xl md:text-6xl font-bold font-display mb-6 max-w-4xl">
                {project.title}
              </h1>

              <p className="text-xl text-muted-foreground max-w-3xl mb-8">
                {caseStudy.summary}
              </p>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
                {caseStudy.metrics.map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    className="p-4 rounded-xl glass-card text-center"
                  >
                    <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                      {metric.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {metric.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto space-y-16">
              {/* The Problem */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <Target className="w-5 h-5 text-destructive" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold">The Problem</h2>
                </div>
                <div className="p-6 rounded-xl bg-destructive/5 border border-destructive/20">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {project.problem}
                  </p>
                </div>
              </motion.div>

              {/* The Solution */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold">The Solution</h2>
                </div>
                <div className="p-6 rounded-xl bg-secondary/5 border border-secondary/20">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {project.solution}
                  </p>
                </div>
              </motion.div>

              {/* Workflow Gallery */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold">Workflow Architecture</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {project.images.map((image, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="relative rounded-xl overflow-hidden glass-card group"
                    >
                      <img
                        src={image.src}
                        alt={image.label}
                        className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                      <div className="absolute bottom-4 left-4 px-3 py-1 rounded-lg glass-card text-sm font-medium">
                        {image.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Tools & Technologies */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold">Tech Stack</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {project.tools.map((tool) => (
                    <span
                      key={tool}
                      className="px-4 py-2 rounded-lg bg-primary/10 text-primary border border-primary/20 font-medium"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center py-12"
              >
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Ready to build something similar?
                </h3>
                <p className="text-muted-foreground mb-8">
                  Let's discuss how automation can transform your business
                </p>
                <Link
                  to="/#contact"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
                >
                  Get a Free System Audit
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CaseStudy;
