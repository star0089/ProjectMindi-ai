import React from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/api";
import { StatCard } from "../components/common/StatCard";
import { ProgressCard } from "../components/common/ProgressCard";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";
import { 
  FolderKanban, 
  CheckSquare, 
  AlertTriangle, 
  Calendar,
  Flag,
  CheckCircle2,
  ListTodo
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

  const { stats, recent_projects, recent_tasks, upcoming_deadlines } = data;

  return (
    <div className="space-y-8 animate-page-fade">
      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Projects"
          value={stats.total_projects}
          icon={FolderKanban}
          iconClassName="text-primary bg-primary/10"
          trend={{ value: `${stats.active_projects} active`, isPositive: true, label: "current portfolios" }}
        />
        <StatCard
          title="Completed Projects"
          value={stats.completed_projects}
          icon={CheckCircle2}
          iconClassName="text-emerald-500 bg-emerald-500/10"
          trend={{ value: `${stats.total_projects - stats.completed_projects} pending`, isPositive: true, label: "in workflow" }}
        />
        <StatCard
          title="Tasks Completed"
          value={stats.completed_tasks}
          icon={CheckSquare}
          iconClassName="text-emerald-500 bg-emerald-500/10"
          trend={{ value: `${stats.pending_tasks} pending`, isPositive: true, label: "to execute" }}
        />
        <StatCard
          title="Overdue Tasks"
          value={stats.overdue_tasks}
          icon={AlertTriangle}
          iconClassName="text-rose-500 bg-rose-500/10"
          trend={{ value: `${stats.overdue_tasks > 0 ? "Action required" : "On track"}`, isPositive: stats.overdue_tasks === 0, label: "deadline status" }}
        />
      </div>

      {/* Progress & Milestones Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ProgressCard
          title="Overall System Progress"
          percentage={stats.overall_progress_percentage}
          label={`${stats.completed_tasks} of ${stats.total_tasks} total tasks finished`}
          className="lg:col-span-2"
        />
        <div className="p-6 rounded-2xl border bg-card text-card-foreground shadow-premium flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active Milestones</span>
            <h3 className="font-sans font-bold text-3xl tracking-tight">{stats.active_milestones}</h3>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Flag className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Activity Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="p-6 rounded-2xl border bg-card text-card-foreground shadow-premium space-y-4">
          <h3 className="font-sans font-bold text-base flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-primary" />
            Recent Projects
          </h3>
          {recent_projects.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">No projects created yet.</p>
          ) : (
            <div className="divide-y space-y-2">
              {recent_projects.map((p) => (
                <div key={p.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">{p.name}</p>
                    <span className="text-muted-foreground">{p.completed_tasks_count}/{p.total_tasks_count} Tasks</span>
                  </div>
                  <span className="font-bold text-primary">{p.progress_percentage}%</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Tasks */}
        <div className="p-6 rounded-2xl border bg-card text-card-foreground shadow-premium space-y-4">
          <h3 className="font-sans font-bold text-base flex items-center gap-2">
            <ListTodo className="w-4 h-4 text-primary" />
            Recent Tasks
          </h3>
          {recent_tasks.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">No tasks created yet.</p>
          ) : (
            <div className="divide-y space-y-2">
              {recent_tasks.map((t) => (
                <div key={t.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">{t.title}</p>
                    <span className="text-muted-foreground capitalize">{t.priority} priority</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary text-foreground capitalize">
                    {t.status.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Deadlines */}
        <div className="p-6 rounded-2xl border bg-card text-card-foreground shadow-premium space-y-4">
          <h3 className="font-sans font-bold text-base flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            Upcoming Deadlines
          </h3>
          {upcoming_deadlines.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">No upcoming deadlines.</p>
          ) : (
            <div className="divide-y space-y-2">
              {upcoming_deadlines.map((d) => (
                <div key={d.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">{d.title}</p>
                    {d.project_name && <span className="text-muted-foreground">{d.project_name}</span>}
                  </div>
                  <span className="font-semibold text-muted-foreground">
                    {new Date(d.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
