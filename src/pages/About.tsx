import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ExternalLink, Clock, Target, Brain, Zap } from 'lucide-react';

const About = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-medium">Loading...</h1>
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
              FocusFlow
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/about" className="text-sm font-medium text-primary border-b-2 border-primary pb-1">
                Beat Procrastination
              </Link>
              <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Timer
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground">
                  Welcome, {user.email}
                </span>
                <Button variant="outline" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="outline">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </header>
      
      <main className="container py-8 max-w-4xl">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Timer
          </Button>
          
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Beat Procrastination with Small Tasks
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Learn how breaking work into focused time blocks can overcome procrastination and boost your productivity.
            </p>
          </div>
        </div>

        <div className="grid gap-8">
          {/* Why Small Tasks Work */}
          <Card className="p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">Why Small Tasks Beat Procrastination</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Procrastination often stems from feeling overwhelmed by large, complex tasks. When your brain perceives 
                    a task as too big or undefined, it triggers a stress response that makes you want to avoid it entirely.
                  </p>
                  <p>
                    By breaking work into small, time-bound sessions (like 15-25 minutes), you make tasks feel manageable. 
                    This approach, popularized by the Pomodoro Technique, leverages several psychological principles:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Reduced cognitive load:</strong> Small tasks require less mental energy to start</li>
                    <li><strong>Quick wins:</strong> Completing short sessions provides immediate satisfaction</li>
                    <li><strong>Time constraint:</strong> Knowing there's an end point makes starting easier</li>
                    <li><strong>Momentum building:</strong> Success breeds success, creating positive feedback loops</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          {/* The Science Behind It */}
          <Card className="p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">The Science Behind Focus Sessions</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Research in neuroscience and psychology supports the effectiveness of time-blocked work:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Attention spans:</strong> Most people can maintain deep focus for 15-45 minutes before attention wanes</li>
                    <li><strong>Dopamine cycles:</strong> Short work sessions followed by breaks optimize dopamine release</li>
                    <li><strong>Stress reduction:</strong> Time limits reduce the anxiety associated with open-ended tasks</li>
                    <li><strong>Flow state:</strong> Structured sessions help you enter and maintain focused work states</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          {/* How to Use FocusFlow */}
          <Card className="p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">How to Use FocusFlow Effectively</h2>
                <div className="space-y-4 text-muted-foreground">
                  <ol className="list-decimal list-inside space-y-3 ml-4">
                    <li>
                      <strong>Choose your task:</strong> Pick one specific thing you want to work on
                    </li>
                    <li>
                      <strong>Set a timer:</strong> Start with 15-25 minutes (adjust based on your attention span)
                    </li>
                    <li>
                      <strong>Eliminate distractions:</strong> Close unnecessary tabs, silence notifications
                    </li>
                    <li>
                      <strong>Focus completely:</strong> Work only on that one task until the timer rings
                    </li>
                    <li>
                      <strong>Take breaks:</strong> Rest for 5-15 minutes between sessions
                    </li>
                    <li>
                      <strong>Track progress:</strong> Sign in to see your focus streaks and build momentum
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </Card>

          {/* External Resources */}
          <Card className="p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">Learn More: Research & Articles</h2>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Dive deeper into the science of productivity and procrastination with these reputable sources:
                  </p>
                  
                  <div className="grid gap-4">
                    <a 
                      href="https://www.apa.org/science/about/psa/2013/09/procrastination"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                      <div>
                        <h3 className="font-semibold">American Psychological Association</h3>
                        <p className="text-sm text-muted-foreground">The Psychology of Procrastination - Why People Put off Important Tasks</p>
                      </div>
                    </a>

                    <a 
                      href="https://hbr.org/2017/03/the-case-for-finally-cleaning-your-desk"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                      <div>
                        <h3 className="font-semibold">Harvard Business Review</h3>
                        <p className="text-sm text-muted-foreground">The Science of Breaking Bad Habits and Building Good Ones</p>
                      </div>
                    </a>

                    <a 
                      href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6005025/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                      <div>
                        <h3 className="font-semibold">National Center for Biotechnology Information</h3>
                        <p className="text-sm text-muted-foreground">The Neuroscience of Goal-Directed Behavior and Time Management</p>
                      </div>
                    </a>

                    <a 
                      href="https://www.nature.com/articles/s41467-019-13663-7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                      <div>
                        <h3 className="font-semibold">Nature Communications</h3>
                        <p className="text-sm text-muted-foreground">Research on Attention Spans and Focused Work Sessions</p>
                      </div>
                    </a>

                    <a 
                      href="https://www.tandfonline.com/doi/abs/10.1080/00224545.2019.1596446"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                      <div>
                        <h3 className="font-semibold">Journal of Social Psychology</h3>
                        <p className="text-sm text-muted-foreground">Procrastination, Self-Regulation, and Time Management Strategies</p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Call to Action */}
          <Card className="p-8 text-center bg-primary/5">
            <h2 className="text-2xl font-bold mb-4">Ready to Beat Procrastination?</h2>
            <p className="text-muted-foreground mb-6">
              Start with just 15 minutes. Pick one small task and experience the power of focused work sessions.
            </p>
            <Button 
              onClick={() => navigate('/')}
              size="lg"
              className="px-8"
            >
              Start Your First Focus Session
            </Button>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default About;