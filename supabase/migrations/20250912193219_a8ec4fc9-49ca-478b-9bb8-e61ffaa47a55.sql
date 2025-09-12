-- Fix the ambiguous column reference by using a completely different approach
DROP FUNCTION IF EXISTS public.select_and_reserve_game_questions(uuid, text, integer);

CREATE OR REPLACE FUNCTION public.select_and_reserve_game_questions(p_game_id uuid, p_category text, p_question_count integer DEFAULT 15)
 RETURNS TABLE(result_question_id uuid, result_question_order integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  rec RECORD;
  order_num integer := 1;
BEGIN
  -- Clear existing questions for this game
  DELETE FROM game_questions WHERE game_id = p_game_id;
  
  -- Select questions and insert them
  FOR rec IN 
    SELECT q.id as qid
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
    -- Insert into game_questions
    INSERT INTO game_questions (game_id, question_id, question_order)
    VALUES (p_game_id, rec.qid, order_num);
    
    -- Update question usage
    INSERT INTO question_usage (question_id, usage_count, last_used_at, updated_at)
    VALUES (rec.qid, 1, NOW(), NOW())
    ON CONFLICT (question_id) 
    DO UPDATE SET 
      usage_count = question_usage.usage_count + 1,
      last_used_at = NOW(),
      updated_at = NOW();
    
    -- Return this record
    result_question_id := rec.qid;
    result_question_order := order_num;
    RETURN NEXT;
    
    order_num := order_num + 1;
  END LOOP;
  
  RETURN;
END;
$function$;