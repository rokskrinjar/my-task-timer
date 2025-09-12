-- Create function to remove duplicate questions (keeping oldest by created_at)
CREATE OR REPLACE FUNCTION remove_duplicate_questions()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  deleted_count INTEGER := 0;
BEGIN
  -- Delete duplicates, keeping only the oldest (earliest created_at) for each question_text
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

-- Execute the duplicate removal
SELECT remove_duplicate_questions() as duplicates_removed;

-- Add unique constraint to prevent future duplicates
-- (question_text must be unique within same grade_level and subject)
ALTER TABLE questions 
ADD CONSTRAINT unique_question_per_grade_subject 
UNIQUE (question_text, grade_level, subject);

-- Drop the function as it's no longer needed
DROP FUNCTION remove_duplicate_questions();