import HeroSection from '../components/HeroSection';
import MarqueeSection from '../components/MarqueeSection';
import AboutSection from '../components/AboutSection';
import ServicesSection from '../components/ServicesSection';
import ProjectsSection from '../components/ProjectsSection';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { hero } = await searchParams;

  return (
    <main style={{ background: '#0C0C0C', overflowX: 'clip' }}>
      <HeroSection variant={hero === 'split' || hero === 'center' ? hero : 'classic'} />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
    </main>
  );
}
