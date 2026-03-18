import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const MobileStickyContact = () => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        if ((window as any).triggerAuditRequest) {
          (window as any).triggerAuditRequest();
        }
      }, 800);
    }
  };

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="px-4 pb-3 pt-2 bg-background/90 backdrop-blur-xl border-t border-border/50">
        <button
          onClick={handleClick}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          style={{ minHeight: '48px' }}
        >
          <Zap className="w-4 h-4" />
          Get in Touch
        </button>
      </div>
    </motion.div>
  );
};

export default MobileStickyContact;
