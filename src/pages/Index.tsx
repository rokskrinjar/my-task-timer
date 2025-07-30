import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Timer } from '@/components/Timer';
import { ProgressDashboard } from '@/components/ProgressDashboard';

const Index = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  // Don't redirect non-authenticated users - let them use the timer

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
              <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Beat Procrastination
              </Link>
              <Link to="/" className="text-sm font-medium text-primary border-b-2 border-primary pb-1">
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
      
      <main className="container py-8">
        <div className="text-center space-y-6 mb-12">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Beat Procrastination
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay focused with our simple, effective countdown timer. Track your progress and build the habit of deep work.
          </p>
        </div>
        
        <Timer />
        
        {user && (
          <div className="mt-16">
            <ProgressDashboard />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
