import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function ResetPassword() {
  const nav = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return toast.error("Minimum 8 characters");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated");
    nav("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <Helmet><title>Set new password</title><meta name="robots" content="noindex" /></Helmet>
      <form onSubmit={onSubmit} className="glass-card w-full max-w-md p-8 rounded-2xl space-y-5">
        <h1 className="text-2xl font-display font-bold">Set a new password</h1>
        <input
          type="password"
          required
          placeholder="New password (min 8 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary/60"
        />
        <button disabled={loading} className="cta-glow w-full py-2.5 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground font-medium">
          Update password
        </button>
      </form>
    </div>
  );
}
