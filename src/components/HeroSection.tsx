import { motion } from 'framer-motion';
import { ArrowDown, Sparkles, Zap, Cog } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Gradient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, hsl(263 70% 66% / 0.3) 0%, transparent 70%)' }}
      />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8"
          >
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-sm text-muted-foreground">Digital Solutions & Automation Architect</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold font-display leading-tight mb-6"
          >
            I Build Systems That{' '}
            <span className="gradient-text">Work While You Sleep</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xl md:text-2xl text-muted-foreground mb-12 font-light"
          >
            Engineering Efficiency through AI & n8n Mastery
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="#contact"
              className="group px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-all animate-pulse-glow flex items-center gap-2"
            >
              <Zap className="w-5 h-5 group-hover:animate-pulse" />
              Get a Free System Audit
            </a>
            <a
              href="#projects"
              className="px-8 py-4 rounded-xl glass-card text-foreground font-semibold text-lg hover-lift cyber-border flex items-center gap-2"
            >
              <Cog className="w-5 h-5" />
              View Projects
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowDown className="w-6 h-6 text-muted-foreground" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
