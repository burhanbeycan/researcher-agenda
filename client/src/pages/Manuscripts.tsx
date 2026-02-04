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
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  draft: "badge-secondary",
  submitted: "badge-primary",
  under_review: "badge-warning",
  accepted: "badge-success",
  rejected: "badge-danger",
  published: "badge-success",
};

const statusLabels: Record<string, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under Review",
  accepted: "Accepted",
  rejected: "Rejected",
  published: "Published",
};

export default function Manuscripts() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
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
    }
  }, [isAuthenticated, navigate]);

  const manuscriptsQuery = trpc.manuscripts.list.useQuery({ search: searchTerm });
  const createMutation = trpc.manuscripts.create.useMutation();
  const updateMutation = trpc.manuscripts.update.useMutation();
  const deleteMutation = trpc.manuscripts.delete.useMutation();

  const manuscripts = manuscriptsQuery.data || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          title: formData.title,
          status: formData.status as any,
          journal: formData.journal || undefined,
          submissionDate: formData.submissionDate ? new Date(formData.submissionDate) : undefined,
          targetDate: formData.targetDate ? new Date(formData.targetDate) : undefined,
          notes: formData.notes || undefined,
        });
        toast.success("Manuscript updated successfully");
      } else {
        await createMutation.mutateAsync({
          title: formData.title,
          status: formData.status as any,
          journal: formData.journal || undefined,
          submissionDate: formData.submissionDate ? new Date(formData.submissionDate) : undefined,
          targetDate: formData.targetDate ? new Date(formData.targetDate) : undefined,
          notes: formData.notes || undefined,
        });
        toast.success("Manuscript created successfully");
      }

      await manuscriptsQuery.refetch();
      setIsOpen(false);
      setEditingId(null);
      setFormData({
        title: "",
        status: "draft",
        journal: "",
        submissionDate: "",
        targetDate: "",
        notes: "",
      });
    } catch (error) {
      toast.error("Failed to save manuscript");
    }
  };

  const handleEdit = (manuscript: any) => {
    setEditingId(manuscript.id);
    setFormData({
      title: manuscript.title,
      status: manuscript.status,
      journal: manuscript.journal || "",
      submissionDate: manuscript.submissionDate ? format(new Date(manuscript.submissionDate), "yyyy-MM-dd") : "",
      targetDate: manuscript.targetDate ? format(new Date(manuscript.targetDate), "yyyy-MM-dd") : "",
      notes: manuscript.notes || "",
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this manuscript?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        await manuscriptsQuery.refetch();
        toast.success("Manuscript deleted successfully");
      } catch (error) {
        toast.error("Failed to delete manuscript");
      }
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <ResearchDashboard currentPage="manuscripts">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Manuscripts</h1>
            <p className="text-muted-foreground mt-1">Manage your research papers and track their progress</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingId(null);
                setFormData({
                  title: "",
                  status: "draft",
                  journal: "",
                  submissionDate: "",
                  targetDate: "",
                  notes: "",
                });
              }}>
                <Plus className="w-4 h-4 mr-2" />
                New Manuscript
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Manuscript" : "New Manuscript"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter manuscript title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
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
                    placeholder="Target journal name"
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
                    />
                  </div>
                  <div>
                    <Label htmlFor="targetDate">Target Date</Label>
                    <Input
                      id="targetDate"
                      type="date"
                      value={formData.targetDate}
                      onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Add any notes about this manuscript"
                    rows={4}
                  />
                </div>

                <Button type="submit" className="w-full">
                  {editingId ? "Update Manuscript" : "Create Manuscript"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search manuscripts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Manuscripts List */}
        {manuscripts.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No manuscripts yet. Create your first manuscript to get started.</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {manuscripts.map((manuscript: any) => (
              <Card key={manuscript.id} className="p-6 card-shadow hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/manuscript-detail?id=${manuscript.id}`)}>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{manuscript.title}</h3>
                      <span className={`badge ${statusColors[manuscript.status]}`}>
                        {statusLabels[manuscript.status]}
                      </span>
                    </div>
                    {manuscript.journal && (
                      <p className="text-sm text-muted-foreground">Journal: {manuscript.journal}</p>
                    )}
                    {manuscript.submissionDate && (
                      <p className="text-sm text-muted-foreground">
                        Submitted: {format(new Date(manuscript.submissionDate), "MMM dd, yyyy")}
                      </p>
                    )}
                    {manuscript.notes && (
                      <p className="text-sm mt-2 text-foreground">{manuscript.notes}</p>
                    )}
                  </div>
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(manuscript)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(manuscript.id)}
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
