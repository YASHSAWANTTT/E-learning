'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export function GradingInterface() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [responsePrompt, setResponsePrompt] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/grade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          answer,
          responsePrompt,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setFeedback(data.feedback);
      } else {
        setFeedback(`Error: ${data.error}`);
      }
    } catch (error) {
      setFeedback('Failed to grade response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>AI Grading Assistant</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Textarea
              id="question"
              placeholder="Enter the question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="answer">Student's Answer</Label>
            <Textarea
              id="answer"
              placeholder="Enter the student's answer..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsePrompt">Expected Key Points</Label>
            <Textarea
              id="responsePrompt"
              placeholder="Enter the expected key points..."
              value={responsePrompt}
              onChange={(e) => setResponsePrompt(e.target.value)}
              required
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? 'Grading...' : 'Grade Response'}
          </Button>

          {feedback && (
            <div className="mt-4 p-4 bg-secondary rounded-lg">
              <h3 className="font-semibold mb-2">Feedback:</h3>
              <div className="whitespace-pre-wrap">{feedback}</div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
} 