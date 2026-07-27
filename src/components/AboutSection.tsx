import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Zap, Target, Cpu, GraduationCap, Workflow, Brain, Rocket, Network, Database } from 'lucide-react';

const timelineEvents = [
  {
    year: "Foundation",
    icon: GraduationCap,
    title: "Engineering Mindset",
    description: "A Physics Electronics background trained me to look at every business as a system, find the bottlenecks, and design something better."
  },
  {
    year: "Discovery",
    icon: Workflow,
    title: "First Business Wins",
    description: "Started helping small teams replace repetitive manual tasks with reliable automation, and saw first-hand how much time and revenue was being lost."
  },
  {
    year: "Growth",
    icon: Brain,
    title: "Advanced Workflow Design",
    description: "Built deep expertise in designing multi-step workflows that connect the tools businesses already use, without disrupting their operations."
  },
  {
    year: "Growth",
    icon: Network,
    title: "Sales & CRM Systems",
    description: "Started architecting full sales and CRM ecosystems, including AI voice agents, pipelines, and conversion-focused funnels for service businesses."
  },
  {
    year: "Scale",
    icon: Database,
    title: "Multi-System Orchestration",
    description: "Now orchestrate revenue, operations and customer data across multiple platforms so leadership has one clean, real-time view of the business."
  },
  {
    year: "Today",
    icon: Rocket,
    title: "AI-Driven Growth Partner",
    description: "Partnering with founders and executives to design AI-powered systems that scale their business without scaling their headcount."
  }
];

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
    <section id="about" className="py-10 sm:py-14 relative" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="space-y-12"
        >
          {/* Main About Content */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl md:text-5xl font-bold font-display mb-8">
                About <span className="gradient-text">Me</span>
              </h2>
              
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Hi, I'm <span className="text-foreground font-semibold">Agbaje Olarewaju</span>. I help business owners, founders and executives fix the operational bottlenecks that quietly drain revenue, burn out their teams, and cap their growth.
                </p>
                <p>
                  My work sits where <span className="text-foreground font-medium">strategy, operations and technology</span> meet. I design AI-powered systems that capture leads, follow up with customers, keep data clean across tools, and give leadership a clear view of what is actually happening in the business.
                </p>
                <p>
                  I am not just a technical implementer. I partner with clients long-term, understand their business goals first, and then build systems that support real growth, not just automation for automation's sake.
                </p>
                <div className="glass-card p-6 mt-8 border-l-4 border-primary">
                  <p className="text-foreground italic text-xl">
                    "I don't just build tools. I design systems that help businesses grow."
                  </p>
                </div>
                <div className="glass-card p-6 border-l-4 border-secondary">
                  <p className="text-foreground italic">
                    "Whether you run a real estate agency, a fintech startup, an HR firm, or an e-commerce brand, if there is a manual process holding you back, I can help you remove it."
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
                  title: "Business Outcomes First",
                  description: "Every project starts with the result you need, more revenue, less admin, faster response times, and works backwards from there."
                },
                {
                  icon: Target,
                  title: "Reliable & Measurable",
                  description: "I build systems that are stable, well-documented, and tied to numbers you actually track: leads, conversions, hours saved."
                },
                {
                  icon: Cpu,
                  title: "Long-Term Partner",
                  description: "I stay involved after launch, refining and expanding your systems as your business grows and priorities shift."
                }
              ].map((item) => (
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
          </div>

          {/* Technical Journey Timeline */}
          <motion.div variants={itemVariants} className="space-y-8">
            <h3 className="text-2xl md:text-3xl font-bold font-display text-center">
              Technical <span className="gradient-text">Journey</span>
            </h3>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-primary via-secondary to-primary hidden md:block" />
              
              <div className="grid gap-8 md:gap-0">
                {timelineEvents.map((event, index) => (
                  <motion.div
                    key={event.title}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.15 }}
                    className={`relative flex items-center md:w-1/2 ${
                      index % 2 === 0 
                        ? 'md:pr-12 md:ml-0' 
                        : 'md:pl-12 md:ml-auto'
                    }`}
                  >
                    {/* Timeline dot */}
                    <div className={`absolute hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-background border-2 border-primary ${
                      index % 2 === 0 
                        ? 'right-0 translate-x-1/2 md:-right-6' 
                        : 'left-0 -translate-x-1/2 md:-left-6'
                    }`}>
                      <event.icon className="w-5 h-5 text-primary" />
                    </div>
                    
                    <div className={`glass-card p-6 w-full ${
                      index % 2 === 0 ? 'md:text-right' : ''
                    }`}>
                      <div className={`flex items-center gap-3 mb-3 ${
                        index % 2 === 0 ? 'md:flex-row-reverse' : ''
                      }`}>
                        <div className="md:hidden p-2 rounded-lg bg-primary/20">
                          <event.icon className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-xs font-mono text-secondary uppercase tracking-wider">
                          {event.year}
                        </span>
                      </div>
                      <h4 className="font-semibold text-lg mb-2">{event.title}</h4>
                      <p className="text-muted-foreground text-sm">{event.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
