import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Plus, Clock, Award } from "lucide-react";
import { UserButton } from "@/components/auth/user-button";
import prisma from "@/lib/prisma";

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  timeLimit: number | null;
  passingScore: number | null;
  canvasQuizId: string | null;
  courseId: string;
  createdAt: Date;
  updatedAt: Date;
}

export default async function CourseQuizzesPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const courseId = params.id;

  // Fetch course details
  const course = await prisma.course.findFirst({
    where: { id: courseId }
  });

  if (!course) {
    redirect("/admin/courses");
  }

  // Fetch quizzes for this course
  const quizzes = await prisma.quiz.findMany({
    where: { courseId }
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
            <h1 className="text-3xl font-bold">Quizzes for {course.title}</h1>
            <p className="text-muted-foreground">Manage quizzes for this course</p>
          </div>
          <div className="flex space-x-2">
            <Link href={`/admin/courses/${courseId}`}>
              <Button variant="outline">Back to Course</Button>
            </Link>
            <Link href={`/admin/quizzes/new?courseId=${courseId}`}>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Quiz
              </Button>
            </Link>
          </div>
        </div>

        {quizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz: Quiz) => (
              <Card key={quiz.id} className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle>{quiz.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground mb-4">{quiz.description}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Time Limit: {quiz.timeLimit} minutes</span>
                    </div>
                    <div className="flex items-center">
                      <Award className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Passing Score: {quiz.passingScore}%</span>
                    </div>
                  </div>
                </CardContent>
                <div className="p-4 mt-auto flex justify-between">
                  <Link href={`/admin/quizzes/${quiz.id}/edit`}>
                    <Button variant="outline">Edit</Button>
                  </Link>
                  <Link href={`/admin/quizzes/${quiz.id}/questions`}>
                    <Button>Manage Questions</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <p className="text-muted-foreground mb-4">No quizzes found for this course</p>
              <Link href={`/admin/quizzes/new?courseId=${courseId}`}>
                <Button>Create First Quiz</Button>
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