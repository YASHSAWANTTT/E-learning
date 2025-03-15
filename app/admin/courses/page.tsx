"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Plus, Pencil, Trash2 } from "lucide-react";
import { UserButton } from "@/components/auth/user-button";

interface Course {
  id: string;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  enrollmentCount?: number;
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      setError('Failed to load courses');
      console.error('Error fetching courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete course');
      }

      // Remove the course from the local state
      setCourses(courses.filter(course => course.id !== courseId));
      router.refresh();
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading Courses...</h2>
          <p className="text-muted-foreground">Please wait while we load the course list</p>
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
            <h1 className="text-3xl font-bold">Course Management</h1>
            <p className="text-muted-foreground">Manage all courses on the platform</p>
          </div>
          <Link href="/admin/courses/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Button>
          </Link>
        </div>

        {error && (
          <div className="p-4 mb-6 bg-destructive/15 text-destructive rounded-md">
            {error}
          </div>
        )}

        {courses.length > 0 ? (
          <div className="grid gap-6">
            {courses.map((course: Course) => (
              <Card key={course.id}>
                <CardHeader className="pb-3">
                  <CardTitle>{course.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <p className="text-muted-foreground mb-2">{course.description}</p>
                      <p className="text-sm text-muted-foreground">
                        Created: {new Date(course.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex justify-end items-start space-x-2">
                      <Link href={`/admin/courses/${course.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                      <Link href={`/admin/courses/${course.id}/quizzes`}>
                        <Button variant="outline" size="sm">
                          Quizzes
                        </Button>
                      </Link>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDelete(course.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <p className="text-muted-foreground mb-4">No courses found</p>
              <Link href="/admin/courses/new">
                <Button>Create Your First Course</Button>
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