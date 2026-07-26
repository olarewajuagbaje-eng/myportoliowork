import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Signed in");
    nav("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <Helmet>
        <title>Sign in — Agbaje Olarewaju</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <form onSubmit={onSubmit} className="glass-card w-full max-w-md p-8 rounded-2xl space-y-5">
        <div>
          <h1 className="text-2xl font-display font-bold">Sign in</h1>
          <p className="text-sm text-muted-foreground mt-1">Admin access to the content dashboard.</p>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground uppercase tracking-wider">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary/60"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground uppercase tracking-wider">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary/60"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="cta-glow w-full py-2.5 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground font-medium flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />} Sign in
        </button>
        <div className="flex justify-between text-xs text-muted-foreground">
          <Link to="/forgot-password" className="hover:text-foreground">Forgot password?</Link>
          <Link to="/" className="hover:text-foreground">← Back to site</Link>
        </div>
      </form>
    </div>
  );
}
