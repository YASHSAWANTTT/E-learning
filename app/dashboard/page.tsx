"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, BookOpen, CheckSquare, User, Loader2 } from "lucide-react";
import { UserButton } from "@/components/auth/user-button";
import { format } from "date-fns";

export default function DashboardPage() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (status === "loading") return;
      
      if (!session) {
        router.push("/login?callbackUrl=/dashboard");
        return;
      }

      try {
        setIsLoading(true);
        
        // Fetch user's enrollments
        const enrollmentsResponse = await fetch("/api/user/enrollments");
        const enrollmentsData = await enrollmentsResponse.json();
        setEnrollments(enrollmentsData);
        
        // Fetch user's quiz attempts
        const attemptsResponse = await fetch("/api/user/quiz-attempts");
        const attemptsData = await attemptsResponse.json();
        setQuizAttempts(attemptsData);
        
        // Fetch all courses for reference
        const coursesResponse = await fetch("/api/courses");
        const coursesData = await coursesResponse.json();
        setCourses(coursesData);
        
        // Fetch all quizzes for reference
        const quizzesResponse = await fetch("/api/quizzes");
        const quizzesData = await quizzesResponse.json();
        setQuizzes(quizzesData);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data");
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [session, status, router]);

  // Helper function to get course title by ID
  const getCourseTitle = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.title : 'Unknown Course';
  };

  // Helper function to get quiz title by ID
  const getQuizTitle = (quizId: string) => {
    const quiz = quizzes.find(q => q.id === quizId);
    return quiz ? quiz.title : 'Unknown Quiz';
  };

  // Calculate average score
  const calculateAverageScore = () => {
    const completedAttempts = quizAttempts.filter(attempt => attempt.score !== null);
    if (completedAttempts.length === 0) return "N/A";
    
    const totalScore = completedAttempts.reduce((sum, attempt) => sum + attempt.score, 0);
    return Math.round(totalScore / completedAttempts.length) + "%";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Loading Dashboard...</h2>
          <p className="text-muted-foreground">Please wait while we load your learning data</p>
        </div>
      </div>
    );
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome, {session?.user.name || "Student"}</h1>
          <p className="text-muted-foreground">Here's an overview of your learning progress</p>
        </div>

        {error && (
          <div className="p-4 mb-6 bg-destructive/15 text-destructive rounded-md">
            {error}
          </div>
        )}

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enrollments.length}</div>
              <p className="text-xs text-muted-foreground">
                {enrollments.length === 0 
                  ? "No courses enrolled yet" 
                  : enrollments.length === 1 
                    ? "1 course enrolled" 
                    : `${enrollments.length} courses enrolled`}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed Quizzes</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {quizAttempts.filter(attempt => attempt.submitted).length}
              </div>
              <p className="text-xs text-muted-foreground">
                {quizAttempts.length === 0 
                  ? "No quizzes attempted yet" 
                  : `${quizAttempts.filter(attempt => attempt.submitted).length} of ${quizAttempts.length} quizzes completed`}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{calculateAverageScore()}</div>
              <p className="text-xs text-muted-foreground">
                {quizAttempts.filter(attempt => attempt.score !== null).length === 0
                  ? "Complete quizzes to see your average score"
                  : `Based on ${quizAttempts.filter(attempt => attempt.score !== null).length} completed quizzes`}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <Card>
            <CardHeader>
              <CardTitle>Recent Quiz Attempts</CardTitle>
              <CardDescription>
                Your most recent quiz attempts and scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              {quizAttempts.length > 0 ? (
                <div className="space-y-4">
                  {quizAttempts.slice(0, 5).map((attempt) => (
                    <div key={attempt.id} className="flex justify-between items-center p-3 bg-muted rounded-md">
                      <div>
                        <p className="font-medium">{getQuizTitle(attempt.quizId)}</p>
                        <p className="text-sm text-muted-foreground">
                          {attempt.completedAt 
                            ? `Completed: ${format(new Date(attempt.completedAt), 'PPP')}` 
                            : 'In progress'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{attempt.score ? `${attempt.score}%` : 'N/A'}</p>
                        {attempt.submitted && (
                          <Link href={`/quizzes/${attempt.quizId}/results/${attempt.id}`}>
                            <Button variant="link" size="sm" className="h-auto p-0">View Results</Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">You haven't taken any quizzes yet</p>
                  <Link href="/quizzes">
                    <Button>Browse Quizzes</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Enrolled Courses */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Your Courses</h2>
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Courses</CardTitle>
              <CardDescription>
                Courses you are currently enrolled in
              </CardDescription>
            </CardHeader>
            <CardContent>
              {enrollments.length > 0 ? (
                <div className="space-y-4">
                  {enrollments.map((enrollment) => (
                    <div key={enrollment.id} className="flex justify-between items-center p-3 bg-muted rounded-md">
                      <div>
                        <p className="font-medium">{getCourseTitle(enrollment.courseId)}</p>
                        <p className="text-sm text-muted-foreground">
                          Enrolled: {format(new Date(enrollment.enrolledAt), 'PPP')}
                        </p>
                      </div>
                      <div>
                        <Link href={`/courses/${enrollment.courseId}`}>
                          <Button variant="outline" size="sm">Continue Learning</Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">You haven't enrolled in any courses yet</p>
                  <Link href="/courses">
                    <Button>Browse Courses</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
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