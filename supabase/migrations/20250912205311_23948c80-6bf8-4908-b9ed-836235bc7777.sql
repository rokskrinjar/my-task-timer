-- Add missing grade 9 questions to fill the gap
INSERT INTO questions (question_text, subject, grade_level, difficulty_order, option_a, option_b, option_c, option_d, correct_answer, category) VALUES
('Katera je največja planeta v Osončju?', 'Naravoslovje', 9, 1, 'Jupiter', 'Saturn', 'Neptun', 'Uran', 'A', 'Šola'),
('Kdo je napisal delo "Krst pri Savici"?', 'Slovenščina', 9, 2, 'France Prešeren', 'Ivan Cankar', 'Dragotin Kette', 'Josip Murn', 'A', 'Šola'),
('Koliko je √144?', 'Matematika', 9, 3, '12', '14', '16', '10', 'A', 'Šola'),
('V katerem letu se je začela prva svetovna vojna?', 'Zgodovina', 9, 4, '1914', '1916', '1918', '1912', 'A', 'Šola'),
('Kateri kemijski element ima simbol Fe?', 'Kemija', 9, 5, 'Železo', 'Fluor', 'Fosfor', 'Francij', 'A', 'Šola'),
('Kako se imenuje glavni mesto Francije?', 'Geografija', 9, 6, 'Pariz', 'London', 'Berlin', 'Madrid', 'A', 'Šola'),
('Katera je formula za izračun prostornine kocke?', 'Matematika', 9, 7, 'a³', 'a²', '6a', '4a', 'A', 'Šola'),
('Kdo je odkril penicilin?', 'Naravoslovje', 9, 8, 'Alexander Fleming', 'Marie Curie', 'Albert Einstein', 'Charles Darwin', 'A', 'Šola');

-- Completely rewrite the question selection function for proper grade progression
CREATE OR REPLACE FUNCTION public.select_and_reserve_game_questions(p_game_id uuid, p_category text, p_question_count integer DEFAULT 15)
 RETURNS TABLE(result_question_id uuid, result_question_order integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  rec RECORD;
  order_num integer := 1;
  current_grade integer := 1;
  max_grade integer := 12;
  questions_per_grade integer;
  remaining_questions integer;
  extra_questions_from_max_grade integer;
BEGIN
  -- Clear existing questions for this game
  DELETE FROM game_questions WHERE game_id = p_game_id;
  
  -- Calculate question distribution
  -- For 15 questions: 1 per grade (1-12) + 3 from grade 12
  -- For other counts: distribute evenly across grades, extras from highest grade
  IF p_question_count <= max_grade THEN
    questions_per_grade := 1;
    extra_questions_from_max_grade := 0;
  ELSE
    questions_per_grade := 1;
    extra_questions_from_max_grade := p_question_count - max_grade;
  END IF;
  
  -- Select exactly one question per grade level (1→12) for grade progression
  FOR current_grade IN 1..LEAST(max_grade, p_question_count) LOOP
    -- Select the best question for this grade (least used, lowest difficulty)
    SELECT q.id as qid INTO rec
    FROM questions q
    LEFT JOIN question_usage qu ON q.id = qu.question_id
    WHERE q.category = p_category 
    AND q.grade_level = current_grade
    AND q.id NOT IN (
      -- Prevent duplicates: exclude already selected questions for this game
      SELECT gq.question_id FROM game_questions gq WHERE gq.game_id = p_game_id
    )
    ORDER BY 
      COALESCE(qu.usage_count, 0) ASC,                            -- Least used first
      q.difficulty_order ASC,                                     -- Easiest within grade first
      COALESCE(qu.last_used_at, '1970-01-01'::timestamp) ASC,     -- Oldest usage
      RANDOM()                                                     -- Random variety
    LIMIT 1;
    
    -- If we found a question for this grade, insert it
    IF rec.qid IS NOT NULL THEN
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
    END IF;
  END LOOP;
  
  -- If we need more questions (e.g., 15 total), select additional from highest grade
  WHILE order_num <= p_question_count AND extra_questions_from_max_grade > 0 LOOP
    SELECT q.id as qid INTO rec
    FROM questions q
    LEFT JOIN question_usage qu ON q.id = qu.question_id
    WHERE q.category = p_category 
    AND q.grade_level = max_grade
    AND q.id NOT IN (
      -- Prevent duplicates: exclude already selected questions for this game
      SELECT gq.question_id FROM game_questions gq WHERE gq.game_id = p_game_id
    )
    ORDER BY 
      COALESCE(qu.usage_count, 0) ASC,                            -- Least used first
      q.difficulty_order ASC,                                     -- Easiest first
      COALESCE(qu.last_used_at, '1970-01-01'::timestamp) ASC,     -- Oldest usage
      RANDOM()                                                     -- Random variety
    LIMIT 1;
    
    -- If we found an additional question, insert it
    IF rec.qid IS NOT NULL THEN
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
      extra_questions_from_max_grade := extra_questions_from_max_grade - 1;
    ELSE
      -- No more questions available, break the loop
      EXIT;
    END IF;
  END LOOP;
  
  RETURN;
END;
$function$;