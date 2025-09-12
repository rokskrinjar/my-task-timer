import { Trophy, Brain, Zap, Users, BookOpen, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const ValuePropositions = () => {
  const propositions = [
    {
      icon: Trophy,
      title: "Tekmuj s prijatelji",
      description: "Pokažite, kdo je najpametnejši v razredu ali med prijatelji!",
      highlight: "Družabno tekmovanje"
    },
    {
      icon: Brain,
      title: "Celotna šolska pot",
      description: "Od 1. razreda do mature - preizkusite znanje iz vseh predmetov!",
      highlight: "12 razredov znanja"
    },
    {
      icon: Zap,
      title: "Hitro in zabavno",
      description: "5-15 minut adrenalinske zabave s trenutnimi rezultati!",
      highlight: "Takojšnja zabava"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Zakaj izbrati naš kviz?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Edinstvena izkušnja, ki združuje zabavo, znanje in družabno tekmovanje
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {propositions.map(({ icon: Icon, title, description, highlight }, index) => (
            <Card 
              key={index}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-card/50 backdrop-blur-sm"
            >
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-foreground">{title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{description}</p>
                </div>
                
                <div className="inline-block bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
                  {highlight}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};