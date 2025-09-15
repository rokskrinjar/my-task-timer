import { useState } from 'react';
import * as XLSX from 'xlsx';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ExcelQuestion {
  question_text: string;
  grade_level: number;
  subject: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  difficulty_order: number;
  category: string;
}

interface ValidationError {
  row: number;
  errors: string[];
}

export const useExcelImport = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const downloadTemplate = () => {
    const template = [
      {
        question_text: "What is 2 + 2?",
        grade_level: 1,
        subject: "Mathematics",
        option_a: "3",
        option_b: "4",
        option_c: "5",
        option_d: "6",
        correct_answer: "B",
        difficulty_order: 1,
        category: "Osnovna šola"
      }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Questions");
    XLSX.writeFile(wb, "questions_template.xlsx");
  };

  const validateQuestion = (question: any, row: number): ValidationError | null => {
    const errors: string[] = [];

    // Required fields
    if (!question.question_text?.trim()) errors.push("Question text is required");
    if (!question.subject?.trim()) errors.push("Subject is required");
    if (!question.option_a?.trim()) errors.push("Option A is required");
    if (!question.option_b?.trim()) errors.push("Option B is required");
    if (!question.option_c?.trim()) errors.push("Option C is required");
    if (!question.option_d?.trim()) errors.push("Option D is required");
    if (!question.category?.trim()) errors.push("Category is required");

    // Grade level validation
    const gradeLevel = parseInt(question.grade_level);
    if (isNaN(gradeLevel) || gradeLevel < 1 || gradeLevel > 12) {
      errors.push("Grade level must be between 1 and 12");
    }

    // Correct answer validation
    if (!['A', 'B', 'C', 'D'].includes(question.correct_answer?.toUpperCase())) {
      errors.push("Correct answer must be A, B, C, or D");
    }

    // Difficulty validation
    const difficulty = parseInt(question.difficulty_order);
    if (isNaN(difficulty) || difficulty < 1 || difficulty > 5) {
      errors.push("Difficulty order must be between 1 and 5");
    }

    return errors.length > 0 ? { row, errors } : null;
  };

  const processFile = async (file: File): Promise<{ success: boolean; message: string; stats?: any }> => {
    setIsProcessing(true);
    
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) {
        return { success: false, message: "Excel file is empty" };
      }

      // Validate all questions
      const validQuestions: ExcelQuestion[] = [];
      const validationErrors: ValidationError[] = [];

      jsonData.forEach((row: any, index: number) => {
        const validationError = validateQuestion(row, index + 2); // +2 for header row
        
        if (validationError) {
          validationErrors.push(validationError);
        } else {
          validQuestions.push({
            question_text: row.question_text.trim(),
            grade_level: parseInt(row.grade_level),
            subject: row.subject.trim(),
            option_a: row.option_a.trim(),
            option_b: row.option_b.trim(),
            option_c: row.option_c.trim(),
            option_d: row.option_d.trim(),
            correct_answer: row.correct_answer.toUpperCase(),
            difficulty_order: parseInt(row.difficulty_order),
            category: row.category.trim()
          });
        }
      });

      if (validationErrors.length > 0) {
        const errorMessage = validationErrors.map(err => 
          `Row ${err.row}: ${err.errors.join(', ')}`
        ).join('\n');
        
        return { 
          success: false, 
          message: `Validation errors found:\n${errorMessage}` 
        };
      }

      // Check for duplicates
      const existingQuestions = await supabase
        .from('questions')
        .select('question_text')
        .in('question_text', validQuestions.map(q => q.question_text));

      if (existingQuestions.error) throw existingQuestions.error;

      const duplicates = validQuestions.filter(q => 
        existingQuestions.data?.some(existing => existing.question_text === q.question_text)
      );

      if (duplicates.length > 0) {
        return {
          success: false,
          message: `Found ${duplicates.length} duplicate questions that already exist in the database`
        };
      }

      // Insert questions
      const { error } = await supabase
        .from('questions')
        .insert(validQuestions);

      if (error) throw error;

      return {
        success: true,
        message: `Successfully imported ${validQuestions.length} questions`,
        stats: {
          imported: validQuestions.length,
          total: jsonData.length
        }
      };

    } catch (error) {
      console.error('Error processing file:', error);
      return {
        success: false,
        message: `Error processing file: ${(error as Error).message}`
      };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    downloadTemplate,
    processFile,
    isProcessing
  };
};