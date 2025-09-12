import { Card, CardContent } from '@/components/ui/card';
import { Users, BookOpen, GraduationCap, Clock } from 'lucide-react';

export const SocialProof = () => {
  const stats = [
    {
      icon: Users,
      value: "1,847+",
      label: "Aktivnih igralcev",
      description: "Učenci in dijaki že preizkušajo svoje znanje"
    },
    {
      icon: BookOpen,
      value: "500+",
      label: "Vprašanj",
      description: "Iz vseh predmetov in razredov"
    },
    {
      icon: GraduationCap,
      value: "12",
      label: "Razredov",
      description: "Od 1. razreda do mature"
    },
    {
      icon: Clock,
      value: "10 min",
      label: "Povprečen čas igre",
      description: "Hitro in zabavno tekmovanje"
    }
  ];

  const recentActivity = [
    "Matej je pravkar dosegel 9. razred! 🎉",
    "Razred 7.a tekmuje v zgodovini",
    "Ana je postala prvakinja v matematiki",
    "Skupina prijateljev iz Ljubljane igra",
    "Luka je dosegel maturo! 🎓",
    "Nova igra se začenja za 8.b razred"
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-muted/20 to-background">
      <div className="container px-4">
        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map(({ icon: Icon, value, label, description }, index) => (
            <Card key={index} className="text-center border-0 bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-all duration-300">
              <CardContent className="p-6 space-y-2">
                <Icon className="h-8 w-8 text-primary mx-auto" />
                <div className="text-2xl sm:text-3xl font-bold text-foreground">{value}</div>
                <div className="text-sm font-medium text-foreground">{label}</div>
                <div className="text-xs text-muted-foreground">{description}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Live Activity Feed */}
        <div className="max-w-2xl mx-auto">
          <div className="text-center space-y-4 mb-8">
            <h3 className="text-2xl font-bold text-foreground">Trenutna aktivnost</h3>
            <p className="text-muted-foreground">Kaj se dogaja v naši skupnosti</p>
          </div>

          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors duration-200"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span className="text-sm text-foreground">{activity}</span>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-6 pt-4 border-t border-border/50">
                <span className="text-sm text-muted-foreground">
                  🔴 V živo • Posodobljeno vsako minuto
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap justify-center items-center gap-8 mt-16 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>Varno za vse starosti</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span>Brez registracije potrebne</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full" />
            <span>Zastonj za uporabo</span>
          </div>
        </div>
      </div>
    </section>
  );
};