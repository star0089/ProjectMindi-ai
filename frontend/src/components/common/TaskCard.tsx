import React from "react";
import type { Task, TaskStatus } from "../../types";
import { Calendar, User, ArrowUpRight } from "lucide-react";
import { cn } from "../../utils/cn";

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onClick
}) => {
  // Priority styles
  const priorityStyles = {
    low: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/10",
    medium: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/10",
    high: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/10",
    critical: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 animate-pulse",
  };

  // Status badge styles
  const statusLabels: Record<TaskStatus, string> = {
    todo: "To Do",
    in_progress: "In Progress",
    review: "In Review",
    testing: "Testing",
    done: "Completed",
  };

  const statusDotColors: Record<TaskStatus, string> = {
    todo: "bg-slate-400",
    in_progress: "bg-violet-500",
    review: "bg-indigo-500",
    testing: "bg-amber-500",
    done: "bg-emerald-500",
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    });
  };

  return (
    <div 
      onClick={onClick}
      className={cn(
        "p-5 rounded-2xl border bg-card text-card-foreground shadow-premium transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer relative overflow-hidden group",
        task.status === "done" && "opacity-75"
      )}
    >
      {/* Top badges */}
      <div className="flex items-center justify-between mb-3.5">
        <span className={cn(
          "px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider",
          priorityStyles[task.priority] || priorityStyles.medium
        )}>
          {task.priority}
        </span>
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <span className={cn("w-1.5 h-1.5 rounded-full", statusDotColors[task.status] || statusDotColors.todo)} />
          <span className="text-muted-foreground">{statusLabels[task.status] || task.status}</span>
        </div>
      </div>

      {/* Task Content */}
      <div className="mb-4">
        <h4 className={cn(
          "font-sans font-semibold text-sm leading-snug group-hover:text-primary transition-colors flex items-start gap-1",
          task.status === "done" && "line-through text-muted-foreground"
        )}>
          {task.title}
          <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary shrink-0 mt-0.5" />
        </h4>
        {task.description && (
          <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
            {task.description}
          </p>
        )}
      </div>

      {/* Footer assignee & timeline */}
      <div className="flex items-center justify-between pt-3 border-t text-[11px] text-muted-foreground">
        {/* Assignee */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-secondary text-foreground text-[9px] font-bold">
            {task.assignee ? task.assignee.substring(0, 2).toUpperCase() : <User className="w-3 h-3" />}
          </div>
          <span className="truncate max-w-[90px] font-medium">{task.assignee || "Unassigned"}</span>
        </div>

        {/* Dates */}
        {(task.start_date || task.end_date) && (
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-muted-foreground" />
            <span>
              {formatDate(task.start_date)}
              {task.end_date && ` - ${formatDate(task.end_date)}`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
