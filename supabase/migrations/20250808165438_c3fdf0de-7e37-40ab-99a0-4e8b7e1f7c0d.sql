-- Fix the constraints that are causing the issues

-- 1. Update user_answer constraint to allow empty strings for lifelines
ALTER TABLE game_answers DROP CONSTRAINT IF EXISTS game_answers_user_answer_check;
ALTER TABLE game_answers ADD CONSTRAINT game_answers_user_answer_check 
CHECK (user_answer = ANY (ARRAY['A'::text, 'B'::text, 'C'::text, 'D'::text, ''::text]));

-- 2. Verify lifeline constraint is correct
-- The lifeline constraint is already correct, so the issue must be in the code still submitting 'timeout'