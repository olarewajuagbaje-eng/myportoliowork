import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const tools = [
  { name: 'n8n', logo: 'https://n8n.io/favicon.ico', color: 'hsl(var(--cyber-emerald))' },
  { name: 'Claude', logo: 'https://claude.ai/favicon.ico', color: 'hsl(45, 93%, 47%)' },
  { name: 'Supabase', logo: 'https://supabase.com/favicon/favicon-32x32.png', color: 'hsl(var(--cyber-emerald))' },
  { name: 'Airtable', logo: 'https://airtable.com/favicon.ico', color: 'hsl(200, 80%, 55%)' },
  { name: 'Jira', logo: 'https://jira.atlassian.com/favicon.ico', color: 'hsl(214, 82%, 51%)' },
  { name: 'Asana', logo: 'https://asana.com/favicon.ico', color: 'hsl(350, 80%, 55%)' },
  { name: 'GitHub', logo: 'https://github.com/favicon.ico', color: 'hsl(0, 0%, 80%)' },
  { name: 'Gmail', logo: 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico', color: 'hsl(4, 80%, 55%)' },
];

const ExpertiseStack = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="py-12 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="glass-card px-8 py-6 text-center"
        >
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground mb-6">
            Trusted by top AI & workflow platforms
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {tools.map((tool, i) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="group flex flex-col items-center gap-2 cursor-default"
              >
                <div
                  className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center bg-muted/50 grayscale transition-all duration-300 group-hover:grayscale-0 group-hover:shadow-lg"
                  style={{
                    '--tw-shadow-color': tool.color,
                  } as React.CSSProperties}
                >
                  <img
                    src={tool.logo}
                    alt={`${tool.name} logo`}
                    className="w-6 h-6 md:w-7 md:h-7 object-contain"
                    loading="lazy"
                  />
                </div>
                <span className="text-[10px] md:text-xs font-mono text-muted-foreground group-hover:text-foreground transition-colors">
                  {tool.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExpertiseStack;
