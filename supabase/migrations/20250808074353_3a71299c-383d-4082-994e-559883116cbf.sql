-- Create questions table
CREATE TABLE public.questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_text TEXT NOT NULL,
  grade_level INTEGER NOT NULL CHECK (grade_level >= 1 AND grade_level <= 9),
  subject TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer TEXT NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
  difficulty_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on questions
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Questions are viewable by everyone
CREATE POLICY "Questions are viewable by everyone" 
ON public.questions 
FOR SELECT 
USING (true);

-- Create games table
CREATE TABLE public.games (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  host_id UUID NOT NULL,
  game_code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'finished')),
  current_question_id UUID,
  current_question_number INTEGER DEFAULT 0,
  max_players INTEGER DEFAULT 4,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  started_at TIMESTAMP WITH TIME ZONE,
  finished_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on games
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

-- Games policies
CREATE POLICY "Games are viewable by participants" 
ON public.games 
FOR SELECT 
USING (true);

CREATE POLICY "Hosts can create games" 
ON public.games 
FOR INSERT 
WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Hosts can update their games" 
ON public.games 
FOR UPDATE 
USING (auth.uid() = host_id);

-- Create game participants table
CREATE TABLE public.game_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  current_score INTEGER DEFAULT 0,
  lifelines_used INTEGER DEFAULT 0,
  is_host BOOLEAN DEFAULT false,
  UNIQUE(game_id, user_id)
);

-- Enable RLS on game participants
ALTER TABLE public.game_participants ENABLE ROW LEVEL SECURITY;

-- Game participants policies
CREATE POLICY "Participants can view game participants" 
ON public.game_participants 
FOR SELECT 
USING (true);

CREATE POLICY "Users can join games" 
ON public.game_participants 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create answers table
CREATE TABLE public.game_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  question_id UUID NOT NULL REFERENCES public.questions(id),
  user_answer TEXT CHECK (user_answer IN ('A', 'B', 'C', 'D')),
  is_correct BOOLEAN,
  lifeline_used TEXT CHECK (lifeline_used IN ('50_50', 'ask_audience', 'phone_friend')),
  answered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(game_id, user_id, question_id)
);

-- Enable RLS on answers
ALTER TABLE public.game_answers ENABLE ROW LEVEL SECURITY;

-- Answers policies
CREATE POLICY "Participants can view answers in their games" 
ON public.game_answers 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.game_participants 
  WHERE game_id = game_answers.game_id AND user_id = auth.uid()
));

CREATE POLICY "Users can insert their own answers" 
ON public.game_answers 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to generate game codes
CREATE OR REPLACE FUNCTION public.generate_game_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::INTEGER, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Insert some sample questions
INSERT INTO public.questions (question_text, grade_level, subject, option_a, option_b, option_c, option_d, correct_answer, difficulty_order) VALUES
('Koliko je 2 + 2?', 1, 'Matematika', '3', '4', '5', '6', 'B', 1),
('Katera je glavno mesto Slovenije?', 1, 'Geografija', 'Maribor', 'Celje', 'Ljubljana', 'Kranj', 'C', 2),
('Koliko nog ima pajek?', 2, 'Naravoslovje', '6', '8', '10', '12', 'B', 3),
('Kdo je napisal Kranjsko čebelo?', 3, 'Slovenščina', 'Ivan Cankar', 'Josip Stritar', 'Janko Kersnik', 'Simon Jenko', 'B', 4),
('Koliko je 15 × 8?', 4, 'Matematika', '120', '125', '130', '115', 'A', 5),
('V katerem letu je bila razglašena neodvisnost Slovenije?', 5, 'Zgodovina', '1990', '1991', '1992', '1989', 'B', 6),
('Kaj je kemijski simbol za zlato?', 6, 'Kemija', 'Go', 'Au', 'Ag', 'Al', 'B', 7),
('Katera je najvišja gora v Sloveniji?', 7, 'Geografija', 'Grintovec', 'Mangart', 'Triglav', 'Razor', 'C', 8),
('Kdo je avtor dela "Cankarjeva trilogija"?', 8, 'Slovenščina', 'Ivan Cankar', 'Drago Jančar', 'Boris Pahor', 'Lojze Kovačič', 'A', 9),
('Koliko je √(144)?', 9, 'Matematika', '11', '12', '13', '14', 'B', 10),
('Kateri kemijski element ima simbol Fe?', 9, 'Kemija', 'Fluor', 'Železo', 'Francij', 'Fermij', 'B', 11),
('V katerem stoletju je živel France Prešeren?', 9, 'Zgodovina', '18. stoletje', '19. stoletje', '20. stoletje', '17. stoletje', 'B', 12);