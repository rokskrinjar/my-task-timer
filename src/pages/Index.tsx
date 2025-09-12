import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import { HeroSection } from '@/components/landing/HeroSection';
import { ValuePropositions } from '@/components/landing/ValuePropositions';
import { GamePreview } from '@/components/landing/GamePreview';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { SocialProof } from '@/components/landing/SocialProof';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Nalaganje...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4 overflow-hidden">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-xl font-bold hover:text-primary transition-colors">
              Kdo naredi celotno šolo
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <main className="pt-14">
        <HeroSection />
        <ValuePropositions />
        <GamePreview />
        <HowItWorks />
        <SocialProof />
      </main>
    </div>
  );
};

export default Index;
