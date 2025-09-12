import { UserPlus, Brain, Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const HowItWorks = () => {
  const steps = [
    {
      icon: UserPlus,
      title: "Pridružite se igri",
      description: "Vnesite kodo igre in svoje ime. Brez registracije!",
      details: "Organizator ustvari igro in deli kodo s skupino"
    },
    {
      icon: Brain,
      title: "Odgovarjajte na vprašanja", 
      description: "Preizkusite znanje iz različnih predmetov in razredov",
      details: "Od osnovnih vprašanj do zahtevnih izzivov mature"
    },
    {
      icon: Trophy,
      title: "Tekmujte za zmago",
      description: "Dokažite, kdo je pravi šolski prvak med prijatelji!",
      details: "Lestvica rezultatov in slavnostno razglasitev zmagovalca"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Kako igra deluje?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            V treh preprostih korakih do zabavne izkušnje s prijatelji
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map(({ icon: Icon, title, description, details }, index) => (
              <div key={index} className="relative">
                {/* Connection line for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent -translate-x-4 z-0" />
                )}
                
                <Card className="relative z-10 group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm border-0">
                  <CardContent className="p-8 text-center space-y-4">
                    {/* Step number */}
                    <div className="w-12 h-12 mx-auto bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg mb-2">
                      {index + 1}
                    </div>
                    
                    {/* Icon */}
                    <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    
                    {/* Content */}
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-foreground">{title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{description}</p>
                      <p className="text-sm text-muted-foreground/80 italic">{details}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <div className="inline-block bg-primary/5 border border-primary/20 rounded-lg p-6">
            <h3 className="font-semibold text-foreground mb-2">⚡ Super hitro</h3>
            <p className="text-sm text-muted-foreground">
              Celotna igra traja le 5-15 minut, odvisno od števila udeležencev
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};