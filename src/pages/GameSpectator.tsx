import React, { useState, useEffect } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Clock, Users, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Game {
  id: string;
  status: string;
  current_question_number: number;
  category: string;
  current_question_id: string | null;
}

interface Question {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
}

interface Player {
  id: string;
  display_name: string;
  current_score: number;
  user_id: string | null;
}

interface Answer {
  user_id: string | null;
  display_name: string | null;
  answered_at: string;
  is_correct: boolean | null;
  user_answer: string | null;
}

const GameSpectator = () => {
  const [searchParams] = useSearchParams();
  const gameCodeParam = searchParams.get('code');
  
  const [gameCode, setGameCode] = useState(gameCodeParam || '');
  const [game, setGame] = useState<Game | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchGameData = async (code: string) => {
    try {
      setLoading(true);
      setError('');

      // Fetch game
      const { data: gameData, error: gameError } = await supabase
        .from('games')
        .select('*')
        .eq('game_code', code.toUpperCase())
        .single();

      if (gameError || !gameData) {
        setError('Game not found');
        return;
      }

      setGame(gameData);

      // Fetch current question if exists
      if (gameData.current_question_id) {
        const { data: questionData } = await supabase
          .from('questions')
          .select('*')
          .eq('id', gameData.current_question_id)
          .single();

        setCurrentQuestion(questionData);

        // Fetch answers for current question
        const { data: answersData } = await supabase
          .from('game_answers')
          .select('user_id, display_name, answered_at, is_correct, user_answer')
          .eq('game_id', gameData.id)
          .eq('question_id', gameData.current_question_id)
          .is('lifeline_used', null);

        setAnswers(answersData || []);
      }

      // Fetch players
      const { data: playersData } = await supabase
        .from('game_participants')
        .select('id, display_name, current_score, user_id')
        .eq('game_id', gameData.id)
        .order('current_score', { ascending: false });

      setPlayers(playersData || []);

    } catch (err) {
      console.error('Error fetching game data:', err);
      setError('Failed to load game data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (gameCodeParam) {
      fetchGameData(gameCodeParam);
    }
  }, [gameCodeParam]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!game) return;

    const gameChannel = supabase
      .channel('game-spectator')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'games',
          filter: `id=eq.${game.id}`
        },
        (payload) => {
          console.log('Game updated:', payload);
          if (payload.new) {
            setGame(payload.new as Game);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_participants',
          filter: `game_id=eq.${game.id}`
        },
        (payload) => {
          console.log('Participants updated:', payload);
          fetchGameData(gameCode); // Refresh all data
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_answers',
          filter: `game_id=eq.${game.id}`
        },
        (payload) => {
          console.log('Answers updated:', payload);
          fetchGameData(gameCode); // Refresh all data
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(gameChannel);
    };
  }, [game?.id, gameCode]);

  const handleJoinSpectator = () => {
    if (gameCode.trim()) {
      window.history.pushState({}, '', `/spectator?code=${gameCode.toUpperCase()}`);
      fetchGameData(gameCode.trim());
    }
  };

  const getAnswerTime = (answeredAt: string) => {
    const answerTime = new Date(answeredAt);
    return answerTime.toLocaleTimeString();
  };

  const getPlayerAnswer = (player: Player) => {
    return answers.find(a => 
      player.user_id ? a.user_id === player.user_id : a.display_name === player.display_name
    );
  };

  // Show game code input if no game loaded
  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Game Spectator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Enter Game Code</label>
              <Input
                inputMode="text"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                placeholder="Enter 6-letter code"
                maxLength={6}
                className="text-center text-lg tracking-wider uppercase"
              />
            </div>
            <Button 
              onClick={handleJoinSpectator}
              disabled={gameCode.length !== 6 || loading}
              className="w-full"
            >
              {loading ? 'Loading...' : 'Watch Game'}
            </Button>
            {error && (
              <p className="text-destructive text-center text-sm">{error}</p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show podium if game is finished
  if (game.status === 'finished') {
    const topPlayers = players.slice(0, 3);
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">🎉 Game Complete! 🎉</h1>
            <p className="text-xl text-muted-foreground">Final Results</p>
          </div>

          <div className="flex justify-center items-end space-x-4 mb-8">
            {topPlayers.map((player, index) => (
              <div 
                key={player.id}
                className={`text-center ${
                  index === 0 ? 'order-2' : index === 1 ? 'order-1' : 'order-3'
                }`}
              >
                <div className={`
                  bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg p-6 border-2
                  ${index === 0 ? 'border-yellow-400 h-48' : index === 1 ? 'border-gray-400 h-40' : 'border-amber-600 h-32'}
                `}>
                  <Trophy className={`
                    mx-auto mb-2
                    ${index === 0 ? 'h-12 w-12 text-yellow-400' : index === 1 ? 'h-10 w-10 text-gray-400' : 'h-8 w-8 text-amber-600'}
                  `} />
                  <div className={`text-2xl font-bold mb-1 ${
                    index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-400' : 'text-amber-600'
                  }`}>
                    #{index + 1}
                  </div>
                  <div className="font-semibold text-lg">{player.display_name}</div>
                  <div className="text-2xl font-bold text-primary">{player.current_score}</div>
                </div>
              </div>
            ))}
          </div>

          {players.length > 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Other Players</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {players.slice(3).map((player, index) => (
                    <div key={player.id} className="flex justify-between items-center p-2 rounded bg-secondary/50">
                      <span className="font-medium">#{index + 4} {player.display_name}</span>
                      <span className="font-bold">{player.current_score}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Game: {gameCode}</h1>
          <Badge variant="outline" className="text-lg px-4 py-1">
            {game.status === 'waiting' ? 'Waiting to Start' : 
             game.status === 'in_progress' ? `Question ${game.current_question_number}` : 
             'Game Finished'}
          </Badge>
        </div>

        {/* Current Question */}
        {currentQuestion && game.status === 'in_progress' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>Question {game.current_question_number}</span>
                <Badge>{game.category}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-xl font-semibold mb-4">{currentQuestion.question_text}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-secondary/50">A) {currentQuestion.option_a}</div>
                <div className="p-3 rounded-lg bg-secondary/50">B) {currentQuestion.option_b}</div>
                <div className="p-3 rounded-lg bg-secondary/50">C) {currentQuestion.option_c}</div>
                <div className="p-3 rounded-lg bg-secondary/50">D) {currentQuestion.option_d}</div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Live Answer Status */}
          {currentQuestion && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Answer Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {players.map((player) => {
                    const answer = getPlayerAnswer(player);
                    return (
                      <div key={player.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                        <span className="font-medium">{player.display_name}</span>
                        <div className="flex items-center gap-2">
                          {answer ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <Badge variant={answer.is_correct ? "default" : "destructive"}>
                                {answer.user_answer}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {getAnswerTime(answer.answered_at)}
                              </span>
                            </>
                          ) : (
                            <Badge variant="outline">Waiting...</Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Live Standings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Live Standings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {players.map((player, index) => (
                  <div key={player.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                    <div className="flex items-center gap-3">
                      <Badge variant={index < 3 ? "default" : "outline"}>
                        #{index + 1}
                      </Badge>
                      <span className="font-medium">{player.display_name}</span>
                    </div>
                    <span className="text-xl font-bold">{player.current_score}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Player Count */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{players.length} players in game</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GameSpectator;