-- Completely rewrite the select_and_reserve_game_questions function to eliminate ambiguity
DROP FUNCTION IF EXISTS public.select_and_reserve_game_questions(uuid, text, integer);

CREATE OR REPLACE FUNCTION public.select_and_reserve_game_questions(p_game_id uuid, p_category text, p_question_count integer DEFAULT 15)
 RETURNS TABLE(question_id uuid, question_order integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  selected_question_id uuid;
  current_order integer := 1;
BEGIN
  -- First, clear any existing questions for this game
  DELETE FROM game_questions WHERE game_id = p_game_id;
  
  -- Select and insert questions one by one
  FOR selected_question_id IN 
    SELECT q.id
    FROM questions q
    LEFT JOIN question_usage qu ON q.id = qu.question_id
    WHERE q.category = p_category
    ORDER BY 
      COALESCE(qu.usage_count, 0) ASC,
      COALESCE(qu.last_used_at, '1970-01-01'::timestamp) ASC,
      q.difficulty_order ASC,
      RANDOM()
    LIMIT p_question_count
  LOOP
    -- Insert the selected question into game_questions
    INSERT INTO game_questions (game_id, question_id, question_order)
    VALUES (p_game_id, selected_question_id, current_order);
    
    -- Update or insert usage tracking
    INSERT INTO question_usage (question_id, usage_count, last_used_at, updated_at)
    VALUES (selected_question_id, 1, NOW(), NOW())
    ON CONFLICT (question_id) 
    DO UPDATE SET 
      usage_count = question_usage.usage_count + 1,
      last_used_at = NOW(),
      updated_at = NOW();
    
    -- Return the result
    question_id := selected_question_id;
    question_order := current_order;
    RETURN NEXT;
    
    current_order := current_order + 1;
  END LOOP;
  
  RETURN;
END;
$function$;