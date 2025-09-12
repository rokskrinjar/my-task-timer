import { Trophy, Star, Clock, Target, Users, Share2, RotateCcw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Podium } from '@/components/Podium';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

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
  category?: string;
  started_at?: string;
  finished_at?: string;
}

interface GameResultsProps {
  game: Game;
  participants: GameParticipant[];
  totalQuestions: number;
}

export const GameResults = ({ game, participants, totalQuestions }: GameResultsProps) => {
  const navigate = useNavigate();
  const winner = participants.length > 0 ? participants[0] : null;
  const gameDuration = game.started_at && game.finished_at 
    ? Math.round((new Date(game.finished_at).getTime() - new Date(game.started_at).getTime()) / 1000 / 60)
    : 0;

  const handleShare = () => {
    const shareText = `🏆 Game Results!\n\nWinner: ${winner?.display_name || 'Unknown'} with ${winner?.current_score || 0} points!\n\nGame Code: ${game.game_code}\nCategory: ${game.category || 'General'}\nPlayers: ${participants.length}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Quiz Game Results',
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Results copied!",
        description: "Game results copied to clipboard.",
      });
    }
  };

  const handlePlayAgain = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      {/* Celebration Header */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Trophy className="w-8 h-8 text-yellow-500 animate-pulse" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Game Complete!
          </h1>
          <Trophy className="w-8 h-8 text-yellow-500 animate-pulse" />
        </div>
        
        {winner && (
          <div className="mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-semibold text-primary">
                Congratulations {winner.display_name}!
              </h2>
              <Star className="w-6 h-6 text-yellow-500" />
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Winner with {winner.current_score} points
            </Badge>
          </div>
        )}
      </div>

      {/* Game Statistics */}
      <Card className="mb-8 shadow-lg border-primary/20">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Game Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-primary/5 rounded-lg">
              <div className="text-2xl font-bold text-primary">{participants.length}</div>
              <div className="text-sm text-muted-foreground">Players</div>
            </div>
            <div className="text-center p-3 bg-secondary/5 rounded-lg">
              <div className="text-2xl font-bold text-secondary">{totalQuestions}</div>
              <div className="text-sm text-muted-foreground">Questions</div>
            </div>
            <div className="text-center p-3 bg-accent/5 rounded-lg">
              <div className="text-2xl font-bold text-accent">{gameDuration}m</div>
              <div className="text-sm text-muted-foreground">Duration</div>
            </div>
            <div className="text-center p-3 bg-muted/5 rounded-lg">
              <div className="text-2xl font-bold">{game.category}</div>
              <div className="text-sm text-muted-foreground">Category</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Podium */}
      <Card className="mb-8 shadow-lg border-primary/20">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-center flex items-center justify-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Top Performers
          </h3>
          <Podium participants={participants} />
        </CardContent>
      </Card>

      {/* Full Leaderboard */}
      <Card className="mb-8 shadow-lg border-primary/20">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Full Leaderboard
          </h3>
          <div className="space-y-3">
            {participants.map((participant, index) => (
              <div 
                key={participant.id}
                className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                  index === 0 
                    ? 'bg-gradient-to-r from-yellow-500/10 to-yellow-400/10 border border-yellow-500/20' 
                    : index === 1
                    ? 'bg-gradient-to-r from-gray-400/10 to-gray-300/10 border border-gray-400/20'
                    : index === 2
                    ? 'bg-gradient-to-r from-amber-500/10 to-amber-400/10 border border-amber-500/20'
                    : 'bg-muted/30 hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                    ${index === 0 ? 'bg-yellow-500 text-white' 
                      : index === 1 ? 'bg-gray-400 text-white'
                      : index === 2 ? 'bg-amber-500 text-white'
                      : 'bg-muted text-muted-foreground'}
                  `}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold">{participant.display_name || 'Unknown'}</div>
                    <div className="text-sm text-muted-foreground">
                      {Math.round((participant.current_score / totalQuestions) * 100)}% accuracy
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{participant.current_score}</div>
                  <div className="text-sm text-muted-foreground">points</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
        <Button 
          onClick={handleShare}
          variant="outline"
          size="lg"
          className="flex items-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          Share Results
        </Button>
        <Button 
          onClick={handlePlayAgain}
          size="lg"
          className="flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Back to Dashboard
        </Button>
      </div>

      {/* Game Code for Reference */}
      <div className="text-center text-muted-foreground">
        <p className="text-sm">Game Code: <span className="font-mono font-semibold">{game.game_code}</span></p>
      </div>
    </div>
  );
};