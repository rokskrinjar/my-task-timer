import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Crown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Participant {
  id: string;
  user_id: string | null;
  current_score: number;
  lifelines_used: number;
  is_host: boolean;
  display_name?: string;
  profiles?: {
    display_name: string;
  };
}

interface GameParticipantsProps {
  gameId: string;
  onParticipantsChange?: (participants: Participant[]) => void;
}

const GameParticipants = ({ gameId, onParticipantsChange }: GameParticipantsProps) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchParticipants = async () => {
    try {
      const { data: participantsData, error: participantsError } = await supabase
        .from('game_participants')
        .select('*')
        .eq('game_id', gameId)
        .order('current_score', { ascending: false });

      if (participantsError || !participantsData) {
        console.error('Error fetching participants:', participantsError);
        return;
      }

      // Fetch profiles efficiently
      const participantsWithProfiles = await Promise.all(
        participantsData.map(async (participant) => {
          if (participant.user_id) {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('display_name')
              .eq('user_id', participant.user_id)
              .single();

            return {
              ...participant,
              profiles: profileData || { display_name: 'Neimenovan igralec' }
            };
          } else {
            return {
              ...participant,
              profiles: { display_name: participant.display_name || 'Gost' }
            };
          }
        })
      );

      setParticipants(participantsWithProfiles);
      onParticipantsChange?.(participantsWithProfiles);
    } catch (error) {
      console.error('Error in fetchParticipants:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();

    // Set up real-time subscription for participants
    const participantsChannel = supabase
      .channel(`participants-${gameId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'game_participants',
        filter: `game_id=eq.${gameId}`
      }, () => {
        fetchParticipants();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(participantsChannel);
    };
  }, [gameId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Igralci
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">Nalaganje...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Igralci ({participants.length})
        </CardTitle>
        <CardDescription>
          Lestvica rezultatov
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {participants.map((participant, index) => (
            <div key={participant.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                {participant.is_host && <Crown className="h-4 w-4 text-yellow-500" />}
                <span className="font-medium">
                  {participant.profiles?.display_name || participant.display_name || 'Neimenovan igralec'}
                </span>
                {index === 0 && participants.length > 1 && (
                  <Badge variant="secondary" className="text-xs">1.</Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{participant.current_score || 0} točk</Badge>
                {(participant.lifelines_used || 0) > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {participant.lifelines_used} pomoči
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GameParticipants;