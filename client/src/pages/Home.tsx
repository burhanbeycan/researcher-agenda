import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { BookOpen, Calendar, Users, Zap, Shield, Bell } from "lucide-react";
import { useEffect } from "react";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container py-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold gradient-text">ResearchHub</h1>
          <Button asChild>
            <a href={getLoginUrl()}>Login</a>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-5xl md:text-6xl font-bold leading-tight">
            Organize Your Academic Life
          </h2>
          <p className="text-xl text-muted-foreground">
            A comprehensive agenda management system designed for researchers. Track manuscripts, conferences, meetings, and never miss a deadline again.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button size="lg" asChild>
              <a href={getLoginUrl()}>Get Started</a>
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-card border-y border-border py-20">
        <div className="container">
          <h3 className="text-3xl font-bold text-center mb-16">Powerful Features</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-lg border border-border hover:border-accent transition-colors">
              <BookOpen className="w-12 h-12 text-accent mb-4" />
              <h4 className="text-xl font-semibold mb-2">Manuscript Tracking</h4>
              <p className="text-muted-foreground">
                Manage your research papers with status tracking, journal information, and submission dates.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-lg border border-border hover:border-accent transition-colors">
              <Calendar className="w-12 h-12 text-accent mb-4" />
              <h4 className="text-xl font-semibold mb-2">Conference Management</h4>
              <p className="text-muted-foreground">
                Track conferences with deadlines, attendance status, and important dates all in one place.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-lg border border-border hover:border-accent transition-colors">
              <Users className="w-12 h-12 text-accent mb-4" />
              <h4 className="text-xl font-semibold mb-2">Meeting Scheduler</h4>
              <p className="text-muted-foreground">
                Schedule and organize meetings with participants, agendas, and detailed notes.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-lg border border-border hover:border-accent transition-colors">
              <Zap className="w-12 h-12 text-accent mb-4" />
              <h4 className="text-xl font-semibold mb-2">Unified Calendar View</h4>
              <p className="text-muted-foreground">
                Visualize all your activities in one elegant calendar with color-coded events.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-lg border border-border hover:border-accent transition-colors">
              <Bell className="w-12 h-12 text-accent mb-4" />
              <h4 className="text-xl font-semibold mb-2">Smart Reminders</h4>
              <p className="text-muted-foreground">
                Receive automated email reminders for upcoming deadlines and important events.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-lg border border-border hover:border-accent transition-colors">
              <Shield className="w-12 h-12 text-accent mb-4" />
              <h4 className="text-xl font-semibold mb-2">Secure & Private</h4>
              <p className="text-muted-foreground">
                Your data is encrypted and secure. Only you can access your research agenda.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20 text-center">
        <h3 className="text-3xl font-bold mb-6">Ready to organize your research?</h3>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join researchers worldwide who are using ResearchHub to manage their academic activities efficiently.
        </p>
        <Button size="lg" asChild>
          <a href={getLoginUrl()}>Start Free Today</a>
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-muted-foreground">
        <p>&copy; 2026 ResearchHub. All rights reserved.</p>
      </footer>
    </div>
  );
}
