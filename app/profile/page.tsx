"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, User, Mail, Calendar, Loader2 } from "lucide-react";
import { UserButton } from "@/components/auth/user-button";
import { format } from "date-fns";

export default function ProfilePage() {
  const [quizAttempts, setQuizAttempts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchProfileData = async () => {
      if (status === "loading") return;
      
      if (!session) {
        router.push("/login?callbackUrl=/profile");
        return;
      }

      try {
        setIsLoading(true);
        
        // Fetch user's quiz attempts
        const attemptsResponse = await fetch("/api/user/quiz-attempts");
        const attemptsData = await attemptsResponse.json();
        setQuizAttempts(attemptsData);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setError("Failed to load profile data");
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [session, status, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Loading Profile...</h2>
          <p className="text-muted-foreground">Please wait while we load your profile data</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // This should not happen due to the redirect in useEffect
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
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and view your progress</p>
        </div>

        {error && (
          <div className="p-4 mb-6 bg-destructive/15 text-destructive rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground mr-2">Name:</span>
                  <span>{session.user.name || "Not set"}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground mr-2">Email:</span>
                  <span>{session.user.email}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground mr-2">Role:</span>
                  <span>{session.user.role === "ADMIN" ? "Administrator" : "Student"}</span>
                </div>
                <div className="pt-4">
                  <Link href="/profile/edit">
                    <Button className="w-full">Edit Profile</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Quiz Results */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Quiz Results</CardTitle>
              </CardHeader>
              <CardContent>
                {quizAttempts.length > 0 ? (
                  <div className="space-y-4">
                    {quizAttempts.slice(0, 5).map((attempt) => (
                      <div key={attempt.id} className="flex justify-between items-center p-3 bg-muted rounded-md">
                        <div>
                          <p className="font-medium">{attempt.quiz?.title || "Unknown Quiz"}</p>
                          <p className="text-sm text-muted-foreground">
                            {attempt.completedAt ? format(new Date(attempt.completedAt), 'PPP') : 'In progress'}
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