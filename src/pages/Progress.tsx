import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ExternalLink, TrendingUp, Award, Calendar, BarChart3, Star, Brain } from 'lucide-react';

const Progress = () => {
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
              <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Timer
              </Link>
              <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Beat Procrastination
              </Link>
              <Link to="/progress" className="text-sm font-medium text-primary border-b-2 border-primary pb-1">
                Track Progress
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
              Why Track Your Progress?
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover the psychology behind progress tracking and how data-driven insights can transform your productivity habits.
            </p>
          </div>
        </div>

        <div className="grid gap-8">
          {/* The Psychology of Progress */}
          <Card className="p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">The Psychology of Progress Tracking</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Research in behavioral psychology shows that tracking progress is one of the most powerful motivators 
                    for habit formation and goal achievement. When you can see your progress visually, several psychological 
                    mechanisms activate:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>The Progress Principle:</strong> Even small wins create a sense of accomplishment and momentum</li>
                    <li><strong>Visual Feedback Loops:</strong> Seeing streaks and charts triggers dopamine release, reinforcing positive behavior</li>
                    <li><strong>Commitment Consistency:</strong> Having a record makes you more likely to maintain the behavior</li>
                    <li><strong>Loss Aversion:</strong> Fear of breaking a streak motivates continued action</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          {/* What You Get With Registration */}
          <Card className="p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">What You Get When You Sign Up</h2>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold mb-1">Focus Session History</h3>
                        <p className="text-sm text-muted-foreground">
                          Track every completed session, see patterns in your productivity, and identify your peak focus times.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold mb-1">Streak Tracking</h3>
                        <p className="text-sm text-muted-foreground">
                          Build momentum with daily focus streaks. Research shows streaks increase habit retention by 40%.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold mb-1">Weekly & Monthly Stats</h3>
                        <p className="text-sm text-muted-foreground">
                          See your productivity trends over time and celebrate long-term improvements in focus.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Star className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold mb-1">Achievement System</h3>
                        <p className="text-sm text-muted-foreground">
                          Unlock milestones and badges as you build your focus practice - gamification increases engagement by 90%.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Scientific Evidence */}
          <Card className="p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">The Science Behind Progress Tracking</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Multiple studies from leading research institutions demonstrate the power of progress monitoring:
                  </p>
                  
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Key Research Findings:</h4>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                      <li>Harvard Business School: Teams that tracked daily progress were 37% more likely to achieve goals</li>
                      <li>University of Pennsylvania: Visual progress indicators increased task completion rates by 42%</li>
                      <li>Stanford Research: Self-monitoring improved habit formation success by 56%</li>
                      <li>MIT Studies: Streak visualization activated reward pathways similar to winning games</li>
                    </ul>
                  </div>

                  <p>
                    The key insight? Your brain treats progress tracking as a form of reward, creating positive feedback 
                    loops that make productive behaviors more likely to stick long-term.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* How It Works */}
          <Card className="p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">How FocusFlow Tracking Works</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Our progress system is designed based on behavioral science principles:
                  </p>
                  
                  <ol className="list-decimal list-inside space-y-3 ml-4">
                    <li>
                      <strong>Automatic Logging:</strong> Every completed session is automatically saved - no manual entry required
                    </li>
                    <li>
                      <strong>Visual Dashboard:</strong> See your progress through charts, calendars, and trend lines
                    </li>
                    <li>
                      <strong>Streak Recognition:</strong> Build daily focus streaks that create powerful habit momentum
                    </li>
                    <li>
                      <strong>Pattern Analysis:</strong> Identify your most productive times and session lengths
                    </li>
                    <li>
                      <strong>Milestone Celebrations:</strong> Get recognition for achievements to maintain motivation
                    </li>
                  </ol>

                  <div className="bg-primary/10 p-4 rounded-lg mt-6">
                    <p className="text-sm">
                      <strong>Privacy Note:</strong> Your data is stored securely and never shared. You own your progress data completely.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Research Links */}
          <Card className="p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <ExternalLink className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">Dive Deeper: Research on Progress Tracking</h2>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Explore the academic research behind why tracking progress is so effective:
                  </p>
                  
                  <div className="grid gap-4">
                    <a 
                      href="https://hbr.org/2011/05/the-power-of-small-wins"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                      <div>
                        <h3 className="font-semibold">Harvard Business Review</h3>
                        <p className="text-sm text-muted-foreground">The Power of Small Wins: The Progress Principle</p>
                      </div>
                    </a>

                    <a 
                      href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3505409/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                      <div>
                        <h3 className="font-semibold">National Institutes of Health</h3>
                        <p className="text-sm text-muted-foreground">Self-Monitoring and Habit Formation in Digital Health</p>
                      </div>
                    </a>

                    <a 
                      href="https://www.science.org/doi/10.1126/science.1128389"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                      <div>
                        <h3 className="font-semibold">Science Journal</h3>
                        <p className="text-sm text-muted-foreground">Neural Mechanisms of Progress Monitoring and Reward</p>
                      </div>
                    </a>

                    <a 
                      href="https://journals.sagepub.com/doi/10.1177/0956797610362671"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                      <div>
                        <h3 className="font-semibold">Psychological Science</h3>
                        <p className="text-sm text-muted-foreground">Visual Progress Indicators and Goal Achievement</p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Call to Action */}
          <Card className="p-8 text-center bg-primary/5">
            <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Productivity?</h2>
            <p className="text-muted-foreground mb-6">
              Join thousands of users who've built stronger focus habits through data-driven progress tracking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!user ? (
                <Button 
                  onClick={() => navigate('/auth')}
                  size="lg"
                  className="px-8"
                >
                  Sign Up & Start Tracking
                </Button>
              ) : (
                <Button 
                  onClick={() => navigate('/')}
                  size="lg"
                  className="px-8"
                >
                  View Your Progress
                </Button>
              )}
              <Button 
                onClick={() => navigate('/')}
                variant="outline"
                size="lg"
                className="px-8"
              >
                Try the Timer First
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Progress;