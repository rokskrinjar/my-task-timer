-- First check if the function exists, if not create it
-- If it exists, replace it with a corrected version

-- Drop the function if it exists to recreate it
DROP FUNCTION IF EXISTS select_and_reserve_game_questions(uuid, text, integer);

-- Create the corrected function with proper table aliases
CREATE OR REPLACE FUNCTION select_and_reserve_game_questions(
  p_game_id uuid,
  p_category text,
  p_question_count integer DEFAULT 15
) RETURNS TABLE(question_id uuid, question_order integer) AS $$
DECLARE
  v_question_record RECORD;
  v_order_counter integer := 1;
BEGIN
  -- Select questions using intelligent selection with proper table aliases
  FOR v_question_record IN
    SELECT DISTINCT q.id as question_id
    FROM questions q
    LEFT JOIN question_usage qu ON q.id = qu.question_id
    WHERE q.category = p_category
    ORDER BY 
      COALESCE(qu.usage_count, 0) ASC,  -- Prefer less used questions
      COALESCE(qu.last_used_at, '1970-01-01'::timestamp) ASC,  -- Prefer questions not used recently
      q.difficulty_order ASC,  -- Then by difficulty
      RANDOM()  -- Finally randomize
    LIMIT p_question_count
  LOOP
    -- Insert the selected question into game_questions
    INSERT INTO game_questions (game_id, question_id, question_order)
    VALUES (p_game_id, v_question_record.question_id, v_order_counter);
    
    -- Update or insert usage tracking with proper conflict handling
    INSERT INTO question_usage (question_id, usage_count, last_used_at, updated_at)
    VALUES (v_question_record.question_id, 1, NOW(), NOW())
    ON CONFLICT (question_id) 
    DO UPDATE SET 
      usage_count = question_usage.usage_count + 1,
      last_used_at = NOW(),
      updated_at = NOW();
    
    -- Return the question info
    question_id := v_question_record.question_id;
    question_order := v_order_counter;
    RETURN NEXT;
    
    v_order_counter := v_order_counter + 1;
  END LOOP;
  
  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;