-- Add display_name column to game_participants and make user_id nullable
ALTER TABLE public.game_participants 
ADD COLUMN display_name TEXT;

-- Make user_id nullable for guest players
ALTER TABLE public.game_participants 
ALTER COLUMN user_id DROP NOT NULL;

-- Add constraint that either user_id OR display_name must be provided
ALTER TABLE public.game_participants 
ADD CONSTRAINT user_id_or_display_name_required 
CHECK ((user_id IS NOT NULL) OR (display_name IS NOT NULL AND display_name != ''));

-- Update RLS policies for game_participants to allow guest access
DROP POLICY IF EXISTS "Participants can view game participants" ON public.game_participants;
DROP POLICY IF EXISTS "Users can join games" ON public.game_participants;

-- New policy: Anyone can view game participants (needed for game functionality)
CREATE POLICY "Anyone can view game participants" 
ON public.game_participants 
FOR SELECT 
USING (true);

-- New policy: Authenticated users can join as themselves, anyone can join as guest
CREATE POLICY "Users and guests can join games" 
ON public.game_participants 
FOR INSERT 
WITH CHECK (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR 
  (auth.uid() IS NULL AND user_id IS NULL AND display_name IS NOT NULL)
);

-- Update game_answers policies to work with guests
DROP POLICY IF EXISTS "Participants can view answers in their games" ON public.game_answers;
DROP POLICY IF EXISTS "Users can insert their own answers" ON public.game_answers;

-- New policy: Anyone can view answers in games they participate in
CREATE POLICY "Participants can view answers in their games" 
ON public.game_answers 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM game_participants gp 
    WHERE gp.game_id = game_answers.game_id 
    AND (
      (auth.uid() IS NOT NULL AND gp.user_id = auth.uid()) OR
      (auth.uid() IS NULL)
    )
  )
);

-- New policy: Anyone can insert answers (will be controlled by application logic)
CREATE POLICY "Anyone can insert answers in their games" 
ON public.game_answers 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM game_participants gp 
    WHERE gp.game_id = game_answers.game_id 
    AND (
      (auth.uid() IS NOT NULL AND gp.user_id = auth.uid() AND game_answers.user_id = auth.uid()) OR
      (auth.uid() IS NULL AND gp.user_id IS NULL)
    )
  )
);