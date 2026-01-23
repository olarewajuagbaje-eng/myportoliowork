import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const skillCategories = [
  {
    title: "Automation",
    color: "primary",
    skills: [
      { name: "n8n Workflows", level: 95 },
      { name: "Zapier / Make", level: 88 },
      { name: "Process Orchestration", level: 92 },
    ]
  },
  {
    title: "AI & LLMs",
    color: "secondary",
    skills: [
      { name: "LLM Orchestration (GPT-4, Claude, Groq)", level: 90 },
      { name: "RAG Architecture", level: 87 },
      { name: "Prompt Engineering", level: 92 },
    ]
  },
  {
    title: "APIs & Backend",
    color: "primary",
    skills: [
      { name: "Advanced API Integration", level: 94 },
      { name: "Google Cloud Console & OAuth", level: 85 },
      { name: "Webhook Development", level: 90 },
    ]
  },
  {
    title: "Frontend Systems",
    color: "secondary",
    skills: [
      { name: "JavaScript / TypeScript", level: 88 },
      { name: "No-Code / Low-Code", level: 95 },
      { name: "React & Modern Frameworks", level: 82 },
    ]
  }
];

const SkillBar = ({ skill, index, isInView, color }: { 
  skill: { name: string; level: number }; 
  index: number; 
  isInView: boolean;
  color: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-sm">{skill.name}</span>
        <span className="text-sm text-muted-foreground">{skill.level}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
          transition={{ duration: 1, delay: 0.3 + index * 0.1, ease: "easeOut" }}
          className={`h-full rounded-full ${
            color === 'primary' 
              ? 'bg-gradient-to-r from-primary to-primary/70' 
              : 'bg-gradient-to-r from-secondary to-secondary/70'
          }`}
        />
      </div>
    </motion.div>
  );
};

const StatsCard = ({ value, label, delay, isInView }: { 
  value: string; 
  label: string; 
  delay: number; 
  isInView: boolean 
}) => {
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

        {/* Skills Grid - 4 Categories */}
        <div className="grid md:grid-cols-2 gap-8">
          {skillCategories.map((category, catIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: catIndex * 0.1 }}
              className="glass-card p-8"
            >
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${
                  category.color === 'primary' ? 'bg-primary' : 'bg-secondary'
                }`} />
                {category.title}
              </h3>
              <div className="space-y-5">
                {category.skills.map((skill, index) => (
                  <SkillBar 
                    key={skill.name} 
                    skill={skill} 
                    index={catIndex * 3 + index} 
                    isInView={isInView}
                    color={category.color}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
