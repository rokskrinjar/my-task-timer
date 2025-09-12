import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Users, Play, Trophy, Share2, Copy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { Podium } from '@/components/Podium';

interface GameParticipant {
  id: string;
  display_name: string;
  current_score: number;
  user_id?: string;
}

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
  participants?: GameParticipant[];
}

interface RecentGamesProps {
  games: Game[];
  isLoading: boolean;
}

const RecentGames: React.FC<RecentGamesProps> = ({ games, isLoading }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'waiting':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'finished':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Play className="h-3 w-3" />;
      case 'waiting':
        return <Clock className="h-3 w-3" />;
      case 'finished':
        return <Trophy className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const getActionButton = (game: Game) => {
    switch (game.status) {
      case 'active':
        return (
          <Button 
            size="sm" 
            onClick={() => navigate(`/game/${game.id}`)}
            className="w-full"
          >
            <Play className="h-4 w-4 mr-2" />
            Nadaljuj
          </Button>
        );
      case 'waiting':
        return (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => navigate(`/game/${game.id}`)}
            className="w-full"
          >
            <Users className="h-4 w-4 mr-2" />
            Odpri igro
          </Button>
        );
      case 'finished':
        return (
          <Button 
            size="sm" 
            variant="secondary"
            onClick={() => navigate(`/game/${game.id}`)}
            className="w-full"
          >
            <Trophy className="h-4 w-4 mr-2" />
            Poglej rezultate
          </Button>
        );
      default:
        return null;
    }
  };

  const copyGameCode = async (gameCode: string) => {
    try {
      await navigator.clipboard.writeText(gameCode);
      toast({
        title: "Koda kopirana",
        description: `Koda igre ${gameCode} je bila kopirana v odložišče.`,
      });
    } catch (error) {
      toast({
        title: "Napaka",
        description: "Kode ni bilo mogoče kopirati.",
        variant: "destructive",
      });
    }
  };

  const shareGame = (gameCode: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Pridruži se kvizu!',
        text: `Uporabi kodo ${gameCode} za pridružitev kvizu.`,
        url: `${window.location.origin}/join?code=${gameCode}`,
      });
    } else {
      copyGameCode(gameCode);
    }
  };

  const getTimeText = (game: Game) => {
    if (game.status === 'active' && game.started_at) {
      return `Aktivna ${formatDistanceToNow(new Date(game.started_at), { addSuffix: true })}`;
    }
    if (game.status === 'finished' && game.finished_at) {
      return `Končana ${formatDistanceToNow(new Date(game.finished_at), { addSuffix: true })}`;
    }
    return `Ustvarjena ${formatDistanceToNow(new Date(game.created_at), { addSuffix: true })}`;
  };

  const getProgressText = (game: Game) => {
    if (game.status === 'active') {
      return `Vprašanje ${game.current_question_number}/15`;
    }
    if (game.status === 'finished') {
      return 'Igra končana';
    }
    return `${game.participant_count || 0}/4 igralci`;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded w-24"></div>
                  <div className="h-3 bg-muted rounded w-32"></div>
                </div>
                <div className="h-6 bg-muted rounded w-16"></div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="h-3 bg-muted rounded w-20"></div>
                  <div className="h-3 bg-muted rounded w-24"></div>
                </div>
                <div className="h-8 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <Card className="text-center py-8">
        <CardContent>
          <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Še nimaš nobene igre.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Ustvari novo igro zgoraj, da začneš!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {games.map((game) => (
        <Card key={game.id} className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg font-semibold">
                    {game.game_code}
                  </CardTitle>
                  {game.status === 'waiting' && (
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyGameCode(game.game_code)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => shareGame(game.game_code)}
                        className="h-6 w-6 p-0"
                      >
                        <Share2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{game.category}</span>
                  <span>•</span>
                  <span>{getTimeText(game)}</span>
                </div>
              </div>
              <Badge 
                variant="secondary" 
                className={`shrink-0 ${getStatusColor(game.status)}`}
              >
                {getStatusIcon(game.status)}
                <span className="ml-1 capitalize">
                  {game.status === 'waiting' ? 'Čakanje' : 
                   game.status === 'active' ? 'Aktivna' : 'Končana'}
                </span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{getProgressText(game)}</span>
                </div>
                {game.status === 'active' && (
                  <div className="text-xs text-muted-foreground">
                    {Math.round(((game.current_question_number || 0) / 15) * 100)}% končano
                  </div>
                )}
              </div>
              
              {game.status === 'active' && (
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.round(((game.current_question_number || 0) / 15) * 100)}%` 
                    }}
                  />
                </div>
               )}
               
               {/* Show podium for finished games */}
               {game.status === 'finished' && game.participants && game.participants.length > 0 && (
                 <Podium participants={game.participants} />
               )}
               
               {getActionButton(game)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RecentGames;