import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { debounce } from '@/utils/mobileOptimizations';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Users, Clock, Trophy, Phone, HelpCircle, Target, Wifi, WifiOff } from 'lucide-react';

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
  const { isOnline, wasOffline } = useNetworkStatus();
  const subscriptionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptRef = useRef<NodeJS.Timeout | null>(null);
  
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
  const [audiencePollResults, setAudiencePollResults] = useState<{option: string, percentage: number}[] | null>(null);

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
        
        // Use question_id from the payload to avoid stale state issues
        const questionId = (payload.new as any)?.question_id;
        console.log('🔍 Current state check:', {
          currentQuestionId: currentQuestion?.id,
          gameCurrentQuestionId: game?.current_question_id,
          hasCurrentQuestion: !!currentQuestion
        });
        
        if (questionId) {
          console.log('🔄 Calling fetchAnswers from real-time update with questionId from payload:', questionId);
          fetchAnswers(questionId).catch(error => {
            console.error('❌ fetchAnswers failed from real-time update:', error);
          });
        } else {
          console.log('⚠️ No question_id in payload, skipping fetchAnswers from real-time update');
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

    subscriptionRef.current = gameChannel;

    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
        subscriptionRef.current = null;
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [user, isGuest, gameId]);

  // Timer effect with proper cleanup and dependencies
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            setTimerActive(false);
            // Use setTimeout to avoid state update during render
            setTimeout(() => {
              if (!hasAnswered) {
                submitAnswer('');
              }
            }, 0);
          }
          return Math.max(0, newTime);
        });
      }, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timerActive, timeLeft, hasAnswered]);

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
    
    // Fetch participants first
    await fetchParticipants();
    
    // Then fetch questions based on the game category
    await fetchQuestionsForGame(gameData);
    
    // Only fetch answers if game is active and has a current question
    if (gameData.status === 'active' && gameData.current_question_id) {
      console.log('Game is active, fetching current question and answers');
      console.log('🔍 About to call fetchCurrentQuestion with:', gameData.current_question_id);
      // First fetch the current question, then fetch answers
      await fetchCurrentQuestion(gameData.current_question_id);
      console.log('🔄 After fetchCurrentQuestion, currentQuestion state is now available for fetchAnswers');
      await fetchAnswers(gameData.current_question_id);
    } else {
      console.log('⚠️ Skipping question/answers fetch. Status:', gameData.status, 'QuestionId:', gameData.current_question_id);
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

  const fetchQuestionsForGame = async (gameData: Game) => {
    if (!gameData?.category) {
      console.log('⚠️ No category found for game, using default');
      // Fallback to fetch all questions if no category
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('difficulty_order');
      
      if (!error && data) {
        console.log('✅ Fetched fallback questions. Count:', data.length);
        const randomizedQuestions = randomizeQuestionsByDifficulty(data);
        setQuestions(randomizedQuestions);
      }
      return;
    }
    
    console.log('🔍 Fetching questions for category:', gameData.category);
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('category', gameData.category);

    if (!error && data) {
      console.log('✅ Fetched questions for category:', gameData.category, 'Count:', data.length);
      const randomizedQuestions = randomizeQuestionsByDifficulty(data);
      setQuestions(randomizedQuestions);
    } else {
      console.error('❌ Error fetching questions:', error);
    }
  };

  // Function to randomize questions while maintaining difficulty progression
  const randomizeQuestionsByDifficulty = (allQuestions: Question[]) => {
    // Group questions by grade level (difficulty)
    const questionsByGrade: { [key: number]: Question[] } = {};
    
    allQuestions.forEach(question => {
      if (!questionsByGrade[question.grade_level]) {
        questionsByGrade[question.grade_level] = [];
      }
      questionsByGrade[question.grade_level].push(question);
    });

    // Shuffle questions within each grade level
    Object.keys(questionsByGrade).forEach(grade => {
      questionsByGrade[parseInt(grade)] = shuffleArray(questionsByGrade[parseInt(grade)]);
    });

    // Create progressive difficulty: linear progression from grade 1 to higher grades
    const finalQuestions: Question[] = [];
    const totalQuestions = 10; // Reduced to 10 questions
    const grades = Object.keys(questionsByGrade).map(Number).sort();
    
    // Linear difficulty progression: 1-2 grade 1, 3 grade 2, 4 grade 3, 5 grade 4, etc.
    const difficultyProgression = [
      { grade: 1, count: 2 },  // Questions 1-2: Grade 1
      { grade: 2, count: 1 },  // Question 3: Grade 2
      { grade: 3, count: 1 },  // Question 4: Grade 3
      { grade: 4, count: 1 },  // Question 5: Grade 4
      { grade: 5, count: 1 },  // Question 6: Grade 5 (if available)
      { grade: 4, count: 1 },  // Question 7: Grade 4 (fallback)
      { grade: 3, count: 1 },  // Question 8: Grade 3 (fallback)
      { grade: 4, count: 1 },  // Question 9: Grade 4 (fallback)
      { grade: 5, count: 1 }   // Question 10: Grade 5 (hardest)
    ];

    for (const stage of difficultyProgression) {
      if (finalQuestions.length >= totalQuestions) break;
      
      // Try to get question from the specified grade, fallback to available grades
      let questionAdded = false;
      
      // First try the exact grade
      if (questionsByGrade[stage.grade] && questionsByGrade[stage.grade].length > 0) {
        const question = questionsByGrade[stage.grade].shift();
        if (question) {
          finalQuestions.push(question);
          questionAdded = true;
        }
      }
      
      // If no question from exact grade, try nearby grades
      if (!questionAdded) {
        const availableGrades = grades.filter(g => questionsByGrade[g] && questionsByGrade[g].length > 0);
        if (availableGrades.length > 0) {
          // Prefer grades close to the target grade
          const closestGrade = availableGrades.reduce((prev, curr) => 
            Math.abs(curr - stage.grade) < Math.abs(prev - stage.grade) ? curr : prev
          );
          const question = questionsByGrade[closestGrade].shift();
          if (question) {
            finalQuestions.push(question);
          }
        }
      }
    }

    // If we still need more questions, add remaining randomly
    const remainingQuestions = Object.values(questionsByGrade).flat();
    while (finalQuestions.length < totalQuestions && remainingQuestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * remainingQuestions.length);
      const question = remainingQuestions.splice(randomIndex, 1)[0];
      finalQuestions.push(question);
    }

    console.log('📊 Randomized questions with linear difficulty progression:', {
      total: finalQuestions.length,
      gradeDistribution: finalQuestions.reduce((acc, q, index) => {
        acc[`Q${index + 1} (Grade ${q.grade_level})`] = q.question_text.substring(0, 30) + '...';
        return acc;
      }, {} as { [key: string]: string })
    });

    return finalQuestions;
  };

  // Fisher-Yates shuffle algorithm
  const shuffleArray = (array: any[]): any[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const fetchCurrentQuestion = async (questionId: string) => {
    console.log('🔍 fetchCurrentQuestion called with questionId:', questionId);
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('id', questionId)
      .single();

    console.log('📋 fetchCurrentQuestion result:', { data, error });
    if (!error && data) {
      console.log('✅ Setting currentQuestion to:', data);
      setCurrentQuestion(data);
      setHasAnswered(false);
      setSelectedAnswer('');
      setTimeLeft(30);
      setTimerActive(true);
      setShowFiftyFifty(false);
      setHiddenOptions([]);
    } else {
      console.error('❌ Error fetching current question:', error);
    }
  };

  const fetchAnswers = async (providedQuestionId?: string) => {
    const questionId = providedQuestionId || currentQuestion?.id || game?.current_question_id;
    if (!questionId) {
      console.log('❌ No current question ID, skipping answers fetch. Game:', game, 'CurrentQuestion:', currentQuestion);
      return;
    }
    
    console.log('📝 Fetching answers for:', { 
      gameId, 
      questionId: questionId,
      gameStatus: game?.status,
      user: user?.id,
      isGuest: isGuest,
      authUid: 'will be null for guests'
    });
    
    console.log('🔍 Making query to game_answers...');
    const { data, error } = await supabase
      .from('game_answers')
      .select('*')
      .eq('game_id', gameId)
      .eq('question_id', questionId);

    if (error) {
      console.error('❌ Error fetching answers:', error);
      console.error('❌ Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return;
    }

    console.log('✅ Fetched answers:', data);
    console.log('🔄 Setting answers state. Previous:', answers, 'New:', data);
    if (data) {
      setAnswers(data);
      
      // Check if current user has answered (exclude lifeline-only answers)
      const userAnswer = user ? 
        data.find(a => a.user_id === user.id && !a.lifeline_used) :
        data.find(a => a.user_id === null && a.display_name === guestPlayer?.displayName && !a.lifeline_used); // Guest players identified by display_name
      
      if (userAnswer) {
        console.log('👤 Found user answer:', userAnswer);
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
    
    // If question changed, fetch the new question immediately and reset answers
    if (newGameData.current_question_id && newGameData.current_question_id !== currentQuestion?.id) {
      console.log('Question changed, fetching new question:', newGameData.current_question_id);
      // Reset answers when question changes
      setAnswers([]);
      setHasAnswered(false);
      setSelectedAnswer('');
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

  const submitAnswer = async (answer: string) => {
    if (!currentQuestion || hasAnswered) return;
    
    console.log('🎯 submitAnswer called with:', { 
      answer, 
      user: user?.id, 
      isGuest, 
      guestPlayer: guestPlayer?.displayName,
      currentQuestion: currentQuestion.id 
    });
    
    const isCorrect = answer === currentQuestion.correct_answer;
    
    // Check if there's already a lifeline record for this user/question
    const existingAnswerQuery = user ? 
      supabase
        .from('game_answers')
        .select('*')
        .eq('game_id', gameId)
        .eq('user_id', user.id)
        .eq('question_id', currentQuestion.id) :
      supabase
        .from('game_answers')
        .select('*')
        .eq('game_id', gameId)
        .is('user_id', null)
        .eq('display_name', guestPlayer?.displayName)
        .eq('question_id', currentQuestion.id);
    
    const { data: existingAnswers, error: fetchError } = await existingAnswerQuery;
    
    if (fetchError) {
      console.error('❌ Error checking existing answers:', fetchError);
      toast({
        title: "Napaka",
        description: "Napaka pri preverjanju obstoječih odgovorov",
        variant: "destructive",
      });
      return;
    }
    
    const existingAnswer = existingAnswers?.[0];
    
    if (existingAnswer && existingAnswer.lifeline_used) {
      // Update existing lifeline record with the actual answer
      console.log('📝 Updating existing lifeline record with answer:', existingAnswer.id);
      
      const { error } = await supabase
        .from('game_answers')
        .update({
          user_answer: answer,
          is_correct: isCorrect
        })
        .eq('id', existingAnswer.id);
        
      if (error) {
        console.error('❌ Answer update error:', error);
        console.error('❌ Full error details:', JSON.stringify(error, null, 2));
        toast({
          title: "Napaka",
          description: `Napaka pri posodobitvi odgovora: ${error.message}`,
          variant: "destructive",
        });
        return;
      }
    } else {
      // Insert new answer record
      const answerData = {
        game_id: gameId,
        user_id: user?.id || null, // Explicitly set null for guests
        display_name: user ? null : guestPlayer?.displayName, // Add display_name for guests
        question_id: currentQuestion.id,
        user_answer: answer,
        is_correct: isCorrect,
        lifeline_used: null // Always null for regular answers
      };
      
      console.log('📝 Submitting answer data:', answerData);
      
      const { error } = await supabase
        .from('game_answers')
        .insert(answerData);

      if (error) {
        console.error('❌ Answer submission error:', error);
        console.error('❌ Full error details:', JSON.stringify(error, null, 2));
        toast({
          title: "Napaka",
          description: `Napaka pri oddaji odgovora: ${error.message}`,
          variant: "destructive",
        });
        return;
      }
    }
    
    console.log('✅ Answer submitted successfully');

    // Update participant score (only for correct answers)
    console.log('🏆 Score update check:', { 
      isCorrect, 
      currentParticipant: currentParticipant?.id, 
      currentScore: currentParticipant?.current_score,
      user: user?.id,
      isGuest,
      guestDisplayName: guestPlayer?.displayName
    });
    
    if (isCorrect && currentParticipant) {
      const updateData = {
        current_score: (currentParticipant.current_score || 0) + 1
      };
      
      const updateCondition = user ? 
        { game_id: gameId, user_id: user.id } :
        { game_id: gameId, display_name: guestPlayer?.displayName };

      console.log('🏆 Updating score with:', { updateData, updateCondition });

      const { error: scoreError } = await supabase
        .from('game_participants')
        .update(updateData)
        .match(updateCondition);

      if (scoreError) {
        console.error('❌ Error updating score:', scoreError);
      } else {
        console.log('✅ Score updated successfully');
        // Refresh participants to show updated scores
        fetchParticipants();
      }
    } else {
      console.log('❌ Score not updated because:', {
        isCorrect,
        hasCurrentParticipant: !!currentParticipant
      });
    }

    // Note: Lifeline count is updated when lifelines are used, not when answers are submitted
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

  const useLifeline = async (type: string) => {
    if (lifelinesUsed.includes(type) || (currentParticipant?.lifelines_used || 0) >= 3) return;
    
    console.log('🆘 Lifeline button clicked:', { 
      type, 
      user: user?.id, 
      isGuest, 
      guestPlayer,
      currentParticipant: currentParticipant?.display_name,
      lifelinesUsed,
      maxLifelinesReached: (currentParticipant?.lifelines_used || 0) >= 3
    });
    
    setLifelinesUsed([...lifelinesUsed, type]);
    
    // Record lifeline usage in database
    const lifeline_used_value = type; // This should match the constraint values
    
    console.log('🎯 Using lifeline:', { 
      type: lifeline_used_value, 
      user: user?.id, 
      isGuest, 
      guestPlayer: guestPlayer?.displayName,
      currentQuestion: currentQuestion?.id,
      gameCurrentQuestionId: game?.current_question_id
    });

    // Use either currentQuestion or the current_question_id from game state
    const questionId = currentQuestion?.id || game?.current_question_id;
    
    if (questionId) {
      const lifeline_data = {
        game_id: gameId,
        user_id: user?.id || null,
        display_name: user ? null : guestPlayer?.displayName, // Add display_name for guests
        question_id: questionId, // Use the questionId variable that works for both currentQuestion and game state
        user_answer: '', // Empty answer for lifeline usage
        is_correct: false, // Not applicable for lifeline
        lifeline_used: lifeline_used_value
      };
      
      console.log('📝 Submitting lifeline data:', lifeline_data);
      
      const { data, error } = await supabase
        .from('game_answers')
        .insert(lifeline_data);

      console.log('🔍 Lifeline submission result:', { data, error });

      if (error) {
        console.error('❌ Lifeline submission error:', error);
        console.error('❌ Full error details:', JSON.stringify(error, null, 2));
        toast({
          title: "Napaka",
          description: `Napaka pri uporabi pomoči: ${error.message}`,
          variant: "destructive",
        });
        return;
      }
      
      console.log('✅ Lifeline submitted successfully');
    } else {
      console.error('❌ No question ID available for lifeline submission');
      toast({
        title: "Napaka",
        description: "Trenutno vprašanje ni na voljo",
        variant: "destructive",
      });
      return;
    }
    
    if (type === '50_50') {
      if (!currentQuestion) return;
      
      const correctAnswer = currentQuestion.correct_answer;
      const options = ['A', 'B', 'C', 'D'];
      const wrongOptions = options.filter(opt => opt !== correctAnswer);
      
      // Remove 2 wrong options randomly
      const toHide = wrongOptions.sort(() => 0.5 - Math.random()).slice(0, 2);
      setHiddenOptions(toHide);
      setShowFiftyFifty(true);
    } else if (type === 'ask_audience') {
      if (!currentQuestion) return;
      
      // Simulate audience poll - correct answer gets 60-80%, others split the rest
      const correctAnswer = currentQuestion.correct_answer;
      const correctPercentage = 60 + Math.random() * 20; // 60-80%
      const remainingPercentage = 100 - correctPercentage;
      const wrongOptions = ['A', 'B', 'C', 'D'].filter(opt => opt !== correctAnswer);
      
      const results: { [key: string]: number } = {};
      results[correctAnswer] = Math.round(correctPercentage);
      
      // Distribute remaining percentage among wrong options
      let remaining = remainingPercentage;
      wrongOptions.forEach((opt, index) => {
        if (index === wrongOptions.length - 1) {
          results[opt] = Math.round(remaining);
        } else {
          const percentage = Math.random() * remaining;
          results[opt] = Math.round(percentage);
          remaining -= percentage;
        }
      });
      
      // Create chart data
      const chartData = ['A', 'B', 'C', 'D'].map(option => ({
        option,
        percentage: results[option] || 0
      }));
      
      setAudiencePollResults(chartData);
      
      toast({
        title: "Vprašaj občinstvo",
        description: "Rezultati občinstva so prikazani v grafu spodaj",
        duration: 5000,
      });
    } else if (type === 'phone_friend') {
      if (!currentQuestion) return;
      
      // Simulate friend's advice - 70% chance they suggest the correct answer
      const correctAnswer = currentQuestion.correct_answer;
      const isCorrectAdvice = Math.random() < 0.7;
      const advice = isCorrectAdvice ? correctAnswer : ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)];
      
      const friendNames = ['Ana', 'Marko', 'Petra', 'Janez', 'Nina', 'Luka'];
      const friendName = friendNames[Math.floor(Math.random() * friendNames.length)];
      
      toast({
        title: "Pokliči prijatelja",
        description: `${friendName} pravi: "Mislim, da je pravilen odgovor ${advice}."`,
        duration: 8000,
      });
    }
  };

  const handleTimeUp = useCallback(() => {
    if (!hasAnswered && timerActive) {
      submitAnswer(''); // Submit empty answer when time runs out
    }
    setTimerActive(false);
  }, [hasAnswered, timerActive]);

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
      {/* Network Status Indicator */}
      {!isOnline && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-destructive text-destructive-foreground px-4 py-2 rounded-md z-50 flex items-center gap-2">
          <WifiOff className="h-4 w-4" />
          <span className="text-sm">Nimate internetne povezave</span>
        </div>
      )}
      {wasOffline && isOnline && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-md z-50 flex items-center gap-2">
          <Wifi className="h-4 w-4" />
          <span className="text-sm">Povezava obnovljena</span>
        </div>
      )}
      
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="w-full max-w-4xl mx-auto flex h-14 items-center justify-between px-2 sm:px-4 overflow-hidden">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">\n
            <h1 className="text-base sm:text-xl font-bold truncate">Koda: {game.game_code}</h1>
            {game.category && (
              <Badge variant="outline" className="text-xs sm:text-sm hidden sm:inline-flex">
                {game.category}
              </Badge>
            )}
            <Badge variant={game.status === 'active' ? 'default' : 'secondary'} className="text-xs sm:text-sm">
              {game.status === 'waiting' ? 'Čaka' : game.status === 'active' ? 'Aktivna' : 'Končana'}
            </Badge>
          </div>
          <div className="flex items-center gap-1 sm:gap-4 min-w-0">
            <Users className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm sm:text-base whitespace-nowrap">{participants.length} igralcev</span>
          </div>
        </div>
      </header>

      <main className="w-full max-w-4xl mx-auto py-4 sm:py-8 px-2 sm:px-4 overflow-hidden">
        <div className="grid gap-4 lg:gap-6 lg:grid-cols-3 w-full">
          {/* Game Area */}
          <div className="lg:col-span-2 space-y-4 lg:space-y-6 min-w-0 max-w-full">
            {game.status === 'waiting' && (
              <Card>
                <CardHeader>
                  <CardTitle>Čakanje na začetek igre</CardTitle>
                  <CardDescription>
                    {game.category && (
                      <span className="block mb-2">Kategorija: <strong>{game.category}</strong></span>
                    )}
                    {participants.length === 1 ? 'Igrate sami. Pripravljeni za izziv?' : 'Čakamo, da se vsi igralci pridružijo igri.'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isHost && (
                    <Button onClick={startGame} disabled={participants.length < 1 || questions.length === 0}>
                      {questions.length === 0 ? 'Nalaganje vprašanj...' : 'Začni igro'}
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
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                      <div>
                        <CardTitle className="flex flex-wrap items-center gap-2 text-base sm:text-lg">
                           <span className="break-words">Vprašanje {game.current_question_number}</span>
                           <Badge variant="outline" className="text-xs sm:text-sm">{currentQuestion.grade_level}. razred</Badge>
                           <Badge variant="secondary" className="text-xs sm:text-sm break-words">{currentQuestion.subject}</Badge>
                        </CardTitle>
                      </div>
                       {timerActive && (
                         <div className="flex items-center gap-2 flex-shrink-0">
                           <Clock className="h-4 w-4 flex-shrink-0" />
                           <span className="font-mono text-base sm:text-lg whitespace-nowrap">{timeLeft}s</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base sm:text-lg mb-4 sm:mb-6 break-words leading-relaxed">{currentQuestion.question_text}</p>
                    
                    <div className="grid grid-cols-1 gap-3 sm:gap-4 max-w-full">
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
                            className="p-3 sm:p-4 h-auto text-left justify-start min-h-[56px] touch-manipulation w-full break-words"
                            onClick={() => !hasAnswered && submitAnswer(option)}
                            disabled={hasAnswered || !timerActive}
                          >
                            <span className="font-bold mr-2 flex-shrink-0">{option})</span>
                            <span className="break-words text-left">{optionText}</span>
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
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Čakamo na ostale igralce...
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Debug: {answers.length}/{participants.length} odgovorov
                              </p>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              Odgovor oddan!
                            </p>
                          )}
                        </div>
                        
                        {/* Show correct answer when everyone has answered OR immediately for single player */}
                        {(() => {
                          const allAnswered = answers.length === participants.length && participants.length > 0;
                          const singlePlayer = participants.length === 1 && hasAnswered;
                          console.log('🎯 Answer display logic:', { 
                            allAnswered, 
                            singlePlayer, 
                            answersLength: answers.length, 
                            participantsLength: participants.length,
                            shouldShow: allAnswered || singlePlayer,
                            answers: answers,
                            participants: participants
                          });
                          return allAnswered || singlePlayer;
                        })() && (
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

                {/* Audience Poll Results Chart */}
                {audiencePollResults && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Rezultati občinstva
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={{
                          percentage: {
                            label: "Glasovi (%)",
                            color: "hsl(var(--chart-1))",
                          },
                        }}
                        className="h-[200px]"
                      >
                        <BarChart data={audiencePollResults}>
                          <XAxis 
                            dataKey="option" 
                            tick={{ fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis 
                            tick={{ fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <ChartTooltip 
                            content={<ChartTooltipContent />}
                            cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                          />
                          <Bar 
                            dataKey="percentage" 
                            fill="var(--color-percentage)"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ChartContainer>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4 w-full"
                        onClick={() => setAudiencePollResults(null)}
                      >
                        Skrij rezultate
                      </Button>
                    </CardContent>
                  </Card>
                )}

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