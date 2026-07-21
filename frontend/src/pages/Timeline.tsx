import React from "react";
import { useQuery } from "@tanstack/react-query";
import { timelineService } from "../services/api";
import { TimelineCard } from "../components/common/TimelineCard";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";
import { EmptyState } from "../components/common/EmptyState";
import { Clock } from "lucide-react";

export const Timeline: React.FC = () => {
  const { data: milestones, isLoading, error } = useQuery({
    queryKey: ["timeline"],
    queryFn: () => timelineService.getTimeline(),
  });

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
      {/* Header */}
      <div className="pb-4 border-b">
        <h2 className="text-base text-muted-foreground">Trace release stages, milestone deadlines, and completion records</h2>
      </div>

      {error || !milestones || milestones.length === 0 ? (
        <EmptyState
          title="No Milestones Defined"
          description="Initialize project timelines to display chronological progression maps."
          icon={Clock}
        />
      ) : (
        <div className="max-w-3xl mx-auto py-4">
          <div className="relative pl-2">
            {milestones.map((milestone, idx) => (
              <TimelineCard 
                key={milestone.id} 
                milestone={milestone} 
                index={idx} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
