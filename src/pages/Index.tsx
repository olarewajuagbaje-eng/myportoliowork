import MeshGradientBackground from '@/components/MeshGradientBackground';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import FeaturedProjectsSection from '@/components/FeaturedProjectsSection';
import ProjectsSection from '@/components/ProjectsSection';
import ClientReviewsSection from '@/components/ClientReviewsSection';
import ContactSection from '@/components/ContactSection';
import PreFooterTerminal from '@/components/PreFooterTerminal';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import MobileStickyContact from '@/components/MobileStickyContact';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <MeshGradientBackground />
      <Header />
      <FloatingButtons />
      <MobileStickyContact />
      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <FeaturedProjectsSection />
        <ProjectsSection />
        <ClientReviewsSection />
        <ContactSection />
        <PreFooterTerminal />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
