import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectService } from "../services/api";
import { ProjectCard } from "../components/project/ProjectCard";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";
import { EmptyState } from "../components/common/EmptyState";
import { FolderKanban, Plus, X } from "lucide-react";

export const Projects: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [projectDeadline, setProjectDeadline] = useState("");

  const { data: projects, isLoading, error } = useQuery({
    queryKey: ["projects"],
    queryFn: projectService.getProjects,
  });

  const createProjectMutation = useMutation({
    mutationFn: projectService.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setIsModalOpen(false);
      setProjectName("");
      setProjectDesc("");
      setProjectDeadline("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    createProjectMutation.mutate({
      name: projectName,
      description: projectDesc || null,
      status: "active",
      deadline: projectDeadline || null,
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-page-fade">
        {[1, 2, 3].map((i) => (
          <LoadingSkeleton key={i} variant="card" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-page-fade">
      {/* Portfolio header */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b">
        <div>
          <h2 className="text-base text-muted-foreground">Manage your hackathon portfolio projects</h2>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-primary-foreground shadow hover:bg-primary/95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {error || !projects || projects.length === 0 ? (
        <EmptyState
          title="No Projects Initiated"
          description="Create your first project configuration to spin up tasks, timelines and risk mitigations."
          icon={FolderKanban}
          actionLabel="Create Project"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              taskCount={project.id === 1 ? 4 : 0}
              completedTasks={project.id === 1 ? 1 : 0}
            />
          ))}
        </div>
      )}

      {/* Creation Modal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 bg-card text-card-foreground border rounded-2xl shadow-premium animate-scale-in">
            <div className="flex items-center justify-between mb-6 pb-2 border-b">
              <h3 className="font-sans font-bold text-lg">Add Project Specification</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-secondary text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. ProjectPilot AI Setup"
                  className="w-full px-3.5 py-2 rounded-xl border bg-secondary/30 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Description
                </label>
                <textarea
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  placeholder="Enter scope details or milestones description..."
                  rows={3}
                  className="w-full px-3.5 py-2 rounded-xl border bg-secondary/30 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Target Deadline
                </label>
                <input
                  type="date"
                  value={projectDeadline}
                  onChange={(e) => setProjectDeadline(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border bg-secondary/30 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background"
                />
              </div>

              <div className="flex items-center gap-3 justify-end pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold border hover:bg-secondary transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createProjectMutation.isPending}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-primary-foreground shadow hover:bg-primary/95 disabled:opacity-55 transition-all"
                >
                  {createProjectMutation.isPending ? "Creating..." : "Save Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
