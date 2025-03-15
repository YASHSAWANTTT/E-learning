"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, BookOpen, Clock, Award, Users } from "lucide-react";
import { UserButton } from "@/components/auth/user-button";

export default function CourseDetailPage() {
  const [course, setCourse] = useState<any>(null);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        // Fetch course details
        const courseResponse = await fetch(`/api/courses/${courseId}`);
        if (!courseResponse.ok) {
          throw new Error("Failed to fetch course");
        }
        const courseData = await courseResponse.json();
        setCourse(courseData);

        // Fetch quizzes for this course
        const quizzesResponse = await fetch(`/api/quizzes?courseId=${courseId}`);
        if (quizzesResponse.ok) {
          const quizzesData = await quizzesResponse.json();
          setQuizzes(quizzesData.filter((quiz: any) => quiz.courseId === courseId));
        }

        // Check if user is enrolled
        if (session) {
          try {
            const enrollmentResponse = await fetch(`/api/courses/${courseId}/enrollment?userId=${session.user.id}`);
            if (enrollmentResponse.ok) {
              const enrollmentData = await enrollmentResponse.json();
              setIsEnrolled(!!enrollmentData);
            }
          } catch (error) {
            console.error("Error checking enrollment:", error);
          }
        }

        // If admin, fetch all enrollments for this course
        if (session?.user?.role === "ADMIN") {
          try {
            const enrollmentsResponse = await fetch(`/api/courses/${courseId}/enrollments`);
            if (enrollmentsResponse.ok) {
              const enrollmentsData = await enrollmentsResponse.json();
              setEnrollments(enrollmentsData);
            }
          } catch (error) {
            console.error("Error fetching enrollments:", error);
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching course data:", error);
        setError("Failed to load course");
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, session]);

  const handleRemoveEnrollment = async (enrollmentId: string, userId: string) => {
    if (!confirm("Are you sure you want to remove this user from the course?")) {
      return;
    }

    try {
      const response = await fetch(`/api/courses/${courseId}/enrollments/${enrollmentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove enrollment");
      }

      // Update the enrollments list
      setEnrollments(enrollments.filter(enrollment => enrollment.id !== enrollmentId));
    } catch (error) {
      console.error("Error removing enrollment:", error);
      alert("Failed to remove user from course");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading Course...</h2>
          <p className="text-muted-foreground">Please wait while we load the course details</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p className="text-muted-foreground">{error || "Course not found"}</p>
          <Link href="/courses">
            <Button className="mt-4">Back to Courses</Button>
          </Link>
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
        {/* Course Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold">{course.title}</h1>
              <p className="text-muted-foreground">{course.description}</p>
            </div>
            {session ? (
              isEnrolled ? (
                <Button disabled>Already Enrolled</Button>
              ) : (
                <Link href={`/courses/${courseId}/enroll`}>
                  <Button>Enroll Now</Button>
                </Link>
              )
            ) : (
              <Link href={`/login?callbackUrl=/courses/${courseId}`}>
                <Button>Login to Enroll</Button>
              </Link>
            )}
          </div>

          {/* Course Image */}
          <div className="w-full h-64 md:h-96 overflow-hidden rounded-lg mb-8">
            <img 
              src={course.imageUrl || "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"} 
              alt={course.title} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Course Quizzes */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Course Quizzes</h2>
          
          {quizzes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => (
                <Card key={quiz.id} className="flex flex-col h-full">
                  <CardHeader>
                    <CardTitle>{quiz.title}</CardTitle>
                    <CardDescription>{quiz.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="space-y-2 text-sm text-muted-foreground">
                      {quiz.timeLimit && (
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4" />
                          <span>Time Limit: {quiz.timeLimit} minutes</span>
                        </div>
                      )}
                      {quiz.passingScore && (
                        <div className="flex items-center">
                          <Award className="mr-2 h-4 w-4" />
                          <span>Passing Score: {quiz.passingScore}%</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <div className="p-4 mt-auto">
                    <Link href={`/quizzes/${quiz.id}`}>
                      <Button className="w-full">Take Quiz</Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground mb-2">No quizzes available for this course yet.</p>
                <p className="text-sm text-muted-foreground">Check back later for updates.</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Course Resources */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Course Resources</h2>
          <Card>
            <CardContent className="py-8">
              <div className="flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-muted-foreground" />
              </div>
              <p className="text-center text-muted-foreground mt-4">
                Course resources will be available after enrollment.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Section: Enrolled Users */}
        {isAdmin && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Enrolled Users</h2>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  User Enrollments
                </CardTitle>
                <CardDescription>
                  Manage users enrolled in this course
                </CardDescription>
              </CardHeader>
              <CardContent>
                {enrollments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-4">User</th>
                          <th className="text-left py-2 px-4">Email</th>
                          <th className="text-left py-2 px-4">Enrolled On</th>
                          <th className="text-left py-2 px-4">Progress</th>
                          <th className="text-left py-2 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {enrollments.map((enrollment) => (
                          <tr key={enrollment.id} className="border-b hover:bg-muted/50">
                            <td className="py-2 px-4">{enrollment.user?.name || "Unknown User"}</td>
                            <td className="py-2 px-4">{enrollment.user?.email || "No email"}</td>
                            <td className="py-2 px-4">{new Date(enrollment.enrolledAt).toLocaleDateString()}</td>
                            <td className="py-2 px-4">{enrollment.progress}%</td>
                            <td className="py-2 px-4">
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleRemoveEnrollment(enrollment.id, enrollment.userId)}
                              >
                                Remove
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center py-4 text-muted-foreground">No users enrolled in this course yet.</p>
                )}
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