-- Temporarily simplify the RLS policy for game_answers to debug the issue
DROP POLICY IF EXISTS "Allow participants to insert answers" ON game_answers;

-- Create a simpler policy for troubleshooting
CREATE POLICY "Simple policy for game answers insertion"
  ON game_answers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM game_participants gp 
      WHERE gp.game_id = game_answers.game_id 
      AND (
        (auth.uid() IS NOT NULL AND gp.user_id = auth.uid() AND game_answers.user_id = auth.uid()) 
        OR 
        (auth.uid() IS NULL AND gp.user_id IS NULL AND game_answers.user_id IS NULL)
      )
    )
  );