-- Add 'timeout' to the allowed lifeline values
ALTER TABLE public.game_answers 
DROP CONSTRAINT IF EXISTS game_answers_lifeline_used_check;

ALTER TABLE public.game_answers 
ADD CONSTRAINT game_answers_lifeline_used_check 
CHECK (lifeline_used IS NULL OR lifeline_used = ANY(ARRAY['50_50', 'ask_audience', 'phone_friend', 'timeout']));