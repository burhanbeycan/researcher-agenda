import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import ResearchDashboard from "@/components/ResearchDashboard";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const statusLabels: Record<string, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under Review",
  accepted: "Accepted",
  rejected: "Rejected",
  published: "Published",
};

export default function ManuscriptDetail() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [manuscriptId, setManuscriptId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    status: "draft",
    journal: "",
    submissionDate: "",
    targetDate: "",
    notes: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) {
      setManuscriptId(parseInt(id));
    }
  }, [isAuthenticated, navigate]);

  const manuscriptQuery = trpc.manuscripts.getById.useQuery(
    { id: manuscriptId! },
    { enabled: !!manuscriptId }
  );
  const updateMutation = trpc.manuscripts.update.useMutation();

  const manuscript = manuscriptQuery.data;

  useEffect(() => {
    if (manuscript) {
      setFormData({
        title: manuscript.title,
        status: manuscript.status,
        journal: manuscript.journal || "",
        submissionDate: manuscript.submissionDate ? format(new Date(manuscript.submissionDate), "yyyy-MM-dd") : "",
        targetDate: manuscript.targetDate ? format(new Date(manuscript.targetDate), "yyyy-MM-dd") : "",
        notes: manuscript.notes || "",
      });
    }
  }, [manuscript]);

  const handleSave = async () => {
    if (!manuscriptId) return;

    try {
      await updateMutation.mutateAsync({
        id: manuscriptId,
        title: formData.title,
        status: formData.status as any,
        journal: formData.journal || undefined,
        submissionDate: formData.submissionDate ? new Date(formData.submissionDate) : undefined,
        targetDate: formData.targetDate ? new Date(formData.targetDate) : undefined,
        notes: formData.notes || undefined,
      });
      await manuscriptQuery.refetch();
      setIsEditing(false);
      toast.success("Manuscript updated successfully");
    } catch (error) {
      toast.error("Failed to update manuscript");
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      toast.error("Please enter a note");
      return;
    }

    if (!manuscriptId) return;

    try {
      const timestamp = format(new Date(), "MMM dd, yyyy HH:mm");
      const separator = formData.notes ? "\n\n---\n" : "";
      const currentNotes = formData.notes ? `${formData.notes}${separator}${timestamp}\n${newNote}` : `${timestamp}\n${newNote}`;
      
      await updateMutation.mutateAsync({
        id: manuscriptId,
        title: formData.title,
        status: formData.status as any,
        journal: formData.journal || undefined,
        submissionDate: formData.submissionDate ? new Date(formData.submissionDate) : undefined,
        targetDate: formData.targetDate ? new Date(formData.targetDate) : undefined,
        notes: currentNotes,
      });
      
      setFormData({ ...formData, notes: currentNotes });
      setNewNote("");
      await manuscriptQuery.refetch();
      toast.success("Note added successfully");
    } catch (error) {
      toast.error("Failed to add note");
    }
  };

  const handleDeleteNotes = async () => {
    if (!manuscriptId) return;
    try {
      await updateMutation.mutateAsync({
        id: manuscriptId,
        title: formData.title,
        status: formData.status as any,
        journal: formData.journal || undefined,
        submissionDate: formData.submissionDate ? new Date(formData.submissionDate) : undefined,
        targetDate: formData.targetDate ? new Date(formData.targetDate) : undefined,
        notes: "",
      });
      setFormData({ ...formData, notes: "" });
      await manuscriptQuery.refetch();
      toast.success("Notes cleared");
    } catch (error) {
      toast.error("Failed to delete notes");
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  if (!manuscript) {
    return (
      <ResearchDashboard currentPage="manuscripts">
        <div className="space-y-6">
          <Button variant="outline" onClick={() => navigate("/manuscripts")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Manuscripts
          </Button>
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">Loading manuscript...</p>
          </Card>
        </div>
      </ResearchDashboard>
    );
  }

  return (
    <ResearchDashboard currentPage="manuscripts">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate("/manuscripts")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Manuscripts
          </Button>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                Edit Manuscript
              </Button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="p-6 card-shadow">
              <h2 className="text-xl font-semibold mb-4">Manuscript Details</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="journal">Journal</Label>
                  <Input
                    id="journal"
                    value={formData.journal}
                    onChange={(e) => setFormData({ ...formData, journal: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="submissionDate">Submission Date</Label>
                    <Input
                      id="submissionDate"
                      type="date"
                      value={formData.submissionDate}
                      onChange={(e) => setFormData({ ...formData, submissionDate: e.target.value })}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="targetDate">Target Date</Label>
                    <Input
                      id="targetDate"
                      type="date"
                      value={formData.targetDate}
                      onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Notes Section */}
            <Card className="p-6 card-shadow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Notes & Progress</h2>
                {formData.notes && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDeleteNotes}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Existing Notes */}
              {formData.notes && (
                <div className="mb-6 p-4 bg-muted rounded-lg whitespace-pre-wrap text-sm">
                  {formData.notes}
                </div>
              )}

              {/* Add New Note */}
              <div className="space-y-3">
                <Label htmlFor="newNote">Add a New Note</Label>
                <Textarea
                  id="newNote"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Write your progress update, feedback, or any other notes..."
                  rows={4}
                  className="resize-none"
                />
                <Button onClick={handleAddNote} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Note
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            <Card className="p-6 card-shadow">
              <h3 className="font-semibold mb-4">Summary</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Status</p>
                  <p className="font-medium">{statusLabels[formData.status]}</p>
                </div>
                {formData.journal && (
                  <div>
                    <p className="text-muted-foreground mb-1">Journal</p>
                    <p className="font-medium">{formData.journal}</p>
                  </div>
                )}
                {formData.submissionDate && (
                  <div>
                    <p className="text-muted-foreground mb-1">Submitted</p>
                    <p className="font-medium">{format(new Date(formData.submissionDate), "MMM dd, yyyy")}</p>
                  </div>
                )}
                {formData.targetDate && (
                  <div>
                    <p className="text-muted-foreground mb-1">Target Date</p>
                    <p className="font-medium">{format(new Date(formData.targetDate), "MMM dd, yyyy")}</p>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6 card-shadow">
              <h3 className="font-semibold mb-4">Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full" onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? "Cancel Editing" : "Edit Details"}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ResearchDashboard>
  );
}
