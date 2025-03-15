import Link from 'next/link';
import { GraduationCap, Award, Users, Target, BookOpen, Lightbulb } from 'lucide-react';
import { UserButton } from '@/components/auth/user-button';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
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
      <section className="bg-gradient-to-b from-primary/10 to-background py-16 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
          <p className="text-xl max-w-3xl mx-auto text-muted-foreground">
            Transforming education through technology and innovation since 2025
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-grow container mx-auto py-12 px-4">
        {/* Our Story */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Story</h2>
              <p className="mb-4">
                Founded in 2025, Strat-Ops began with a simple mission: to make quality education accessible to everyone, everywhere. What started as a small project by a group of passionate educators and technologists has grown into a comprehensive learning ecosystem serving thousands of students worldwide.
              </p>
              <p className="mb-4">
                During the global pandemic, we witnessed firsthand the challenges faced by traditional educational institutions. This inspired us to create a platform that not only delivers content but fosters genuine engagement and measurable outcomes.
              </p>
              <p>
                Today, we continue to innovate at the intersection of education and technology, constantly refining our approach based on learning science and user feedback.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                alt="Team collaboration" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Mission and Vision */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Mission & Vision</h2>
            <div className="w-20 h-1 bg-primary mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-2">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center mb-4">Our Mission</h3>
                <p className="text-center">
                  To democratize education by providing accessible, engaging, and effective learning experiences that empower individuals to achieve their full potential, regardless of their background or circumstances.
                </p>
              </CardContent>
            </Card>
            
            <Card className="p-2">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <Lightbulb className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center mb-4">Our Vision</h3>
                <p className="text-center">
                  To build a world where quality education is a right, not a privilege. We envision a future where technology bridges educational gaps, where learning is personalized, and where every student has the tools they need to succeed.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Core Values */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do, from product development to customer support
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Inclusivity</h3>
              <p className="text-muted-foreground">
                We design our platform to be accessible to all learners, regardless of ability, background, or learning style.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Excellence</h3>
              <p className="text-muted-foreground">
                We strive for the highest quality in our content, technology, and user experience, constantly iterating and improving.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lifelong Learning</h3>
              <p className="text-muted-foreground">
                We believe education is a continuous journey, not a destination, and we support learners at every stage of their development.
              </p>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Passionate educators, technologists, and lifelong learners dedicated to transforming education
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 justify-center">
            <div className="text-center">
              <div className="mb-4 rounded-full overflow-hidden w-40 h-40 mx-auto">
                <img 
                  src="https://fgcucdn.fgcu.edu/directory/_images/pshah.jpg" 
                  alt="Piyush Shah" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold">Piyush Shah</h3>
              <p className="text-primary">CEO & Co-Founder</p>
              <p className="text-sm text-muted-foreground mt-2">
               
              </p>
            </div>
            
            <div className="text-center">
              <div className="mb-4 rounded-full overflow-hidden w-40 h-40 mx-auto">
                <img 
                  src="https://webapp4.asu.edu/photo-ws/directory_photo/kpshah8?size=medium&break=1740953721&blankImage2=1" 
                  alt="Kaushal Shah" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold">Kaushal Shah</h3>
              <p className="text-primary">CTO & Co-Founder</p>
              <p className="text-sm text-muted-foreground mt-2">
               
              </p>
            </div>
            
            <div className="text-center">
              <div className="mb-4 rounded-full overflow-hidden w-40 h-40 mx-auto">
                <img 
                  src="https://media.licdn.com/dms/image/v2/D4E03AQFSSRWJh87i2w/profile-displayphoto-shrink_400_400/B4EZVzlIjoG0Ag-/0/1741400869694?e=1747267200&v=beta&t=qd449H5Doa0uxfgqfiTVzO8SbbvttYBLgq85Ws0G7C0" 
                  alt="Devangana Shah" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold">Devangana Shah</h3>
              <p className="text-primary">Head of Curriculum</p>
              <p className="text-sm text-muted-foreground mt-2">
                PhD at the age of 19
              </p>
            </div>
          </div>
        </section>

        {/* Milestones */}
        {/* <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Milestones</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Key achievements in our journey to transform education
            </p>
          </div>
          
          <div className="relative border-l-2 border-primary/30 pl-8 ml-4 space-y-12">
            <div className="relative">
              <div className="absolute -left-12 top-0 w-6 h-6 rounded-full bg-primary"></div>
              <div>
                <h3 className="text-xl font-bold">2020</h3>
                <p className="font-semibold">Platform Launch</p>
                <p className="text-muted-foreground">
                  Launched with 10 courses and 500 beta users, focusing on web development and data science
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -left-12 top-0 w-6 h-6 rounded-full bg-primary"></div>
              <div>
                <h3 className="text-xl font-bold">2021</h3>
                <p className="font-semibold">Canvas LMS Integration</p>
                <p className="text-muted-foreground">
                  Partnered with educational institutions to provide seamless integration with existing systems
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -left-12 top-0 w-6 h-6 rounded-full bg-primary"></div>
              <div>
                <h3 className="text-xl font-bold">2022</h3>
                <p className="font-semibold">10,000 Active Users</p>
                <p className="text-muted-foreground">
                  Reached 10,000 active users and expanded course offerings to include business, design, and soft skills
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -left-12 top-0 w-6 h-6 rounded-full bg-primary"></div>
              <div>
                <h3 className="text-xl font-bold">2023</h3>
                <p className="font-semibold">Accessibility Certification</p>
                <p className="text-muted-foreground">
                  Achieved WCAG 2.1 AA compliance certification, making our platform accessible to all learners
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -left-12 top-0 w-6 h-6 rounded-full bg-primary"></div>
              <div>
                <h3 className="text-xl font-bold">2024</h3>
                <p className="font-semibold">Global Expansion</p>
                <p className="text-muted-foreground">
                  Expanded to serve users in over 50 countries with multi-language support and localized content
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -left-12 top-0 w-6 h-6 rounded-full bg-primary"></div>
              <div>
                <h3 className="text-xl font-bold">2025</h3>
                <p className="font-semibold">Next Generation Platform</p>
                <p className="text-muted-foreground">
                  Launched our completely redesigned platform with enhanced features for personalized learning
                </p>
              </div>
            </div>
          </div>
        </section> */}

        {/* CTA */}
        <section className="bg-primary/10 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Join Our Learning Community</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Discover courses taught by industry experts and connect with a global community of learners
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/courses">
              <Button size="lg">Explore Courses</Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg">Sign Up Free</Button>
            </Link>
          </div>
        </section>
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