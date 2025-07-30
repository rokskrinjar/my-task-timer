import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Clock, Flame } from 'lucide-react';

interface FocusSession {
  id: string;
  duration_minutes: number;
  completed_at: string;
  was_interrupted: boolean;
}

export const ProgressDashboard = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);

  const fetchSessions = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('focus_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <Card className="p-6">
        <div className="text-center">Loading your progress...</div>
      </Card>
    );
  }

  const completedSessions = sessions.filter(s => !s.was_interrupted);
  const totalFocusTime = completedSessions.reduce((sum, s) => sum + s.duration_minutes, 0);
  const currentStreak = calculateStreak(completedSessions);
  const todaySessions = sessions.filter(s => 
    new Date(s.completed_at).toDateString() === new Date().toDateString()
  );

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-center">Your Progress</h3>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
          <div className="text-2xl font-bold">{completedSessions.length}</div>
          <div className="text-sm text-muted-foreground">Completed Sessions</div>
        </Card>
        
        <Card className="p-4 text-center">
          <Clock className="w-8 h-8 mx-auto mb-2 text-blue-500" />
          <div className="text-2xl font-bold">{Math.floor(totalFocusTime / 60)}h {totalFocusTime % 60}m</div>
          <div className="text-sm text-muted-foreground">Total Focus Time</div>
        </Card>
        
        <Card className="p-4 text-center">
          <Flame className="w-8 h-8 mx-auto mb-2 text-orange-500" />
          <div className="text-2xl font-bold">{currentStreak}</div>
          <div className="text-sm text-muted-foreground">Current Streak</div>
        </Card>
        
        <Card className="p-4 text-center">
          <Target className="w-8 h-8 mx-auto mb-2 text-green-500" />
          <div className="text-2xl font-bold">{todaySessions.length}</div>
          <div className="text-sm text-muted-foreground">Today's Sessions</div>
        </Card>
      </div>

      {/* Recent Sessions */}
      {sessions.length > 0 && (
        <Card className="p-6">
          <h4 className="text-lg font-semibold mb-4">Recent Sessions</h4>
          <div className="space-y-3">
            {sessions.slice(0, 5).map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{session.duration_minutes} minutes</span>
                  {!session.was_interrupted ? (
                    <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-500/20">
                      Completed
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="bg-orange-500/10 text-orange-600 border-orange-500/20">
                      Interrupted
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(session.completed_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {sessions.length === 0 && (
        <Card className="p-8 text-center">
          <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h4 className="text-lg font-semibold mb-2">Start Your Focus Journey</h4>
          <p className="text-muted-foreground">
            Complete your first focus session to start tracking your progress!
          </p>
        </Card>
      )}
    </div>
  );
};

function calculateStreak(sessions: FocusSession[]): number {
  if (sessions.length === 0) return 0;
  
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  // Group sessions by date
  const sessionsByDate = sessions.reduce((acc, session) => {
    const date = new Date(session.completed_at);
    date.setHours(0, 0, 0, 0);
    const dateStr = date.toISOString().split('T')[0];
    
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(session);
    return acc;
  }, {} as Record<string, FocusSession[]>);
  
  // Calculate streak from today backwards
  for (let i = 0; i < 365; i++) { // Max 365 days
    const checkDate = new Date(currentDate);
    checkDate.setDate(checkDate.getDate() - i);
    const dateStr = checkDate.toISOString().split('T')[0];
    
    if (sessionsByDate[dateStr]) {
      streak++;
    } else if (i > 0) { // Allow today to be empty if checking streak
      break;
    }
  }
  
  return streak;
}