import React from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/api";
import { StatCard } from "../components/common/StatCard";
import { ProgressCard } from "../components/common/ProgressCard";
import { AIInsightCard } from "../components/common/AIInsightCard";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";
import { 
  Heart, 
  CheckSquare, 
  AlertTriangle, 
  Sparkles,
  Calendar,
  User,
  Activity,
  ShieldCheck
} from "lucide-react";

export const Dashboard: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboardSummary"],
    queryFn: dashboardService.getSummary,
  });

  if (isLoading) {
    return <LoadingSkeleton variant="dashboard" />;
  }

  if (error || !data) {
    return (
      <div className="p-8 border rounded-2xl bg-destructive/5 text-destructive text-center font-medium">
        Failed to load dashboard metrics. Ensure backend server is running.
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-page-fade">
      {/* Overview Stat Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Project Health"
          value={`${data.project_health.score}%`}
          icon={Heart}
          iconClassName="text-rose-500 bg-rose-500/10"
          trend={{ value: data.project_health.status, isPositive: true, label: "Overall state" }}
        />
        <ProgressCard
          title="Overall Progress"
          percentage={data.overall_progress.percentage}
          label={`${data.overall_progress.completed_milestones} / ${data.overall_progress.total_milestones} Milestones`}
        />
        <StatCard
          title="Completed Tasks"
          value={data.tasks_summary.completed}
          icon={CheckSquare}
          iconClassName="text-emerald-500 bg-emerald-500/10"
          trend={{ value: `+${data.tasks_summary.in_progress} active`, isPositive: true, label: "in progress" }}
        />
        <StatCard
          title="Active Risks"
          value={data.active_risks.count}
          icon={AlertTriangle}
          iconClassName="text-amber-500 bg-amber-500/10"
          trend={{ value: `${data.active_risks.items.length} triggering`, isPositive: false, label: "mitigation active" }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left main grid columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI insights panel */}
          <div className="p-6 rounded-2xl border bg-card text-card-foreground shadow-premium space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <h3 className="font-sans font-bold text-lg">Recent AI PM Insights</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.recent_ai_insights.map((insight) => (
                <AIInsightCard
                  key={insight.id}
                  text={insight.text}
                  category={insight.category as any}
                  timestamp={insight.timestamp}
                />
              ))}
            </div>
          </div>

          {/* Scope Health check card */}
          <div className="p-6 rounded-2xl border bg-card text-card-foreground shadow-premium flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <h3 className="font-sans font-bold text-lg">Scope Guardian Metric</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Original specification scope alignment is at <span className="font-semibold text-foreground">{data.scope_health.percentage}%</span>.
                There has been no unauthorized scope creep detected recently.
              </p>
            </div>
            <div className="w-full md:w-48">
              <ProgressCard
                title="Scope Alignment"
                percentage={data.scope_health.percentage}
                className="shadow-none border-0 p-0"
              />
            </div>
          </div>
        </div>

        {/* Right side panels */}
        <div className="space-y-6">
          {/* Upcoming Deadlines list */}
          <div className="p-6 rounded-2xl border bg-card text-card-foreground shadow-premium space-y-4">
            <h3 className="font-sans font-bold text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Upcoming Deadlines
            </h3>
            <div className="divide-y">
              {data.upcoming_deadlines.map((deadline) => (
                <div key={deadline.id} className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{deadline.title}</p>
                    <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-secondary text-foreground capitalize mt-1">
                      {deadline.type}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
                    {new Date(deadline.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Log */}
          <div className="p-6 rounded-2xl border bg-card text-card-foreground shadow-premium space-y-4">
            <h3 className="font-sans font-bold text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              {data.recent_activity.map((activity) => (
                <div key={activity.id} className="flex gap-3 text-xs leading-relaxed">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary font-bold text-[10px] shrink-0">
                    {activity.user.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">{activity.user}</span>
                    <span className="text-muted-foreground"> {activity.action}</span>
                    <span className="text-[10px] text-muted-foreground/60 block mt-0.5">
                      {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
