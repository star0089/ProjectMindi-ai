import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { timelineService, projectService } from "../services/api";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";
import { EmptyState } from "../components/common/EmptyState";
import { Clock, CheckCircle2, AlertCircle, Filter } from "lucide-react";
import { cn } from "../utils/cn";

export const Timeline: React.FC = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<number | undefined>(undefined);

  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: () => projectService.getProjects(),
  });

  const { data: items, isLoading, error } = useQuery({
    queryKey: ["timeline", selectedProjectId],
    queryFn: () => timelineService.getTimeline(selectedProjectId),
  });

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "TBD";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto animate-page-fade">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-6">
            <LoadingSkeleton variant="circle" className="w-8 h-8 shrink-0" />
            <LoadingSkeleton variant="card" className="flex-1" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-page-fade">
      {/* Header & Controls */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b">
        <div className="flex items-center gap-2 bg-card border rounded-xl px-3 py-2 text-xs">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          <select
            value={selectedProjectId || ""}
            onChange={(e) => setSelectedProjectId(e.target.value ? Number(e.target.value) : undefined)}
            className="bg-transparent focus:outline-none font-medium cursor-pointer"
          >
            <option value="">All Projects Timeline</option>
            {projects?.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {error || !items || items.length === 0 ? (
        <EmptyState
          title="No Timeline Events"
          description="Create project milestones or task due dates to view release timelines."
          icon={Clock}
        />
      ) : (
        <div className="max-w-3xl mx-auto py-4">
          <div className="relative pl-2">
            {items.map((item, idx) => {
              const isOverdue = !item.completed && item.deadline && new Date(item.deadline) < new Date();
              return (
                <div key={item.id} className="flex gap-4 md:gap-6 relative group">
                  {/* Node Icon */}
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all z-10",
                      item.completed 
                        ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20" 
                        : isOverdue 
                        ? "bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-500/20"
                        : "bg-background border-muted-foreground/30 text-muted-foreground group-hover:border-primary"
                    )}>
                      {item.completed ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : isOverdue ? (
                        <AlertCircle className="w-4 h-4" />
                      ) : (
                        <span className="text-xs font-semibold">{idx + 1}</span>
                      )}
                    </div>
                    {/* Line Connector */}
                    <div className="w-0.5 h-full bg-border group-last:bg-transparent absolute top-8 bottom-0" />
                  </div>

                  {/* Details Card */}
                  <div className="flex-1 pb-8">
                    <div className="p-5 rounded-2xl border bg-card text-card-foreground shadow-premium transition-all group-hover:shadow-md">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                            item.type === "milestone" ? "bg-primary/10 text-primary border-primary/20" : "bg-secondary text-foreground"
                          )}>
                            {item.type}
                          </span>
                          {item.project_name && (
                            <span className="text-xs font-medium text-muted-foreground">{item.project_name}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Due: {formatDate(item.deadline)}</span>
                        </div>
                      </div>

                      <h4 className={cn("font-sans font-bold text-base mb-1", item.completed && "text-muted-foreground line-through")}>
                        {item.title}
                      </h4>

                      {isOverdue && (
                        <span className="text-xs font-semibold text-rose-500 flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Overdue Target Date
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
