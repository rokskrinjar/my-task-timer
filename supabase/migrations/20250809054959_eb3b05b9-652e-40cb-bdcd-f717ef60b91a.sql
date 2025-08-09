-- Add display_name column to game_answers for guest player identification
ALTER TABLE public.game_answers 
ADD COLUMN display_name TEXT;

-- Add a comment to explain the purpose
COMMENT ON COLUMN public.game_answers.display_name IS 'Display name for guest players (null for authenticated users)';