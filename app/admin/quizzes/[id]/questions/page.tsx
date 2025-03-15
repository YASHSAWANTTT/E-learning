import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Plus, FileText, CheckCircle, XCircle } from "lucide-react";
import { UserButton } from "@/components/auth/user-button";
import prisma from "@/lib/prisma";

export default async function QuizQuestionsPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const quizId = params.id;

  // Fetch quiz details
  const quiz = await prisma.quiz.findFirst({
    where: { id: quizId }
  });

  if (!quiz) {
    redirect("/admin/quizzes");
  }

  // Fetch questions for this quiz
  const questions = await prisma.question.findMany({
    where: { quizId },
    include: {
      options: true
    }
  });

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
            <Link href="/admin" className="hover:underline font-bold">Admin</Link>
            <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          </nav>
          <UserButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Questions for {quiz.title}</h1>
            <p className="text-muted-foreground">Manage questions for this quiz</p>
          </div>
          <div className="flex space-x-2">
            <Link href="/admin/quizzes">
              <Button variant="outline">Back to Quizzes</Button>
            </Link>
            <Link href={`/admin/quizzes/${quizId}/questions/new`}>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </Link>
          </div>
        </div>

        {questions.length > 0 ? (
          <div className="space-y-6">
            {questions.map((question, index) => (
              <Card key={question.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Question {index + 1}: {question.text}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground mb-2">
                      Type: {question.type} | Points: {question.points}
                    </p>
                    
                    {question.options.length > 0 && (
                      <div className="space-y-2 pl-4">
                        {question.options.map((option) => (
                          <div key={option.id} className="flex items-center">
                            {option.isCorrect ? (
                              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                            )}
                            <span>{option.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 flex justify-end space-x-2">
                    <Link href={`/admin/quizzes/${quizId}/questions/${question.id}/edit`}>
                      <Button variant="outline" size="sm">Edit</Button>
                    </Link>
                    <Link href={`/admin/quizzes/${quizId}/questions/${question.id}/delete`}>
                      <Button variant="destructive" size="sm">Delete</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <p className="text-muted-foreground mb-4">No questions found for this quiz</p>
              <Link href={`/admin/quizzes/${quizId}/questions/new`}>
                <Button>Add First Question</Button>
              </Link>
            </CardContent>
          </Card>
        )}
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