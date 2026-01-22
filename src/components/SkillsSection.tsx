import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const skills = [
  { name: "n8n", level: 95, category: "Automation" },
  { name: "JavaScript", level: 90, category: "Programming" },
  { name: "Groq AI", level: 88, category: "AI/ML" },
  { name: "Whisper API", level: 85, category: "AI/ML" },
  { name: "SerpAPI", level: 82, category: "Integration" },
  { name: "Custom API Integration", level: 92, category: "Integration" },
  { name: "RAG Architecture", level: 87, category: "AI/ML" },
  { name: "No-Code/Low-Code", level: 95, category: "Development" },
];

const SkillBar = ({ skill, index, isInView }: { skill: typeof skills[0]; index: number; isInView: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium">{skill.name}</span>
        <span className="text-sm text-muted-foreground">{skill.level}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
          transition={{ duration: 1, delay: 0.3 + index * 0.1, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
        />
      </div>
    </motion.div>
  );
};

const StatsCard = ({ value, label, delay, isInView }: { value: string; label: string; delay: number; isInView: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.6, delay }}
      className="glass-card p-6 text-center hover-lift"
    >
      <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </motion.div>
  );
};

const SkillsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="py-32 relative" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
            Technical <span className="gradient-text">Arsenal</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The tools and technologies I use to build powerful automation systems
          </p>
        </motion.div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <StatsCard value="90%" label="Reduction in Manual Tasks" delay={0} isInView={isInView} />
          <StatsCard value="24/7" label="AI Availability" delay={0.1} isInView={isInView} />
          <StatsCard value="50+" label="Workflows Automated" delay={0.2} isInView={isInView} />
          <StatsCard value="10x" label="Efficiency Increase" delay={0.3} isInView={isInView} />
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-card p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary" />
              Core Technologies
            </h3>
            <div className="space-y-6">
              {skills.slice(0, 4).map((skill, index) => (
                <SkillBar key={skill.name} skill={skill} index={index} isInView={isInView} />
              ))}
            </div>
          </div>
          
          <div className="glass-card p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-secondary" />
              Integration & AI
            </h3>
            <div className="space-y-6">
              {skills.slice(4).map((skill, index) => (
                <SkillBar key={skill.name} skill={skill} index={index + 4} isInView={isInView} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
