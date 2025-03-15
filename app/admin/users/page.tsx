"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, UserPlus, Shield, User as UserIcon, Eye } from "lucide-react";
import { UserButton } from "@/components/auth/user-button";
import { format } from "date-fns";
import { toast } from "sonner";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: "USER" | "ADMIN";
  createdAt: Date;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch users on component mount
  useState(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setError('Failed to load users');
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMakeAdmin = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}/make-admin`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to update user role');
      }

      // Update the user's role in the local state
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, role: "ADMIN" as const }
          : user
      ));

      toast.success('User role updated successfully');
      router.refresh();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading Users...</h2>
          <p className="text-muted-foreground">Please wait while we load the user list</p>
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
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">Manage user accounts and permissions</p>
          </div>
          <Link href="/admin/users/new">
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Create User
            </Button>
          </Link>
        </div>

        {error && (
          <div className="p-4 mb-6 bg-destructive/15 text-destructive rounded-md">
            {error}
          </div>
        )}

        {users.length > 0 ? (
          <div className="grid gap-6">
            {users.map((user) => (
              <Card key={user.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center">
                      {user.name}
                      {user.role === "ADMIN" && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-destructive text-destructive-foreground">
                          Admin
                        </span>
                      )}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <div className="flex items-center mb-2">
                        <UserIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-muted-foreground">{user.email}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Joined: {format(new Date(user.createdAt), 'PPP')}
                      </p>
                    </div>
                    <div className="flex justify-end items-start space-x-2">
                      <Link href={`/admin/users/${user.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                      {user.role !== "ADMIN" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleMakeAdmin(user.id)}
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Make Admin
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <p className="text-muted-foreground mb-4">No users found</p>
              <Link href="/admin/users/new">
                <Button>Create User</Button>
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