import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, HelpCircle, Phone, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, LabelList } from 'recharts';

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

interface GameQuestionsProps {
  gameId: string;
  currentQuestion: Question | null;
  onQuestionChange?: (question: Question | null) => void;
  onAnswerSubmitted?: (answer: string) => void;
  isHost: boolean;
  userId?: string;
  isGuest?: boolean;
  guestDisplayName?: string;
}

const GameQuestions = ({ 
  gameId, 
  currentQuestion, 
  onQuestionChange,
  onAnswerSubmitted,
  isHost,
  userId,
  isGuest,
  guestDisplayName
}: GameQuestionsProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [hasAnswered, setHasAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [lifelinesUsed, setLifelinesUsed] = useState<string[]>([]);
  const [showFiftyFifty, setShowFiftyFifty] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState<string[]>([]);
  const [phoneAdvice, setPhoneAdvice] = useState<string>('');
  const [audienceVotes, setAudienceVotes] = useState<{[key: string]: number}>({});
  const { toast } = useToast();

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            setTimerActive(false);
            if (!hasAnswered) {
              handleSubmitAnswer('');
            }
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

  // Reset state when question changes
  useEffect(() => {
    if (currentQuestion) {
      setSelectedAnswer('');
      setHasAnswered(false);
      setTimeLeft(30);
      setTimerActive(true);
      setShowFiftyFifty(false);
      setHiddenOptions([]);
      setLifelinesUsed([]);
      setPhoneAdvice('');
      setAudienceVotes({});
    }
  }, [currentQuestion?.id]);

  const handleSubmitAnswer = async (answer: string) => {
    if (!currentQuestion || hasAnswered) return;
    
    const isCorrect = answer === currentQuestion.correct_answer;
    
    const answerData = {
      game_id: gameId,
      user_id: userId || null,
      display_name: isGuest ? guestDisplayName : null,
      question_id: currentQuestion.id,
      user_answer: answer,
      is_correct: isCorrect,
      lifeline_used: null
    };
    
    const { error } = await supabase
      .from('game_answers')
      .insert(answerData);

    if (error) {
      console.error('Error submitting answer:', error);
      toast({
        title: "Napaka",
        description: "Napaka pri oddaji odgovora",
        variant: "destructive",
      });
      return;
    }
    
    setHasAnswered(true);
    setSelectedAnswer(answer);
    setTimerActive(false);
    onAnswerSubmitted?.(answer);
  };

  const useLifeline = async (type: string) => {
    if (lifelinesUsed.includes(type) || !currentQuestion) return;
    
    setLifelinesUsed([...lifelinesUsed, type]);
    
    if (type === 'fifty_fifty') {
      setShowFiftyFifty(true);
      const options = ['A', 'B', 'C', 'D'];
      const correctOption = currentQuestion.correct_answer;
      const wrongOptions = options.filter(opt => opt !== correctOption);
      const optionsToHide = wrongOptions.slice(0, 2);
      setHiddenOptions(optionsToHide);
    } else if (type === 'phone_friend') {
      // Phone a friend: gives advice with 70% chance of being correct
      const options = ['A', 'B', 'C', 'D'];
      const correctOption = currentQuestion.correct_answer;
      const isCorrectAdvice = Math.random() < 0.7;
      const advisedOption = isCorrectAdvice ? correctOption : options[Math.floor(Math.random() * options.length)];
      setPhoneAdvice(`Prijatelj svetuje: ${advisedOption}`);
    } else if (type === 'ask_audience') {
      // Ask audience: generates percentage votes with bias toward correct answer
      const options = ['A', 'B', 'C', 'D'];
      const correctOption = currentQuestion.correct_answer;
      const votes: {[key: string]: number} = {};
      
      // Generate biased votes (correct answer gets 40-60%, others split the rest)
      const correctVote = 40 + Math.random() * 20; // 40-60%
      const remainingVote = 100 - correctVote;
      
      votes[correctOption] = Math.round(correctVote);
      
      // Distribute remaining votes among other options
      const otherOptions = options.filter(opt => opt !== correctOption);
      let remaining = remainingVote;
      
      otherOptions.forEach((option, index) => {
        if (index === otherOptions.length - 1) {
          votes[option] = Math.round(remaining);
        } else {
          const vote = Math.random() * (remaining / (otherOptions.length - index));
          votes[option] = Math.round(vote);
          remaining -= vote;
        }
      });
      
      setAudienceVotes(votes);
    }
    
    // Record lifeline usage
    const lifeline_data = {
      game_id: gameId,
      user_id: userId || null,
      display_name: isGuest ? guestDisplayName : null,
      question_id: currentQuestion.id,
      user_answer: '',
      is_correct: false,
      lifeline_used: type
    };
    
    await supabase
      .from('game_answers')
      .insert(lifeline_data);
  };

  if (!currentQuestion) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            Čakanje na vprašanje...
          </div>
        </CardContent>
      </Card>
    );
  }

  const options = [
    { key: 'A', text: currentQuestion.option_a },
    { key: 'B', text: currentQuestion.option_b },
    { key: 'C', text: currentQuestion.option_c },
    { key: 'D', text: currentQuestion.option_d },
  ];

  return (
    <div className="space-y-4">
      {/* Timer and Lifelines */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="font-medium">{timeLeft}s</span>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => useLifeline('fifty_fifty')}
                disabled={lifelinesUsed.includes('fifty_fifty') || hasAnswered}
              >
                <Target className="h-4 w-4" />
                50:50
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => useLifeline('phone_friend')}
                disabled={lifelinesUsed.includes('phone_friend') || hasAnswered}
              >
                <Phone className="h-4 w-4" />
                Pokliči
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => useLifeline('ask_audience')}
                disabled={lifelinesUsed.includes('ask_audience') || hasAnswered}
              >
                <HelpCircle className="h-4 w-4" />
                Občinstvo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {currentQuestion.question_text}
          </CardTitle>
          <CardDescription>
            <Badge variant="secondary">
              {currentQuestion.subject} - {currentQuestion.grade_level}. razred
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Show lifeline results */}
          {phoneAdvice && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-800">{phoneAdvice}</p>
            </div>
          )}
          
          {Object.keys(audienceVotes).length > 0 && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-sm font-medium text-purple-800 mb-3">Glasovanje občinstva:</p>
              <div className="h-32 mb-3">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    layout="horizontal"
                    data={Object.entries(audienceVotes).map(([option, percentage]) => ({
                      option: option,
                      percentage: percentage,
                      isCorrect: option === currentQuestion.correct_answer
                    }))}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis 
                      type="number"
                      domain={[0, 100]}
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={true}
                    />
                    <YAxis 
                      type="category"
                      dataKey="option" 
                      tick={{ fontSize: 14, fontWeight: 'bold' }}
                      tickLine={false}
                      axisLine={true}
                      width={30}
                    />
                    <Bar dataKey="percentage" radius={[0, 4, 4, 0]} height={20}>
                      <LabelList 
                        dataKey="percentage" 
                        position="right" 
                        fill="#374151" 
                        fontSize={12}
                        fontWeight="bold"
                        formatter={(value: number) => `${value}%`}
                      />
                      {Object.entries(audienceVotes).map(([option], index) => (
                        <Cell 
                          key={index} 
                          fill={option === currentQuestion.correct_answer ? "#16a34a" : "#8b5cf6"} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {options.map((option) => {
            const isHidden = hiddenOptions.includes(option.key);
            const isSelected = selectedAnswer === option.key;
            const isCorrect = hasAnswered && option.key === currentQuestion.correct_answer;
            const isWrong = hasAnswered && isSelected && option.key !== currentQuestion.correct_answer;
            
            if (isHidden) return null;
            
            return (
              <Button
                key={option.key}
                variant={isCorrect ? "default" : isWrong ? "destructive" : isSelected ? "secondary" : "outline"}
                className={`w-full justify-start h-auto p-4 text-left ${
                  isCorrect ? "bg-green-600 hover:bg-green-700 text-white border-green-600" : 
                  isWrong ? "bg-red-600 hover:bg-red-700 text-white border-red-600" : ""
                }`}
                onClick={() => {
                  if (!hasAnswered) {
                    handleSubmitAnswer(option.key);
                  }
                }}
                disabled={hasAnswered}
              >
                <span className="font-medium mr-2">{option.key}.</span>
                {option.text}
              </Button>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default GameQuestions;