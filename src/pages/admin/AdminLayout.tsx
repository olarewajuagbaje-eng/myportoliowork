import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Loader2, LogOut, FileText, PlusCircle, ExternalLink } from "lucide-react";

export default function AdminLayout() {
  const { loading, session, isAdmin, signOut } = useAuth();
  const loc = useLocation();

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );

  if (!session) return <Navigate to="/login" state={{ from: loc }} replace />;
  if (!isAdmin)
    return (
      <div className="min-h-screen flex items-center justify-center px-6 text-center">
        <div>
          <h1 className="text-2xl font-display mb-2">Access denied</h1>
          <p className="text-muted-foreground mb-6">Your account does not have admin access.</p>
          <button onClick={signOut} className="text-sm text-primary hover:underline">Sign out</button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex">
      <aside className="w-60 border-r border-white/5 bg-black/30 backdrop-blur-xl p-6 hidden md:flex flex-col">
        <Link to="/" className="font-display font-bold text-lg mb-8">AO Admin</Link>
        <nav className="space-y-1 flex-1 text-sm">
          <Link to="/admin" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5">
            <FileText className="w-4 h-4" /> Posts
          </Link>
          <Link to="/admin/posts/new" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5">
            <PlusCircle className="w-4 h-4" /> New post
          </Link>
          <Link to="/blog" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5">
            <ExternalLink className="w-4 h-4" /> View blog
          </Link>
        </nav>
        <button onClick={signOut} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </aside>
      <main className="flex-1 p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  );
}
