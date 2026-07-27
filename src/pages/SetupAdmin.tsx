import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, ShieldCheck } from "lucide-react";
import NotFound from "./NotFound";

const ALLOWED_EMAIL = "olarewajuagbaje@gmail.com";

export default function SetupAdmin() {
  const nav = useNavigate();
  const [checking, setChecking] = useState(true);
  const [available, setAvailable] = useState(false);
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.functions.invoke("setup-admin", {
        body: { action: "check" },
      });
      if (error) {
        setAvailable(false);
      } else {
        setAvailable(!!data?.available);
      }
      setChecking(false);
    })();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return toast.error("Password must be at least 8 characters");
    if (password !== confirm) return toast.error("Passwords do not match");
    if (!fullName.trim()) return toast.error("Please enter your full name");

    setLoading(true);
    const { data, error } = await supabase.functions.invoke("setup-admin", {
      body: {
        action: "create",
        email: ALLOWED_EMAIL,
        password,
        displayName: fullName.trim(),
      },
    });
    if (error || data?.error) {
      setLoading(false);
      return toast.error(data?.error ?? error?.message ?? "Setup failed");
    }
    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email: ALLOWED_EMAIL,
      password,
    });
    setLoading(false);
    if (signInErr) return toast.error(signInErr.message);
    toast.success("Administrator account created");
    nav("/admin", { replace: true });
  };

  if (checking)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );

  if (!available) return <NotFound />;

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <Helmet>
        <title>Administrator Setup</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <form onSubmit={onSubmit} className="glass-card w-full max-w-md p-8 rounded-2xl space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold">One-time admin setup</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              This page disables itself after use.
            </p>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-muted-foreground uppercase tracking-wider">Full name</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary/60"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground uppercase tracking-wider">Email</label>
          <input
            type="email"
            value={ALLOWED_EMAIL}
            readOnly
            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-muted-foreground"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground uppercase tracking-wider">Password</label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary/60"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground uppercase tracking-wider">Confirm password</label>
          <input
            type="password"
            required
            minLength={8}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary/60"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="cta-glow w-full py-2.5 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground font-medium flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />} Create administrator
        </button>
      </form>
    </div>
  );
}
