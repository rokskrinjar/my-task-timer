-- Let's temporarily make the game_answers table more permissive to isolate the issue
-- We'll allow all authenticated and unauthenticated users to read game_answers

DROP POLICY IF EXISTS "Allow participants to view game answers" ON public.game_answers;

-- Create a very permissive policy for debugging
CREATE POLICY "Temporary permissive policy for debugging" 
ON public.game_answers 
FOR SELECT 
USING (true); -- Allow everyone to read, just for debugging