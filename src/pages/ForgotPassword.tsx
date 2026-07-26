import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <Helmet><title>Reset password</title><meta name="robots" content="noindex" /></Helmet>
      <form onSubmit={onSubmit} className="glass-card w-full max-w-md p-8 rounded-2xl space-y-5">
        <h1 className="text-2xl font-display font-bold">Reset password</h1>
        {sent ? (
          <p className="text-sm text-muted-foreground">If an account exists for {email}, a reset link has been sent.</p>
        ) : (
          <>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary/60"
            />
            <button disabled={loading} className="cta-glow w-full py-2.5 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground font-medium">
              Send reset link
            </button>
          </>
        )}
        <Link to="/login" className="text-xs text-muted-foreground hover:text-foreground block">← Back to sign in</Link>
      </form>
    </div>
  );
}
