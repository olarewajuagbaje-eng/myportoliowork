import { useEffect, useState } from 'react';
import { Terminal as TerminalIcon, Activity } from 'lucide-react';

const lines = [
  '$ n8n workflow run --id "lead-router"',
  '✓ webhook.received → payload validated',
  '✓ ai_agent.triage → intent: "high_value_lead"',
  '✓ ghl.contact.upsert → pipeline: "discovery"',
  '✓ teams.notify → alert dispatched',
  '✓ supabase.log → event_id 7F3A...',
  'system idle. listening for next event.',
];

const PreFooterTerminal = () => {
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [printed, setPrinted] = useState<string[]>([]);

  useEffect(() => {
    if (lineIdx >= lines.length) {
      const reset = setTimeout(() => {
        setPrinted([]);
        setLineIdx(0);
        setCharIdx(0);
      }, 2400);
      return () => clearTimeout(reset);
    }
    const current = lines[lineIdx];
    if (charIdx < current.length) {
      const t = setTimeout(() => setCharIdx(charIdx + 1), 28);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setPrinted((p) => [...p, current]);
      setLineIdx((i) => i + 1);
      setCharIdx(0);
    }, 320);
    return () => clearTimeout(t);
  }, [lineIdx, charIdx]);

  return (
    <section aria-hidden="true" className="container mx-auto px-6 pb-6">
      <div className="glass-card mx-auto max-w-2xl rounded-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/60">
          <span className="w-2.5 h-2.5 rounded-full bg-destructive/80" />
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'hsl(45 93% 47%)' }} />
          <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
          <span className="ml-3 text-[11px] font-mono text-muted-foreground flex items-center gap-2">
            <TerminalIcon className="w-3 h-3" />
            agbaje@architect ~ live ops
          </span>
          <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-mono text-secondary">
            <Activity className="w-3 h-3 animate-pulse" /> live
          </span>
        </div>
        <pre className="px-4 py-3 font-mono text-[11px] sm:text-xs leading-relaxed text-foreground/85 min-h-[140px] whitespace-pre-wrap">
{printed.map((l, i) => (
  <div key={i} className={l.startsWith('✓') ? 'text-secondary' : l.startsWith('$') ? 'text-primary' : 'text-muted-foreground'}>
    {l}
  </div>
))}
{lineIdx < lines.length && (
  <div className={lines[lineIdx].startsWith('✓') ? 'text-secondary' : lines[lineIdx].startsWith('$') ? 'text-primary' : 'text-muted-foreground'}>
    {lines[lineIdx].slice(0, charIdx)}
    <span className="terminal-caret">▌</span>
  </div>
)}
        </pre>
      </div>
    </section>
  );
};

export default PreFooterTerminal;
