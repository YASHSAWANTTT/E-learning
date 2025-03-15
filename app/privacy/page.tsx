import Link from 'next/link';
import { GraduationCap, Shield, Lock, Eye, FileText, Bell, UserCheck, RefreshCw } from 'lucide-react';
import { UserButton } from '@/components/auth/user-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
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
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                We are committed to protecting your privacy and ensuring the security of your personal information.
              </p>
              <p className="text-muted-foreground mt-2">Last Updated: May 15, 2025</p>
            </div>
            <div className="bg-primary/10 p-6 rounded-full">
              <Shield className="h-20 w-20 text-primary" />
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
                <li><a href="#introduction" className="text-primary hover:underline">Introduction</a></li>
                <li><a href="#data-collection" className="text-primary hover:underline">Data Collection and Usage</a></li>
                <li><a href="#cookies" className="text-primary hover:underline">Cookie Policy</a></li>
                <li><a href="#user-rights" className="text-primary hover:underline">User Rights and Choices</a></li>
                <li><a href="#data-security" className="text-primary hover:underline">Data Security Measures</a></li>
                <li><a href="#third-party" className="text-primary hover:underline">Third-Party Data Sharing</a></li>
                <li><a href="#childrens-privacy" className="text-primary hover:underline">Children's Privacy Protection</a></li>
                <li><a href="#updates" className="text-primary hover:underline">Policy Update Procedures</a></li>
                <li><a href="#contact" className="text-primary hover:underline">Contact Information</a></li>
              </ol>
            </CardContent>
          </Card>

          {/* Introduction */}
          <section id="introduction" className="mb-12">
            <div className="flex items-center mb-4">
              <FileText className="h-6 w-6 text-primary mr-2" />
              <h2 className="text-2xl font-bold">1. Introduction</h2>
            </div>
            <div className="ml-8">
              <p className="mb-4">
                Welcome to the Strat-Ops Privacy Policy. This policy describes how we collect, use, process, and disclose your information, including personal information, in conjunction with your access to and use of our platform.
              </p>
              <p className="mb-4">
                By using our services, you understand and agree that we are providing a platform for you to access educational content, participate in courses, take quizzes, and interact with instructors and other users. This Privacy Policy applies to all users of our platform, including students, instructors, and administrators.
              </p>
              <p>
                We are committed to protecting your privacy and ensuring you have a positive experience on our platform. This policy outlines our data handling practices and the choices you have regarding how your data is collected and used.
              </p>
            </div>
          </section>

          {/* Data Collection and Usage */}
          <section id="data-collection" className="mb-12">
            <div className="flex items-center mb-4">
              <Eye className="h-6 w-6 text-primary mr-2" />
              <h2 className="text-2xl font-bold">2. Data Collection and Usage</h2>
            </div>
            <div className="ml-8">
              <h3 className="text-xl font-semibold mb-3">Information You Provide to Us</h3>
              <p className="mb-4">
                We collect information you provide directly to us when you:
              </p>
              <ul className="list-disc list-inside mb-4 ml-4 space-y-1">
                <li>Create or modify your account</li>
                <li>Register for courses</li>
                <li>Complete quizzes and assignments</li>
                <li>Participate in forums or discussions</li>
                <li>Contact customer support</li>
                <li>Respond to surveys or promotional communications</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">Information We Collect Automatically</h3>
              <p className="mb-4">
                When you access or use our platform, we automatically collect:
              </p>
              <ul className="list-disc list-inside mb-4 ml-4 space-y-1">
                <li>Log information (IP address, browser type, pages visited)</li>
                <li>Device information (hardware model, operating system)</li>
                <li>Location information (derived from IP address)</li>
                <li>Usage data (course progress, quiz scores, time spent)</li>
                <li>Performance and diagnostic information</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">How We Use Your Information</h3>
              <p className="mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside mb-4 ml-4 space-y-1">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Track your progress and issue certificates</li>
                <li>Send technical notices, updates, and support messages</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Personalize content and recommendations</li>
                <li>Monitor and analyze trends, usage, and activities</li>
                <li>Detect, investigate, and prevent fraudulent transactions and abuse</li>
              </ul>
            </div>
          </section>

          {/* Cookie Policy */}
          <section id="cookies" className="mb-12">
            <div className="flex items-center mb-4">
              <Lock className="h-6 w-6 text-primary mr-2" />
              <h2 className="text-2xl font-bold">3. Cookie Policy</h2>
            </div>
            <div className="ml-8">
              <p className="mb-4">
                Cookies are small text files that are placed on your device when you visit our website. We use cookies and similar technologies to:
              </p>
              <ul className="list-disc list-inside mb-4 ml-4 space-y-1">
                <li>Keep you logged in to your account</li>
                <li>Remember your preferences and settings</li>
                <li>Understand how you interact with our platform</li>
                <li>Analyze the performance of our website</li>
                <li>Deliver relevant advertisements</li>
                <li>Prevent fraud and enhance security</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">Types of Cookies We Use</h3>
              <div className="mb-4">
                <p className="font-medium">Essential Cookies:</p>
                <p className="ml-4 mb-2">These cookies are necessary for the website to function properly and cannot be switched off in our systems.</p>
                
                <p className="font-medium">Performance Cookies:</p>
                <p className="ml-4 mb-2">These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.</p>
                
                <p className="font-medium">Functional Cookies:</p>
                <p className="ml-4 mb-2">These cookies enable the website to provide enhanced functionality and personalization.</p>
                
                <p className="font-medium">Targeting Cookies:</p>
                <p className="ml-4 mb-2">These cookies may be set through our site by our advertising partners to build a profile of your interests.</p>
              </div>

              <h3 className="text-xl font-semibold mb-3">Managing Cookies</h3>
              <p className="mb-4">
                Most web browsers allow you to control cookies through their settings preferences. However, limiting the ability of websites to set cookies may impact your experience. For a more detailed explanation of how we use cookies, please visit our dedicated Cookie Policy page.
              </p>
            </div>
          </section>

          {/* User Rights and Choices */}
          <section id="user-rights" className="mb-12">
            <div className="flex items-center mb-4">
              <UserCheck className="h-6 w-6 text-primary mr-2" />
              <h2 className="text-2xl font-bold">4. User Rights and Choices</h2>
            </div>
            <div className="ml-8">
              <p className="mb-4">
                We respect your right to control your data. You have the following rights regarding your personal information:
              </p>
              
              <h3 className="text-xl font-semibold mb-3">Access and Portability</h3>
              <p className="mb-4">
                You can request a copy of your personal data in a structured, commonly used, and machine-readable format. You can also request information about how we use your data and with whom we share it.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">Correction and Update</h3>
              <p className="mb-4">
                You can review, correct, or update your personal information at any time by accessing your account settings on our platform.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">Deletion and Restriction</h3>
              <p className="mb-4">
                You can request the deletion of your personal data, subject to certain exceptions. You can also request that we restrict the processing of your data in certain circumstances.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">Objection</h3>
              <p className="mb-4">
                You have the right to object to our processing of your personal data for direct marketing purposes or when our processing is based on legitimate interests.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">Consent Withdrawal</h3>
              <p className="mb-4">
                Where we rely on your consent to process your personal data, you have the right to withdraw that consent at any time.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">Communication Preferences</h3>
              <p className="mb-4">
                You can opt out of receiving promotional communications from us by following the instructions in those communications or by adjusting your notification settings in your account.
              </p>
              
              <div className="bg-primary/10 p-4 rounded-md">
                <p className="font-medium">To exercise any of these rights, please contact us at privacy@elearningplatform.com or through the Contact Information section below.</p>
              </div>
            </div>
          </section>

          {/* Data Security Measures */}
          <section id="data-security" className="mb-12">
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-primary mr-2" />
              <h2 className="text-2xl font-bold">5. Data Security Measures</h2>
            </div>
            <div className="ml-8">
              <p className="mb-4">
                We take the security of your personal information seriously and use appropriate technical and organizational measures to protect your personal information against unauthorized or unlawful processing and against accidental loss, destruction, or damage.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">Our Security Practices</h3>
              <ul className="list-disc list-inside mb-4 ml-4 space-y-1">
                <li>Encryption of sensitive data both in transit and at rest</li>
                <li>Regular security assessments and penetration testing</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Regular security training for all employees</li>
                <li>Incident response procedures</li>
                <li>Physical security measures for our facilities</li>
                <li>Regular backups and disaster recovery planning</li>
              </ul>
              
              <p className="mb-4">
                While we implement safeguards designed to protect your information, no security system is impenetrable, and we cannot guarantee the security of our systems 100%. We encourage you to take steps to protect your account, such as choosing a strong password and keeping it confidential.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">Data Breach Notification</h3>
              <p className="mb-4">
                In the event of a data breach that affects your personal information, we will notify you and the relevant authorities as required by applicable law. We will provide information about the breach, the affected data, and steps you can take to protect yourself.
              </p>
            </div>
          </section>

          {/* Third-Party Data Sharing */}
          <section id="third-party" className="mb-12">
            <div className="flex items-center mb-4">
              <FileText className="h-6 w-6 text-primary mr-2" />
              <h2 className="text-2xl font-bold">6. Third-Party Data Sharing</h2>
            </div>
            <div className="ml-8">
              <p className="mb-4">
                We may share your information with third parties in certain circumstances:
              </p>
              
              <h3 className="text-xl font-semibold mb-3">Service Providers</h3>
              <p className="mb-4">
                We share information with vendors, service providers, and other partners who help us provide the service, such as hosting providers, payment processors, analytics services, and customer support tools.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">Educational Institutions</h3>
              <p className="mb-4">
                If you are taking courses through your school, employer, or other organization, we may share your enrollment and progress data with them.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">Legal Requirements</h3>
              <p className="mb-4">
                We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency).
              </p>
              
              <h3 className="text-xl font-semibold mb-3">Business Transfers</h3>
              <p className="mb-4">
                If we are involved in a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">With Your Consent</h3>
              <p className="mb-4">
                We may share your information with third parties when you have given us your consent to do so.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">Third-Party Integrations</h3>
              <p className="mb-4">
                If you choose to connect your account with third-party services (such as Canvas LMS), we may share information with those services to facilitate the integration.
              </p>
              
              <div className="bg-primary/10 p-4 rounded-md">
                <p>We require all third parties to respect the security of your personal data and to treat it in accordance with the law. We do not allow our third-party service providers to use your personal data for their own purposes and only permit them to process your personal data for specified purposes and in accordance with our instructions.</p>
              </div>
            </div>
          </section>

          {/* Children's Privacy Protection */}
          <section id="childrens-privacy" className="mb-12">
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-primary mr-2" />
              <h2 className="text-2xl font-bold">7. Children's Privacy Protection</h2>
            </div>
            <div className="ml-8">
              <p className="mb-4">
                Our platform is not directed to children under the age of 13 (or higher in some jurisdictions). We do not knowingly collect personal information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we can take steps to remove that information from our systems.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">Special Provisions for Educational Institutions</h3>
              <p className="mb-4">
                If we collect information from children under 13 in the context of providing educational services to schools or educational institutions, we will:
              </p>
              <ul className="list-disc list-inside mb-4 ml-4 space-y-1">
                <li>Collect personal information only as necessary for the educational context</li>
                <li>Not use personal information for commercial purposes</li>
                <li>Provide the school with access to review and delete information</li>
                <li>Implement reasonable security procedures</li>
              </ul>
              
              <p className="mb-4">
                In these cases, we rely on the educational institution to obtain appropriate parental consent.
              </p>
            </div>
          </section>

          {/* Policy Update Procedures */}
          <section id="updates" className="mb-12">
            <div className="flex items-center mb-4">
              <RefreshCw className="h-6 w-6 text-primary mr-2" />
              <h2 className="text-2xl font-bold">8. Policy Update Procedures</h2>
            </div>
            <div className="ml-8">
              <p className="mb-4">
                We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. When we make material changes to this Privacy Policy, we will:
              </p>
              <ul className="list-disc list-inside mb-4 ml-4 space-y-1">
                <li>Post the updated policy on our website</li>
                <li>Update the "Last Updated" date at the top of this page</li>
                <li>Notify you via email or through a notice on our platform</li>
                <li>Obtain your consent when required by applicable law</li>
              </ul>
              
              <p className="mb-4">
                We encourage you to review our Privacy Policy whenever you access our platform to stay informed about our information practices and your privacy rights.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">Archive of Previous Versions</h3>
              <p className="mb-4">
                We maintain an archive of previous versions of our Privacy Policy, which you can request by contacting us.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section id="contact" className="mb-12">
            <div className="flex items-center mb-4">
              <Bell className="h-6 w-6 text-primary mr-2" />
              <h2 className="text-2xl font-bold">9. Contact Information</h2>
            </div>
            <div className="ml-8">
              <p className="mb-4">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </p>
              
              <div className="bg-card p-6 rounded-lg shadow-sm mb-4">
                <p className="font-semibold mb-2">Strat-Ops</p>
                <p className="mb-1">Attn: Privacy Officer</p>
                <p className="mb-1">123 Learning Street</p>
                <p className="mb-1">San Francisco, CA 94103</p>
                <p className="mb-1">United States</p>
                <p className="mb-1">Email: privacy@elearningplatform.com</p>
                <p>Phone: +1 (555) 123-4567</p>
              </div>
              
              <h3 className="text-xl font-semibold mb-3">Data Protection Officer</h3>
              <p className="mb-4">
                Our Data Protection Officer can be contacted at dpo@elearningplatform.com.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">For EU/EEA Residents</h3>
              <p className="mb-4">
                If you are located in the EU or EEA and have concerns about our data collection practices that we have not addressed satisfactorily, you have the right to lodge a complaint with your local data protection authority.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">For California Residents</h3>
              <p className="mb-4">
                If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA). Please see our California Privacy Notice for more information.
              </p>
            </div>
          </section>

          {/* CTA */}
          <div className="bg-primary/10 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Have Questions About Your Privacy?</h2>
            <p className="mb-6 max-w-2xl mx-auto">
              Our team is here to help you understand how we protect your data and answer any questions you may have about our privacy practices.
            </p>
            <Link href="/contact">
              <Button size="lg">Contact Our Privacy Team</Button>
            </Link>
          </div>
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