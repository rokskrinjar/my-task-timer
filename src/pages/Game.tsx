import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Users, Clock, Trophy, Phone, HelpCircle, Target } from 'lucide-react';

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

interface GameAnswer {
  user_id: string | null;
  user_answer: string;
  is_correct: boolean;
  lifeline_used?: string;
}

const Game = () => {
  const { gameId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check if this is a guest player
  const guestPlayer = sessionStorage.getItem('guestPlayer') ? 
    JSON.parse(sessionStorage.getItem('guestPlayer') || '{}') : null;
  
  const isGuest = !user && guestPlayer?.gameId === gameId;
  
  const [game, setGame] = useState<Game | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [hasAnswered, setHasAnswered] = useState(false);
  const [answers, setAnswers] = useState<GameAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [lifelinesUsed, setLifelinesUsed] = useState<string[]>([]);
  const [showFiftyFifty, setShowFiftyFifty] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);

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
      .channel(`game-updates-${gameId}`) // Simpler channel name
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
        event: '*',
        schema: 'public',
        table: 'game_participants',
        filter: `game_id=eq.${gameId}`
      }, (payload) => {
        console.log('👥 Real-time participants update received:', payload);
        console.log('Triggering participants refetch...');
        fetchParticipants();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'game_answers',
        filter: `game_id=eq.${gameId}`
      }, (payload) => {
        console.log('📝 Real-time answers update received:', payload);
        if (game?.current_question_id) {
          fetchAnswers();
        }
      })
      .subscribe((status) => {
        console.log('📡 Real-time subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to real-time updates');
          // Force initial data fetch after subscription
          console.log('🔄 Forcing initial data refresh after subscription...');
          setTimeout(() => {
            fetchParticipants();
            fetchGameData();
          }, 500);
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Real-time subscription error');
        }
      });

    return () => {
      supabase.removeChannel(gameChannel);
    };
  }, [user, isGuest, gameId]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      handleTimeUp();
    }
    
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const fetchGameData = async () => {
    console.log('🔄 Fetching game data for gameId:', gameId);
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
    
    await Promise.all([
      fetchParticipants(),
      fetchQuestions()
    ]);
    
    // Only fetch answers if game is active and has a current question
    if (gameData.status === 'active' && gameData.current_question_id) {
      console.log('Game is active, fetching current question and answers');
      await Promise.all([
        fetchCurrentQuestion(gameData.current_question_id),
        fetchAnswers()
      ]);
    }
    
    setLoading(false);
  };

  const fetchParticipants = async () => {
    console.log('Fetching participants for game:', gameId);
    // First fetch participants
    const { data: participantsData, error: participantsError } = await supabase
      .from('game_participants')
      .select('*')
      .eq('game_id', gameId)
      .order('current_score', { ascending: false });

    if (participantsError || !participantsData) {
      console.error('Error fetching participants:', participantsError);
      return;
    }

    console.log('Fetched participants:', participantsData);

    // Then fetch profiles for each participant (only for authenticated users)
    const participantsWithProfiles = await Promise.all(
      participantsData.map(async (participant) => {
        if (participant.user_id) {
          // Authenticated user - fetch profile
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
          // Guest user - use display_name from participant record
          return {
            ...participant,
            profiles: { display_name: participant.display_name || 'Gost' }
          };
        }
      })
    );

    console.log('Participants with profiles:', participantsWithProfiles);
    setParticipants(participantsWithProfiles);
  };

  const fetchQuestions = async () => {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('difficulty_order');

    if (!error && data) {
      setQuestions(data);
    }
  };

  const fetchCurrentQuestion = async (questionId: string) => {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('id', questionId)
      .single();

    if (!error && data) {
      setCurrentQuestion(data);
      setHasAnswered(false);
      setSelectedAnswer('');
      setTimeLeft(30);
      setTimerActive(true);
      setShowFiftyFifty(false);
      setHiddenOptions([]);
    }
  };

  const fetchAnswers = async () => {
    if (!game?.current_question_id) {
      console.log('No current question ID, skipping answers fetch');
      return;
    }
    
    console.log('Fetching answers for question:', game.current_question_id);
    const { data, error } = await supabase
      .from('game_answers')
      .select('*')
      .eq('game_id', gameId)
      .eq('question_id', game.current_question_id);

    if (error) {
      console.error('Error fetching answers:', error);
      return;
    }

    console.log('Fetched answers:', data);
    if (data) {
      setAnswers(data);
      
      // Check if current user has answered
      const userAnswer = user ? 
        data.find(a => a.user_id === user.id) :
        data.find(a => a.user_id === null); // Guest players have null user_id
      
      if (userAnswer) {
        setHasAnswered(true);
        setSelectedAnswer(userAnswer.user_answer || '');
        setTimerActive(false);
      }
    }
  };

  const handleGameUpdate = (payload: any) => {
    console.log('🔥 Processing game update:', payload);
    const newGameData = payload.new;
    
    // Update game state immediately
    setGame(prev => {
      console.log('Updating game state from:', prev, 'to:', newGameData);
      return newGameData;
    });
    
    // If status changed to active and we have a question, fetch it
    if (newGameData.status === 'active' && newGameData.current_question_id) {
      console.log('Game became active, fetching first question:', newGameData.current_question_id);
      fetchCurrentQuestion(newGameData.current_question_id);
    }
    
    // If question changed, fetch the new question immediately
    if (newGameData.current_question_id && newGameData.current_question_id !== currentQuestion?.id) {
      console.log('Question changed, fetching new question:', newGameData.current_question_id);
      fetchCurrentQuestion(newGameData.current_question_id);
    }
  };

  const startGame = async () => {
    console.log('startGame called, isHost:', isHost, 'questions.length:', questions.length);
    if (!isHost || !questions.length) return;
    
    console.log('Starting game with first question:', questions[0]);
    const firstQuestion = questions[0];
    
    console.log('Updating game status to active...');
    const { error } = await supabase
      .from('games')
      .update({
        status: 'active',
        current_question_id: firstQuestion.id,
        current_question_number: 1,
        started_at: new Date().toISOString()
      })
      .eq('id', gameId);

    console.log('Game update result:', error ? 'ERROR: ' + error.message : 'SUCCESS');
    
    if (error) {
      toast({
        title: "Napaka",
        description: "Napaka pri zagonu igre",
        variant: "destructive",
      });
    } else {
      // Immediately show the first question instead of waiting for realtime update
      console.log('Immediately showing first question');
      await fetchCurrentQuestion(firstQuestion.id);
      
      // Update local game state immediately
      setGame(prev => prev ? {
        ...prev,
        status: 'active',
        current_question_id: firstQuestion.id,
        current_question_number: 1
      } : null);
      
      // Force a broadcast by refetching game data for all clients
      console.log('🔄 Broadcasting game state change...');
      setTimeout(() => {
        fetchGameData();
      }, 200);
    }
  };

  const submitAnswer = async (answer: string, lifeline?: string) => {
    if (!currentQuestion || hasAnswered) return;
    
    const isCorrect = answer === currentQuestion.correct_answer;
    
    const { error } = await supabase
      .from('game_answers')
      .insert({
        game_id: gameId,
        user_id: user?.id,
        question_id: currentQuestion.id,
        user_answer: answer,
        is_correct: isCorrect,
        lifeline_used: lifeline
      });

    if (error) {
      toast({
        title: "Napaka",
        description: "Napaka pri oddaji odgovora",
        variant: "destructive",
      });
      return;
    }

    // Update participant score (only for correct answers)
    if (isCorrect && currentParticipant) {
      const updateData = {
        current_score: (currentParticipant.current_score || 0) + 1
      };
      
      const updateCondition = user ? 
        { game_id: gameId, user_id: user.id } :
        { game_id: gameId, display_name: guestPlayer?.displayName };

      const { error: scoreError } = await supabase
        .from('game_participants')
        .update(updateData)
        .match(updateCondition);

      if (scoreError) {
        console.error('Error updating score:', scoreError);
      }
    }

    // Update lifelines used count if lifeline was used
    if (lifeline && currentParticipant) {
      const updateData = {
        lifelines_used: (currentParticipant.lifelines_used || 0) + 1
      };
      
      const updateCondition = user ? 
        { game_id: gameId, user_id: user.id } :
        { game_id: gameId, display_name: guestPlayer?.displayName };

      const { error: lifelineError } = await supabase
        .from('game_participants')
        .update(updateData)
        .match(updateCondition);

      if (lifelineError) {
        console.error('Error updating lifelines:', lifelineError);
      }
    }

    setHasAnswered(true);
    setSelectedAnswer(answer);
    setTimerActive(false);
  };

  const nextQuestion = async () => {
    console.log('nextQuestion called, isHost:', isHost, 'current game:', game);
    if (!isHost || !game) return;
    
    const nextQuestionNumber = game.current_question_number + 1;
    const nextQuestion = questions[nextQuestionNumber - 1];
    
    console.log('Next question number:', nextQuestionNumber, 'Next question:', nextQuestion);
    
    if (!nextQuestion) {
      // End game
      console.log('No more questions, ending game');
      const { error } = await supabase
        .from('games')
        .update({
          status: 'finished',
          finished_at: new Date().toISOString()
        })
        .eq('id', gameId);

      if (error) {
        console.error('Error ending game:', error);
      } else {
        // Update local state immediately
        setGame(prev => prev ? {
          ...prev,
          status: 'finished'
        } : null);
      }
      
      return;
    }
    
    console.log('Updating to next question...');
    const { error } = await supabase
      .from('games')
      .update({
        current_question_id: nextQuestion.id,
        current_question_number: nextQuestionNumber
      })
      .eq('id', gameId);

    console.log('Next question update result:', error ? 'ERROR: ' + error.message : 'SUCCESS');

    if (error) {
      toast({
        title: "Napaka",
        description: "Napaka pri prehodu na naslednje vprašanje",
        variant: "destructive",
      });
    } else {
      // Immediately show the next question instead of waiting for realtime update
      console.log('Immediately showing next question');
      await fetchCurrentQuestion(nextQuestion.id);
      
      // Update local game state immediately
      setGame(prev => prev ? {
        ...prev,
        current_question_id: nextQuestion.id,
        current_question_number: nextQuestionNumber
      } : null);
      
      // Reset answers for new question
      setAnswers([]);
    }
  };

  const useLifeline = (type: string) => {
    if (lifelinesUsed.includes(type) || (currentParticipant?.lifelines_used || 0) >= 3) return;
    
    setLifelinesUsed([...lifelinesUsed, type]);
    
    if (type === '50_50') {
      if (!currentQuestion) return;
      
      const correctAnswer = currentQuestion.correct_answer;
      const options = ['A', 'B', 'C', 'D'];
      const wrongOptions = options.filter(opt => opt !== correctAnswer);
      
      // Remove 2 wrong options randomly
      const toHide = wrongOptions.sort(() => 0.5 - Math.random()).slice(0, 2);
      setHiddenOptions(toHide);
      setShowFiftyFifty(true);
    }
  };

  const handleTimeUp = () => {
    if (!hasAnswered) {
      submitAnswer('', 'timeout');
    }
    setTimerActive(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Nalaganje igre...</p>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Igra ni bila najdena</CardTitle>
            <CardDescription>Preverite kodo igre ali se obrnite na gostitelja.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/dashboard')}>
              Nazaj na glavno stran
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Koda: {game.game_code}</h1>
            <Badge variant={game.status === 'active' ? 'default' : 'secondary'}>
              {game.status === 'waiting' ? 'Čaka' : game.status === 'active' ? 'Aktivna' : 'Končana'}
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <Users className="h-4 w-4" />
            <span>{participants.length} igralcev</span>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Game Area */}
          <div className="lg:col-span-2 space-y-6">
            {game.status === 'waiting' && (
              <Card>
                <CardHeader>
                  <CardTitle>Čakanje na začetek igre</CardTitle>
                  <CardDescription>
                    {participants.length === 1 ? 'Igrate sami. Pripravljeni za izziv?' : 'Čakamo, da se vsi igralci pridružijo igri.'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isHost && (
                    <Button onClick={startGame} disabled={participants.length < 1}>
                      Začni igro
                    </Button>
                  )}
                  {!isHost && (
                    <p className="text-muted-foreground">
                      Čakamo, da gostitelj zažene igro...
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {game.status === 'active' && currentQuestion && (
              <>
                {/* Question */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <span>Vprašanje {game.current_question_number}</span>
                          <Badge variant="outline">{currentQuestion.grade_level}. razred</Badge>
                          <Badge variant="secondary">{currentQuestion.subject}</Badge>
                        </CardTitle>
                      </div>
                      {timerActive && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span className="font-mono text-lg">{timeLeft}s</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg mb-6">{currentQuestion.question_text}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {['A', 'B', 'C', 'D'].map((option) => {
                        const isHidden = hiddenOptions.includes(option);
                        const optionText = currentQuestion[`option_${option.toLowerCase()}` as keyof Question] as string;
                        
                        if (isHidden) {
                          return (
                            <div key={option} className="p-4 border rounded-lg bg-muted/50 opacity-50">
                              <span className="text-muted-foreground">Option hidden</span>
                            </div>
                          );
                        }
                        
                        return (
                          <Button
                            key={option}
                            variant={selectedAnswer === option ? "default" : "outline"}
                            className="p-4 h-auto text-left justify-start"
                            onClick={() => !hasAnswered && submitAnswer(option)}
                            disabled={hasAnswered || !timerActive}
                          >
                            <span className="font-bold mr-2">{option})</span>
                            {optionText}
                          </Button>
                        );
                      })}
                    </div>

                    {hasAnswered && (
                      <div className="mt-6 space-y-4">
                        <div className="p-4 bg-accent rounded-lg">
                          <p className="font-medium">
                            Vaš odgovor: {selectedAnswer || 'Ni odgovora'}
                          </p>
                          {participants.length > 1 ? (
                            <p className="text-sm text-muted-foreground">
                              Čakamo na ostale igralce...
                            </p>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              Odgovor oddan!
                            </p>
                          )}
                        </div>
                        
                        {/* Show correct answer when everyone has answered OR immediately for single player */}
                        {((answers.length === participants.length && participants.length > 0) || (participants.length === 1 && hasAnswered)) && (
                          <div className={`p-4 border rounded-lg ${
                            selectedAnswer === currentQuestion.correct_answer 
                              ? 'bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                              : 'bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                          }`}>
                            <p className={`font-medium ${
                              selectedAnswer === currentQuestion.correct_answer 
                                ? 'text-green-800 dark:text-green-200' 
                                : 'text-red-800 dark:text-red-200'
                            }`}>
                              Pravilen odgovor: {currentQuestion.correct_answer}) {currentQuestion[`option_${currentQuestion.correct_answer.toLowerCase()}` as keyof Question] as string}
                            </p>
                            {participants.length > 1 && (
                              <div className={`mt-2 text-sm ${
                                selectedAnswer === currentQuestion.correct_answer 
                                  ? 'text-green-700 dark:text-green-300' 
                                  : 'text-red-700 dark:text-red-300'
                              }`}>
                                {answers.filter(a => a.is_correct).length} od {participants.length} igralcev je odgovorilo pravilno
                              </div>
                            )}
                            {participants.length === 1 && (
                              <div className={`mt-2 text-sm ${
                                selectedAnswer === currentQuestion.correct_answer 
                                  ? 'text-green-700 dark:text-green-300' 
                                  : 'text-red-700 dark:text-red-300'
                              }`}>
                                {selectedAnswer === currentQuestion.correct_answer ? '✅ Pravilno!' : '❌ Napačno'}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Lifelines */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5" />
                      Pomoči ({3 - (currentParticipant?.lifelines_used || 0)} preostalo)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => useLifeline('50_50')}
                        disabled={lifelinesUsed.includes('50_50') || hasAnswered || (currentParticipant?.lifelines_used || 0) >= 3}
                      >
                        <Target className="h-4 w-4 mr-2" />
                        50:50
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => useLifeline('ask_audience')}
                        disabled={lifelinesUsed.includes('ask_audience') || hasAnswered || (currentParticipant?.lifelines_used || 0) >= 3}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Vprašaj občinstvo
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => useLifeline('phone_friend')}
                        disabled={lifelinesUsed.includes('phone_friend') || hasAnswered || (currentParticipant?.lifelines_used || 0) >= 3}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Pokliči prijatelja
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Host Controls */}
                {isHost && ((answers.length === participants.length && participants.length > 1) || (participants.length === 1 && hasAnswered)) && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Gostitelj</CardTitle>
                      <CardDescription>Vsi igralci so odgovorili</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button onClick={nextQuestion}>
                        {game.current_question_number >= questions.length ? 'Končaj igro' : 'Naslednje vprašanje'}
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {game.status === 'finished' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Igra končana!
                  </CardTitle>
                  <CardDescription>Rezultati končne igre</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => isGuest ? navigate('/join') : navigate('/dashboard')}>
                    {isGuest ? 'Pridruži se novi igri' : 'Nazaj na glavno stran'}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Leaderboard */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Lestvica
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {participants.map((participant, index) => (
                    <div
                      key={participant.id}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        (user && participant.user_id === user.id) || 
                        (!user && participant.display_name === guestPlayer?.displayName) 
                          ? 'bg-accent' : 'bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-lg">#{index + 1}</span>
                        <div>
                          <p className="font-medium">
                            {participant.profiles?.display_name || 'Neimenovan igralec'}
                          </p>
                          {participant.is_host && (
                            <Badge variant="outline" className="text-xs">Gostitelj</Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{participant.current_score}</p>
                        <p className="text-xs text-muted-foreground">
                          Pomoči: {3 - participant.lifelines_used}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Current question progress */}
            {game.status === 'active' && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Napredek</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Vprašanje</span>
                      <span>{game.current_question_number} / {questions.length}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(game.current_question_number / questions.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Odgovori</span>
                      <span>{answers.length} / {participants.length}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-secondary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(answers.length / Math.max(participants.length, 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
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