import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import { Users, Trophy } from 'lucide-react';

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
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-xl font-bold hover:text-primary transition-colors">
              Kdo naredi osnovno šolo
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <main className="container py-16">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Kdo naredi osnovno šolo?
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Kviz v stilu "Lepo je biti milijonar" za osnovno šolo. Tekmujte s prijatelji in pokažite svoje znanje!
          </p>
          
          {/* Main action - Join game as guest */}
          <div className="bg-card border rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-2">Pridruži se igri</h2>
            <p className="text-muted-foreground mb-4">
              Brez prijave - samo vnesite kodo igre in vaše ime!
            </p>
            <Button size="lg" className="w-full" asChild>
              <Link to="/join">
                <Users className="mr-2 h-5 w-5" />
                Pridruži se igri
              </Link>
            </Button>
          </div>
          
          {/* Secondary action - Create games */}
          <div className="pt-4">
            <p className="text-sm text-muted-foreground mb-3">
              Želite ustvariti svojo igro?
            </p>
            <Button variant="outline" size="lg" asChild>
              <Link to="/auth">
                <Trophy className="mr-2 h-4 w-4" />
                Prijavite se in ustvarite igro
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
