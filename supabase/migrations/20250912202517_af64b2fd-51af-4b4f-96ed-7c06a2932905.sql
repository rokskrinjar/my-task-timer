-- Add DELETE policy for game_answers table to allow users to delete their own answers
CREATE POLICY "Game participants can delete their own answers" 
ON public.game_answers 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1
    FROM game_participants gp
    WHERE (
      gp.game_id = game_answers.game_id 
      AND (
        (auth.uid() IS NOT NULL AND gp.user_id = auth.uid() AND game_answers.user_id = auth.uid()) 
        OR 
        (auth.uid() IS NULL AND gp.user_id IS NULL AND game_answers.user_id IS NULL)
      )
    )
  )
);