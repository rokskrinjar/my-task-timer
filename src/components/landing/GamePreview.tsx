import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle } from 'lucide-react';

export const GamePreview = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const sampleQuestions = [
    {
      grade: "1. razred",
      subject: "Matematika",
      question: "Koliko je 2 + 3?",
      answers: ["4", "5", "6", "7"],
      correct: 1
    },
    {
      grade: "6. razred",
      subject: "Zgodovina",
      question: "Kdaj se je začela prva svetovna vojna?",
      answers: ["1912", "1914", "1916", "1918"],
      correct: 1
    },
    {
      grade: "12. razred",
      subject: "Fizika",
      question: "Kakšna je hitrost svetlobe v vakuumu?",
      answers: ["300.000 km/s", "150.000 km/s", "450.000 km/s", "600.000 km/s"],
      correct: 0
    }
  ];

  const question = sampleQuestions[currentQuestion];

  useEffect(() => {
    if (isAnswered) {
      const timer = setTimeout(() => {
        setCurrentQuestion((prev) => (prev + 1) % sampleQuestions.length);
        setSelectedAnswer(null);
        setIsAnswered(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAnswered]);

  const handleAnswer = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setIsAnswered(true);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-muted/20 to-background">
      <div className="container px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Kako izgleda igra?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Preizkusite vzorčno vprašanje iz različnih razredov in predmetov
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {/* Progress indicator */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                {question.grade}
              </span>
              <span>•</span>
              <span className="bg-secondary/10 text-secondary-foreground px-2 py-1 rounded-full font-medium">
                {question.subject}
              </span>
            </div>
            <Progress value={(currentQuestion + 1) * 33.33} className="h-2" />
          </div>

          {/* Question card */}
          <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-8 space-y-6">
              <h3 className="text-2xl font-bold text-center text-foreground leading-relaxed">
                {question.question}
              </h3>
              
              <div className="grid gap-3">
                {question.answers.map((answer, index) => {
                  const isCorrect = index === question.correct;
                  const isSelected = selectedAnswer === index;
                  
                  let buttonVariant: "outline" | "destructive" | "default" = "outline";
                  let buttonClass = "h-auto p-4 text-left justify-start transition-all duration-300";
                  
                  if (isAnswered) {
                    if (isCorrect) {
                      buttonClass += " bg-green-50 border-green-200 text-green-700 hover:bg-green-50";
                    } else if (isSelected && !isCorrect) {
                      buttonClass += " bg-red-50 border-red-200 text-red-700 hover:bg-red-50";
                    }
                  } else if (isSelected) {
                    buttonVariant = "default";
                  }

                  return (
                    <Button
                      key={index}
                      variant={buttonVariant}
                      className={buttonClass}
                      onClick={() => handleAnswer(index)}
                      disabled={isAnswered}
                    >
                      <span className="flex items-center gap-3 w-full">
                        <span className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm font-medium">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="flex-1">{answer}</span>
                        {isAnswered && isCorrect && <CheckCircle className="h-5 w-5 text-green-600" />}
                        {isAnswered && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-600" />}
                      </span>
                    </Button>
                  );
                })}
              </div>
              
              {isAnswered && (
                <div className="text-center text-sm text-muted-foreground animate-fade-in">
                  {selectedAnswer === question.correct ? (
                    <span className="text-green-600 font-medium">🎉 Pravilno! Greste naprej...</span>
                  ) : (
                    <span className="text-red-600 font-medium">❌ Napaka! Igra se konča...</span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              To je le okus igre - pravi kviz ima več kot 500 vprašanj iz vseh predmetov!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};