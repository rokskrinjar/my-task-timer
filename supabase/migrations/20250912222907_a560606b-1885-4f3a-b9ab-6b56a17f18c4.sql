-- Create function to safely remove duplicate questions with complete cleanup
CREATE OR REPLACE FUNCTION remove_duplicate_questions_final()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  deleted_count INTEGER := 0;
BEGIN
  -- Step 1: Remove duplicate game_questions that would conflict
  WITH ranked_questions AS (
    SELECT id, question_text, grade_level, subject,
           ROW_NUMBER() OVER (
             PARTITION BY question_text, grade_level, subject 
             ORDER BY created_at ASC
           ) as rn
    FROM questions
  ),
  question_mapping AS (
    SELECT 
      duplicate.id as old_id,
      original.id as new_id
    FROM ranked_questions duplicate
    JOIN ranked_questions original ON (
      duplicate.question_text = original.question_text 
      AND duplicate.grade_level = original.grade_level 
      AND duplicate.subject = original.subject
      AND original.rn = 1
    )
    WHERE duplicate.rn > 1
  ),
  conflicting_game_questions AS (
    SELECT gq.id
    FROM game_questions gq
    JOIN question_mapping qm ON gq.question_id = qm.old_id
    WHERE EXISTS (
      SELECT 1 FROM game_questions gq2 
      WHERE gq2.game_id = gq.game_id 
      AND gq2.question_id = qm.new_id
    )
  )
  DELETE FROM game_questions WHERE id IN (SELECT id FROM conflicting_game_questions);

  -- Step 2: Remove duplicate game_answers that would conflict
  WITH ranked_questions AS (
    SELECT id, question_text, grade_level, subject,
           ROW_NUMBER() OVER (
             PARTITION BY question_text, grade_level, subject 
             ORDER BY created_at ASC
           ) as rn
    FROM questions
  ),
  question_mapping AS (
    SELECT 
      duplicate.id as old_id,
      original.id as new_id
    FROM ranked_questions duplicate
    JOIN ranked_questions original ON (
      duplicate.question_text = original.question_text 
      AND duplicate.grade_level = original.grade_level 
      AND duplicate.subject = original.subject
      AND original.rn = 1
    )
    WHERE duplicate.rn > 1
  ),
  conflicting_game_answers AS (
    SELECT ga.id
    FROM game_answers ga
    JOIN question_mapping qm ON ga.question_id = qm.old_id
    WHERE EXISTS (
      SELECT 1 FROM game_answers ga2 
      WHERE ga2.game_id = ga.game_id 
      AND COALESCE(ga2.user_id, '00000000-0000-0000-0000-000000000000') = COALESCE(ga.user_id, '00000000-0000-0000-0000-000000000000')
      AND ga2.question_id = qm.new_id
    )
  )
  DELETE FROM game_answers WHERE id IN (SELECT id FROM conflicting_game_answers);

  -- Step 3: Update remaining game_questions to point to the oldest question
  WITH ranked_questions AS (
    SELECT id, question_text, grade_level, subject,
           ROW_NUMBER() OVER (
             PARTITION BY question_text, grade_level, subject 
             ORDER BY created_at ASC
           ) as rn
    FROM questions
  ),
  question_mapping AS (
    SELECT 
      duplicate.id as old_id,
      original.id as new_id
    FROM ranked_questions duplicate
    JOIN ranked_questions original ON (
      duplicate.question_text = original.question_text 
      AND duplicate.grade_level = original.grade_level 
      AND duplicate.subject = original.subject
      AND original.rn = 1
    )
    WHERE duplicate.rn > 1
  )
  UPDATE game_questions 
  SET question_id = question_mapping.new_id
  FROM question_mapping 
  WHERE game_questions.question_id = question_mapping.old_id;

  -- Step 4: Update remaining game_answers to point to the oldest question
  WITH ranked_questions AS (
    SELECT id, question_text, grade_level, subject,
           ROW_NUMBER() OVER (
             PARTITION BY question_text, grade_level, subject 
             ORDER BY created_at ASC
           ) as rn
    FROM questions
  ),
  question_mapping AS (
    SELECT 
      duplicate.id as old_id,
      original.id as new_id
    FROM ranked_questions duplicate
    JOIN ranked_questions original ON (
      duplicate.question_text = original.question_text 
      AND duplicate.grade_level = original.grade_level 
      AND duplicate.subject = original.subject
      AND original.rn = 1
    )
    WHERE duplicate.rn > 1
  )
  UPDATE game_answers 
  SET question_id = question_mapping.new_id
  FROM question_mapping 
  WHERE game_answers.question_id = question_mapping.old_id;

  -- Step 5: Now safely delete the duplicate questions
  WITH ranked_questions AS (
    SELECT id, 
           ROW_NUMBER() OVER (
             PARTITION BY question_text, grade_level, subject 
             ORDER BY created_at ASC
           ) as rn
    FROM questions
  ),
  duplicates_to_delete AS (
    SELECT id FROM ranked_questions WHERE rn > 1
  )
  DELETE FROM questions 
  WHERE id IN (SELECT id FROM duplicates_to_delete);
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count;
END;
$$;

-- Execute the cleanup
SELECT remove_duplicate_questions_final() as duplicates_removed;

-- Add unique constraint to prevent future duplicates
ALTER TABLE questions 
ADD CONSTRAINT unique_question_per_grade_subject 
UNIQUE (question_text, grade_level, subject);

-- Drop the function
DROP FUNCTION remove_duplicate_questions_final();