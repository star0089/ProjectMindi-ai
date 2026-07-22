import React from "react";
import type { Project } from "../../types";
import { Clock, MoreVertical, Edit2, Trash2, Eye, AlertCircle } from "lucide-react";
import { cn } from "../../utils/cn";

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
  onViewDetails?: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onDelete,
  onViewDetails
}) => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  const formatDeadline = (dateStr: string | null) => {
    if (!dateStr) return "No deadline";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const statusStyles = {
    planning: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    on_hold: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    completed: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    cancelled: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  };

  return (
    <div className="group flex flex-col p-6 rounded-2xl border bg-card text-card-foreground shadow-premium transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 relative">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <span className={cn(
          "px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize",
          statusStyles[project.status] || statusStyles.active
        )}>
          {project.status.replace("_", " ")}
        </span>

        {/* Dropdown menu */}
        <div className="relative">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="p-1 rounded-md text-muted-foreground hover:bg-secondary transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div 
              className="absolute right-0 top-7 z-20 w-36 py-1.5 rounded-xl border bg-card shadow-lg text-xs animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              {onViewDetails && (
                <button
                  onClick={() => { setMenuOpen(false); onViewDetails(project); }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-secondary text-foreground text-left"
                >
                  <Eye className="w-3.5 h-3.5" /> Details
                </button>
              )}
              {onEdit && (
                <button
                  onClick={() => { setMenuOpen(false); onEdit(project); }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-secondary text-foreground text-left"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => { setMenuOpen(false); onDelete(project); }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-rose-500/10 text-rose-500 text-left"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Metadata */}
      <div className="flex-1 cursor-pointer" onClick={() => onViewDetails?.(project)}>
        <h3 className="font-sans font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors">
          {project.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-6">
          {project.description || "No description provided for this project specification."}
        </p>
      </div>

      {/* Progress metrics */}
      <div className="space-y-3 mt-auto">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-muted-foreground">
            {project.completed_tasks_count} / {project.total_tasks_count} Tasks
          </span>
          <span className="font-bold text-foreground">{project.progress_percentage}%</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-primary to-violet-500 transition-all duration-300" 
            style={{ width: `${project.progress_percentage}%` }}
          />
        </div>

        {/* Footer date metadata */}
        <div className="flex items-center justify-between pt-3 border-t text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            <span>{formatDeadline(project.deadline)}</span>
          </div>

          {project.overdue_tasks_count > 0 && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full">
              <AlertCircle className="w-3 h-3" />
              {project.overdue_tasks_count} Overdue
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
