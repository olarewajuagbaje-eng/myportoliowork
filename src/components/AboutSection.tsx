import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Zap, Target, Cpu } from 'lucide-react';

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section id="about" className="py-32 relative" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl md:text-5xl font-bold font-display mb-8">
              About <span className="gradient-text">Me</span>
            </h2>
            
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Hi! I'm <span className="text-foreground font-semibold">Agbaje Olarewaju</span>, a Digital Solutions & Creative Entrepreneur with a background in Physics Electronics.
              </p>
              <p>
                I specialize in building autonomous engines that save time and scale business processes. From integrating AI to streamline recruitment to designing SaaS solutions with no-code, I turn complex chaos into results-driven workflows.
              </p>
              <div className="glass-card p-6 mt-8 border-l-4 border-primary">
                <p className="text-foreground italic">
                  "I am industry-agnostic. Whether it's Real Estate, FinTech, HR, or E-commerce—if there is a manual process, I can automate it."
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="grid gap-6"
          >
            {[
              {
                icon: Zap,
                title: "Automation First",
                description: "Every solution starts with identifying what can be automated to maximize efficiency."
              },
              {
                icon: Target,
                title: "Results Driven",
                description: "Focused on measurable outcomes that directly impact your bottom line."
              },
              {
                icon: Cpu,
                title: "AI-Powered",
                description: "Leveraging cutting-edge AI to create intelligent, adaptive systems."
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                whileHover={{ scale: 1.02 }}
                className="glass-card p-6 hover-lift cyber-border"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
