-- Fix security issues by properly setting search_path for existing functions

-- Update handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'display_name');
  RETURN NEW;
END;
$$;

-- Update calculate_current_streak function
CREATE OR REPLACE FUNCTION public.calculate_current_streak(user_uuid uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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

-- Update check_and_award_achievements function
CREATE OR REPLACE FUNCTION public.check_and_award_achievements(user_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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