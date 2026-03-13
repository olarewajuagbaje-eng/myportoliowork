import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Shield, Users, MessageSquare, Mail, Youtube, Bot, ChevronDown, Maximize2, BookOpen, Video, BookText } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProjectDetailModal from './ProjectDetailModal';

// Import real workflow images
import revenueShield from '@/assets/revenue-shield.jpg';
import revenueShieldDetail from '@/assets/revenue-shield-detail.jpg';
import revenueShieldLogic from '@/assets/revenue-shield-logic.jpg';
import revenueShieldVerification from '@/assets/revenue-shield-verification.jpg';
import revenueShieldWebhook from '@/assets/revenue-shield-webhook.jpg';
import revenueShieldFulfillment from '@/assets/revenue-shield-fulfillment.jpg';
import revenueShieldNumber from '@/assets/revenue-shield-number.jpg';
import revenueShieldInventory from '@/assets/revenue-shield-inventory.jpg';
import revenueShieldEmail from '@/assets/revenue-shield-email.jpg';
import revenueShieldCustomer from '@/assets/revenue-shield-customer.jpg';
import recruitmentPipeline from '@/assets/recruitment-pipeline.jpg';
import recruitmentPipelineDetail from '@/assets/recruitment-pipeline-detail.jpg';
import executiveAiShadow from '@/assets/executive-ai-shadow.jpg';
import executiveAiShadowDetail from '@/assets/executive-ai-shadow-detail.jpg';
import executiveAiOverview from '@/assets/executive-ai-overview.jpg';
import executiveAiAgent from '@/assets/executive-ai-agent.jpg';
import executiveAiTelegram from '@/assets/executive-ai-telegram.jpg';
import leadChatbot from '@/assets/lead-chatbot.jpg';
import leadChatbotHero from '@/assets/lead-chatbot-hero.jpg';
import leadChatbotInterface from '@/assets/lead-chatbot-interface.jpg';
import saasLeadOrchestrator from '@/assets/saas-lead-orchestrator.jpg';
import aiResearchFactory from '@/assets/ai-research-factory.jpg';
import aiResearchWorkflow from '@/assets/ai-research-workflow.jpg';
import aiResearchOutput from '@/assets/ai-research-output.jpg';
import aiResearchSheets from '@/assets/ai-research-sheets.jpg';
import youtubeContentArchitect from '@/assets/youtube-content-architect.jpg';
import whatsappAiAssistant from '@/assets/whatsapp-ai-assistant.jpg';
import whatsappAiOverview from '@/assets/whatsapp-ai-overview.jpg';
import videoCinematicImage from '@/assets/video-cinematic-image.jpg';
import videoCinematicFile from '@/assets/video-cinematic-file.jpg';
import videoCinematicLyric from '@/assets/video-cinematic-lyric.jpg';
import videoCinematicPrompt from '@/assets/video-cinematic-prompt.jpg';
import videoCinematicWorkflow from '@/assets/video-cinematic-workflow.jpg';
import videoCinematicYoutube from '@/assets/video-cinematic-youtube.jpg';
import videoCinematicOverview from '@/assets/video-cinematic-overview.jpg';
import literaryArchitectWorkflow from '@/assets/literary-architect-workflow.jpg';
import literaryArchitectCover from '@/assets/literary-architect-cover.jpg';
import literaryArchitectBook from '@/assets/literary-architect-book.jpg';
import literaryArchitectAirtable from '@/assets/literary-architect-airtable.jpg';
import jiraWorkflowOverview from '@/assets/jira-workflow-overview.jpg';
import discordEscalation from '@/assets/discord-escalation.jpg';
import jiraSheetsReport from '@/assets/jira-sheets-report.jpg';
import discordCoachingTip from '@/assets/discord-coaching-tip.jpg';
import discordWebhookConfig from '@/assets/discord-webhook-config.jpg';
import jiraGroqAgent from '@/assets/jira-groq-agent.jpg';

export interface ProjectImage {
  src: string;
  label: string;
}

export interface ProjectImpact {
  timeSaved?: string;
  protection?: string;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  problem: string;
  solution: string;
  tools: string[];
  images: ProjectImage[];
  icon: React.ComponentType<{ className?: string }>;
  featured?: boolean;
  impact?: ProjectImpact;
  roiImpact?: string;
  loomVideo?: string;
  caseStudy?: {
    heroImage: string;
    summary: string;
    metrics: { label: string; value: string }[];
  };
}

export const projects: Project[] = [
  {
    id: 1,
    title: "The Autonomous Fulfillment & Revenue Shield",
    slug: "revenue-shield",
    description: "End-to-end order verification system with Number() type-casting for data normalization, Paystack-to-SKU price verification, and Google Sheets as the Single Source of Truth.",
    problem: "E-commerce businesses face revenue leakage from underpayments, manual order verification delays, and inventory sync errors across platforms.",
    solution: "Built an autonomous fulfillment system that intercepts Paystack webhooks, validates payment amounts using Number() type-casting, cross-references SKU prices from Google Sheets, and auto-triggers fulfillment only on verified transactions.",
    tools: ["n8n", "Paystack API", "Google Sheets", "Gmail API", "Webhooks", "Number() Type-casting"],
    images: [
      { src: revenueShield, label: "Architecture Overview" },
      { src: revenueShieldNumber, label: "Number() Type-Casting Logic" },
      { src: revenueShieldWebhook, label: "Paystack Webhook Setup" },
      { src: revenueShieldVerification, label: "Payment Verification" },
      { src: revenueShieldInventory, label: "Inventory Lookup" },
      { src: revenueShieldLogic, label: "Stock Deduction Logic" },
      { src: revenueShieldCustomer, label: "Customer Data Update" },
      { src: revenueShieldEmail, label: "Automated Email Confirmation" },
      { src: revenueShieldFulfillment, label: "Fulfillment Output" },
      { src: revenueShieldDetail, label: "Live Dashboard" },
    ],
    icon: Shield,
    featured: true,
    roiImpact: "Eliminated 100% of revenue leakage from underpayments",
    impact: {
      timeSaved: "4 hours/day",
      protection: "100% Protection against underpayments"
    },
    caseStudy: {
      heroImage: revenueShield,
      summary: "How I eliminated revenue leakage and automated fulfillment for an e-commerce business using n8n, Paystack webhooks, and intelligent data validation.",
      metrics: [
        { label: "Time Saved", value: "4 hrs/day" },
        { label: "Revenue Protected", value: "100%" },
        { label: "Manual Tasks Eliminated", value: "15+" },
        { label: "Processing Time", value: "<2 sec" },
      ]
    }
  },
  {
    id: 2,
    title: "Automated Recruitment Pipeline",
    slug: "recruitment-pipeline",
    description: "AI-powered CV screening and interview scheduling with Groq AI scoring, auto-notifications via Gmail, and Google Calendar integration.",
    problem: "HR teams manually review hundreds of CVs, schedule interviews through endless email chains, and lose qualified candidates due to slow response times.",
    solution: "Created an end-to-end pipeline using Groq Chat Model that auto-parses incoming CVs, scores candidates with structured output parsing, schedules interviews via Google Calendar, and sends personalized Gmail notifications—reducing hiring time by 80%.",
    tools: ["n8n", "Groq AI", "Google Sheets", "Gmail API", "Google Calendar", "PDF Parser"],
    images: [
      { src: recruitmentPipeline, label: "Architecture Overview" },
      { src: recruitmentPipelineDetail, label: "AI Scoring Logic" },
    ],
    icon: Users,
    roiImpact: "Reduced hiring cycle time by 80%",
    caseStudy: {
      heroImage: recruitmentPipeline,
      summary: "Building an AI-powered recruitment pipeline that screens CVs, scores candidates, and schedules interviews automatically.",
      metrics: [
        { label: "Hiring Time Reduced", value: "80%" },
        { label: "CVs Processed/Day", value: "100+" },
        { label: "Response Time", value: "<1 min" },
      ]
    }
  },
  {
    id: 3,
    title: "The Executive AI Shadow",
    slug: "executive-ai-shadow",
    description: "A Telegram-powered Digital Chief of Staff using AI Agents to handle executive communications and draft contextual email responses.",
    problem: "Executives spend hours daily managing emails, scheduling, and communications. Critical messages get buried, responses are delayed, and valuable time is lost to administrative overhead.",
    solution: "Built an AI-powered assistant that monitors Telegram for voice/text commands, processes them with structured AI Agents, drafts contextual email responses via Gmail API, and manages scheduling—all hands-free.",
    tools: ["n8n", "Telegram Bot API", "AI Agent", "Gmail API", "Structured Output Parser"],
    images: [
      { src: executiveAiOverview, label: "Architecture Overview" },
      { src: executiveAiTelegram, label: "Telegram Trigger Setup" },
      { src: executiveAiAgent, label: "AI Agent Configuration" },
      { src: executiveAiShadow, label: "Workflow Canvas" },
      { src: executiveAiShadowDetail, label: "Live Output" },
    ],
    icon: Bot,
    roiImpact: "Saved executives 15+ hours per week on communications",
    caseStudy: {
      heroImage: executiveAiOverview,
      summary: "Creating a personal AI Chief of Staff that handles executive communications through Telegram with intelligent email drafting.",
      metrics: [
        { label: "Emails Automated", value: "90%" },
        { label: "Response Time", value: "<30 sec" },
        { label: "Hours Saved/Week", value: "15+" },
      ]
    }
  },
  {
    id: 4,
    title: "Lead Generation Chatbot",
    slug: "lead-chatbot",
    description: "RAG-based chatbot with Postgres memory, SerpAPI integration, and intelligent lead routing to Google Sheets.",
    problem: "Businesses miss leads outside business hours. Manual responses are slow and inconsistent. Booking appointments requires back-and-forth messaging.",
    solution: "Deployed a chatbot with Groq AI, Postgres Chat Memory for context retention, SerpAPI for real-time data, and RAG architecture that instantly answers questions and routes qualified leads to Google Sheets—24/7 without human intervention.",
    tools: ["n8n", "Groq AI", "Postgres Memory", "SerpAPI", "Google Sheets", "RAG"],
    images: [
      { src: leadChatbotHero, label: "Live Demo" },
      { src: leadChatbotInterface, label: "Chat Interface" },
      { src: leadChatbot, label: "Workflow Canvas" },
    ],
    icon: MessageSquare,
    roiImpact: "Increased lead capture rate by 45%",
    caseStudy: {
      heroImage: leadChatbotHero,
      summary: "Building a 24/7 AI chatbot that captures leads, answers questions intelligently, and routes qualified prospects automatically.",
      metrics: [
        { label: "Lead Capture Rate", value: "+45%" },
        { label: "Availability", value: "24/7" },
        { label: "Response Time", value: "<3 sec" },
      ]
    }
  },
  {
    id: 5,
    title: "AI Research & Content Factory",
    slug: "ai-research-factory",
    description: "Automated content generation pipeline with Groq AI, Tavily research integration, and Google Sheets content management.",
    problem: "Content creation requires hours of research, writing, and publishing. Teams struggle to maintain consistent output across multiple topics and platforms.",
    solution: "Built an AI Research Factory that pulls topics from Google Sheets, researches via Tavily API, generates content with Groq Chat Model, and updates the sheet with drafted articles—fully automated.",
    tools: ["n8n", "Groq AI", "Tavily API", "Google Sheets", "HTTP Requests", "AI Agents"],
    images: [
      { src: aiResearchWorkflow, label: "Architecture Overview" },
      { src: aiResearchFactory, label: "AI Agent Logic" },
      { src: aiResearchOutput, label: "Content Output Node" },
      { src: aiResearchSheets, label: "Google Sheets Dashboard" },
    ],
    icon: Mail,
    roiImpact: "Automated 20+ articles per week with zero research time",
    caseStudy: {
      heroImage: aiResearchWorkflow,
      summary: "Creating an automated content factory that researches topics and generates articles without human intervention.",
      metrics: [
        { label: "Content/Week", value: "20+ articles" },
        { label: "Research Time", value: "0 min" },
        { label: "Quality Score", value: "95%" },
      ]
    }
  },
  {
    id: 6,
    title: "YouTube-to-Social Content Architect",
    slug: "youtube-content-architect",
    description: "Automated content repurposing pipeline that transforms YouTube videos into LinkedIn posts via AI-powered transcript processing.",
    problem: "Content creators spend hours manually repurposing YouTube content for other platforms. Consistency is lost, and social channels remain underutilized.",
    solution: "Created an automated pipeline using YouTube Transcript extraction, Split Out for chunk processing, Aggregate for content consolidation, and a SocialScribe AI Agent that generates platform-optimized LinkedIn posts—delivered via Telegram.",
    tools: ["n8n", "YouTube Transcript", "Groq AI", "Telegram Bot", "Split/Aggregate", "SocialScribe Agent"],
    images: [
      { src: youtubeContentArchitect, label: "Architecture Overview" },
    ],
    icon: Youtube,
  },
  {
    id: 7,
    title: "WhatsApp AI Personal Assistant",
    slug: "whatsapp-ai-assistant",
    description: "Full-featured WhatsApp assistant bridged to Telegram alerts, powered by Groq AI with memory persistence, web search, and Google Calendar integration.",
    problem: "Personal assistants are expensive. Scheduling, research, and calculations require switching between multiple apps and services. Notifications are scattered across platforms.",
    solution: "Built a WhatsApp-native AI assistant using n8n's WhatsApp Business API trigger, Groq Chat Model with Simple Memory node for context retention, SerpAPI for real-time web search, and a Telegram bridge that routes high-priority alerts to my command center—all accessible through natural conversation.",
    tools: ["n8n", "WhatsApp Business API", "Groq AI", "Simple Memory", "SerpAPI", "Google Calendar", "Telegram Bridge"],
    images: [
      { src: whatsappAiOverview, label: "Architecture Overview" },
      { src: whatsappAiAssistant, label: "Workflow Canvas" },
    ],
    icon: MessageSquare,
  },
  {
    id: 8,
    title: "Video Cinematic Engine",
    slug: "video-cinematic-engine",
    description: "End-to-end AI video production pipeline that transforms YouTube transcripts into cinematic content with Suno-generated music, AI image prompts, and automated YouTube publishing. System Architecture: Orchestrates Suno, ElevenLabs, and Creatomate via n8n for fully autonomous 4K rendering.",
    problem: "Content creators struggle to produce high-quality videos at scale. Manual video production is time-consuming, expensive, and requires specialized skills. Music licensing, image creation, and post-production add complexity.",
    solution: "Built an autonomous video production engine using n8n that ingests YouTube transcripts, generates original lyrics with AI, creates custom music via Suno API, produces cinematic image prompts for each scene, renders via Creatomate, and auto-publishes to YouTube—delivering a bundled output of 5 images + 1 audio track per video.",
    tools: ["n8n", "Groq AI", "Suno API", "Creatomate", "YouTube API", "Image Pollinations", "Split/Aggregate"],
    images: [
      { src: videoCinematicWorkflow, label: "n8n Workflow Architecture" },
      { src: videoCinematicOverview, label: "Full Pipeline Overview" },
      { src: videoCinematicLyric, label: "AI Lyric Writer Node" },
      { src: videoCinematicPrompt, label: "Image Prompt Generator" },
      { src: videoCinematicImage, label: "Image Generation Output" },
      { src: videoCinematicFile, label: "Video File Processor" },
      { src: videoCinematicYoutube, label: "YouTube Auto-Publish" },
    ],
    icon: Video,
    featured: true,
    impact: {
      timeSaved: "10+ hours/video",
      protection: "Bundled: 5 images + 1 audio"
    },
    caseStudy: {
      heroImage: videoCinematicWorkflow,
      summary: "How I built an AI-powered video factory that transforms transcripts into fully-produced cinematic content with custom music and automated YouTube publishing.",
      metrics: [
        { label: "Production Time", value: "<5 min" },
        { label: "Manual Editing", value: "0%" },
        { label: "Assets/Video", value: "6+" },
        { label: "Cost/Video", value: "-90%" },
      ]
    }
  },
  {
    id: 9,
    title: "The Autonomous Literary Architect",
    slug: "literary-architect",
    description: "An End-to-End AI Pipeline for Automated Book Enrichment & Cover Design. Orchestration: n8n, Intelligence: Groq, Creative: Stability AI SD3, Database: Airtable.",
    problem: "Publishing workflows are manual nightmares—metadata tagging, age classification, BISAC coding, and cover design require specialized knowledge and hours per title. Scaling to hundreds of books is virtually impossible without a large team.",
    solution: "Built an autonomous literary pipeline that ingests raw book titles from Airtable, uses a Groq-powered Cinematic Engine with Structured Output Parser to generate age-appropriate metadata (Age Grade, BISAC codes) and hyper-realistic 3D cover prompts, renders professional covers via Stability AI SD3, uploads to Google Drive, and includes a Human-in-the-loop (HITL) review stage before final approval.",
    tools: ["n8n", "Groq AI", "Stability AI SD3", "Airtable", "Google Drive", "Structured Output Parser", "HTTP Requests"],
    images: [
      { src: literaryArchitectWorkflow, label: "n8n Workflow Architecture" },
      { src: literaryArchitectCover, label: "AI Cover Generation Output" },
      { src: literaryArchitectBook, label: "Book Metadata & Cover Detail" },
      { src: literaryArchitectAirtable, label: "Airtable Book Library CRM" },
    ],
    icon: BookText,
    featured: true,
    impact: {
      timeSaved: "8+ hours/batch",
      protection: "HITL: Human-in-the-loop Review"
    },
    loomVideo: "https://www.loom.com/share/0e6441af592247649304ca63dbd128b4",
    caseStudy: {
      heroImage: literaryArchitectWorkflow,
      summary: "How I built an autonomous book enrichment pipeline that transforms raw titles into market-ready assets with AI-generated metadata and professional covers.",
      metrics: [
        { label: "Titles/Batch", value: "100+" },
        { label: "Manual Work", value: "0%" },
        { label: "Cover Quality", value: "1000x1500px" },
        { label: "Review Stage", value: "HITL" },
      ]
    }
  },
  {
    id: 10,
    title: "The Remote Team Accountability & Recognition Engine",
    slug: "team-accountability-engine",
    description: "An automation layer on Jira to improve accountability. Scans overdue tasks, delivers AI coaching tips via Groq (Llama 3), and celebrates completed work via Discord.",
    problem: "Remote managers spend hours tracking overdue Jira tickets, chasing team members for updates, and have no automated way to recognize completed work—leading to disengagement and missed deadlines.",
    solution: "Built an AI-powered accountability engine that runs daily status checks on Jira, identifies overdue tasks, generates personalized coaching tips via Groq (Llama 3), sends escalation alerts and celebration messages through Discord webhooks, and logs everything to Google Sheets for executive reporting.",
    tools: ["n8n", "Jira API", "Groq AI (Llama 3)", "Discord Webhooks", "Google Sheets", "Structured Output Parser"],
    images: [
      { src: jiraWorkflowOverview, label: "n8n Workflow Architecture" },
      { src: jiraGroqAgent, label: "Groq AI Coaching Agent" },
      { src: discordWebhookConfig, label: "Discord Webhook Configuration" },
      { src: discordEscalation, label: "Jira Overdue Escalation Alert" },
      { src: discordCoachingTip, label: "AI Coaching Tip in Discord" },
      { src: jiraSheetsReport, label: "Google Sheets Executive Report" },
    ],
    icon: Users,
    featured: true,
    impact: {
      timeSaved: "5+ hours/week",
      protection: "100% Automated Follow-ups"
    },
    caseStudy: {
      heroImage: jiraWorkflowOverview,
      summary: "How I built an AI-powered accountability engine that transforms stale Jira tickets into actionable coaching tips and team celebrations via Discord.",
      metrics: [
        { label: "Follow-up Rate", value: "100%" },
        { label: "Manager Time Saved", value: "5 hrs/wk" },
        { label: "Recognition Delay", value: "<1 min" },
        { label: "Reporting", value: "Real-time" },
      ]
    }
  },
];

const ProjectCard = ({ project, onClick, index, isInView }: { project: Project; onClick: () => void; index: number; isInView: boolean; }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    whileHover={{ scale: 1.02, y: -5 }}
    onClick={onClick}
    className={`glass-card p-6 cursor-pointer hover-lift cyber-border group relative ${
      project.featured ? 'md:col-span-2 lg:col-span-2' : ''
    }`}
  >
    {/* Featured Badge */}
    {project.featured && (
      <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground text-xs font-bold flex items-center gap-1">
        <Shield className="w-3 h-3" />
        FEATURED
      </div>
    )}
    
    <div className="relative aspect-video mb-4 rounded-lg overflow-hidden bg-muted">
      <img 
        src={project.images[0].src} 
        alt={project.title} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        loading="lazy" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      
      {/* View Canvas Button */}
      <motion.button
        initial={{ opacity: 0 }}
        whileHover={{ scale: 1.1 }}
        className="absolute top-3 right-3 p-2 rounded-lg bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => { e.stopPropagation(); onClick(); }}
      >
        <Maximize2 className="w-4 h-4 text-primary" />
      </motion.button>
      
      {/* Case Study Badge */}
      {project.caseStudy && (
        <Link 
          to={`/case-study/${project.slug}`}
          onClick={(e) => e.stopPropagation()}
          className="absolute top-3 left-3 p-2 rounded-lg bg-secondary/90 backdrop-blur-sm flex items-center gap-1 text-xs font-medium text-secondary-foreground hover:bg-secondary transition-colors"
        >
          <BookOpen className="w-3 h-3" />
          Case Study
        </Link>
      )}
      
      <div className="absolute bottom-3 left-3 p-2 rounded-lg bg-primary/20 backdrop-blur-sm">
        <project.icon className="w-5 h-5 text-primary" />
      </div>
    </div>
    
    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
    
    {/* Impact Stats for Featured Project */}
    {project.featured && project.impact && (
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20">
          <div className="text-lg font-bold text-secondary">{project.impact.timeSaved}</div>
          <div className="text-xs text-muted-foreground">Time Saved</div>
        </div>
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
          <div className="text-sm font-bold text-primary">{project.impact.protection}</div>
        </div>
      </div>
    )}
    
    <div className="flex flex-wrap gap-2">
      {project.tools.slice(0, project.featured ? 6 : 3).map((tool) => (
        <span key={tool} className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">{tool}</span>
      ))}
      {project.tools.length > (project.featured ? 6 : 3) && (
        <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
          +{project.tools.length - (project.featured ? 6 : 3)} more
        </span>
      )}
    </div>
    
    {/* CTA */}
    <div className="mt-4 pt-4 border-t border-border">
      <button className="w-full py-2 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 text-foreground font-medium text-sm hover:from-primary/20 hover:to-secondary/20 transition-colors flex items-center justify-center gap-2">
        Build My Workflow
      </button>
    </div>
  </motion.div>
);

const ProjectsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showAll, setShowAll] = useState(false);
  const displayedProjects = showAll ? projects : projects.slice(0, 5);

  return (
    <>
      <section id="projects" className="py-32 relative" ref={ref}>
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">Featured <span className="gradient-text">Projects</span></h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Real-world automation solutions that deliver measurable results</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
            {displayedProjects.map((project, index) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                index={index} 
                isInView={isInView} 
                onClick={() => setSelectedProject(project)} 
              />
            ))}
          </div>
          {!showAll && projects.length > 5 && (
            <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: 0.5 }} className="text-center">
              <button onClick={() => setShowAll(true)} className="inline-flex items-center gap-2 px-6 py-3 rounded-lg glass-card hover:bg-muted transition-colors font-medium">
                <ChevronDown className="w-4 h-4" />
                View All Projects
              </button>
            </motion.div>
          )}
        </div>
      </section>
      <ProjectDetailModal project={selectedProject} isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} />
    </>
  );
};

export default ProjectsSection;
