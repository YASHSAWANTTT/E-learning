"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { GraduationCap, Clock, AlertCircle, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { UserButton } from "@/components/auth/user-button";

interface Question {
  id: string;
  text: string;
  type: string;
  points: number;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
}

interface Answer {
  questionId: string;
  selectedOptionId?: string;
  text?: string;
}

export default function TakeQuizPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();
  const params = useParams();
  const quizId = params.id as string;
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        console.log(`Fetching quiz data for quiz ${quizId}`);
        
        // Fetch quiz details
        const quizResponse = await fetch(`/api/quizzes/${quizId}`);
        if (!quizResponse.ok) {
          console.error(`Failed to fetch quiz: ${quizResponse.status} ${quizResponse.statusText}`);
          throw new Error("Failed to fetch quiz");
        }
        const quizData = await quizResponse.json();
        console.log(`Quiz data:`, quizData);
        setQuiz(quizData);
        
        // Set time limit
        if (quizData.timeLimit) {
          setTimeLeft(quizData.timeLimit * 60); // Convert minutes to seconds
        }

        // Fetch questions
        const questionsResponse = await fetch(`/api/quizzes/${quizId}/questions`);
        if (!questionsResponse.ok) {
          console.error(`Failed to fetch questions: ${questionsResponse.status} ${questionsResponse.statusText}`);
          throw new Error("Failed to fetch questions");
        }
        const questionsData = await questionsResponse.json();
        console.log(`Questions data:`, questionsData);
        setQuestions(questionsData);
        
        // Initialize answers array
        const initialAnswers = questionsData.map((question: Question) => ({
          questionId: question.id,
          selectedOptionId: undefined,
          text: undefined,
        }));
        setAnswers(initialAnswers);

        // Create quiz attempt
        if (session) {
          console.log(`Creating quiz attempt for user ${session.user.id}`);
          const attemptResponse = await fetch(`/api/quizzes/${quizId}/attempt`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            }
          });
          
          if (!attemptResponse.ok) {
            console.error(`Failed to create attempt: ${attemptResponse.status} ${attemptResponse.statusText}`);
            const errorData = await attemptResponse.text();
            console.error(`Error response:`, errorData);
            throw new Error("Failed to create quiz attempt");
          }
          
          const attemptData = await attemptResponse.json();
          console.log(`Attempt created:`, attemptData);
          setAttemptId(attemptData.attemptId);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
        setError("Failed to load quiz");
        setIsLoading(false);
      }
    };

    if (session) {
      fetchQuizData();
    } else if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=/quizzes/${quizId}/take`);
    }
  }, [quizId, session, status, router]);

  // Timer effect
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || isLoading) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev !== null && prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev !== null ? prev - 1 : null;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isLoading]);

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "--:--";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleAnswerChange = (questionId: string, value: string, type: string) => {
    setAnswers((prev) => 
      prev.map((answer) => 
        answer.questionId === questionId
          ? type === "MULTIPLE_CHOICE" || type === "TRUE_FALSE"
            ? { ...answer, selectedOptionId: value }
            : { ...answer, text: value }
          : answer
      )
    );
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!attemptId) {
      console.error("No attempt ID available");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log(`Submitting quiz ${quizId} attempt ${attemptId}`);
      console.log(`Answers:`, answers);
      
      const response = await fetch(`/api/quizzes/${quizId}/attempt/${attemptId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers }),
      });
      
      if (!response.ok) {
        console.error(`Failed to submit quiz: ${response.status} ${response.statusText}`);
        const errorText = await response.text();
        console.error(`Error response:`, errorText);
        throw new Error("Failed to submit quiz");
      }
      
      const data = await response.json();
      console.log(`Submission successful:`, data);
      
      router.push(`/quizzes/${quizId}/results/${attemptId}`);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      setError("Failed to submit quiz");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading Quiz...</h2>
          <p className="text-muted-foreground">Please wait while we prepare your quiz</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Quiz</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Link href="/quizzes">
            <Button>Back to Quizzes</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-6 w-6" />
            <Link href="/">
              <h1 className="text-xl font-bold">Strat-Ops</h1>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {timeLeft !== null && (
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span className="font-mono">{formatTime(timeLeft)}</span>
              </div>
            )}
            <UserButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{quiz?.title}</h1>
          <div className="flex justify-between items-center mt-2">
            <p className="text-muted-foreground">Question {currentQuestionIndex + 1} of {questions.length}</p>
            <p className="text-sm font-medium">{progress.toFixed(0)}% Complete</p>
          </div>
          <Progress value={progress} className="mt-2" />
        </div>

        {currentQuestion && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">
                {currentQuestion.text}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(currentQuestion.type === "MULTIPLE_CHOICE" || currentQuestion.type === "TRUE_FALSE") && (
                <RadioGroup
                  value={answers[currentQuestionIndex]?.selectedOptionId || ""}
                  onValueChange={(value) => handleAnswerChange(currentQuestion.id, value, currentQuestion.type)}
                  className="space-y-3"
                >
                  {currentQuestion.options.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted">
                      <RadioGroupItem value={option.id} id={option.id} />
                      <Label htmlFor={option.id} className="flex-grow cursor-pointer">
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {(currentQuestion.type === "SHORT_ANSWER" || currentQuestion.type === "ESSAY") && (
                <Textarea
                  placeholder={currentQuestion.type === "SHORT_ANSWER" ? "Enter your answer..." : "Write your essay..."}
                  value={answers[currentQuestionIndex]?.text || ""}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value, currentQuestion.type)}
                  className={currentQuestion.type === "ESSAY" ? "min-h-32" : ""}
                />
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              {currentQuestionIndex < questions.length - 1 ? (
                <Button onClick={handleNextQuestion}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmitQuiz}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Submitting..." : "Submit Quiz"}
                </Button>
              )}
            </CardFooter>
          </Card>
        )}

        <div className="flex flex-wrap gap-2 justify-center">
          {questions.map((_, index) => (
            <Button
              key={index}
              variant={index === currentQuestionIndex ? "default" : answers[index]?.selectedOptionId || answers[index]?.text ? "outline" : "ghost"}
              size="sm"
              className={`w-10 h-10 ${index === currentQuestionIndex ? "" : answers[index]?.selectedOptionId || answers[index]?.text ? "border-green-500" : "border-muted-foreground"}`}
              onClick={() => setCurrentQuestionIndex(index)}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </main>
    </div>
  );
}