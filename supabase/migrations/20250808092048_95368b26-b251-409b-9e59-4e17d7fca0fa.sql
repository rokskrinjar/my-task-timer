-- First, let's see the current RLS policy for game_answers
-- The issue is that guest users (user_id = null) can't read game_answers
-- We need to update the SELECT policy to handle guest users properly

-- Drop the existing policy
DROP POLICY IF EXISTS "Participants can view answers in their games" ON public.game_answers;

-- Create a new policy that handles both authenticated users and guests
CREATE POLICY "Participants can view answers in their games" 
ON public.game_answers 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM game_participants gp 
    WHERE gp.game_id = game_answers.game_id 
    AND (
      -- For authenticated users: check user_id match
      (auth.uid() IS NOT NULL AND gp.user_id = auth.uid()) 
      OR 
      -- For guest users: if they're not authenticated, allow if there's any guest participant
      (auth.uid() IS NULL AND gp.user_id IS NULL)
    )
  )
);