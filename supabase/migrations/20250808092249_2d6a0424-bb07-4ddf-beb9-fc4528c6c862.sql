-- The current RLS policy is too complex for guest users
-- Let's simplify it to make it work for both authenticated and guest users

-- Drop the existing policy
DROP POLICY IF EXISTS "Participants can view answers in their games" ON public.game_answers;

-- Create a simpler policy that allows all users to view answers if they are participants
-- This approach trusts that if someone can access the game, they should see the answers
CREATE POLICY "Allow participants to view game answers" 
ON public.game_answers 
FOR SELECT 
USING (
  -- Allow if there's a participant in this game matching the current user
  EXISTS (
    SELECT 1 FROM game_participants gp 
    WHERE gp.game_id = game_answers.game_id 
    AND (
      -- For authenticated users
      (auth.uid() IS NOT NULL AND gp.user_id = auth.uid())
      OR
      -- For unauthenticated users (guests), allow if any guest participant exists
      (auth.uid() IS NULL AND EXISTS (
        SELECT 1 FROM game_participants gp2 
        WHERE gp2.game_id = game_answers.game_id 
        AND gp2.user_id IS NULL
      ))
    )
  )
);