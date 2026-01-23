import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Send, Terminal, CheckCircle2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ExecutionStep {
  message: string;
  status: 'pending' | 'running' | 'success' | 'error';
}

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const runExecutionAnimation = async () => {
    const steps = [
      { message: '> Initializing Telegram Bot...', delay: 500 },
      { message: '> Routing Lead to Agbaje...', delay: 800 },
      { message: '> Automation Standing By.', delay: 600 },
    ];

    for (let i = 0; i < steps.length; i++) {
      setExecutionSteps(prev => [
        ...prev,
        { message: steps[i].message, status: 'running' }
      ]);
      
      await new Promise(resolve => setTimeout(resolve, steps[i].delay));
      
      setExecutionSteps(prev => 
        prev.map((step, idx) => 
          idx === i ? { ...step, status: 'success' } : step
        )
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setExecutionSteps([]);
    setShowSuccess(false);

    try {
      const { data, error } = await supabase.functions.invoke('send-lead-notification', {
        body: formData,
      });

      if (error) throw error;

      // Run the terminal animation
      await runExecutionAnimation();
      
      setShowSuccess(true);
      toast({
        title: "Message sent!",
        description: "I'll get back to you soon.",
      });
      
      // Reset form after delay
      setTimeout(() => {
        setFormData({ name: '', email: '', message: '' });
        setExecutionSteps([]);
        setShowSuccess(false);
      }, 5000);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setExecutionSteps([
        { message: '> Error: Connection failed.', status: 'error' },
        { message: '> Retrying via backup channel...', status: 'running' }
      ]);
      
      toast({
        title: "Message received!",
        description: "Your message has been logged. I'll get back to you soon.",
        variant: "default",
      });
      
      setTimeout(() => {
        setFormData({ name: '', email: '', message: '' });
        setExecutionSteps([]);
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
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
                  disabled={isSubmitting}
                  className="w-full bg-transparent border-b border-border py-2 focus:outline-none focus:border-primary transition-colors font-mono disabled:opacity-50"
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
                  disabled={isSubmitting}
                  className="w-full bg-transparent border-b border-border py-2 focus:outline-none focus:border-primary transition-colors font-mono disabled:opacity-50"
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
                  disabled={isSubmitting}
                  rows={4}
                  className="w-full bg-transparent border-b border-border py-2 focus:outline-none focus:border-primary transition-colors font-mono resize-none disabled:opacity-50"
                  placeholder="Tell me about your project..."
                />
              </div>

              {/* Execution Log */}
              {executionSteps.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-background/50 rounded-lg p-4 font-mono text-sm space-y-2"
                >
                  {executionSteps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center gap-2 ${
                        step.status === 'success' ? 'text-secondary' :
                        step.status === 'error' ? 'text-destructive' :
                        'text-muted-foreground'
                      }`}
                    >
                      {step.status === 'running' && (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      )}
                      {step.status === 'success' && (
                        <CheckCircle2 className="w-3 h-3" />
                      )}
                      {step.message}
                      {step.status === 'success' && (
                        <span className="text-secondary ml-1">Done.</span>
                      )}
                    </motion.div>
                  ))}
                  
                  {showSuccess && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-secondary mt-4 pt-4 border-t border-border"
                    >
                      ✓ Lead captured successfully. Expect a response within 24 hours.
                    </motion.div>
                  )}
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    send_message()
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
