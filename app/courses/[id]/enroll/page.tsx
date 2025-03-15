"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { GraduationCap, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserButton } from "@/components/auth/user-button";

export default function CourseEnrollPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [course, setCourse] = useState<any>(null);
  
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${courseId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch course");
        }
        const courseData = await response.json();
        setCourse(courseData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching course:", error);
        setError("Failed to load course");
        setIsLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    } else {
      setError("Invalid course ID");
      setIsLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    const enrollInCourse = async () => {
      if (status === "loading" || !session || !courseId) return;
      
      try {
        setIsLoading(true);
        const response = await fetch(`/api/courses/${courseId}/enroll`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          }
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Failed to enroll in course");
          setIsLoading(false);
          return;
        }

        setSuccess("Successfully enrolled in course");
        setTimeout(() => {
          router.push(`/courses/${courseId}`);
        }, 2000);
      } catch (error) {
        console.error("Enrollment error:", error);
        setError("Something went wrong");
        setIsLoading(false);
      }
    };

    if (session) {
      enrollInCourse();
    } else if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=/courses/${courseId}/enroll`);
    }
  }, [session, status, courseId, router]);

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Processing Enrollment...</h2>
          <p className="text-muted-foreground">Please wait while we enroll you in this course</p>
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
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center">
                {success ? (
                  <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                ) : error ? (
                  <XCircle className="h-6 w-6 text-destructive mr-2" />
                ) : (
                  <GraduationCap className="h-6 w-6 mr-2" />
                )}
                {success ? "Enrollment Successful" : error ? "Enrollment Failed" : "Course Enrollment"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {course && (
                <p className="mb-4 text-center">
                  {success ? (
                    `You have successfully enrolled in "${course.title}"`
                  ) : error ? (
                    error
                  ) : (
                    `Enrolling in "${course.title}"...`
                  )}
                </p>
              )}
              
              <div className="flex justify-center mt-4">
                <Link href={courseId ? `/courses/${courseId}` : "/courses"}>
                  <Button>
                    {success ? "Go to Course" : "Back to Course"}
                  </Button>
                </Link>
              </div>
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