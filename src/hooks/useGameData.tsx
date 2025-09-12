import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Game {
  id: string;
  game_code: string;
  status: string;
  host_id: string;
  created_at: string;
  category: string;
  current_question_number: number;
  started_at?: string;
  finished_at?: string;
  participant_count?: number;
}

export const useGameData = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Optimized query for user games - no blocking behavior
  const { data: myGames = [], isLoading: gamesLoading, error } = useQuery({
    queryKey: ['user-games', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // Enhanced query with participant count and richer data
      const { data: hostGames, error: hostError } = await supabase
        .from('games')
        .select(`
          *,
          participant_count:game_participants(count)
        `)
        .eq('host_id', user.id)
        .order('created_at', { ascending: false })
        .limit(8);

      if (hostError) {
        console.error('Error fetching games:', hostError);
        throw hostError;
      }
      
      // Transform the data to include participant count
      const transformedGames = hostGames?.map(game => ({
        ...game,
        participant_count: game.participant_count?.[0]?.count || 0
      })) || [];
      
      return transformedGames;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Don't refetch on mount to prevent blocking
    retry: 1, // Reduce retries to fail fast
  });

  const invalidateGames = () => {
    queryClient.invalidateQueries({ queryKey: ['user-games'] });
  };

  return {
    myGames,
    gamesLoading,
    error,
    invalidateGames
  };
};