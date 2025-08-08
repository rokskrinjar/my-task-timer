-- Fix lifeline constraint to allow NULL values
ALTER TABLE game_answers DROP CONSTRAINT IF EXISTS game_answers_lifeline_used_check;
ALTER TABLE game_answers ADD CONSTRAINT game_answers_lifeline_used_check 
CHECK (lifeline_used IS NULL OR lifeline_used = ANY (ARRAY['50_50'::text, 'ask_audience'::text, 'phone_friend'::text]));