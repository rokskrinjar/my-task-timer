-- Add timer mode and answer reveal tracking to games table
ALTER TABLE public.games 
ADD COLUMN has_timer boolean NOT NULL DEFAULT false,
ADD COLUMN show_correct_answer boolean NOT NULL DEFAULT false,
ADD COLUMN question_result_shown_at timestamp with time zone;