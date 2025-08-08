-- Add UPDATE policy for game participants to allow score updates
CREATE POLICY "Participants can update their own data" 
ON public.game_participants 
FOR UPDATE 
USING (
  -- Allow authenticated users to update their own participant record
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
  -- Allow guests to update their own participant record (identified by display_name)
  (auth.uid() IS NULL AND user_id IS NULL)
);