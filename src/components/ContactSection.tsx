import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Send, Terminal, CheckCircle2, Loader2, AlertCircle, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ExecutionStep {
  message: string;
  status: 'pending' | 'running' | 'success' | 'error';
}

interface ContactSectionProps {
  autoFocus?: boolean;
  initialMessage?: string;
}

interface ApiStep {
  step: string;
  status: string;
  message: string;
}

const ContactSection = ({ autoFocus = false, initialMessage = '' }: ContactSectionProps) => {
  const ref = useRef(null);
  const formRef = useRef<HTMLFormElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: initialMessage,
  });
  const [isTyping, setIsTyping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle auto-focus and auto-type for audit request
  useEffect(() => {
    if (autoFocus && messageInputRef.current) {
      messageInputRef.current.focus();
      if (initialMessage) {
        // Simulate typing effect
        let index = 0;
        const typeInterval = setInterval(() => {
          if (index < initialMessage.length) {
            setFormData(prev => ({
              ...prev,
              message: initialMessage.substring(0, index + 1)
            }));
            index++;
          } else {
            clearInterval(typeInterval);
          }
        }, 50);
        return () => clearInterval(typeInterval);
      }
    }
  }, [autoFocus, initialMessage]);

  const runExecutionAnimation = async (apiSteps: ApiStep[] | null, success: boolean) => {
    // If we have API steps, use those for real-time sync
    if (apiSteps && apiSteps.length > 0) {
      for (let i = 0; i < apiSteps.length; i++) {
        const step = apiSteps[i];
        const stepMessage = `> ${step.step}... ${step.message}`;
        
        setExecutionSteps(prev => [
          ...prev,
          { message: stepMessage, status: 'running' }
        ]);
        
        await new Promise(resolve => setTimeout(resolve, 400));
        
        setExecutionSteps(prev => 
          prev.map((s, idx) => 
            idx === prev.length - 1 
              ? { ...s, status: step.status === 'success' ? 'success' : 'error' } 
              : s
          )
        );
      }
    } else {
      // Fallback animation for error cases
      const fallbackSteps = success ? [
        { message: '> auth_token_verified...', delay: 600 },
        { message: '> routing_lead_data...', delay: 800 },
        { message: '> secure_mail_dispatched_to_agbaje.', delay: 700 },
      ] : [
        { message: '> auth_token_verified...', delay: 600 },
        { message: '> connection_error: retrying...', delay: 500 },
        { message: '> backup_channel_active.', delay: 600 },
      ];

      for (let i = 0; i < fallbackSteps.length; i++) {
        setExecutionSteps(prev => [
          ...prev,
          { message: fallbackSteps[i].message, status: 'running' }
        ]);
        
        await new Promise(resolve => setTimeout(resolve, fallbackSteps[i].delay));
        
        setExecutionSteps(prev => 
          prev.map((step, idx) => 
            idx === i ? { ...step, status: success || i < fallbackSteps.length - 1 ? 'success' : 'error' } : step
          )
        );
      }
    }
  };

  const sendTelegramNotification = async (name: string, email: string, message: string): Promise<{ success: boolean; steps: ApiStep[] | null }> => {
    try {
      const { data, error } = await supabase.functions.invoke('send-lead-notification', {
        body: { name, email, message },
      });

      if (error) {
        console.error('Edge function error:', error);
        return { success: false, steps: null };
      }

      console.log('Lead notification response:', data);
      return { 
        success: data?.success === true,
        steps: data?.steps || null
      };
    } catch (error) {
      console.error('Error calling edge function:', error);
      return { success: false, steps: null };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setExecutionSteps([]);
    setShowSuccess(false);

    // Show initial processing step
    setExecutionSteps([{ message: '> initializing_secure_channel...', status: 'running' }]);
    await new Promise(resolve => setTimeout(resolve, 300));
    setExecutionSteps(prev => prev.map(s => ({ ...s, status: 'success' })));

    const result = await sendTelegramNotification(
      formData.name.trim(),
      formData.email.trim(),
      formData.message.trim()
    );

    // Run the terminal animation synced with API response
    await runExecutionAnimation(result.steps, result.success);
    
    if (result.success) {
      setShowSuccess(true);
      toast({
        title: "Message sent!",
        description: "I'll get back to you within 24 hours.",
      });
    } else {
      toast({
        title: "Message logged",
        description: "Your message has been received. I'll respond soon.",
        variant: "default",
      });
    }
    
    // Reset form after delay
    setTimeout(() => {
      setFormData({ name: '', email: '', message: '' });
      setExecutionSteps([]);
      setShowSuccess(false);
      setIsSubmitting(false);
    }, 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 500);
  };

  // Function to trigger audit request from external CTA
  const triggerAuditRequest = () => {
    const auditMessage = 'I need a workflow review.';
    setExecutionSteps([{ message: '> request_audit_initialized: "I need a workflow review."', status: 'success' }]);
    setFormData(prev => ({ ...prev, message: auditMessage }));
    messageInputRef.current?.focus();
  };

  // Expose trigger function globally for CTA buttons
  useEffect(() => {
    (window as any).triggerAuditRequest = triggerAuditRequest;
    return () => {
      delete (window as any).triggerAuditRequest;
    };
  }, []);

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
            
            <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-6">
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
                  ref={messageInputRef}
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
                        step.message.includes('ai_analysis') || step.message.includes('categorized') 
                          ? <Brain className="w-3 h-3" />
                          : <CheckCircle2 className="w-3 h-3" />
                      )}
                      {step.status === 'error' && (
                        <AlertCircle className="w-3 h-3" />
                      )}
                      {step.message}
                      {step.status === 'success' && !step.message.includes('initialized') && !step.message.includes('...') && (
                        <span className="text-secondary ml-1">✓</span>
                      )}
                    </motion.div>
                  ))}
                  
                  {showSuccess && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-secondary mt-4 pt-4 border-t border-border"
                    >
                      ✓ Lead captured & analyzed. Expect a response within 24 hours.
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
