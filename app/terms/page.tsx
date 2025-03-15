import Link from 'next/link';
import { GraduationCap, FileText, AlertTriangle, Scale, ShieldCheck, BookOpen, Gavel, HelpCircle } from 'lucide-react';
import { UserButton } from '@/components/auth/user-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
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

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-12 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Please read these terms carefully before using our platform.
              </p>
              <p className="text-muted-foreground mt-2">Last Updated: May 15, 2025</p>
            </div>
            <div className="bg-primary/10 p-6 rounded-full">
              <Scale className="h-20 w-20 text-primary" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-grow container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Table of Contents */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4">Table of Contents</h2>
              <ol className="list-decimal list-inside space-y-2 ml-2">
                <li><Link href="#agreement" className="text-primary hover:underline">Agreement to Terms</Link></li>
                <li><Link href="#user-obligations" className="text-primary hover:underline">User Obligations and Responsibilities</Link></li>
                <li><Link href="#acceptable-use" className="text-primary hover:underline">Acceptable Use Policy</Link></li>
                <li><Link href="#intellectual-property" className="text-primary hover:underline">Intellectual Property Rights</Link></li>
                <li><Link href="#disclaimer" className="text-primary hover:underline">Disclaimer of Warranties</Link></li>
                <li><Link href="#limitation" className="text-primary hover:underline">Limitation of Liability</Link></li>
                <li><Link href="#termination" className="text-primary hover:underline">Account Termination Policies</Link></li>
                <li><Link href="#dispute" className="text-primary hover:underline">Dispute Resolution Process</Link></li>
                <li><Link href="#governing-law" className="text-primary hover:underline">Governing Law and Jurisdiction</Link></li>
              </ol>
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
