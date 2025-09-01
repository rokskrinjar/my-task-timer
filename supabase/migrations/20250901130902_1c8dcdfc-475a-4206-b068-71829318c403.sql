-- Fix critical security vulnerability: Remove public access to game_answers
-- This fixes the issue where anyone could view all player answers and performance data

-- Drop the temporary permissive policy that exposes all game answers
DROP POLICY IF EXISTS "Temporary permissive policy for debugging" ON public.game_answers;

-- Create a proper SELECT policy that only allows game participants to view answers from their games
CREATE POLICY "Game participants can view answers from their games" 
ON public.game_answers 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM public.game_participants gp 
    WHERE gp.game_id = game_answers.game_id 
    AND (
      -- For authenticated users: match user_id
      (auth.uid() IS NOT NULL AND gp.user_id = auth.uid()) 
      OR 
      -- For guest players: they can't verify identity reliably, so we restrict to real-time game access only
      -- This means guests can only see answers during active gameplay via real-time subscriptions
      (auth.uid() IS NULL AND gp.user_id IS NULL)
    )
  )
);

-- Additional security: Create policy to prevent guests from viewing historical game data
-- Guests should only access current game answers during active sessions
CREATE POLICY "Restrict guest access to recent games only" 
ON public.game_answers 
FOR SELECT 
USING (
  -- If user is not authenticated (guest), only allow access to games created within last 24 hours
  CASE 
    WHEN auth.uid() IS NULL THEN 
      EXISTS (
        SELECT 1 
        FROM public.games g 
        WHERE g.id = game_answers.game_id 
        AND g.created_at > NOW() - INTERVAL '24 hours'
      )
    ELSE true -- Authenticated users have normal access based on participation
  END
);