import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GraduationCap, User, Mail, Calendar, Shield, BookOpen, CheckSquare } from "lucide-react";
import { UserButton } from "@/components/auth/user-button";
import prisma from "@/lib/prisma";
import { format } from "date-fns";

interface Course {
  title: string;
}

interface Enrollment {
  id: string;
  courseId: string;
  enrolledAt: Date;
  progress: number;
  course: Course;
}

interface Quiz {
  title: string;
  courseId: string;
  course?: Course;
}

interface QuizAttempt {
  id: string;
  quizId: string;
  startedAt: Date;
  completedAt: Date | null;
  score: number | null;
  submitted: boolean;
  quiz: Quiz;
}

export default async function UserDetailsPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const userId = params.id;

  // Fetch user details
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    redirect("/admin/users");
  }

  // Fetch user's enrollments
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: true
    },
    orderBy: {
      enrolledAt: 'desc'
    }
  });

  // Fetch user's quiz attempts with course information
  const quizAttempts = await prisma.quizAttempt.findMany({
    where: { userId },
    include: {
      quiz: {
        include: {
          course: true
        }
      }
    },
    orderBy: {
      startedAt: 'desc'
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
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">User Details</h1>
            <p className="text-muted-foreground">View and manage user information</p>
          </div>
          <Link href="/admin/users">
            <Button variant="outline">Back to Users</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* User Information */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                User Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <div className="bg-primary h-16 w-16 rounded-full flex items-center justify-center text-primary-foreground text-xl font-bold">
                  {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-lg">{user.name || "No name provided"}</h3>
                  <p className="text-sm text-muted-foreground">{user.role}</p>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Joined: {format(new Date(user.createdAt), 'PPP')}</span>
                </div>
                {user.canvasUserId && (
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Canvas ID: {user.canvasUserId}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 flex space-x-2">
                <Link href={`/admin/users/${user.id}/edit`}>
                  <Button variant="outline" size="sm">Edit User</Button>
                </Link>
                {user.role !== "ADMIN" && (
                  <form action={`/api/users/${user.id}/make-admin`} method="POST">
                    <Button variant="outline" size="sm" type="submit">
                      Make Admin
                    </Button>
                  </form>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Course Enrollments */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Course Enrollments
              </CardTitle>
              <CardDescription>
                Courses this user is enrolled in
              </CardDescription>
            </CardHeader>
            <CardContent>
              {enrollments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4">Course</th>
                        <th className="text-left py-2 px-4">Enrolled On</th>
                        <th className="text-left py-2 px-4">Progress</th>
                        <th className="text-left py-2 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enrollments.map((enrollment: Enrollment) => (
                        <tr key={enrollment.id} className="border-b hover:bg-muted/50">
                          <td className="py-2 px-4">
                            <Link href={`/admin/courses/${enrollment.courseId}`} className="text-primary hover:underline">
                              {enrollment.course.title}
                            </Link>
                          </td>
                          <td className="py-2 px-4">{format(new Date(enrollment.enrolledAt), 'PPP')}</td>
                          <td className="py-2 px-4">{enrollment.progress}%</td>
                          <td className="py-2 px-4">
                            <form action={`/api/courses/${enrollment.courseId}/enrollments/${enrollment.id}`} method="POST">
                              <input type="hidden" name="_method" value="DELETE" />
                              <Button variant="destructive" size="sm" type="submit">
                                Remove
                              </Button>
                            </form>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center py-4 text-muted-foreground">This user is not enrolled in any courses.</p>
              )}
            </CardContent>
          </Card>

          {/* Quiz Attempts */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckSquare className="h-5 w-5 mr-2" />
                Quiz Attempts
              </CardTitle>
              <CardDescription>
                Quiz attempts and scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              {quizAttempts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4">Quiz</th>
                        <th className="text-left py-2 px-4">Course</th>
                        <th className="text-left py-2 px-4">Started</th>
                        <th className="text-left py-2 px-4">Completed</th>
                        <th className="text-left py-2 px-4">Score</th>
                        <th className="text-left py-2 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quizAttempts.map((attempt: QuizAttempt) => (
                        <tr key={attempt.id} className="border-b hover:bg-muted/50">
                          <td className="py-2 px-4">
                            <Link href={`/admin/quizzes/${attempt.quizId}`} className="text-primary hover:underline">
                              {attempt.quiz.title}
                            </Link>
                          </td>
                          <td className="py-2 px-4">
                            <Link href={`/admin/courses/${attempt.quiz.courseId}`} className="text-primary hover:underline">
                              {attempt.quiz.course?.title || "Unknown Course"}
                            </Link>
                          </td>
                          <td className="py-2 px-4">{format(new Date(attempt.startedAt), 'PPP')}</td>
                          <td className="py-2 px-4">
                            {attempt.completedAt ? format(new Date(attempt.completedAt), 'PPP') : 'Not completed'}
                          </td>
                          <td className="py-2 px-4">{attempt.score !== null ? `${attempt.score}%` : 'N/A'}</td>
                          <td className="py-2 px-4">
                            {attempt.submitted ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Submitted
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                In Progress
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center py-4 text-muted-foreground">This user has not attempted any quizzes.</p>
              )}
            </CardContent>
          </Card>
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