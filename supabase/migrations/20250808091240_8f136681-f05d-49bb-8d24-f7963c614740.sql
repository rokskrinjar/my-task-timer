-- Enable real-time updates for game tables
ALTER TABLE public.games REPLICA IDENTITY FULL;
ALTER TABLE public.game_participants REPLICA IDENTITY FULL;
ALTER TABLE public.game_answers REPLICA IDENTITY FULL;

-- Add tables to real-time publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.games;
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_participants;  
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_answers;