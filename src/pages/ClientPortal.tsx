import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Terminal, 
  Shield, 
  Activity, 
  Cpu, 
  Server, 
  CheckCircle2, 
  Clock,
  Zap,
  Database,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

interface SystemMetric {
  label: string;
  value: string;
  status: 'active' | 'idle' | 'processing';
  icon: React.ComponentType<{ className?: string }>;
}

interface AutomationStats {
  totalWorkflows: number;
  tasksProcessed: string;
  uptime: string;
  avgResponseTime: string;
}

const ClientPortal = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ clientId: '', accessKey: '' });
  const [isLoading, setIsLoading] = useState(false);

  const stats: AutomationStats = {
    totalWorkflows: 12,
    tasksProcessed: "24,847",
    uptime: "99.97%",
    avgResponseTime: "1.2s"
  };

  const systemMetrics: SystemMetric[] = [
    { label: "Revenue Shield", value: "Active", status: "active", icon: Shield },
    { label: "Lead Pipeline", value: "Processing", status: "processing", icon: Zap },
    { label: "AI Agents", value: "3 Online", status: "active", icon: Cpu },
    { label: "Data Sync", value: "Idle", status: "idle", icon: Database },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For demo purposes - always show dashboard
    setIsAuthenticated(true);
    setIsLoading(false);
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="terminal-window">
            <div className="terminal-header">
              <div className="terminal-dot bg-destructive" />
              <div className="terminal-dot" style={{ backgroundColor: 'hsl(45 93% 47%)' }} />
              <div className="terminal-dot bg-secondary" />
              <span className="ml-4 text-muted-foreground text-sm flex items-center gap-2">
                <Lock className="w-4 h-4" />
                client_portal_auth
              </span>
            </div>

            <form onSubmit={handleLogin} className="p-6 space-y-6">
              <div className="text-center mb-8">
                <motion.div
                  animate={{ 
                    boxShadow: ['0 0 20px hsl(var(--primary)/0.3)', '0 0 40px hsl(var(--primary)/0.5)', '0 0 20px hsl(var(--primary)/0.3)']
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-flex p-4 rounded-xl bg-primary/10 mb-4"
                >
                  <Terminal className="w-10 h-10 text-primary" />
                </motion.div>
                <h1 className="text-2xl font-bold font-display">System Login</h1>
                <p className="text-sm text-muted-foreground mt-2">
                  Access your automation dashboard
                </p>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                  <span className="text-secondary">$</span> client_id:
                </label>
                <input
                  type="text"
                  value={loginData.clientId}
                  onChange={(e) => setLoginData({ ...loginData, clientId: e.target.value })}
                  className="w-full bg-transparent border-b border-border py-2 focus:outline-none focus:border-primary transition-colors font-mono"
                  placeholder="Enter client ID"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                  <span className="text-secondary">$</span> access_key:
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={loginData.accessKey}
                    onChange={(e) => setLoginData({ ...loginData, accessKey: e.target.value })}
                    className="w-full bg-transparent border-b border-border py-2 focus:outline-none focus:border-primary transition-colors font-mono pr-10"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Cpu className="w-4 h-4" />
                    </motion.div>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    authenticate()
                  </>
                )}
              </motion.button>

              <p className="text-xs text-center text-muted-foreground mt-4">
                Contact <span className="text-primary">contact@agbaje.dev</span> for access
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  // Dashboard view
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Exit Portal
          </Link>
          <div className="flex items-center gap-2 text-sm text-secondary">
            <CheckCircle2 className="w-4 h-4" />
            System Online
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold font-display mb-2">
            Automation <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-muted-foreground">
            Real-time overview of your automated systems
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Active Workflows", value: stats.totalWorkflows, icon: Server },
            { label: "Tasks Processed", value: stats.tasksProcessed, icon: Activity },
            { label: "System Uptime", value: stats.uptime, icon: Clock },
            { label: "Avg Response", value: stats.avgResponseTime, icon: Zap },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-4"
            >
              <stat.icon className="w-5 h-5 text-primary mb-2" />
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            System Status
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            {systemMetrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <metric.icon className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">{metric.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${
                    metric.status === 'active' ? 'text-secondary' :
                    metric.status === 'processing' ? 'text-primary' :
                    'text-muted-foreground'
                  }`}>
                    {metric.value}
                  </span>
                  <motion.div
                    className={`w-2 h-2 rounded-full ${
                      metric.status === 'active' ? 'bg-secondary' :
                      metric.status === 'processing' ? 'bg-primary' :
                      'bg-muted-foreground'
                    }`}
                    animate={metric.status === 'processing' ? { 
                      scale: [1, 1.5, 1],
                      opacity: [1, 0.5, 1]
                    } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-lg bg-background/50 font-mono text-sm">
            <div className="text-muted-foreground">
              <span className="text-secondary">$</span> last_sync: {new Date().toISOString()}
            </div>
            <div className="text-muted-foreground mt-1">
              <span className="text-secondary">$</span> status: all_systems_nominal
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-4">
            Want a dashboard like this for your business?
          </p>
          <Link
            to="/#contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
          >
            Build My Dashboard
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default ClientPortal;
