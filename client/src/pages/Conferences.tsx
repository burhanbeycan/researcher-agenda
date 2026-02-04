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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit2, Trash2, Search, MapPin, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  interested: "badge-secondary",
  submitted: "badge-primary",
  accepted: "badge-success",
  attended: "badge-success",
  rejected: "badge-danger",
};

const statusLabels: Record<string, string> = {
  interested: "Interested",
  submitted: "Submitted",
  accepted: "Accepted",
  attended: "Attended",
  rejected: "Rejected",
};

export default function Conferences() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    startDate: "",
    endDate: "",
    submissionDeadline: "",
    attendanceStatus: "interested",
    website: "",
    notes: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const conferencesQuery = trpc.conferences.list.useQuery({ search: searchTerm });
  const createMutation = trpc.conferences.create.useMutation();
  const updateMutation = trpc.conferences.update.useMutation();
  const deleteMutation = trpc.conferences.delete.useMutation();

  const conferences = conferencesQuery.data || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          name: formData.name,
          location: formData.location || undefined,
          startDate: new Date(formData.startDate),
          endDate: formData.endDate ? new Date(formData.endDate) : undefined,
          submissionDeadline: formData.submissionDeadline ? new Date(formData.submissionDeadline) : undefined,
          attendanceStatus: formData.attendanceStatus as any,
          website: formData.website || undefined,
          notes: formData.notes || undefined,
        });
        toast.success("Conference updated successfully");
      } else {
        await createMutation.mutateAsync({
          name: formData.name,
          location: formData.location || undefined,
          startDate: new Date(formData.startDate),
          endDate: formData.endDate ? new Date(formData.endDate) : undefined,
          submissionDeadline: formData.submissionDeadline ? new Date(formData.submissionDeadline) : undefined,
          attendanceStatus: formData.attendanceStatus as any,
          website: formData.website || undefined,
          notes: formData.notes || undefined,
        });
        toast.success("Conference created successfully");
      }

      await conferencesQuery.refetch();
      setIsOpen(false);
      setEditingId(null);
      setFormData({
        name: "",
        location: "",
        startDate: "",
        endDate: "",
        submissionDeadline: "",
        attendanceStatus: "interested",
        website: "",
        notes: "",
      });
    } catch (error) {
      toast.error("Failed to save conference");
    }
  };

  const handleEdit = (conference: any) => {
    setEditingId(conference.id);
    setFormData({
      name: conference.name,
      location: conference.location || "",
      startDate: format(new Date(conference.startDate), "yyyy-MM-dd"),
      endDate: conference.endDate ? format(new Date(conference.endDate), "yyyy-MM-dd") : "",
      submissionDeadline: conference.submissionDeadline ? format(new Date(conference.submissionDeadline), "yyyy-MM-dd") : "",
      attendanceStatus: conference.attendanceStatus,
      website: conference.website || "",
      notes: conference.notes || "",
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this conference?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        await conferencesQuery.refetch();
        toast.success("Conference deleted successfully");
      } catch (error) {
        toast.error("Failed to delete conference");
      }
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <ResearchDashboard currentPage="conferences">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Conferences</h1>
            <p className="text-muted-foreground mt-1">Track conferences and manage your attendance</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingId(null);
                setFormData({
                  name: "",
                  location: "",
                  startDate: "",
                  endDate: "",
                  submissionDeadline: "",
                  attendanceStatus: "interested",
                  website: "",
                  notes: "",
                });
              }}>
                <Plus className="w-4 h-4 mr-2" />
                New Conference
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Conference" : "New Conference"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Conference Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter conference name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="City, Country"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="submissionDeadline">Submission Deadline</Label>
                  <Input
                    id="submissionDeadline"
                    type="date"
                    value={formData.submissionDeadline}
                    onChange={(e) => setFormData({ ...formData, submissionDeadline: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="status">Attendance Status</Label>
                  <Select value={formData.attendanceStatus} onValueChange={(value) => setFormData({ ...formData, attendanceStatus: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="interested">Interested</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="attended">Attended</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://conference.example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Add any notes about this conference"
                    rows={4}
                  />
                </div>

                <Button type="submit" className="w-full">
                  {editingId ? "Update Conference" : "Create Conference"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search conferences..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Conferences List */}
        {conferences.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No conferences yet. Add your first conference to get started.</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {conferences.map((conference: any) => (
              <Card key={conference.id} className="p-6 card-shadow hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{conference.name}</h3>
                      <span className={`badge ${statusColors[conference.attendanceStatus]}`}>
                        {statusLabels[conference.attendanceStatus]}
                      </span>
                    </div>
                    {conference.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <MapPin className="w-4 h-4" />
                        {conference.location}
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(conference.startDate), "MMM dd, yyyy")}
                      {conference.endDate && ` - ${format(new Date(conference.endDate), "MMM dd, yyyy")}`}
                    </p>
                    {conference.submissionDeadline && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Deadline: {format(new Date(conference.submissionDeadline), "MMM dd, yyyy")}
                      </p>
                    )}
                    {conference.website && (
                      <a href={conference.website} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline flex items-center gap-1 mt-2">
                        <LinkIcon className="w-3 h-3" />
                        Visit Website
                      </a>
                    )}
                    {conference.notes && (
                      <p className="text-sm mt-2 text-foreground">{conference.notes}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(conference)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(conference.id)}
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
