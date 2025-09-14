import React, { useEffect } from 'react';
import { AdminRoute } from '@/components/AdminRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

const questionSchema = z.object({
  question_text: z.string().min(10, 'Question must be at least 10 characters'),
  subject: z.string().min(1, 'Subject is required'),
  grade_level: z.number().min(1).max(12),
  difficulty_order: z.number().min(1).max(10),
  option_a: z.string().min(1, 'Option A is required'),
  option_b: z.string().min(1, 'Option B is required'),
  option_c: z.string().min(1, 'Option C is required'),
  option_d: z.string().min(1, 'Option D is required'),
  correct_answer: z.enum(['A', 'B', 'C', 'D']),
  category: z.string().default('Osnovna šola'),
});

type QuestionForm = z.infer<typeof questionSchema>;

const EditQuestion = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();
  
  const { data: question, isLoading } = useQuery({
    queryKey: ['question', id],
    queryFn: async () => {
      if (!id) throw new Error('Question ID is required');
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<QuestionForm>({
    resolver: zodResolver(questionSchema),
  });

  useEffect(() => {
    if (question) {
      reset({
        question_text: question.question_text,
        subject: question.subject,
        grade_level: question.grade_level,
        difficulty_order: question.difficulty_order,
        option_a: question.option_a,
        option_b: question.option_b,
        option_c: question.option_c,
        option_d: question.option_d,
        correct_answer: question.correct_answer as 'A' | 'B' | 'C' | 'D',
        category: question.category,
      });
    }
  }, [question, reset]);

  const onSubmit = async (data: QuestionForm) => {
    try {
      if (!id) throw new Error('Question ID is required');
      
      const { error } = await supabase
        .from('questions')
        .update({
          question_text: data.question_text,
          subject: data.subject,
          grade_level: data.grade_level,
          option_a: data.option_a,
          option_b: data.option_b,
          option_c: data.option_c,
          option_d: data.option_d,
          correct_answer: data.correct_answer,
          difficulty_order: data.difficulty_order,
          category: data.category
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Question updated successfully!"
      });
      navigate('/admin/questions');
    } catch (error) {
      console.error('Error updating question:', error);
      toast({
        title: "Error",
        description: "Failed to update question: " + (error as Error).message,
        variant: "destructive"
      });
    }
  };

  const subjects = [
    'Matematika',
    'Slovenščina',
    'Angleščina',
    'Naravoslovje',
    'Družboslovje',
    'Zgodovina',
    'Geografija',
    'Biologija',
    'Kemija',
    'Fizika',
    'Likovna umetnost',
    'Glasbena umetnost',
    'Šport',
  ];

  if (isLoading) {
    return (
      <AdminRoute>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading question...</p>
          </div>
        </div>
      </AdminRoute>
    );
  }

  if (!question) {
    return (
      <AdminRoute>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Question Not Found</h1>
            <p className="text-muted-foreground">The question you're looking for doesn't exist.</p>
            <Link to="/admin/questions">
              <Button className="mt-4">Back to Questions</Button>
            </Link>
          </div>
        </div>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to="/admin/questions">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Questions
                  </Button>
                </Link>
                <h1 className="text-2xl font-bold text-foreground">Edit Question</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-4xl">
            <CardHeader>
              <CardTitle>Edit Question</CardTitle>
              <CardDescription>Update the question details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select value={question.subject} onValueChange={(value) => setValue('subject', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map(subject => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.subject && <p className="text-sm text-destructive">{errors.subject.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="grade_level">Grade Level</Label>
                    <Select value={question.grade_level.toString()} onValueChange={(value) => setValue('grade_level', parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(grade => (
                          <SelectItem key={grade} value={grade.toString()}>
                            Grade {grade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.grade_level && <p className="text-sm text-destructive">{errors.grade_level.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="difficulty_order">Difficulty (1-10)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      {...register('difficulty_order', { valueAsNumber: true })}
                    />
                    {errors.difficulty_order && <p className="text-sm text-destructive">{errors.difficulty_order.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="correct_answer">Correct Answer</Label>
                    <Select value={question.correct_answer} onValueChange={(value) => setValue('correct_answer', value as 'A' | 'B' | 'C' | 'D')}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select correct answer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="C">C</SelectItem>
                        <SelectItem value="D">D</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.correct_answer && <p className="text-sm text-destructive">{errors.correct_answer.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="question_text">Question Text</Label>
                  <Textarea
                    {...register('question_text')}
                    placeholder="Enter the question text..."
                    rows={3}
                  />
                  {errors.question_text && <p className="text-sm text-destructive">{errors.question_text.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="option_a">Option A</Label>
                    <Input {...register('option_a')} placeholder="Option A" />
                    {errors.option_a && <p className="text-sm text-destructive">{errors.option_a.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="option_b">Option B</Label>
                    <Input {...register('option_b')} placeholder="Option B" />
                    {errors.option_b && <p className="text-sm text-destructive">{errors.option_b.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="option_c">Option C</Label>
                    <Input {...register('option_c')} placeholder="Option C" />
                    {errors.option_c && <p className="text-sm text-destructive">{errors.option_c.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="option_d">Option D</Label>
                    <Input {...register('option_d')} placeholder="Option D" />
                    {errors.option_d && <p className="text-sm text-destructive">{errors.option_d.message}</p>}
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <Button type="submit" disabled={isSubmitting}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmitting ? 'Updating...' : 'Update Question'}
                  </Button>
                  <Link to="/admin/questions">
                    <Button variant="outline">Cancel</Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </AdminRoute>
  );
};

export default EditQuestion;