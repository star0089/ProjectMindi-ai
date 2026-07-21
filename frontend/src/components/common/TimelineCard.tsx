import React from "react";
import { Milestone } from "../../types";
import { CheckCircle2, Clock, MapPin, ArrowRight } from "lucide-react";
import { cn } from "../../utils/cn";

interface TimelineCardProps {
  milestone: Milestone;
  index: number;
}

export const TimelineCard: React.FC<TimelineCardProps> = ({ milestone, index }) => {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "TBD";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <div className="flex gap-4 md:gap-6 relative group">
      {/* Node indicator */}
      <div className="flex flex-col items-center">
        <div className={cn(
          "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all z-10",
          milestone.completed 
            ? "bg-green-500 border-green-500 text-white shadow-md shadow-green-500/20" 
            : "bg-background border-muted-foreground/30 text-muted-foreground group-hover:border-primary"
        )}>
          {milestone.completed ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <span className="text-xs font-semibold">{index + 1}</span>
          )}
        </div>
        {/* Timeline Connector Line */}
        <div className="w-0.5 h-full bg-border group-last:bg-transparent absolute top-8 bottom-0" />
      </div>

      {/* Content card */}
      <div className="flex-1 pb-8">
        <div className="p-5 rounded-2xl border bg-card text-card-foreground shadow-premium transition-all group-hover:shadow-md group-hover:-translate-y-0.5">
          {/* Phase label & Deadline */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            {milestone.phase && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary text-foreground border uppercase tracking-wider">
                {milestone.phase}
              </span>
            )}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span>Due: {formatDate(milestone.deadline)}</span>
            </div>
          </div>

          {/* Title */}
          <h4 className={cn(
            "font-sans font-bold text-base mb-1.5 transition-colors",
            milestone.completed ? "text-foreground/80" : "text-foreground group-hover:text-primary"
          )}>
            {milestone.title}
          </h4>

          {/* Description stub */}
          <p className="text-xs text-muted-foreground leading-relaxed">
            {milestone.completed 
              ? "Requirement met. All associated tasks passed audit reviews." 
              : "Ongoing tasks linked to this milestone are actively tracked."}
          </p>
        </div>
      </div>
    </div>
  );
};
