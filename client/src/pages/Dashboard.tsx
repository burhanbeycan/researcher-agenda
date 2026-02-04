import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import ResearchDashboard from "@/components/ResearchDashboard";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { BookOpen, Calendar, Users, AlertCircle } from "lucide-react";
import { format, isBefore, addDays } from "date-fns";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const manuscriptsQuery = trpc.manuscripts.list.useQuery({});
  const conferencesQuery = trpc.conferences.list.useQuery({});
  const meetingsQuery = trpc.meetings.list.useQuery({});

  const manuscripts = manuscriptsQuery.data || [];
  const conferences = conferencesQuery.data || [];
  const meetings = meetingsQuery.data || [];

  // Calculate statistics
  const draftManuscripts = manuscripts.filter((m: any) => m.status === "draft").length;
  const submittedManuscripts = manuscripts.filter((m: any) => m.status === "submitted").length;
  const upcomingConferences = conferences.filter((c: any) => isBefore(new Date(), c.startDate)).length;
  const upcomingMeetings = meetings.filter((m: any) => isBefore(new Date(), m.date)).length;

  // Get upcoming deadlines (next 7 days)
  const now = new Date();
  const nextWeek = addDays(now, 7);
  
  const upcomingDeadlines = [
    ...manuscripts
      .filter((m: any) => m.submissionDate && isBefore(m.submissionDate, nextWeek) && isBefore(now, m.submissionDate))
      .map((m: any) => ({ type: "Manuscript", title: m.title, date: m.submissionDate })),
    ...conferences
      .filter((c: any) => c.submissionDeadline && isBefore(c.submissionDeadline, nextWeek) && isBefore(now, c.submissionDeadline))
      .map((c: any) => ({ type: "Conference", title: c.name, date: c.submissionDeadline })),
    ...meetings
      .filter((m: any) => isBefore(m.date, nextWeek) && isBefore(now, m.date))
      .map((m: any) => ({ type: "Meeting", title: m.title, date: m.date })),
  ].sort((a: any, b: any) => (a.date?.getTime() || 0) - (b.date?.getTime() || 0));

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <ResearchDashboard currentPage="dashboard">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground">Here's an overview of your research activities.</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6 card-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Manuscripts</p>
                <p className="text-3xl font-bold mt-2">{manuscripts.length}</p>
              </div>
              <BookOpen className="w-12 h-12 text-accent opacity-20" />
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              {draftManuscripts} draft, {submittedManuscripts} submitted
            </p>
          </Card>

          <Card className="p-6 card-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Conferences</p>
                <p className="text-3xl font-bold mt-2">{conferences.length}</p>
              </div>
              <Calendar className="w-12 h-12 text-accent opacity-20" />
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              {upcomingConferences} upcoming
            </p>
          </Card>

          <Card className="p-6 card-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Meetings</p>
                <p className="text-3xl font-bold mt-2">{meetings.length}</p>
              </div>
              <Users className="w-12 h-12 text-accent opacity-20" />
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              {upcomingMeetings} upcoming
            </p>
          </Card>

          <Card className="p-6 card-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Upcoming Deadlines</p>
                <p className="text-3xl font-bold mt-2">{upcomingDeadlines.length}</p>
              </div>
              <AlertCircle className="w-12 h-12 text-accent opacity-20" />
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              In the next 7 days
            </p>
          </Card>
        </div>

        {/* Upcoming Deadlines */}
        {upcomingDeadlines.length > 0 && (
          <Card className="p-6 card-shadow">
            <h2 className="text-xl font-semibold mb-4">Upcoming Deadlines</h2>
            <div className="space-y-3">
              {upcomingDeadlines.slice(0, 5).map((deadline, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{deadline.title}</p>
                    <p className="text-sm text-muted-foreground">{deadline.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{deadline.date ? format(deadline.date, "MMM dd") : ""}</p>
                    <p className="text-sm text-muted-foreground">
                      {deadline.date ? format(deadline.date, "h:mm a") : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Quick Actions */}
        <Card className="p-6 card-shadow">
          <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-accent">{draftManuscripts}</p>
              <p className="text-sm text-muted-foreground mt-1">Draft Manuscripts</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-accent">{submittedManuscripts}</p>
              <p className="text-sm text-muted-foreground mt-1">Submitted</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-accent">{upcomingConferences}</p>
              <p className="text-sm text-muted-foreground mt-1">Upcoming Conferences</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-accent">{upcomingMeetings}</p>
              <p className="text-sm text-muted-foreground mt-1">Upcoming Meetings</p>
            </div>
          </div>
        </Card>
      </div>
    </ResearchDashboard>
  );
}
