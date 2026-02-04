import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import ResearchDashboard from "@/components/ResearchDashboard";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit2, Trash2, Search, MapPin, Users, Clock } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function Meetings() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    duration: "",
    location: "",
    participants: "",
    agenda: "",
    notes: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const meetingsQuery = trpc.meetings.list.useQuery({ search: searchTerm });
  const createMutation = trpc.meetings.create.useMutation();
  const updateMutation = trpc.meetings.update.useMutation();
  const deleteMutation = trpc.meetings.delete.useMutation();

  const meetings = meetingsQuery.data || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const dateTime = formData.time ? `${formData.date}T${formData.time}` : formData.date;
      const participants = formData.participants
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p);

      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          title: formData.title,
          date: new Date(dateTime),
          duration: formData.duration ? parseInt(formData.duration) : undefined,
          location: formData.location || undefined,
          participants: participants,
          agenda: formData.agenda || undefined,
          notes: formData.notes || undefined,
        });
        toast.success("Meeting updated successfully");
      } else {
        await createMutation.mutateAsync({
          title: formData.title,
          date: new Date(dateTime),
          duration: formData.duration ? parseInt(formData.duration) : undefined,
          location: formData.location || undefined,
          participants: participants,
          agenda: formData.agenda || undefined,
          notes: formData.notes || undefined,
        });
        toast.success("Meeting created successfully");
      }

      await meetingsQuery.refetch();
      setIsOpen(false);
      setEditingId(null);
      setFormData({
        title: "",
        date: "",
        time: "",
        duration: "",
        location: "",
        participants: "",
        agenda: "",
        notes: "",
      });
    } catch (error) {
      toast.error("Failed to save meeting");
    }
  };

  const handleEdit = (meeting: any) => {
    const meetingDate = new Date(meeting.date);
    setEditingId(meeting.id);
    setFormData({
      title: meeting.title,
      date: format(meetingDate, "yyyy-MM-dd"),
      time: format(meetingDate, "HH:mm"),
      duration: meeting.duration ? meeting.duration.toString() : "",
      location: meeting.location || "",
      participants: meeting.participants?.join(", ") || "",
      agenda: meeting.agenda || "",
      notes: meeting.notes || "",
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this meeting?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        await meetingsQuery.refetch();
        toast.success("Meeting deleted successfully");
      } catch (error) {
        toast.error("Failed to delete meeting");
      }
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <ResearchDashboard currentPage="meetings">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Meetings</h1>
            <p className="text-muted-foreground mt-1">Schedule and organize your meetings</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingId(null);
                setFormData({
                  title: "",
                  date: "",
                  time: "",
                  duration: "",
                  location: "",
                  participants: "",
                  agenda: "",
                  notes: "",
                });
              }}>
                <Plus className="w-4 h-4 mr-2" />
                New Meeting
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Meeting" : "New Meeting"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Meeting Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter meeting title"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="60"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Room or URL"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="participants">Participants</Label>
                  <Input
                    id="participants"
                    value={formData.participants}
                    onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                    placeholder="John Doe, Jane Smith (comma separated)"
                  />
                </div>

                <div>
                  <Label htmlFor="agenda">Agenda</Label>
                  <Textarea
                    id="agenda"
                    value={formData.agenda}
                    onChange={(e) => setFormData({ ...formData, agenda: e.target.value })}
                    placeholder="Meeting agenda items"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Add any additional notes"
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full">
                  {editingId ? "Update Meeting" : "Create Meeting"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search meetings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Meetings List */}
        {meetings.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No meetings scheduled yet. Create your first meeting to get started.</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {meetings.map((meeting: any) => (
              <Card key={meeting.id} className="p-6 card-shadow hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-3">{meeting.title}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {format(new Date(meeting.date), "MMM dd, yyyy")}
                        {meeting.time && ` at ${format(new Date(meeting.date), "h:mm a")}`}
                        {meeting.duration && ` (${meeting.duration} min)`}
                      </div>
                      {meeting.location && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {meeting.location}
                        </div>
                      )}
                      {meeting.participants && meeting.participants.length > 0 && (
                        <div className="flex items-start gap-2 text-muted-foreground">
                          <Users className="w-4 h-4 mt-0.5" />
                          <div>
                            {meeting.participants.map((p: string, idx: number) => (
                              <div key={idx}>{p}</div>
                            ))}
                          </div>
                        </div>
                      )}
                      {meeting.agenda && (
                        <div className="mt-3 p-3 bg-muted rounded">
                          <p className="font-medium mb-1">Agenda:</p>
                          <p>{meeting.agenda}</p>
                        </div>
                      )}
                      {meeting.notes && (
                        <p className="mt-2">{meeting.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(meeting)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(meeting.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ResearchDashboard>
  );
}
