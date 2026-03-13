import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Sparkles, X } from 'lucide-react';

const FloatingButtons = () => {
  const [assistantOpen, setAssistantOpen] = useState(false);

  return (
    <>
      {/* Floating Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-center">
        {/* AI Assistant Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setAssistantOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-shadow"
          aria-label="AI Assistant"
        >
          <Sparkles className="w-6 h-6 text-primary-foreground" />
        </motion.button>

        {/* WhatsApp Button */}
        <motion.a
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          href="https://wa.me/2349169043196"
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full bg-[hsl(142,70%,45%)] flex items-center justify-center shadow-lg shadow-[hsl(142,70%,45%)/0.3] hover:shadow-[hsl(142,70%,45%)/0.5] transition-shadow"
          aria-label="Contact on WhatsApp"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </motion.a>
      </div>

      {/* AI Assistant Modal */}
      <AnimatePresence>
        {assistantOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
              onClick={() => setAssistantOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: 100, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-6 right-6 z-[70] w-[90vw] max-w-[400px] h-[70vh] max-h-[600px] rounded-2xl overflow-hidden border border-border bg-background shadow-2xl shadow-primary/10"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="font-display font-semibold text-sm text-foreground">AI Assistant</span>
                </div>
                <button
                  onClick={() => setAssistantOpen(false)}
                  className="p-1 rounded-md hover:bg-muted transition-colors"
                  aria-label="Close AI Assistant"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <iframe
                src="https://agbaje-assistance.lovable.app"
                className="w-full h-[calc(100%-48px)] border-0"
                title="AI Assistant"
                allow="microphone"
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingButtons;
