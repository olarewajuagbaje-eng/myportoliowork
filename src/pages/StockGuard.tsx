import { lazy, Suspense, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertTriangle, Cpu, TrendingUp, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import WorkflowFlow from '@/components/stockguard/WorkflowFlow';

const JsonViewer = lazy(() => import('@/components/stockguard/JsonViewer'));

const VIDEO_ID = '19Xvgo0JdV37O462LmEIzNdgcZ21b4XhN';

const BLOCKS = [
  {
    title: 'The Problem', Icon: AlertTriangle, tone: 'destructive',
    text: 'Shopify operates reactively. It tracks current stock but does not warn merchants of impending stockouts or sudden warehouse discrepancies. E-commerce brands frequently lose top-line revenue by spending ad dollars to drive traffic to sold-out products, relying on manual spreadsheet exports to guess reorder dates.',
  },
  {
    title: 'The Solution', Icon: Cpu, tone: 'primary',
    text: 'Engineered a low-code, automated intelligence engine using Shopify Webhooks, n8n, and Airtable. The system intercepts every inventory change in real-time. It normalizes the data and calculates dynamic Risk Scores and predictive runway days based on historical sales velocity. Instead of manual monitoring, the system acts as a 24/7 watchdog, automatically dispatching rule-based alerts to the team the moment a product crosses a critical threshold or registers an anomaly.',
  },
  {
    title: 'The Result', Icon: TrendingUp, tone: 'secondary',
    text: 'Eliminated manual inventory tracking, prevented surprise stockouts, protected active ad spend, and provided the operations team with a live, predictable reorder dashboard.',
  },
] as const;

const toneClass = {
  destructive: 'border-destructive/25 bg-destructive/5 text-destructive',
  primary: 'border-primary/25 bg-primary/5 text-primary',
  secondary: 'border-secondary/25 bg-secondary/5 text-secondary',
};

const StockGuard = () => {
  const [workflow, setWorkflow] = useState<unknown>(null);
  useEffect(() => {
    window.scrollTo(0, 0);
    import('@/data/stockguard-workflow.json').then((m) => setWorkflow(m.default));
  }, []);

  return (
    <>
      <Helmet>
        <title>StockGuard: Shopify Inventory Intelligence | Case Study</title>
        <meta name="description" content="Real-time Shopify inventory intelligence built with n8n and Airtable: risk scores, runway days and instant stockout alerts." />
        <link rel="canonical" href="https://agbajeautomation.me/projects/stockguard" />
      </Helmet>

      <main className="relative z-10 min-h-dvh pb-20 pt-6">
        <div className="container mx-auto max-w-5xl px-5">
          <Button asChild variant="ghost" className="mb-6 min-h-11 rounded-xl">
            <Link to="/#featured-projects"><ArrowLeft className="h-4 w-4" aria-hidden="true" />Back to projects</Link>
          </Button>

          {/* 1. Hero + video */}
          <header className="mb-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">E-commerce Revenue Protection</p>
            <h1 className="mt-2 font-display text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
              StockGuard: <span className="gradient-text">Real-Time Shopify Inventory Intelligence</span>
            </h1>
            <ul aria-label="Technologies used" className="mt-4 flex flex-wrap gap-2">
              {['Shopify Webhooks', 'n8n', 'Airtable', 'SMTP Alerts', 'AI Summaries'].map((t) => (
                <li key={t}><Badge variant="secondary" className="rounded-full">{t}</Badge></li>
              ))}
            </ul>
          </header>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="glass-card overflow-hidden rounded-3xl border border-border/70 p-1.5">
            <div className="aspect-video overflow-hidden rounded-[1.25rem] bg-muted">
              <iframe
                src={`https://drive.google.com/file/d/${VIDEO_ID}/preview`}
                title="StockGuard system walkthrough video"
                className="size-full"
                allow="autoplay; fullscreen"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </motion.div>

          {/* 2. Case study */}
          <section aria-labelledby="case-study" className="mt-14">
            <h2 id="case-study" className="sr-only">Case study</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {BLOCKS.map(({ title, Icon, tone, text }, i) => (
                <motion.article key={title}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="glass-card rounded-3xl border border-border/70 p-6">
                  <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border ${toneClass[tone]}`}>
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="mb-2 font-display text-lg font-semibold">{title}</h3>
                  <p className="text-sm leading-relaxed text-foreground/80">{text}</p>
                </motion.article>
              ))}
            </div>
          </section>

          {/* 3. Workflow */}
          <section aria-labelledby="flow" className="mt-14">
            <h2 id="flow" className="mb-2 font-display text-2xl font-bold">Live Data Flow</h2>
            <p className="mb-8 text-sm text-muted-foreground">Every inventory change travels through the engine in real time.</p>
            <div className="glass-card rounded-3xl border border-border/70 px-6 py-10">
              <WorkflowFlow />
            </div>
          </section>

          {/* 4. Architecture code */}
          <section aria-labelledby="arch" className="mt-14">
            <h2 id="arch" className="mb-2 flex items-center gap-2 font-display text-2xl font-bold">
              <Code2 className="h-6 w-6 text-primary" aria-hidden="true" />Architecture Code
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">The actual n8n workflow export behind StockGuard. Inspect it, copy it, or load your own.</p>
            <Suspense fallback={<div className="glass-card h-64 animate-pulse rounded-3xl" />}>
              {workflow ? <JsonViewer initialJson={workflow} /> : <div className="glass-card h-64 animate-pulse rounded-3xl" />}
            </Suspense>
          </section>

          <div className="mt-14 text-center">
            <Button asChild size="lg" className="cta-glow min-h-11 rounded-xl">
              <Link to="/#contact">Book A Strategy Call</Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  );
};

export default StockGuard;
