import MeshGradientBackground from '@/components/MeshGradientBackground';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import BusinessImpactSection from '@/components/BusinessImpactSection';
import FeaturedProjectsSection from '@/components/FeaturedProjectsSection';
import HowProjectsStartSection from '@/components/HowProjectsStartSection';
import TrustIndicatorsSection from '@/components/TrustIndicatorsSection';
import ProjectsSection from '@/components/ProjectsSection';
import WhoIWorkWithSection from '@/components/WhoIWorkWithSection';
import WhyDelaySection from '@/components/WhyDelaySection';
import AfterContactSection from '@/components/AfterContactSection';
import ClientReviewsSection from '@/components/ClientReviewsSection';
import TrustSection from '@/components/TrustSection';
import FAQBeforeHiringSection from '@/components/FAQBeforeHiringSection';
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
        <BusinessImpactSection />
        <HowProjectsStartSection />
        <FeaturedProjectsSection />
        <WhoIWorkWithSection />
        <ProjectsSection />
        <WhyDelaySection />
        <ClientReviewsSection />
        <TrustIndicatorsSection />
        <TrustSection />
        <FAQBeforeHiringSection />
        <AfterContactSection />
        <ContactSection />
        <PreFooterTerminal />

      </main>
      <Footer />
    </div>
  );
};

export default Index;

