import { supabase } from '@/integrations/supabase/client';

export type ProjectEventType = 'impression' | 'cta_click' | 'secondary_click' | 'modal_open';

const SESSION_KEY = 'pa_session';
const seen = new Set<string>();

function sessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return 'anon';
  }
}

/** Fire-and-forget event for measuring per-project conversion lift. */
export function trackProjectEvent(projectSlug: string, eventType: ProjectEventType) {
  if (!projectSlug) return;
  if (eventType === 'impression') {
    if (seen.has(projectSlug)) return; // one impression per project per page load
    seen.add(projectSlug);
  }
  const payload = { project_slug: projectSlug.slice(0, 80), event_type: eventType, session_id: sessionId() };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (supabase.from('project_events' as any) as any).insert(payload).then(() => undefined, () => undefined);
  // Forward to GA/GTM if present
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  if (typeof w.gtag === 'function') w.gtag('event', `project_${eventType}`, { project: projectSlug });
  if (Array.isArray(w.dataLayer)) w.dataLayer.push({ event: `project_${eventType}`, project: projectSlug });
}
