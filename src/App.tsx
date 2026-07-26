import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "@/lib/auth";
import Index from "./pages/Index";
import CaseStudy from "./pages/CaseStudy";
import ClientPortal from "./pages/ClientPortal";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import BlogList from "./pages/BlogList";
import BlogPost from "./pages/BlogPost";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminPosts from "./pages/admin/AdminPosts";
import PostEditor from "./pages/admin/PostEditor";

const queryClient = new QueryClient();

// GitHub Pages SPA redirect handler: consumes the path stored by 404.html
const SpaRedirectHandler = () => {
  const nav = useNavigate();
  useEffect(() => {
    const target = sessionStorage.getItem("spa-redirect");
    if (target && target !== "/" && target !== window.location.pathname + window.location.search + window.location.hash) {
      sessionStorage.removeItem("spa-redirect");
      nav(target, { replace: true });
    } else if (target) {
      sessionStorage.removeItem("spa-redirect");
    }
  }, [nav]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <SpaRedirectHandler />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/case-study/:slug" element={<CaseStudy />} />
            <Route path="/portal" element={<ClientPortal />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminPosts />} />
              <Route path="posts/new" element={<PostEditor />} />
              <Route path="posts/:id" element={<PostEditor />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
