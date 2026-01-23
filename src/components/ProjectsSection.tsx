import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Bot, Mail, MessageSquare, Database, Workflow, ChevronDown } from 'lucide-react';
import ProjectDetailModal from './ProjectDetailModal';

const projects = [
  {
    id: 1,
    title: "The Executive AI Shadow",
    description: "A Telegram-powered Digital Chief of Staff using Groq AI and Gmail API to handle executive comms via voice/text.",
    problem: "Executives spend hours daily managing emails, scheduling, and communications. Critical messages get buried, responses are delayed, and valuable time is lost to administrative overhead.",
    solution: "Built an AI-powered assistant that monitors Telegram for voice/text commands, processes them with Groq AI, drafts contextual email responses via Gmail API, and manages scheduling—all hands-free.",
    tools: ["n8n", "Telegram Bot API", "Groq AI", "Gmail API", "Voice Recognition"],
    images: ["https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop"],
    icon: Bot,
  },
  {
    id: 2,
    title: "Automated Recruitment Pipeline",
    description: "AI-powered CV screening and interview scheduling that parses data and auto-notifies candidates via Gmail.",
    problem: "HR teams manually review hundreds of CVs, schedule interviews through endless email chains, and lose qualified candidates due to slow response times.",
    solution: "Created an end-to-end pipeline that auto-parses incoming CVs, scores candidates using AI, schedules interviews based on availability, and sends personalized notifications—reducing hiring time by 80%.",
    tools: ["n8n", "OpenAI", "Google Sheets", "Gmail API", "Calendar API"],
    images: ["https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop"],
    icon: Mail,
  },
  {
    id: 3,
    title: "WhatsApp AI Lead Bot",
    description: "A RAG-based chatbot for lead collection, booking, and smart answers using retrieval-augmented generation.",
    problem: "Businesses miss leads outside business hours. Manual responses are slow and inconsistent. Booking appointments requires back-and-forth messaging.",
    solution: "Deployed a WhatsApp bot with RAG architecture that instantly answers questions from a knowledge base, qualifies leads, and books appointments directly—24/7 without human intervention.",
    tools: ["n8n", "WhatsApp Business API", "Pinecone", "OpenAI Embeddings", "RAG"],
    images: ["https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1556155092-490a1ba16284?w=800&h=600&fit=crop"],
    icon: MessageSquare,
  },
  {
    id: 4,
    title: "AI SaaS Lead Orchestrator",
    description: "Multi-channel routing system syncing data to Google Sheets and CRMs for seamless lead management.",
    problem: "Leads come from multiple channels—website, social media, ads, referrals—but data ends up siloed. Sales teams lack a unified view and miss follow-ups.",
    solution: "Built a central orchestration system that captures leads from all channels, enriches data with AI, routes to the right sales rep, updates CRM in real-time, and triggers follow-up sequences.",
    tools: ["n8n", "HubSpot API", "Google Sheets", "Webhooks", "AI Enrichment"],
    images: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop"],
    icon: Database,
  },
  {
    id: 5,
    title: "Smart n8n Form Automation",
    description: "Advanced data routing and message synchronization for complex multi-step form workflows.",
    problem: "Form submissions trigger manual data entry across multiple systems. Errors occur, data is duplicated, and the process doesn't scale.",
    solution: "Designed intelligent form processing that validates, transforms, and routes data to the right destinations. Includes error handling, retry logic, and audit trails for complete visibility.",
    tools: ["n8n", "Typeform", "Airtable", "Slack", "Custom Webhooks"],
    images: ["https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop"],
    icon: Workflow,
  },
];

const ProjectCard = ({ project, onClick, index, isInView }: { project: typeof projects[0]; onClick: () => void; index: number; isInView: boolean; }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    whileHover={{ scale: 1.02, y: -5 }}
    onClick={onClick}
    className="glass-card p-6 cursor-pointer hover-lift cyber-border group"
  >
    <div className="relative aspect-video mb-4 rounded-lg overflow-hidden bg-muted">
      <img src={project.images[0]} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      <div className="absolute bottom-3 left-3 p-2 rounded-lg bg-primary/20 backdrop-blur-sm">
        <project.icon className="w-5 h-5 text-primary" />
      </div>
    </div>
    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
    <div className="flex flex-wrap gap-2">
      {project.tools.slice(0, 3).map((tool) => (<span key={tool} className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">{tool}</span>))}
    </div>
  </motion.div>
);

const ProjectsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [showAll, setShowAll] = useState(false);
  const displayedProjects = showAll ? projects : projects.slice(0, 4);

  return (
    <>
      <section id="projects" className="py-32 relative" ref={ref}>
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">Featured <span className="gradient-text">Projects</span></h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Real-world automation solutions that deliver measurable results</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {displayedProjects.map((project, index) => (<ProjectCard key={project.id} project={project} index={index} isInView={isInView} onClick={() => setSelectedProject(project)} />))}
          </div>
          {!showAll && projects.length > 4 && (
            <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: 0.5 }} className="text-center">
              <button onClick={() => setShowAll(true)} className="inline-flex items-center gap-2 px-6 py-3 rounded-lg glass-card hover:bg-muted transition-colors font-medium"><ChevronDown className="w-4 h-4" />View All Projects</button>
            </motion.div>
          )}
        </div>
      </section>
      <ProjectDetailModal project={selectedProject} isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} />
    </>
  );
};

export default ProjectsSection;
