
-- 1) Drop functions that reference timer/achievements, to remove deps before dropping tables
DROP FUNCTION IF EXISTS public.check_and_award_achievements(uuid);
DROP FUNCTION IF EXISTS public.calculate_current_streak(uuid);

-- 2) Drop timer/achievements-related tables
DROP TABLE IF EXISTS public.user_achievements;
DROP TABLE IF EXISTS public.achievements;
DROP TABLE IF EXISTS public.focus_sessions;
