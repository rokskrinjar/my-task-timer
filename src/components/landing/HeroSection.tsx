import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users, Trophy, Play } from 'lucide-react';
import { FloatingIcons } from './FloatingIcons';

export const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden">
      <FloatingIcons />
      
      <div className="container px-4 text-center space-y-8 relative z-10">
        <div className="space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent leading-tight">
            Kdo naredi celotno šolo?
          </h1>
          
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Preizkusite svoje osnovnošolsko in srednješolsko znanje. Lahko preživite celotno pot in dosežete maturo?
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border">
              <Trophy className="h-4 w-4 text-primary" />
              <span>Že <strong className="text-foreground">1,847</strong> učencev in dijakov testiranih!</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Button size="lg" className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" asChild>
            <Link to="/join">
              <Play className="mr-2 h-5 w-5" />
              Pridruži se igri
            </Link>
          </Button>
          
          <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-300" asChild>
            <Link to="/auth">
              <Users className="mr-2 h-5 w-5" />
              Ustvari svojo igro
            </Link>
          </Button>
        </div>
        
        <div className="pt-8">
          <p className="text-sm text-muted-foreground">
            ⚡ Brez prijave potrebne za igranje • 🎓 Vsi predmeti in razredi • 👥 Igraj s prijatelji
          </p>
        </div>
      </div>
    </section>
  );
};