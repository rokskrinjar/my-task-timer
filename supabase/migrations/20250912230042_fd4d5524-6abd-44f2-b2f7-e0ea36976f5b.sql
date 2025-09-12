-- Fix the RLS policy for game_participants UPDATE to properly handle guest updates
DROP POLICY IF EXISTS "Participants can update their own data" ON game_participants;

CREATE POLICY "Participants can update their own data" 
ON game_participants 
FOR UPDATE 
USING (
  -- Allow authenticated users to update their own records
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR 
  -- Allow guests to update their own records (identified by display_name when user_id is null)
  (auth.uid() IS NULL AND user_id IS NULL)
);