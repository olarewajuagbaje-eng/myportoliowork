import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Send, Terminal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent!",
      description: "I'll get back to you soon.",
    });
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 500);
  };

  return (
    <section id="contact" className="py-32 relative" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
            Let's <span className="gradient-text">Connect</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ready to automate your business? Let's discuss your project.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          {/* Terminal Window */}
          <div className="terminal-window">
            <div className="terminal-header">
              <div className="terminal-dot bg-destructive" />
              <div className="terminal-dot" style={{ backgroundColor: 'hsl(45 93% 47%)' }} />
              <div className="terminal-dot bg-secondary" />
              <span className="ml-4 text-muted-foreground text-sm flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                contact@agbaje.dev
              </span>
              {isTyping && (
                <span className="ml-auto text-xs text-muted-foreground animate-pulse">
                  typing...
                </span>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                  <span className="text-secondary">$</span> enter_name:
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-b border-border py-2 focus:outline-none focus:border-primary transition-colors font-mono"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                  <span className="text-secondary">$</span> enter_email:
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-b border-border py-2 focus:outline-none focus:border-primary transition-colors font-mono"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                  <span className="text-secondary">$</span> enter_message:
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full bg-transparent border-b border-border py-2 focus:outline-none focus:border-primary transition-colors font-mono resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-4 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <Send className="w-4 h-4" />
                send_message()
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
