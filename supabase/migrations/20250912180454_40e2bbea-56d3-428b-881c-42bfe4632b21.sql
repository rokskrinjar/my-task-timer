-- Create game_questions table to track which questions are used in each game
CREATE TABLE public.game_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID NOT NULL,
  question_id UUID NOT NULL,
  question_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(game_id, question_id),
  UNIQUE(game_id, question_order)
);

-- Enable RLS
ALTER TABLE public.game_questions ENABLE ROW LEVEL SECURITY;

-- Create policies for game_questions
CREATE POLICY "Game participants can view game questions" 
ON public.game_questions 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM game_participants gp 
  WHERE gp.game_id = game_questions.game_id 
  AND (
    (auth.uid() IS NOT NULL AND gp.user_id = auth.uid()) OR 
    (auth.uid() IS NULL AND gp.user_id IS NULL)
  )
));

CREATE POLICY "Game hosts can insert game questions" 
ON public.game_questions 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM games g 
  WHERE g.id = game_questions.game_id 
  AND g.host_id = auth.uid()
));

-- Create question_usage table to track question usage statistics
CREATE TABLE public.question_usage (
  question_id UUID NOT NULL PRIMARY KEY,
  usage_count INTEGER NOT NULL DEFAULT 0,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.question_usage ENABLE ROW LEVEL SECURITY;

-- Create policy for question_usage (readable by everyone since it's just stats)
CREATE POLICY "Question usage is viewable by everyone" 
ON public.question_usage 
FOR SELECT 
USING (true);

-- Create trigger to update updated_at
CREATE TRIGGER update_question_usage_updated_at
BEFORE UPDATE ON public.question_usage
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to select and reserve questions for a game
CREATE OR REPLACE FUNCTION public.select_and_reserve_game_questions(
  p_game_id UUID,
  p_category TEXT,
  p_question_count INTEGER DEFAULT 15
)
RETURNS TABLE(question_id UUID, question_order INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  question_record RECORD;
  current_order INTEGER := 1;
BEGIN
  -- Check if questions are already reserved for this game
  IF EXISTS (SELECT 1 FROM game_questions WHERE game_id = p_game_id) THEN
    -- Return existing questions in order
    RETURN QUERY 
    SELECT gq.question_id, gq.question_order 
    FROM game_questions gq 
    WHERE gq.game_id = p_game_id 
    ORDER BY gq.question_order;
    RETURN;
  END IF;

  -- Ensure we have usage tracking for all questions
  INSERT INTO question_usage (question_id)
  SELECT q.id 
  FROM questions q 
  WHERE q.category = p_category
  ON CONFLICT (question_id) DO NOTHING;

  -- Select questions using smart algorithm:
  -- 1. Prioritize questions that have never been used
  -- 2. Then questions used least recently
  -- 3. Then questions used least overall
  FOR question_record IN (
    SELECT 
      q.id,
      q.difficulty_order
    FROM questions q
    LEFT JOIN question_usage qu ON q.id = qu.question_id
    WHERE q.category = p_category
    ORDER BY 
      -- Never used questions first
      CASE WHEN qu.usage_count = 0 OR qu.usage_count IS NULL THEN 0 ELSE 1 END,
      -- Then by oldest last_used_at (least recently used)
      qu.last_used_at ASC NULLS FIRST,
      -- Then by lowest usage count
      qu.usage_count ASC,
      -- Finally by difficulty order for consistency
      q.difficulty_order ASC,
      -- Random tiebreaker
      RANDOM()
    LIMIT p_question_count
  ) LOOP
    -- Insert into game_questions
    INSERT INTO game_questions (game_id, question_id, question_order)
    VALUES (p_game_id, question_record.id, current_order);
    
    -- Update usage statistics
    UPDATE question_usage 
    SET 
      usage_count = usage_count + 1,
      last_used_at = now(),
      updated_at = now()
    WHERE question_id = question_record.id;
    
    -- Return the question
    question_id := question_record.id;
    question_order := current_order;
    RETURN NEXT;
    
    current_order := current_order + 1;
  END LOOP;
END;
$function$;

-- Function to get the next question for a game
CREATE OR REPLACE FUNCTION public.get_next_game_question(
  p_game_id UUID,
  p_current_question_number INTEGER
)
RETURNS TABLE(
  question_id UUID,
  question_text TEXT,
  option_a TEXT,
  option_b TEXT,
  option_c TEXT,
  option_d TEXT,
  correct_answer TEXT,
  difficulty_order INTEGER
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT 
    q.id,
    q.question_text,
    q.option_a,
    q.option_b,
    q.option_c,
    q.option_d,
    q.correct_answer,
    q.difficulty_order
  FROM game_questions gq
  JOIN questions q ON gq.question_id = q.id
  WHERE gq.game_id = p_game_id 
  AND gq.question_order = p_current_question_number + 1
  LIMIT 1;
$function$;