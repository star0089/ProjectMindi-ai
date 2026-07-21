import React from "react";
import { Project } from "../../types";
import { Clock, CheckCircle2, AlertTriangle, MoreVertical } from "lucide-react";
import { cn } from "../../utils/cn";

interface ProjectCardProps {
  project: Project;
  taskCount?: number;
  completedTasks?: number;
  onClick?: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  taskCount = 0,
  completedTasks = 0,
  onClick
}) => {
  // Format deadline
  const formatDeadline = (dateStr: string | null) => {
    if (!dateStr) return "No deadline";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  // Status mapping
  const statusStyles = {
    planning: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    active: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    completed: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
    on_hold: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  };

  const progress = taskCount > 0 ? Math.round((completedTasks / taskCount) * 100) : 0;

  return (
    <div 
      onClick={onClick}
      className="group flex flex-col p-6 rounded-2xl border bg-card text-card-foreground shadow-premium transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <span className={cn(
          "px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize",
          statusStyles[project.status]
        )}>
          {project.status.replace("_", " ")}
        </span>
        <button className="p-1 rounded-md text-muted-foreground hover:bg-secondary transition-colors">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Meta Content */}
      <div className="flex-1">
        <h3 className="font-sans font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors">
          {project.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-6">
          {project.description || "No project description provided."}
        </p>
      </div>

      {/* Progress metrics */}
      <div className="space-y-3 mt-auto">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-muted-foreground">Progress</span>
          <span className="text-foreground">{progress}%</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-primary to-violet-500" 
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Footer date metadata */}
        <div className="flex items-center justify-between pt-3 border-t text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            <span>{formatDeadline(project.deadline)}</span>
          </div>
          <span>{taskCount} Tasks</span>
        </div>
      </div>
    </div>
  );
};
