'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as XLSX from 'xlsx';

interface Question {
  text: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'ESSAY';
  points: number;
  options?: {
    text: string;
    isCorrect: boolean;
  }[];
}

export function ExcelQuizUploader() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answerKey, setAnswerKey] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const validateQuestionData = (data: any[]) => {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('No questions found in the file');
    }

    data.forEach((row, index) => {
      if (!row.Questions && !row.Question) {
        throw new Error(`Missing question text in row ${index + 1}`);
      }
      if (row.Type && !['MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER', 'ESSAY'].includes(row.Type.toUpperCase())) {
        throw new Error(`Invalid question type "${row.Type}" in row ${index + 1}`);
      }
      if (row.Points && isNaN(parseInt(row.Points))) {
        throw new Error(`Invalid points value in row ${index + 1}`);
      }
    });
  };

  const handleQuestionsFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setError(null);
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      validateQuestionData(jsonData);

      const formattedQuestions: Question[] = jsonData.map((row: any) => ({
        text: row.Questions || row.Question,
        type: row.Type?.toUpperCase() || 'SHORT_ANSWER',
        points: parseInt(row.Points) || 1,
        options: row.Options ? row.Options.split(';').map((opt: string) => ({
          text: opt.trim(),
          isCorrect: false // Will be updated from answer key
        })) : undefined
      }));

      setQuestions(formattedQuestions);
    } catch (err: any) {
      setError(err.message || 'Error processing questions file');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerKeyFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setError(null);
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (!Array.isArray(jsonData) || jsonData.length === 0) {
        throw new Error('No answers found in the file');
      }

      const answers: Record<string, string> = {};
      jsonData.forEach((row: any, index) => {
        if (!row.QuestionNumber || !row.CorrectAnswer) {
          throw new Error(`Missing required fields in row ${index + 1}`);
        }
        answers[row.QuestionNumber] = row.CorrectAnswer;
      });

      setAnswerKey(answers);

      // Update questions with correct answers
      if (questions.length > 0) {
        const updatedQuestions = questions.map((q, idx) => {
          if (q.options) {
            const correctAnswer = answers[idx + 1];
            return {
              ...q,
              options: q.options.map(opt => ({
                ...opt,
                isCorrect: opt.text.trim() === correctAnswer?.trim()
              }))
            };
          }
          return q;
        });
        setQuestions(updatedQuestions);
      }
    } catch (err: any) {
      setError(err.message || 'Error processing answer key file');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = async () => {
    if (!title.trim()) {
      setError('Quiz title is required');
      return;
    }

    if (questions.length === 0) {
      setError('No questions have been imported');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/quizzes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || 'Quiz imported from Excel files',
          timeLimit: 60,
          passingScore: 70,
          questions
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create quiz');
      }

      const data = await response.json();
      window.location.href = `/admin/quizzes/${data.id}/questions`;
    } catch (err: any) {
      setError(err.message || 'Error creating quiz');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Import Quiz from Excel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Quiz Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter quiz title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Quiz Description (Optional)</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter quiz description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="questions">Questions File</Label>
            <Input
              id="questions"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleQuestionsFile}
              disabled={loading}
            />
            <p className="text-sm text-muted-foreground">
              Excel file should have columns: Questions, Type, Points, Options (optional, semicolon-separated)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="answers">Answer Key File</Label>
            <Input
              id="answers"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleAnswerKeyFile}
              disabled={loading}
            />
            <p className="text-sm text-muted-foreground">
              Excel file should have columns: QuestionNumber, CorrectAnswer
            </p>
          </div>

          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          {questions.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Imported Questions: {questions.length}</h3>
              <Button
                onClick={handleCreateQuiz}
                disabled={loading || questions.length === 0 || !title.trim()}
              >
                {loading ? 'Creating Quiz...' : 'Create Quiz'}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 