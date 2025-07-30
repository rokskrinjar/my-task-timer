-- Create achievements table
CREATE TABLE public.achievements (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  requirement_type text NOT NULL, -- 'sessions_count', 'streak_days', 'total_minutes', 'consecutive_days'
  requirement_value integer NOT NULL,
  badge_color text NOT NULL DEFAULT '#3b82f6',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create user_achievements table
CREATE TABLE public.user_achievements (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  achievement_id uuid NOT NULL REFERENCES public.achievements(id),
  unlocked_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Enable RLS
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Create policies for achievements (readable by everyone)
CREATE POLICY "Achievements are viewable by everyone" 
ON public.achievements 
FOR SELECT 
USING (true);

-- Create policies for user_achievements
CREATE POLICY "Users can view their own achievements" 
ON public.user_achievements 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements" 
ON public.user_achievements 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Insert default achievements
INSERT INTO public.achievements (name, description, icon, requirement_type, requirement_value, badge_color) VALUES
('First Focus', 'Complete your first focus session', '🎯', 'sessions_count', 1, '#22c55e'),
('Getting Started', 'Complete 5 focus sessions', '🚀', 'sessions_count', 5, '#3b82f6'),
('Focused Mind', 'Complete 25 focus sessions', '🧠', 'sessions_count', 25, '#8b5cf6'),
('Focus Master', 'Complete 100 focus sessions', '👑', 'sessions_count', 100, '#f59e0b'),
('Daily Habit', 'Maintain a 3-day focus streak', '🔥', 'streak_days', 3, '#ef4444'),
('Week Warrior', 'Maintain a 7-day focus streak', '⚡', 'streak_days', 7, '#f97316'),
('Streak Champion', 'Maintain a 30-day focus streak', '🏆', 'streak_days', 30, '#dc2626'),
('Hour Power', 'Complete 60 minutes of focused work', '⏰', 'total_minutes', 60, '#06b6d4'),
('Focus Marathon', 'Complete 10 hours of focused work', '🏃', 'total_minutes', 600, '#10b981'),
('Dedication', 'Complete 50 hours of focused work', '💪', 'total_minutes', 3000, '#7c3aed');

-- Create function to calculate user streaks
CREATE OR REPLACE FUNCTION public.calculate_current_streak(user_uuid uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  streak_count integer := 0;
  check_date date;
  session_exists boolean;
BEGIN
  -- Start from today and work backwards
  check_date := CURRENT_DATE;
  
  LOOP
    -- Check if user had any completed sessions on this date
    SELECT EXISTS (
      SELECT 1 FROM public.focus_sessions 
      WHERE user_id = user_uuid 
      AND was_interrupted = false
      AND DATE(completed_at) = check_date
    ) INTO session_exists;
    
    -- If no session on this date, break the streak
    IF NOT session_exists THEN
      -- Exception: if this is today and no sessions yet, don't break streak
      IF check_date = CURRENT_DATE THEN
        check_date := check_date - interval '1 day';
        CONTINUE;
      ELSE
        EXIT;
      END IF;
    END IF;
    
    -- Increment streak and check previous day
    streak_count := streak_count + 1;
    check_date := check_date - interval '1 day';
    
    -- Safety limit to prevent infinite loops
    IF streak_count > 1000 THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN streak_count;
END;
$$;

-- Create function to check and award achievements
CREATE OR REPLACE FUNCTION public.check_and_award_achievements(user_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_sessions_count integer;
  user_total_minutes integer;
  user_current_streak integer;
  achievement_record record;
BEGIN
  -- Get user stats
  SELECT COUNT(*), COALESCE(SUM(duration_minutes), 0)
  INTO user_sessions_count, user_total_minutes
  FROM public.focus_sessions
  WHERE user_id = user_uuid AND was_interrupted = false;
  
  -- Get current streak
  SELECT public.calculate_current_streak(user_uuid) INTO user_current_streak;
  
  -- Check each achievement
  FOR achievement_record IN 
    SELECT * FROM public.achievements
  LOOP
    -- Check if user already has this achievement
    IF NOT EXISTS (
      SELECT 1 FROM public.user_achievements 
      WHERE user_id = user_uuid AND achievement_id = achievement_record.id
    ) THEN
      -- Check if user meets the requirement
      IF (achievement_record.requirement_type = 'sessions_count' AND user_sessions_count >= achievement_record.requirement_value) OR
         (achievement_record.requirement_type = 'total_minutes' AND user_total_minutes >= achievement_record.requirement_value) OR
         (achievement_record.requirement_type = 'streak_days' AND user_current_streak >= achievement_record.requirement_value) THEN
        
        -- Award the achievement
        INSERT INTO public.user_achievements (user_id, achievement_id)
        VALUES (user_uuid, achievement_record.id);
      END IF;
    END IF;
  END LOOP;
END;
$$;