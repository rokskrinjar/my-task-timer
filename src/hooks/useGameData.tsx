import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Game {
  id: string;
  game_code: string;
  status: string;
  host_id: string;
  created_at: string;
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
      
      // Single fast query for hosted games only
      const { data: hostGames, error: hostError } = await supabase
        .from('games')
        .select('*')
        .eq('host_id', user.id)
        .order('created_at', { ascending: false })
        .limit(6); // Limit to reduce payload

      if (hostError) {
        console.error('Error fetching games:', hostError);
        throw hostError;
      }
      
      return hostGames || [];
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