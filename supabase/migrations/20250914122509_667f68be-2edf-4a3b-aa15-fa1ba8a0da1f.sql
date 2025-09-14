-- Fix function search path issue for update_category_question_count function
CREATE OR REPLACE FUNCTION public.update_category_question_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Update question count for the affected category
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE public.categories 
        SET question_count = (
            SELECT COUNT(*) 
            FROM public.questions 
            WHERE category = NEW.category
        )
        WHERE name = NEW.category;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.categories 
        SET question_count = (
            SELECT COUNT(*) 
            FROM public.questions 
            WHERE category = OLD.category
        )
        WHERE name = OLD.category;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$;