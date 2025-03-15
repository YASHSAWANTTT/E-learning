import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, CheckCircle, XCircle, Award, ArrowRight } from "lucide-react";
import { UserButton } from "@/components/auth/user-button";
import prisma from "@/lib/prisma";

export default async function QuizResultsPage({ 
  params 
}: { 
  params: { id: string; attemptId: string } 
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const quizId = params.id;
  const attemptId = params.attemptId;

  // Fetch quiz attempt
  const attempt = await prisma.quizAttempt.findFirst({
    where: {
      id: attemptId,
      userId: session.user.id,
      quizId,
    },
    include: {
      quiz: true,
      answers: {
        include: {
          question: {
            include: {
              options: true
            }
          }
        }
      }
    }
  });

  if (!attempt) {
    redirect("/dashboard");
  }

  // Check if the quiz was passed
  const isPassed = attempt.score !== null && attempt.quiz.passingScore !== null 
    ? attempt.score >= attempt.quiz.passingScore 
    : false;

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
          <nav className="hidden md:flex space-x-4">
            <Link href="/courses" className="hover:underline">Courses</Link>
            <Link href="/quizzes" className="hover:underline">Quizzes</Link>
            <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          </nav>
          <UserButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Quiz Results</h1>
          <p className="text-muted-foreground">{attempt.quiz.title}</p>
        </div>

        {/* Score Card */}
        <Card className="mb-8">
          <CardHeader className={`${isPassed ? 'bg-green-100' : 'bg-red-100'} rounded-t-lg`}>
            <CardTitle className="flex items-center justify-center text-2xl">
              {isPassed ? (
                <CheckCircle className="h-8 w-8 text-green-600 mr-2" />
              ) : (
                <XCircle className="h-8 w-8 text-red-600 mr-2" />
              )}
              {attempt.score !== null ? `${attempt.score}%` : 'Not Scored'}
            </CardTitle>
          </CardHeader>
          <CardContent className="py-6">
            <div className="text-center mb-4">
              <p className="text-lg font-medium">
                {isPassed ? 'Congratulations! You passed the quiz.' : 'You did not pass the quiz.'}
              </p>
              <p className="text-muted-foreground">
                Passing score: {attempt.quiz.passingScore}%
              </p>
            </div>
            
            <div className="flex justify-center space-x-4 mt-6">
              <Link href={`/quizzes/${quizId}`}>
                <Button variant="outline">
                  Take Again
                </Button>
              </Link>
              <Link href={`/courses/${attempt.quiz.courseId}`}>
                <Button>
                  Back to Course
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Answer Review */}
        <h2 className="text-2xl font-bold mb-4">Answer Review</h2>
        <div className="space-y-6">
          {attempt.answers.map((answer, index) => {
            const question = answer.question;
            const isCorrect = question.type === "MULTIPLE_CHOICE" || question.type === "TRUE_FALSE"
              ? question.options.find(o => o.id === answer.selectedOptionId)?.isCorrect
              : null;
            
            return (
              <Card key={answer.id} className={`border-l-4 ${
                isCorrect === true ? 'border-l-green-500' : 
                isCorrect === false ? 'border-l-red-500' : 
                'border-l-yellow-500'
              }`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-start">
                    <span className="bg-muted rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                      {index + 1}
                    </span>
                    {question.text}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(question.type === "MULTIPLE_CHOICE" || question.type === "TRUE_FALSE") && (
                    <div className="space-y-2">
                      {question.options.map((option) => {
                        const isSelected = option.id === answer.selectedOptionId;
                        return (
                          <div 
                            key={option.id} 
                            className={`p-2 rounded-md flex items-center ${
                              isSelected && option.isCorrect ? 'bg-green-100' :
                              isSelected && !option.isCorrect ? 'bg-red-100' :
                              !isSelected && option.isCorrect ? 'bg-green-50' :
                              'bg-muted/30'
                            }`}
                          >
                            {isSelected ? (
                              option.isCorrect ? (
                                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600 mr-2" />
                              )
                            ) : option.isCorrect ? (
                              <CheckCircle className="h-4 w-4 text-green-600 mr-2 opacity-50" />
                            ) : (
                              <div className="w-4 h-4 mr-2" />
                            )}
                            <span className={isSelected ? 'font-medium' : ''}>
                              {option.text}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {(question.type === "SHORT_ANSWER" || question.type === "ESSAY") && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Your answer:</p>
                      <div className="p-3 bg-muted rounded-md">
                        {answer.text || <em className="text-muted-foreground">No answer provided</em>}
                      </div>
                      <p className="text-sm text-yellow-600 mt-2">
                        This answer requires manual grading.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted py-8 px-6 mt-8">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <GraduationCap className="h-6 w-6" />
              <span className="font-bold">Strat-Ops</span>
            </div>
            <div className="flex space-x-6">
              <Link href="/about" className="hover:underline">About</Link>
              <Link href="/contact" className="hover:underline">Contact</Link>
              <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
              <Link href="/terms" className="hover:underline">Terms of Service</Link>
            </div>
          </div>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Strat-Ops. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}