import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectService } from "../services/api";
import type { Project, ProjectStatus } from "../types";
import { ProjectCard } from "../components/project/ProjectCard";
import { ProjectModal } from "../components/project/ProjectModal";
import { ProjectDetailsDrawer } from "../components/project/ProjectDetailsDrawer";
import { DeleteConfirmModal } from "../components/common/DeleteConfirmModal";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";
import { EmptyState } from "../components/common/EmptyState";
import { useToast } from "../hooks/useToast";
import { FolderKanban, Plus, Search, Filter, ArrowUpDown } from "lucide-react";

export const Projects: React.FC = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const [drawerProject, setDrawerProject] = useState<Project | null>(null);

  // Fetch projects from DB
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ["projects", search, statusFilter, sortBy],
    queryFn: () => projectService.getProjects({ search, status: statusFilter, sort_by: sortBy }),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: projectService.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] });
      setIsModalOpen(false);
      toast("Project created successfully!", "success");
    },
    onError: () => toast("Failed to create project", "error")
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Project> }) => projectService.updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] });
      setIsModalOpen(false);
      setEditingProject(null);
      toast("Project updated successfully!", "success");
    },
    onError: () => toast("Failed to update project", "error")
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => projectService.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] });
      setDeletingProject(null);
      toast("Project deleted successfully", "info");
    },
    onError: () => toast("Failed to delete project", "error")
  });

  const handleCreateOrUpdate = (data: { name: string; description: string | null; status: ProjectStatus; deadline: string | null }) => {
    if (editingProject) {
      updateMutation.mutate({ id: editingProject.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6 animate-page-fade">
      {/* Action Header & Search/Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search bar */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects by title or scope..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border bg-card text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="flex items-center gap-2 bg-card border rounded-xl px-3 py-2 text-xs">
            <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent focus:outline-none font-medium cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-card border rounded-xl px-3 py-2 text-xs">
            <ArrowUpDown className="w-4 h-4 text-muted-foreground shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent focus:outline-none font-medium cursor-pointer"
            >
              <option value="created_at">Newest First</option>
              <option value="name">Name A-Z</option>
              <option value="deadline">Deadline</option>
              <option value="progress">Progress %</option>
            </select>
          </div>
        </div>

        {/* Create Project Trigger */}
        <button
          onClick={() => { setEditingProject(null); setIsModalOpen(true); }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-primary text-primary-foreground shadow hover:bg-primary/95 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Grid List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <LoadingSkeleton key={i} variant="card" />
          ))}
        </div>
      ) : error || !projects || projects.length === 0 ? (
        <EmptyState
          title="No Projects Found"
          description="Create your first project specification to begin tracking tasks, progress meters, and deadlines."
          icon={FolderKanban}
          actionLabel="Create Project"
          onAction={() => { setEditingProject(null); setIsModalOpen(true); }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={(p) => { setEditingProject(p); setIsModalOpen(true); }}
              onDelete={(p) => setDeletingProject(p)}
              onViewDetails={(p) => setDrawerProject(p)}
            />
          ))}
        </div>
      )}

      {/* Modals & Details Drawer */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
        project={editingProject}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteConfirmModal
        isOpen={!!deletingProject}
        title="Delete Project"
        message={`Are you sure you want to delete '${deletingProject?.name}'? This will permanently delete all linked tasks and milestones.`}
        onClose={() => setDeletingProject(null)}
        onConfirm={() => deletingProject && deleteMutation.mutate(deletingProject.id)}
        isLoading={deleteMutation.isPending}
      />

      <ProjectDetailsDrawer
        isOpen={!!drawerProject}
        onClose={() => setDrawerProject(null)}
        project={drawerProject}
      />
    </div>
  );
};
