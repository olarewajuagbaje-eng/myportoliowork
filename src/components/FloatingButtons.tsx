import { motion } from 'framer-motion';
import { MessageCircle, Sparkles } from 'lucide-react';

const FloatingButtons = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-center">
      {/* AI Assistant Button — opens in new tab */}
      <motion.a
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        href="https://agbaje-assistance.lovable.app"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-shadow"
        aria-label="AI Assistant"
      >
        <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
      </motion.a>

      {/* WhatsApp Button */}
      <motion.a
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        href="https://wa.me/2349169043196"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[hsl(142,70%,45%)] flex items-center justify-center shadow-lg shadow-[hsl(142,70%,45%)/0.3] hover:shadow-[hsl(142,70%,45%)/0.5] transition-shadow"
        aria-label="Contact on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />
      </motion.a>
    </div>
  );
};

export default FloatingButtons;
