import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { Users, Trophy, Wifi, WifiOff, Play, SkipForward } from 'lucide-react';
import QuestionStatsCard from '@/components/QuestionStatsCard';
import GameParticipants from '@/components/GameParticipants';
import GameQuestions from '@/components/GameQuestions';

interface Question {
  id: string;
  question_text: string;
  grade_level: number;
  subject: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  difficulty_order: number;
}

interface Game {
  id: string;
  game_code: string;
  status: string;
  host_id: string;
  current_question_number: number;
  current_question_id?: string;
  category?: string;
}

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

const Game = () => {
  const { gameId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isOnline } = useNetworkStatus();
  const subscriptionRef = useRef<any>(null);
  
  // Check if this is a guest player
  const guestPlayer = sessionStorage.getItem('guestPlayer') ? 
    JSON.parse(sessionStorage.getItem('guestPlayer') || '{}') : null;
  
  const isGuest = !user && guestPlayer?.gameId === gameId;
  
  const [game, setGame] = useState<Game | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionAnswers, setCurrentQuestionAnswers] = useState<any[]>([]);

  const currentParticipant = participants.find(p => 
    user ? p.user_id === user.id : p.display_name === guestPlayer?.displayName
  );
  const isHost = currentParticipant?.is_host || false;

  useEffect(() => {
    // Redirect to join page if not authenticated and not a guest
    if (!user && !isGuest) {
      navigate('/join');
      return;
    }
    
    if ((!user && !isGuest) || !gameId) return;
    
    fetchGameData();
    
    // Set up real-time subscriptions
    console.log('Setting up real-time subscriptions for gameId:', gameId);
    const gameChannel = supabase
      .channel(`game-updates-${gameId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'games',
        filter: `id=eq.${gameId}`
      }, (payload) => {
        console.log('🔥 Real-time game update received:', payload);
        handleGameUpdate(payload);
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'game_answers',
        filter: `game_id=eq.${gameId}`
      }, (payload) => {
        console.log('🔥 New answer received:', payload);
        handleNewAnswer(payload);
      })
      .subscribe((status) => {
        console.log('📡 Real-time subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to real-time updates');
        }
      });

    subscriptionRef.current = gameChannel;

    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
        subscriptionRef.current = null;
      }
    };
  }, [user, isGuest, gameId]);

  const fetchGameData = async () => {
    console.log('🔄 Fetching game data for gameId:', gameId);
    try {
      const { data: gameData, error: gameError } = await supabase
        .from('games')
        .select('*')
        .eq('id', gameId)
        .single();

      if (gameError || !gameData) {
        console.error('Error fetching game:', gameError);
        toast({
          title: "Napaka",
          description: "Igra ni bila najdena",
          variant: "destructive",
        });
        navigate('/dashboard');
        return;
      }

      console.log('📋 Fetched game data:', gameData);
      setGame(gameData);
      
      // Fetch questions for the game
      await fetchQuestionsForGame(gameData);
      
      // Only fetch current question if game is active and has a current question
      if (gameData.status === 'active' && gameData.current_question_id) {
        await fetchCurrentQuestion(gameData.current_question_id);
      }
    } catch (error) {
      console.error('Error in fetchGameData:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleParticipantsChange = (newParticipants: Participant[]) => {
    setParticipants(newParticipants);
  };

  const fetchQuestionsForGame = async (gameData: Game) => {
    console.log('🔍 Fetching reserved questions for game:', gameData.id);
    
    const { data: gameQuestions, error: gameQuestionsError } = await supabase
      .from('game_questions')
      .select('question_id, question_order')
      .eq('game_id', gameData.id)
      .order('question_order');

    if (!gameQuestionsError && gameQuestions && gameQuestions.length > 0) {
      console.log('✅ Found pre-reserved questions. Count:', gameQuestions.length);
      
      const questionIds = gameQuestions.map(gq => gq.question_id);
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .in('id', questionIds);

      if (!questionsError && questionsData) {
        const orderedQuestions = gameQuestions
          .map(gq => questionsData.find(q => q.id === gq.question_id))
          .filter(q => q !== undefined) as Question[];
        setQuestions(orderedQuestions);
        return;
      }
    }

    console.log('📝 No reserved questions found, will reserve when game starts');
    setQuestions([]);
  };

  const fetchCurrentQuestion = async (questionId: string) => {
    console.log('🔍 fetchCurrentQuestion called with questionId:', questionId);
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('id', questionId)
        .single();

      if (!error && data) {
        console.log('✅ Setting currentQuestion to:', data);
        setCurrentQuestion(data);
      } else {
        console.error('❌ Error fetching current question:', error);
      }
    } catch (error) {
      console.error('Error in fetchCurrentQuestion:', error);
    }
  };

  const handleGameUpdate = (payload: any) => {
    console.log('🔥 Processing game update:', payload);
    const newGameData = payload.new;
    
    setGame(prev => {
      console.log('Updating game state from:', prev, 'to:', newGameData);
      return newGameData;
    });
    
    if (newGameData.status === 'active' && newGameData.current_question_id) {
      console.log('Game became active, fetching first question:', newGameData.current_question_id);
      fetchCurrentQuestion(newGameData.current_question_id);
    }
    
    if (newGameData.current_question_id && newGameData.current_question_id !== currentQuestion?.id) {
      console.log('Question changed, fetching new question:', newGameData.current_question_id);
      setCurrentQuestionAnswers([]); // Reset answers for new question
      fetchCurrentQuestion(newGameData.current_question_id);
    }
  };

  const startGame = async () => {
    console.log('startGame called, isHost:', isHost);
    if (!isHost || !game?.category) return;
    
    console.log('🎯 Reserving questions for game...');
    
    const { data: reservedQuestions, error: reserveError } = await supabase
      .rpc('select_and_reserve_game_questions', {
        p_game_id: gameId,
        p_category: game.category,
        p_question_count: 15
      });

    if (reserveError || !reservedQuestions || reservedQuestions.length === 0) {
      console.error('❌ Error reserving questions:', reserveError);
      toast({
        title: "Napaka",
        description: "Napaka pri izbiri vprašanj",
        variant: "destructive",
      });
      return;
    }

    console.log('✅ Reserved questions:', reservedQuestions.length);

    const { data: firstQuestionData, error: firstQuestionError } = await supabase
      .rpc('get_next_game_question', {
        p_game_id: gameId,
        p_current_question_number: 0
      });

    if (firstQuestionError || !firstQuestionData || firstQuestionData.length === 0) {
      console.error('❌ Error getting first question:', firstQuestionError);
      toast({
        title: "Napaka",
        description: "Napaka pri pridobivanju prvega vprašanja",
        variant: "destructive",
      });
      return;
    }

    const firstQuestion = firstQuestionData[0];
    console.log('🎯 Starting game with first question:', firstQuestion.question_id);
    
    const { error } = await supabase
      .from('games')
      .update({
        status: 'active',
        current_question_id: firstQuestion.question_id,
        current_question_number: 1,
        started_at: new Date().toISOString()
      })
      .eq('id', gameId);

    if (error) {
      toast({
        title: "Napaka",
        description: "Napaka pri zagonu igre",
        variant: "destructive",
      });
    } else {
      await fetchQuestionsForGame(game);
      await fetchCurrentQuestion(firstQuestion.question_id);
      
      setGame(prev => prev ? {
        ...prev,
        status: 'active',
        current_question_id: firstQuestion.question_id,
        current_question_number: 1
      } : null);
    }
  };

  const nextQuestion = async () => {
    console.log('nextQuestion called, isHost:', isHost, 'current game:', game);
    if (!isHost || !game) return;
    
    const nextQuestionNumber = game.current_question_number + 1;
    
    const { data: nextQuestionData, error: nextQuestionError } = await supabase
      .rpc('get_next_game_question', {
        p_game_id: gameId,
        p_current_question_number: game.current_question_number
      });

    if (nextQuestionError || !nextQuestionData || nextQuestionData.length === 0) {
      console.log('No more questions, ending game');
      const { error } = await supabase
        .from('games')
        .update({
          status: 'finished',
          finished_at: new Date().toISOString()
        })
        .eq('id', gameId);

      if (!error) {
        setGame(prev => prev ? {
          ...prev,
          status: 'finished'
        } : null);
      }
      return;
    }
    
    const nextQuestion = nextQuestionData[0];
    console.log('✅ Found next question:', nextQuestion.question_id);
    
    const { error } = await supabase
      .from('games')
      .update({
        current_question_id: nextQuestion.question_id,
        current_question_number: nextQuestionNumber
      })
      .eq('id', gameId);

    if (error) {
      toast({
        title: "Napaka",
        description: "Napaka pri prehodu na naslednje vprašanje",
        variant: "destructive",
      });
    } else {
      await fetchCurrentQuestion(nextQuestion.question_id);
      setGame(prev => prev ? {
        ...prev,
        current_question_id: nextQuestion.question_id,
        current_question_number: nextQuestionNumber
      } : null);
    }
  };

  const handleNewAnswer = async (payload: any) => {
    const newAnswer = payload.new;
    console.log('🎯 Processing new answer:', newAnswer);
    
    // Only process actual answers, not lifeline usage
    if (!newAnswer.user_answer || newAnswer.lifeline_used) return;
    
    // Fetch all answers for current question to check if everyone has answered
    if (currentQuestion && game?.status === 'active') {
      const { data: allAnswers, error } = await supabase
        .from('game_answers')
        .select('*')
        .eq('game_id', gameId)
        .eq('question_id', currentQuestion.id)
        .not('user_answer', 'is', null)
        .is('lifeline_used', null);

      if (!error && allAnswers) {
        console.log('📊 Current answers for question:', allAnswers.length, 'Total participants:', participants.length);
        setCurrentQuestionAnswers(allAnswers);
        
        // Check if all participants have answered
        if (allAnswers.length >= participants.length && participants.length > 0 && isHost) {
          console.log('🎉 All participants have answered! Auto-progressing...');
          // Small delay to let UI update, then auto-progress
          setTimeout(() => {
            nextQuestion();
          }, 2000);
        }
      }
    }
  };

  const handleAnswerSubmitted = (answer: string) => {
    console.log('Answer submitted:', answer);
    // Reset current question answers when question changes
    setCurrentQuestionAnswers([]);
  };

  const handleQuestionChange = (question: Question | null) => {
    setCurrentQuestion(question);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Nalaganje igre...</p>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Igra ni bila najdena</h1>
          <Button onClick={() => navigate('/dashboard')}>
            Nazaj na nadzorno ploščo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Igra: {game.game_code}</h1>
            <Badge variant={game.status === 'waiting' ? 'secondary' : game.status === 'active' ? 'default' : 'outline'}>
              {game.status === 'waiting' ? 'Čaka' : game.status === 'active' ? 'Aktivna' : 'Končana'}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {!isOnline && (
              <div className="flex items-center gap-1 text-destructive">
                <WifiOff className="h-4 w-4" />
                <span className="text-sm">Brez povezave</span>
              </div>
            )}
            {isOnline && (
              <div className="flex items-center gap-1 text-green-600">
                <Wifi className="h-4 w-4" />
                <span className="text-sm">Povezan</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container py-6 px-4 max-w-6xl mx-auto">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Game Controls and Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Game Controls */}
            {isHost && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Nadzor igre
                  </CardTitle>
                  <CardDescription>
                    Upravljajte potek igre
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {game.status === 'waiting' && (
                    <Button 
                      onClick={startGame} 
                      className="w-full" 
                      size="lg"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Začni igro
                    </Button>
                  )}
                  {game.status === 'active' && (
                    <Button 
                      onClick={nextQuestion} 
                      className="w-full" 
                      size="lg"
                    >
                      <SkipForward className="h-4 w-4 mr-2" />
                      Naslednje vprašanje
                    </Button>
                  )}
                  {game.status === 'finished' && (
                    <div className="text-center py-4">
                      <Trophy className="h-12 w-12 mx-auto text-yellow-500 mb-2" />
                      <p className="font-medium">Igra je končana!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Game Stats */}
            {questions.length > 0 && (
              <QuestionStatsCard 
                totalQuestions={questions.length}
                questionsRemaining={questions.length - (game.current_question_number || 0)}
                currentQuestionNumber={game.current_question_number || 0}
              />
            )}

            {/* Participants */}
            <GameParticipants 
              gameId={gameId!} 
              onParticipantsChange={handleParticipantsChange}
            />
          </div>

          {/* Right Column - Questions */}
          <div className="lg:col-span-2">
            {game.status === 'waiting' ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Čakanje na začetek igre</h2>
                  <p className="text-muted-foreground mb-4">
                    Delite kodo igre <strong>{game.game_code}</strong> z drugimi igralci
                  </p>
                  {isHost && (
                    <p className="text-sm text-muted-foreground">
                      Kot gostitelj lahko začnete igro, ko ste pripravljeni
                    </p>
                  )}
                </CardContent>
              </Card>
            ) : game.status === 'active' ? (
              <GameQuestions
                gameId={gameId!}
                currentQuestion={currentQuestion}
                onQuestionChange={handleQuestionChange}
                onAnswerSubmitted={handleAnswerSubmitted}
                isHost={isHost}
                userId={user?.id}
                isGuest={isGuest}
                guestDisplayName={guestPlayer?.displayName}
              />
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Trophy className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Igra je končana!</h2>
                  <p className="text-muted-foreground mb-4">
                    Poglejte končne rezultate v tabeli igralcev
                  </p>
                  <Button onClick={() => navigate('/dashboard')}>
                    Nazaj na nadzorno ploščo
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Game;