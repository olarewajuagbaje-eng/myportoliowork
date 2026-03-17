import N8nWorkflowBackground from '@/components/N8nWorkflowBackground';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FeaturedProjectsSection from '@/components/FeaturedProjectsSection';
import ExpertiseStack from '@/components/ExpertiseStack';
import AboutSection from '@/components/AboutSection';
import ProjectsSection from '@/components/ProjectsSection';
import BeforeAfterSection from '@/components/BeforeAfterSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import SkillsSection from '@/components/SkillsSection';
import BlogSection from '@/components/BlogSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <N8nWorkflowBackground />
      <Header />
      <FloatingButtons />
      <main className="relative z-10">
        <HeroSection />
        <FeaturedProjectsSection />
        <ExpertiseStack />
        <AboutSection />
        <ProjectsSection />
        <BeforeAfterSection />
        <TestimonialsSection />
        <SkillsSection />
        <BlogSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
