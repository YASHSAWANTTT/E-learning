import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Clock, Award, Info, AlertCircle } from "lucide-react";
import { UserButton } from "@/components/auth/user-button";
import { StartQuizButton } from "@/components/quiz/start-quiz-button";
import prisma from "@/lib/prisma";
import type { QuizAttempt } from "@prisma/client";

export default async function QuizDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const quizId = params.id;

  // Fetch quiz details
  const quiz = await prisma.quiz.findFirst({
    where: { id: quizId }
  });

  if (!quiz) {
    redirect("/quizzes");
  }

  // Fetch course details
  const course = await prisma.course.findFirst({
    where: { id: quiz.courseId }
  });

  // Check if user has attempted this quiz before
  let previousAttempts: QuizAttempt[] = [];
  if (session) {
    previousAttempts = await prisma.quizAttempt.findMany({
      where: {
        userId: session.user.id,
        quizId
      },
      orderBy: {
        startedAt: 'desc'
      }
    });
  }

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
        {/* Quiz Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold">{quiz.title}</h1>
              <p className="text-muted-foreground">{quiz.description}</p>
              {course && (
                <p className="text-sm mt-2">
                  Course: <Link href={`/courses/${course.id}`} className="text-primary hover:underline">{course.title}</Link>
                </p>
              )}
            </div>
            {session ? (
              <StartQuizButton quizId={quizId} />
            ) : (
              <Link href="/login">
                <Button>Login to Take Quiz</Button>
              </Link>
            )}
          </div>
        </div>

        {/* Quiz Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Time Limit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{quiz.timeLimit} minutes</p>
              <p className="text-sm text-muted-foreground">
                You must complete the quiz within this time limit
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Passing Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{quiz.passingScore}%</p>
              <p className="text-sm text-muted-foreground">
                You need to score at least this percentage to pass
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="h-5 w-5 mr-2" />
                Attempts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{previousAttempts.length}</p>
              <p className="text-sm text-muted-foreground">
                You have taken this quiz {previousAttempts.length} times
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quiz Instructions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quiz Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 text-primary mt-0.5" />
              <p>Read each question carefully before selecting your answer.</p>
            </div>
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 text-primary mt-0.5" />
              <p>Once you submit an answer, you cannot change it.</p>
            </div>
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 text-primary mt-0.5" />
              <p>The quiz will automatically submit when the time limit is reached.</p>
            </div>
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 text-primary mt-0.5" />
              <p>You will receive your score immediately after completing the quiz.</p>
            </div>
          </CardContent>
        </Card>

        {/* Previous Attempts */}
        {previousAttempts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Previous Attempts</h2>
            <Card>
              <CardContent className="py-4">
                <div className="space-y-4">
                  {previousAttempts.map((attempt) => (
                    <div key={attempt.id} className="flex justify-between items-center p-3 bg-muted rounded-md">
                      <div>
                        <p className="font-medium">Attempt on {new Date(attempt.startedAt).toLocaleDateString()}</p>
                        <p className="text-sm text-muted-foreground">
                          {attempt.completedAt ? 'Completed' : 'In progress'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{attempt.score ? `${attempt.score}%` : 'N/A'}</p>
                        <p className="text-sm text-muted-foreground">
                          {attempt.score && attempt.score >= (quiz.passingScore || 70) ? 'Passed' : 'Failed'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-muted py-8 px-6">
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