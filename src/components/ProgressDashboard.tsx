import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, TrendingUp, Trophy, Flame, Target, Award, BarChart3 } from 'lucide-react';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, parseISO, isSameDay } from 'date-fns';

interface FocusSession {
  id: string;
  duration_minutes: number;
  completed_at: string;
  was_interrupted: boolean;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  badge_color: string;
  requirement_type: string;
  requirement_value: number;
}

interface UserAchievement {
  id: string;
  achievement: Achievement;
  unlocked_at: string;
}

interface WeeklyData {
  date: string;
  sessions: number;
  minutes: number;
}

export const ProgressDashboard = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProgressData();
    }
  }, [user]);

  const fetchProgressData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch focus sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('focus_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (sessionsError) throw sessionsError;
      setSessions(sessionsData || []);

      // Fetch all achievements
      const { data: achievementsData, error: achievementsError } = await supabase
        .from('achievements')
        .select('*')
        .order('requirement_value', { ascending: true });

      if (achievementsError) throw achievementsError;
      setAchievements(achievementsData || []);

      // Fetch user achievements
      const { data: userAchievementsData, error: userAchievementsError } = await supabase
        .from('user_achievements')
        .select(`
          id,
          unlocked_at,
          achievement:achievements(*)
        `)
        .eq('user_id', user.id)
        .order('unlocked_at', { ascending: false });

      if (userAchievementsError) throw userAchievementsError;
      setUserAchievements(userAchievementsData || []);

      // Calculate current streak
      const { data: streakData } = await supabase.rpc('calculate_current_streak', { user_uuid: user.id });
      setCurrentStreak(streakData || 0);

      // Generate weekly data for chart
      generateWeeklyData(sessionsData || []);

    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateWeeklyData = (sessions: FocusSession[]) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      const daysSessions = sessions.filter(session => 
        !session.was_interrupted && 
        isSameDay(parseISO(session.completed_at), date)
      );
      
      return {
        date: format(date, 'MMM dd'),
        sessions: daysSessions.length,
        minutes: daysSessions.reduce((sum, session) => sum + session.duration_minutes, 0)
      };
    });
    
    setWeeklyData(last7Days);
  };

  const getStats = () => {
    const completedSessions = sessions.filter(s => !s.was_interrupted);
    const totalMinutes = completedSessions.reduce((sum, session) => sum + session.duration_minutes, 0);
    const averageSession = completedSessions.length > 0 ? Math.round(totalMinutes / completedSessions.length) : 0;
    
    // This week stats
    const weekStart = startOfWeek(new Date());
    const weekEnd = endOfWeek(new Date());
    const thisWeekSessions = completedSessions.filter(session => {
      const sessionDate = parseISO(session.completed_at);
      return sessionDate >= weekStart && sessionDate <= weekEnd;
    });
    const thisWeekMinutes = thisWeekSessions.reduce((sum, session) => sum + session.duration_minutes, 0);

    // This month stats
    const monthStart = startOfMonth(new Date());
    const monthEnd = endOfMonth(new Date());
    const thisMonthSessions = completedSessions.filter(session => {
      const sessionDate = parseISO(session.completed_at);
      return sessionDate >= monthStart && sessionDate <= monthEnd;
    });
    const thisMonthMinutes = thisMonthSessions.reduce((sum, session) => sum + session.duration_minutes, 0);

    return {
      totalSessions: completedSessions.length,
      totalMinutes,
      totalHours: Math.round(totalMinutes / 60 * 10) / 10,
      averageSession,
      thisWeekSessions: thisWeekSessions.length,
      thisWeekHours: Math.round(thisWeekMinutes / 60 * 10) / 10,
      thisMonthSessions: thisMonthSessions.length,
      thisMonthHours: Math.round(thisMonthMinutes / 60 * 10) / 10,
      currentStreak
    };
  };

  const getRecentSessions = () => {
    return sessions
      .filter(s => !s.was_interrupted)
      .slice(0, 10)
      .map(session => ({
        ...session,
        date: format(parseISO(session.completed_at), 'MMM dd, yyyy'),
        time: format(parseISO(session.completed_at), 'h:mm a')
      }));
  };

  const getNextAchievement = () => {
    const stats = getStats();
    const unlockedIds = userAchievements.map(ua => ua.achievement.id);
    
    const nextAchievements = achievements
      .filter(achievement => !unlockedIds.includes(achievement.id))
      .map(achievement => {
        let progress = 0;
        let currentValue = 0;
        
        switch (achievement.requirement_type) {
          case 'sessions_count':
            currentValue = stats.totalSessions;
            progress = Math.min((currentValue / achievement.requirement_value) * 100, 100);
            break;
          case 'total_minutes':
            currentValue = stats.totalMinutes;
            progress = Math.min((currentValue / achievement.requirement_value) * 100, 100);
            break;
          case 'streak_days':
            currentValue = stats.currentStreak;
            progress = Math.min((currentValue / achievement.requirement_value) * 100, 100);
            break;
        }
        
        return { ...achievement, progress, currentValue };
      })
      .sort((a, b) => b.progress - a.progress)[0];

    return nextAchievements;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Your Progress</h2>
        <div className="text-center py-8">
          <div className="text-lg">Loading your progress...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const stats = getStats();
  const recentSessions = getRecentSessions();
  const nextAchievement = getNextAchievement();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">Your Progress</h2>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Total Sessions</span>
          </div>
          <div className="text-2xl font-bold">{stats.totalSessions}</div>
          <div className="text-xs text-muted-foreground">{stats.totalHours}h total</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium">Current Streak</span>
          </div>
          <div className="text-2xl font-bold">{stats.currentStreak}</div>
          <div className="text-xs text-muted-foreground">days in a row</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">This Week</span>
          </div>
          <div className="text-2xl font-bold">{stats.thisWeekSessions}</div>
          <div className="text-xs text-muted-foreground">{stats.thisWeekHours}h focused</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium">This Month</span>
          </div>
          <div className="text-2xl font-bold">{stats.thisMonthSessions}</div>
          <div className="text-xs text-muted-foreground">{stats.thisMonthHours}h focused</div>
        </Card>
      </div>

      {/* Weekly Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Last 7 Days
        </h3>
        <div className="space-y-4">
          {weeklyData.map((day, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-16 text-sm text-muted-foreground">{day.date}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">{day.sessions} sessions</span>
                  <span className="text-xs text-muted-foreground">({day.minutes}m)</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ 
                      width: `${Math.min((day.sessions / Math.max(...weeklyData.map(d => d.sessions))) * 100, 100)}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Achievements */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Recent Achievements
          </h3>
          {userAchievements.length > 0 ? (
            <div className="space-y-3">
              {userAchievements.slice(0, 5).map((userAchievement) => (
                <div key={userAchievement.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl">{userAchievement.achievement.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium">{userAchievement.achievement.name}</div>
                    <div className="text-sm text-muted-foreground">{userAchievement.achievement.description}</div>
                    <div className="text-xs text-muted-foreground">
                      Unlocked {format(parseISO(userAchievement.unlocked_at), 'MMM dd, yyyy')}
                    </div>
                  </div>
                  <Badge style={{ backgroundColor: userAchievement.achievement.badge_color }}>
                    New!
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              Complete your first focus session to unlock achievements!
            </div>
          )}
        </Card>

        {/* Next Achievement */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-500" />
            Next Achievement
          </h3>
          {nextAchievement ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{nextAchievement.icon}</div>
                <div className="flex-1">
                  <div className="font-medium">{nextAchievement.name}</div>
                  <div className="text-sm text-muted-foreground">{nextAchievement.description}</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{nextAchievement.currentValue} / {nextAchievement.requirement_value}</span>
                </div>
                <Progress value={nextAchievement.progress} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  {Math.round(nextAchievement.progress)}% complete
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              Congratulations! You've unlocked all achievements! 🎉
            </div>
          )}
        </Card>
      </div>

      {/* Session History */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Focus Sessions
        </h3>
        {recentSessions.length > 0 ? (
          <div className="space-y-2">
            {recentSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <div>
                    <div className="font-medium">{session.duration_minutes} minutes</div>
                    <div className="text-sm text-muted-foreground">{session.date} at {session.time}</div>
                  </div>
                </div>
                <Badge variant="secondary">Completed</Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No focus sessions yet. Start your first session to see your history here!
          </div>
        )}
      </Card>
    </div>
  );
};