import { useMemo, useRef, useState } from 'react';
import { Check, Copy, Upload, RotateCcw, ClipboardPaste } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Tiny JSON syntax highlighter using theme tokens. */
function highlight(json: string) {
  return escape(json).replace(
    /("(\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (m) => {
      let cls = 'text-secondary'; // number
      if (m.startsWith('"')) cls = m.trimEnd().endsWith(':') ? 'text-primary' : 'text-foreground/80';
      else if (/true|false|null/.test(m)) cls = 'text-accent-foreground';
      return `<span class="${cls}">${m}</span>`;
    },
  );
}

interface Props {
  initialJson?: unknown;
}

const JsonViewer = ({ initialJson }: Props) => {
  const initial = useMemo(() => (initialJson ? JSON.stringify(initialJson, null, 2) : ''), [initialJson]);
  const [json, setJson] = useState(initial);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [pasting, setPasting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = (text: string) => {
    try {
      setJson(JSON.stringify(JSON.parse(text), null, 2));
      setError('');
      setPasting(false);
      setDraft('');
    } catch {
      setError('That is not valid JSON. Please check the file and try again.');
    }
  };

  const onFile = async (f?: File) => {
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) return setError('File is larger than 5 MB.');
    load(await f.text());
  };

  const copy = async () => {
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const html = useMemo(() => highlight(json), [json]);
  const lines = json ? json.split('\n').length : 0;

  return (
    <div className="glass-card overflow-hidden rounded-3xl border border-border/70">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 bg-background/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-destructive/70" aria-hidden="true" />
          <span className="h-3 w-3 rounded-full bg-accent" aria-hidden="true" />
          <span className="h-3 w-3 rounded-full bg-secondary/70" aria-hidden="true" />
          <span className="ml-2 font-mono text-xs text-muted-foreground">n8n-workflow.json {lines ? `· ${lines} lines` : ''}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <input ref={fileRef} type="file" accept="application/json,.json" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} aria-label="Upload n8n workflow JSON file" />
          <Button size="sm" variant="outline" className="min-h-9 rounded-lg" onClick={() => fileRef.current?.click()}>
            <Upload className="h-4 w-4" aria-hidden="true" />Upload
          </Button>
          <Button size="sm" variant="outline" className="min-h-9 rounded-lg" onClick={() => setPasting((p) => !p)} aria-expanded={pasting}>
            <ClipboardPaste className="h-4 w-4" aria-hidden="true" />Paste
          </Button>
          {initial && json !== initial && (
            <Button size="sm" variant="ghost" className="min-h-9 rounded-lg" onClick={() => setJson(initial)}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" />Reset
            </Button>
          )}
          <Button size="sm" className="min-h-9 rounded-lg" onClick={copy} disabled={!json} aria-live="polite">
            {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
            {copied ? 'Copied' : 'Copy to Clipboard'}
          </Button>
        </div>
      </div>

      {pasting && (
        <div className="space-y-2 border-b border-border/60 p-4">
          <label htmlFor="json-paste" className="text-sm text-muted-foreground">Paste your workflow JSON</label>
          <Textarea id="json-paste" value={draft} onChange={(e) => setDraft(e.target.value)} rows={6} className="font-mono text-xs" />
          <Button size="sm" onClick={() => load(draft)} disabled={!draft.trim()}>Render JSON</Button>
        </div>
      )}
      {error && <p role="alert" className="px-4 pt-3 text-sm text-destructive">{error}</p>}

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); onFile(e.dataTransfer.files?.[0]); }}
        className="max-h-[520px] overflow-auto"
        tabIndex={0}
        aria-label="Workflow JSON code"
      >
        {json ? (
          <pre className="p-4 font-mono text-[11px] leading-relaxed sm:text-xs"><code dangerouslySetInnerHTML={{ __html: html }} /></pre>
        ) : (
          <p className="p-10 text-center text-sm text-muted-foreground">Drop, upload or paste an n8n workflow export to inspect it.</p>
        )}
      </div>
    </div>
  );
};

export default JsonViewer;
