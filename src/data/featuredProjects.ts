import type { ProjectCardData } from '@/components/ProjectCard';

/**
 * Local fallback catalogue. The live site reads featured projects from the
 * database (`featured_projects`); this data is used to seed that table and as a
 * resilient fallback if the backend is unreachable.
 */
export const featuredProjectsFallback: ProjectCardData[] = [
  {
    slug: 'docextract-ai',
    name: 'DocExtract AI',
    eyebrow: 'Logistics Automation',
    headline: 'Automated Shipment Document Extraction',
    kpis: [
      { value: '100%', label: 'Manual Entry Eliminated' },
      { value: '<5s', label: 'Near-Instant Processing' },
      { value: '0', label: 'Data Errors' },
    ],
    problem:
      'Logistics companies drown in messy shipping documents, slowing operations and burying staff in repetitive data entry.',
    solution:
      'An intelligent extraction system that reads every incoming document, pulls the key fields, and routes clean data directly into the core database without human touch.',
    results: [
      'Staff freed from manual data entry entirely',
      'Documents processed the moment they arrive',
      'Clean, verified data in every downstream system',
    ],
    tags: ['n8n', 'Groq', 'Supabase'],
    themeClass: 'featured-project-service',
    cta: { label: 'Explore Solution', actionType: 'modal', icon: 'FileStack' },
    secondaryCta: { label: 'Book A Strategy Call', actionType: 'anchor', href: '#contact' },
  },
  {
    slug: 'flowdesk',
    name: 'FlowDesk',
    eyebrow: 'Small Business Operations',
    headline: 'FlowDesk: One Place To Run The Whole Business',
    problem:
      'Leads, bookings and team messages were scattered across email, WhatsApp and spreadsheets, so enquiries were missed and nobody knew who was following up.',
    solution:
      'We brought every enquiry, booking and conversation into one simple hub, alerted the right person instantly, and gave each team member their own access level.',
    results: [
      'Nothing slips through the cracks',
      'Instant alerts on every new enquiry',
      'One shared view for the whole team',
    ],
    tags: ['React', 'Supabase', 'CRM Automation', 'SaaS'],
    themeClass: 'featured-project-service',
    cta: { label: 'Explore Solution', actionType: 'external', href: 'https://getflowdesk.lovable.app' },
    secondaryCta: { label: 'View Case Study', actionType: 'modal' },
  },
  {
    slug: 'vitaflow',
    name: 'VitaFlow',
    eyebrow: 'Wellness Operations',
    headline: 'VitaFlow: A Single Platform For Client Wellness',
    problem:
      'Clients were juggling several health apps and providers had no clear picture of progress, so engagement dropped and follow-up was inconsistent.',
    solution:
      'We replaced the app stack with one platform that guides the client day to day, sends reminders automatically, and gives providers a single dashboard.',
    results: [
      'Higher client engagement',
      'Automatic reminders replace manual follow-up',
      'Full visibility for providers',
    ],
    tags: ['AI/ML', 'HealthTech', 'Tailwind CSS', 'Edge Functions'],
    themeClass: 'featured-project-wellness',
    cta: { label: 'Explore Solution', actionType: 'external', href: 'https://vita-flow-zen.lovable.app' },
    secondaryCta: { label: 'View Case Study', actionType: 'modal' },
  },
  {
    slug: 'b2b-sales-engine',
    name: 'Sales Engine',
    eyebrow: 'B2B Sales Conversion',
    headline: 'The Automated B2B Sales Conversion Engine',
    problem:
      'High value enquiries went cold because the sales team followed up manually, hours or days later, with no clear view of which leads were worth chasing.',
    solution:
      'We connected every enquiry into one automated pipeline that scores each buyer, alerts the sales team instantly, and re-engages quiet leads with a polished follow-up sequence.',
    results: [
      'Leads contacted in under 60 seconds',
      'Cold leads recovered automatically',
      'Live view of pipeline value and booked calls',
    ],
    tags: ['GoHighLevel (GHL)', 'Custom HTML', 'Pipeline Automation', 'Dynamic Scoring'],
    themeClass: 'featured-project-sales',
    cta: {
      label: 'Watch The Walkthrough',
      actionType: 'external',
      href: 'https://drive.google.com/file/d/1Ct1PmftfwrdmM8NY1q7uHT76PaJVpTEA/view?usp=drivesdk',
      icon: 'PlayCircle',
    },
    secondaryCta: { label: 'View Case Study', actionType: 'modal' },
  },
  {
    slug: 'ror-ai-engine',
    name: 'ROR AI Engine',
    eyebrow: 'Revenue Protection',
    headline: 'AI Triage & CRM Engine',
    problem:
      'Website visitors asked the same questions all day, buyers abandoned checkout without anyone noticing, and customer records had to be typed in by hand.',
    solution:
      'We added an always-on assistant that answers and qualifies buyers, spots abandoned purchases and follows up automatically, while every detail writes itself into the CRM.',
    results: [
      'Abandoned sales recovered without staff effort',
      'Zero duplicate data entry',
      'Every enquiry qualified and summarised for the team',
    ],
    tags: ['n8n', 'CourseCreator 360 (GHL)', 'Groq (Llama 3.3)', 'Google Sheets'],
    themeClass: 'featured-project-sales',
    cta: {
      label: 'Watch The Walkthrough',
      actionType: 'external',
      href: 'https://drive.google.com/file/d/1HEoafNeV5KcFHYNwNeuvxjlgXGgaAC_N/view?usp=drivesdk',
      icon: 'PlayCircle',
    },
    secondaryCta: { label: 'View Case Study', actionType: 'modal' },
  },
  {
    slug: 'voice-ai-overflow',
    name: 'Voice AI',
    eyebrow: 'Customer Communication',
    headline: 'Enterprise Voice Assistant For Overflow Calls',
    problem:
      'Busy periods and after-hours calls went unanswered at a healthcare business, leaving patients waiting and staff with no record of what was missed.',
    solution:
      'A professional voice assistant now answers overflow calls, captures what the caller needs, logs it centrally, and alerts the team the moment something is urgent.',
    results: [
      'No unanswered calls, day or night',
      'Every call logged and searchable',
      'Urgent cases escalated in real time',
    ],
    tags: ['Uptiq (GHL)', 'n8n', 'Power Automate', 'SharePoint'],
    themeClass: 'featured-project-wellness',
    cta: { label: 'See How It Works', actionType: 'modal', icon: 'PlayCircle' },
    secondaryCta: { label: 'Book A Strategy Call', actionType: 'anchor', href: '#contact' },
  },
  {
    slug: 'content-production-engine',
    name: 'Content Engine',
    eyebrow: 'Marketing Operations',
    headline: 'Autonomous Content Production Engine',
    problem:
      'Publishing consistently required writers, editors and manual uploads, so marketing output stalled whenever the team got busy.',
    solution:
      'We built a system that drafts on-brand content, routes it to the right place, and waits for one human approval before publishing everything for you.',
    results: [
      'Consistent publishing without extra hires',
      'Human approval keeps quality in control',
      'Weeks of content scheduled in advance',
    ],
    tags: ['n8n', 'Airtable', 'WordPress', 'AI Writing'],
    themeClass: 'featured-project-service',
    cta: { label: 'See How It Works', actionType: 'modal' },
    secondaryCta: { label: 'Book A Strategy Call', actionType: 'anchor', href: '#contact' },
  },
  {
    slug: 'render-engine',
    name: 'Render Engine',
    eyebrow: 'Brand Visibility',
    headline: 'Autonomous Content & Design Engine',
    problem:
      'Staying visible online meant researching topics, writing posts and designing graphics every single day, which no small team can sustain.',
    solution:
      'The system now researches what is trending, writes the post, produces a branded graphic and publishes it twice a day, completely hands-off.',
    results: [
      'Daily brand presence with zero manual effort',
      'Branded visuals produced automatically',
      'Reliable output even when the team is busy',
    ],
    tags: ['n8n', 'Node.js', 'Supabase', 'AI Content', 'Buffer'],
    themeClass: 'featured-project-sales',
    cta: { label: 'View Case Study', actionType: 'modal' },
    secondaryCta: { label: 'Book A Strategy Call', actionType: 'anchor', href: '#contact' },
  },
  {
    slug: 'automatch',
    name: 'AutoMatch',
    eyebrow: 'Brokerage Automation',
    headline: 'AutoMatch: Hands-Off Car Brokerage',
    problem:
      'Matching buyers to dealers meant hours of phone calls, spreadsheets and back-and-forth, which limited how many deals the team could handle.',
    solution:
      'Buyer requests are now matched automatically, the right dealers are notified instantly, and every step of the deal is tracked in one secure place.',
    results: [
      'More deals handled with the same team',
      'Buyers matched in minutes, not days',
      'Complete, auditable record of every transaction',
    ],
    tags: ['n8n', 'Supabase', 'AI Matching'],
    themeClass: 'featured-project-wellness',
    cta: { label: 'Explore Solution', actionType: 'external', href: 'https://driveway-dealer.lovable.app' },
    secondaryCta: { label: 'View Case Study', actionType: 'modal' },
  },
  {
    slug: 'jnk-logistics-flow',
    name: 'JNK Logistics',
    eyebrow: 'Operations Visibility',
    headline: 'JNK Logistics Flow: Live Dispatch Command Center',
    problem:
      'Dispatchers worked from stale spreadsheets, clients called constantly for updates, and duplicate customer records made reporting unreliable.',
    solution:
      'We built a live command center where jobs, drivers and revenue update in real time, and gave clients their own tracking portal so they stop calling for status.',
    results: [
      'Real-time visibility across the fleet',
      'Fewer status calls from clients',
      'Clean, duplicate-free customer records',
    ],
    tags: ['React', 'Supabase', 'n8n', 'AI Summaries'],
    themeClass: 'featured-project-service',
    cta: { label: 'Explore Solution', actionType: 'external', href: 'https://jnk-logistics-flow.lovable.app' },
    secondaryCta: { label: 'View Case Study', actionType: 'modal' },
  },
  {
    slug: 'architecture-masterclass',
    name: 'Masterclass',
    eyebrow: 'High-Ticket Sales',
    headline: 'Architecture Masterclass Funnel & Infrastructure',
    problem:
      'A premium training programme was being sold through a generic page that failed to build trust, so high-ticket buyers hesitated at checkout.',
    solution:
      'We designed a premium buying experience that lets prospects preview the programme, then connected checkout to automated onboarding behind the scenes.',
    results: [
      'Stronger buyer confidence at checkout',
      'Onboarding handled automatically after purchase',
      'Protected margins on every high-ticket sale',
    ],
    tags: ['GoHighLevel', 'Custom HTML/CSS', 'n8n', 'Supabase'],
    themeClass: 'featured-project-masterclass',
    cta: {
      label: 'View Live Funnel',
      actionType: 'external',
      href: 'https://sites.leadconnectorhq.com/preview/WH0tMAV06vMVunjvnmgz?notrack=true',
    },
    secondaryCta: { label: 'View Case Study', actionType: 'modal' },
  },
];
