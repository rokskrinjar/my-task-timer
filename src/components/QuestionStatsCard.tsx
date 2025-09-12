import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Users, TrendingUp } from 'lucide-react';

interface QuestionStatsCardProps {
  totalQuestions: number;
  questionsRemaining: number;
  currentQuestionNumber: number;
}

const QuestionStatsCard = ({ 
  totalQuestions, 
  questionsRemaining, 
  currentQuestionNumber 
}: QuestionStatsCardProps) => {
  const progress = totalQuestions > 0 ? (currentQuestionNumber / totalQuestions) * 100 : 0;
  
  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart className="h-5 w-5" />
          Napredek igre
        </CardTitle>
        <CardDescription>
          Inteligentno izbiranje vprašanj za boljšo izkušnjo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Vprašanje {currentQuestionNumber} od {totalQuestions}
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-xs text-muted-foreground">
            Vprašanja so izbrana pametno za zmanjšanje ponavljanja
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionStatsCard;