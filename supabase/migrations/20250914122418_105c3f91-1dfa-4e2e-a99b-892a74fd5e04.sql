-- Create categories table
CREATE TABLE public.categories (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    question_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create policies for categories
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert categories" 
ON public.categories 
FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() AND role = 'admin'::app_role
    )
);

CREATE POLICY "Admins can update categories" 
ON public.categories 
FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() AND role = 'admin'::app_role
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() AND role = 'admin'::app_role
    )
);

CREATE POLICY "Admins can delete categories" 
ON public.categories 
FOR DELETE 
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() AND role = 'admin'::app_role
    )
);

-- Create trigger for updated_at
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert existing categories from hardcoded list
INSERT INTO public.categories (name, display_name, is_enabled) VALUES
    ('Šola', 'Šola', true),
    ('Geografija', 'Geografija', true),
    ('Živali', 'Živali', true),
    ('Friends Trivia', 'Friends Trivia', true),
    ('Music', 'Music', true),
    ('Movies', 'Movies', true),
    ('High School', 'High School', true),
    ('Sports', 'Sports', true);

-- Create function to update question count for categories
CREATE OR REPLACE FUNCTION public.update_category_question_count()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update question count when questions are modified
CREATE TRIGGER update_category_question_count_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.questions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_category_question_count();

-- Initial update of question counts
UPDATE public.categories 
SET question_count = (
    SELECT COUNT(*) 
    FROM public.questions 
    WHERE questions.category = categories.name
);