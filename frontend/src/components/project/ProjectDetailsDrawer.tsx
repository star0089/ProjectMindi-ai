import React from "react";
import type { Project } from "../../types";
import { useQuery } from "@tanstack/react-query";
import { taskService, milestoneService } from "../../services/api";
import { TaskCard } from "../common/TaskCard";
import { X, CheckCircle2 } from "lucide-react";
import { cn } from "../../utils/cn";

interface ProjectDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

export const ProjectDetailsDrawer: React.FC<ProjectDetailsDrawerProps> = ({
  isOpen,
  onClose,
  project
}) => {
  const { data: tasks } = useQuery({
    queryKey: ["tasks", project?.id],
    queryFn: () => taskService.getTasks({ project_id: project!.id }),
    enabled: !!project && isOpen,
  });

  const { data: milestones } = useQuery({
    queryKey: ["milestones", project?.id],
    queryFn: () => milestoneService.getMilestones(project!.id),
    enabled: !!project && isOpen,
  });

  if (!isOpen || !project) return null;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "No deadline set";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <div className="fixed top-0 bottom-0 right-0 z-50 w-full max-w-xl bg-card text-card-foreground border-l shadow-2xl flex flex-col animate-slide-left">
        {/* Header */}
        <div className="p-6 border-b flex items-start justify-between gap-4 bg-muted/20">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 capitalize">
                {project.status.replace("_", " ")}
              </span>
              <span className="text-xs text-muted-foreground">ID: #{project.id}</span>
            </div>
            <h2 className="font-sans font-bold text-xl leading-tight">{project.name}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl border hover:bg-secondary text-muted-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Project Description
            </h4>
            <p className="text-sm text-foreground leading-relaxed bg-secondary/20 p-4 rounded-xl border">
              {project.description || "No specific description has been added for this project."}
            </p>
          </div>

          {/* Key Metrics Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl border bg-secondary/20">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">Progress</span>
              <span className="font-bold text-base text-primary">{project.progress_percentage}%</span>
            </div>
            <div className="p-3 rounded-xl border bg-secondary/20">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">Tasks</span>
              <span className="font-bold text-base text-foreground">{project.completed_tasks_count}/{project.total_tasks_count}</span>
            </div>
            <div className="p-3 rounded-xl border bg-secondary/20">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">Overdue</span>
              <span className={cn("font-bold text-base", project.overdue_tasks_count > 0 ? "text-rose-500" : "text-foreground")}>
                {project.overdue_tasks_count}
              </span>
            </div>
            <div className="p-3 rounded-xl border bg-secondary/20">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">Milestones</span>
              <span className="font-bold text-base text-foreground">{project.completed_milestones_count}/{project.milestones_count}</span>
            </div>
          </div>

          {/* Milestones list section */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span>Project Milestones</span>
              <span>({milestones?.length || 0})</span>
            </h4>

            {milestones && milestones.length > 0 ? (
              <div className="space-y-2">
                {milestones.map((m) => (
                  <div key={m.id} className="p-3 rounded-xl border bg-card flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className={cn("w-4 h-4", m.completed ? "text-emerald-500" : "text-muted-foreground/40")} />
                      <span className={cn("font-semibold", m.completed && "line-through text-muted-foreground")}>{m.title}</span>
                    </div>
                    <span className="text-muted-foreground">{formatDate(m.deadline)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">No milestones configured.</p>
            )}
          </div>

          {/* Tasks list section */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span>Linked Tasks</span>
              <span>({tasks?.length || 0})</span>
            </h4>

            {tasks && tasks.length > 0 ? (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">No tasks created under this project.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
