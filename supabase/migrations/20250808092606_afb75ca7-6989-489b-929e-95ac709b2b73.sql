-- Fix the root cause: make user_id nullable in game_answers for guest users
ALTER TABLE public.game_answers ALTER COLUMN user_id DROP NOT NULL;

-- Also fix the INSERT policy to properly handle guest users
DROP POLICY IF EXISTS "Anyone can insert answers in their games" ON public.game_answers;

CREATE POLICY "Allow participants to insert answers" 
ON public.game_answers 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM game_participants gp 
    WHERE gp.game_id = game_answers.game_id 
    AND (
      -- For authenticated users
      (auth.uid() IS NOT NULL AND gp.user_id = auth.uid() AND game_answers.user_id = auth.uid())
      OR
      -- For guest users: allow null user_id if there's a guest participant
      (auth.uid() IS NULL AND game_answers.user_id IS NULL AND EXISTS (
        SELECT 1 FROM game_participants gp2 
        WHERE gp2.game_id = game_answers.game_id 
        AND gp2.user_id IS NULL
      ))
    )
  )
);