import { ArrowRight } from 'lucide-react';

export const goToContact = (onBefore?: () => void) => {
  onBefore?.();
  setTimeout(() => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => (window as any).triggerAuditRequest?.(), 800);
  }, 150);
};

const ConversionPrompt = ({ onBefore }: { onBefore?: () => void }) => (
  <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
    <div className="mb-3 sm:mb-0">
      <p className="font-semibold text-foreground">Want a system like this for your business?</p>
      <p className="text-sm text-foreground/75">Book a free strategy call and get a clear automation plan.</p>
    </div>
    <button
      type="button"
      onClick={() => goToContact(onBefore)}
      className="cta-glow inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:w-auto"
    >
      Let's talk <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </button>
  </div>
);

export default ConversionPrompt;
