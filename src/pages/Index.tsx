import N8nWorkflowBackground from '@/components/N8nWorkflowBackground';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import FeaturedProjectsSection from '@/components/FeaturedProjectsSection';
import ProjectsSection from '@/components/ProjectsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import MobileStickyContact from '@/components/MobileStickyContact';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <N8nWorkflowBackground />
      <Header />
      <FloatingButtons />
      <MobileStickyContact />
      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <FeaturedProjectsSection />
        <ProjectsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
