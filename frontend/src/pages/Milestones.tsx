import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { milestoneService, projectService } from "../services/api";
import type { Milestone } from "../types";
import { MilestoneModal } from "../components/milestone/MilestoneModal";
import { DeleteConfirmModal } from "../components/common/DeleteConfirmModal";
import { ProgressCard } from "../components/common/ProgressCard";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";
import { EmptyState } from "../components/common/EmptyState";
import { useToast } from "../hooks/useToast";
import { Flag, Plus, CheckCircle2, Clock, Filter, Trash2, Edit2 } from "lucide-react";
import { cn } from "../utils/cn";

export const Milestones: React.FC = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [selectedProjectId, setSelectedProjectId] = useState<number | undefined>(undefined);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [deletingMilestone, setDeletingMilestone] = useState<Milestone | null>(null);

  // Queries
  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: () => projectService.getProjects(),
  });

  const { data: milestones, isLoading, error } = useQuery({
    queryKey: ["milestones", selectedProjectId],
    queryFn: () => milestoneService.getMilestones(selectedProjectId),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: milestoneService.createMilestone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["milestones"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] });
      setIsModalOpen(false);
      toast("Milestone created successfully!", "success");
    },
    onError: () => toast("Failed to create milestone", "error")
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Milestone> }) => milestoneService.updateMilestone(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["milestones"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] });
      setIsModalOpen(false);
      setEditingMilestone(null);
      toast("Milestone updated!", "success");
    },
    onError: () => toast("Failed to update milestone", "error")
  });

  const toggleCompleteMutation = useMutation({
    mutationFn: (id: number) => milestoneService.toggleMilestoneComplete(id),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["milestones"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] });
      toast(
        updated.completed ? "Milestone marked as completed!" : "Milestone marked as pending",
        updated.completed ? "success" : "info"
      );
    },
    onError: () => toast("Failed to update milestone completion", "error")
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => milestoneService.deleteMilestone(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["milestones"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] });
      setDeletingMilestone(null);
      toast("Milestone deleted", "info");
    },
    onError: () => toast("Failed to delete milestone", "error")
  });

  const handleCreateOrUpdate = (data: { project_id: number; title: string; deadline: string | null; completed: boolean }) => {
    if (editingMilestone) {
      updateMutation.mutate({ id: editingMilestone.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const totalCount = milestones?.length || 0;
  const completedCount = milestones?.filter((m) => m.completed).length || 0;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "No deadline set";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <div className="space-y-6 animate-page-fade">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b">
        <div className="flex items-center gap-3">
          {/* Project Filter */}
          <div className="flex items-center gap-2 bg-card border rounded-xl px-3 py-2 text-xs">
            <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
            <select
              value={selectedProjectId || ""}
              onChange={(e) => setSelectedProjectId(e.target.value ? Number(e.target.value) : undefined)}
              className="bg-transparent focus:outline-none font-medium cursor-pointer"
            >
              <option value="">All Projects</option>
              {projects?.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Create Milestone Trigger */}
        <button
          onClick={() => { setEditingMilestone(null); setIsModalOpen(true); }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-primary text-primary-foreground shadow hover:bg-primary/95 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Milestone</span>
        </button>
      </div>

      {/* Progress card overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ProgressCard
          title="Overall Milestone Completion"
          percentage={completionPercentage}
          label={`${completedCount} of ${totalCount} milestones completed`}
          className="md:col-span-2"
        />
        <div className="p-6 rounded-2xl border bg-card text-card-foreground shadow-premium flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active Checkpoints</span>
            <h3 className="font-sans font-bold text-2xl tracking-tight mt-1">{totalCount - completedCount}</h3>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Milestones List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <LoadingSkeleton key={i} variant="card" />
          ))}
        </div>
      ) : error || !milestones ? (
        <EmptyState
          title="Failed to Load Milestones"
          description="Ensure backend API service is running."
          icon={Flag}
        />
      ) : milestones.length === 0 ? (
        <EmptyState
          title="No Milestones Defined"
          description="Create your first milestone checkpoint to measure project release phases."
          icon={Flag}
          actionLabel="Create Milestone"
          onAction={() => { setEditingMilestone(null); setIsModalOpen(true); }}
        />
      ) : (
        <div className="space-y-3">
          {milestones.map((m) => (
            <div 
              key={m.id}
              className="p-5 rounded-2xl border bg-card text-card-foreground shadow-premium flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-md"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <button
                  onClick={() => toggleCompleteMutation.mutate(m.id)}
                  className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                    m.completed ? "bg-emerald-500 border-emerald-500 text-white" : "border-muted-foreground/40 hover:border-primary"
                  )}
                >
                  {m.completed && <CheckCircle2 className="w-4 h-4" />}
                </button>

                <div className="min-w-0">
                  <h4 className={cn("font-sans font-bold text-base truncate", m.completed && "line-through text-muted-foreground")}>
                    {m.title}
                  </h4>
                  {m.project_name && (
                    <span className="text-xs text-muted-foreground">Project: {m.project_name}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Due: {formatDate(m.deadline)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setEditingMilestone(m); setIsModalOpen(true); }}
                    className="p-1.5 rounded-lg border hover:bg-secondary text-muted-foreground transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingMilestone(m)}
                    className="p-1.5 rounded-lg border hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <MilestoneModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
        milestone={editingMilestone}
        projects={projects || []}
        defaultProjectId={selectedProjectId}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteConfirmModal
        isOpen={!!deletingMilestone}
        title="Delete Milestone"
        message={`Are you sure you want to delete milestone '${deletingMilestone?.title}'?`}
        onClose={() => setDeletingMilestone(null)}
        onConfirm={() => deletingMilestone && deleteMutation.mutate(deletingMilestone.id)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
