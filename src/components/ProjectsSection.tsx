import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Bot, Mail, MessageSquare, Users, Workflow, X } from 'lucide-react';

interface Project {
  id: number;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  problem: string;
  solution: string;
  tech: string[];
  color: 'purple' | 'emerald';
}

const projects: Project[] = [
  {
    id: 1,
    icon: Bot,
    title: "Executive AI Shadow",
    subtitle: "Digital Chief of Staff",
    problem: "Executives drowning in communication chaos—missed messages, delayed responses, and scattered priorities.",
    solution: "A Telegram-powered AI assistant using Groq AI and Gmail API that handles executive comms via voice/text, prioritizes tasks, and responds intelligently.",
    tech: ["Telegram API", "Groq AI", "Gmail API", "n8n"],
    color: 'purple'
  },
  {
    id: 2,
    icon: Users,
    title: "Automated Recruitment Pipeline",
    subtitle: "AI-Powered HR System",
    problem: "Manual CV screening taking hours, inconsistent candidate evaluation, and scheduling nightmares.",
    solution: "AI-powered CV parsing and screening that auto-scores candidates, schedules interviews, and notifies via Gmail—reducing hiring time by 80%.",
    tech: ["AI/ML", "Gmail API", "Google Sheets", "n8n"],
    color: 'emerald'
  },
  {
    id: 3,
    icon: MessageSquare,
    title: "WhatsApp AI Lead Bot",
    subtitle: "RAG-Based Chatbot",
    problem: "Lost leads due to slow response times and inability to answer complex queries 24/7.",
    solution: "A RAG-based chatbot that collects leads, books appointments, and provides smart answers using your knowledge base—available 24/7.",
    tech: ["WhatsApp API", "RAG", "Vector DB", "n8n"],
    color: 'purple'
  },
  {
    id: 4,
    icon: Workflow,
    title: "AI SaaS Lead Orchestrator",
    subtitle: "Multi-Channel Router",
    problem: "Leads from multiple channels getting lost, no unified tracking, and manual data entry errors.",
    solution: "Multi-channel routing system that captures, qualifies, and syncs lead data to Google Sheets and CRMs in real-time.",
    tech: ["Multi-Channel API", "CRM Integration", "Google Sheets", "n8n"],
    color: 'emerald'
  },
  {
    id: 5,
    icon: Mail,
    title: "Smart Form Automation",
    subtitle: "Data Routing Engine",
    problem: "Form submissions requiring manual processing, delayed follow-ups, and data inconsistencies.",
    solution: "Advanced data routing and message synchronization that processes forms instantly and triggers appropriate workflows.",
    tech: ["Webhook", "Data Parsing", "Multi-Platform", "n8n"],
    color: 'purple'
  }
];

const ProjectCard = ({ project, onClick }: { project: Project; onClick: () => void }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`glass-card p-6 cursor-pointer hover-lift cyber-border group relative overflow-hidden`}
    >
      {/* Pulse effect on hover */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
        project.color === 'purple' 
          ? 'bg-gradient-to-br from-primary/10 to-transparent' 
          : 'bg-gradient-to-br from-secondary/10 to-transparent'
      }`} />
      
      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-lg mb-4 flex items-center justify-center ${
          project.color === 'purple' 
            ? 'bg-primary/20' 
            : 'bg-secondary/20'
        }`}>
          <project.icon className={`w-6 h-6 ${
            project.color === 'purple' ? 'text-primary' : 'text-secondary'
          }`} />
        </div>
        
        <h3 className="text-xl font-bold mb-1">{project.title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{project.subtitle}</p>
        
        <div className="flex flex-wrap gap-2">
          {project.tech.slice(0, 3).map((tech) => (
            <span 
              key={tech} 
              className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const ProjectModal = ({ project, onClose }: { project: Project; onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-card max-w-2xl w-full p-8 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className={`w-16 h-16 rounded-xl mb-6 flex items-center justify-center ${
          project.color === 'purple' ? 'bg-primary/20' : 'bg-secondary/20'
        }`}>
          <project.icon className={`w-8 h-8 ${
            project.color === 'purple' ? 'text-primary' : 'text-secondary'
          }`} />
        </div>

        <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
        <p className="text-muted-foreground mb-8">{project.subtitle}</p>

        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-destructive mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-destructive" />
              THE PROBLEM
            </h4>
            <p className="text-muted-foreground">{project.problem}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-secondary mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              THE SOLUTION
            </h4>
            <p className="text-muted-foreground">{project.solution}</p>
          </div>

          <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
            {project.tech.map((tech) => (
              <span 
                key={tech} 
                className={`text-sm px-3 py-1 rounded-full ${
                  project.color === 'purple' 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-secondary/20 text-secondary'
                }`}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ProjectsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="projects" className="py-32 relative" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real automation solutions that transformed business operations
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <ProjectCard
                project={project}
                onClick={() => setSelectedProject(project)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
};

export default ProjectsSection;
