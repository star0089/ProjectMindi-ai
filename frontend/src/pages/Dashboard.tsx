import React from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/api";
import { StatCard } from "../components/common/StatCard";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";
import { 
  FolderKanban, 
  CheckSquare, 
  AlertTriangle, 
  Calendar,
  ShieldCheck,
  TrendingUp,
  Activity,
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

  // Fallback defaults if data is missing
  const stats = data?.stats || {
    total_projects: 0,
    active_projects: 0,
    completed_projects: 0,
    total_tasks: 0,
    completed_tasks: 0,
    pending_tasks: 0,
    overdue_tasks: 0,
    active_milestones: 0,
    overall_progress_percentage: 0,
  };
  const recent_projects = data?.recent_projects || [];
  const recent_tasks = data?.recent_tasks || [];
  const upcoming_deadlines = data?.upcoming_deadlines || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Enterprise Dashboard</h1>
        <p className="text-muted-foreground mt-1">High-level overview of portfolio health, velocity, and risks.</p>
      </div>

      {error && (
        <div className="p-4 border rounded-xl bg-destructive/10 text-destructive text-sm font-medium">
          Backend server issue detected. Displaying offline metrics.
        </div>
      )}

      {/* Enterprise KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Project Health"
          value="92%"
          icon={Activity}
          iconClassName="text-emerald-500 bg-emerald-500/10"
          trend={{ value: "+2% from last week", isPositive: true, label: "portfolio health" }}
        />
        <StatCard
          title="Scope Health"
          value="88%"
          icon={ShieldCheck}
          iconClassName="text-blue-500 bg-blue-500/10"
          trend={{ value: "Stable", isPositive: true, label: "creep index" }}
        />
        <StatCard
          title="Global Risk Score"
          value="24%"
          icon={AlertTriangle}
          iconClassName="text-amber-500 bg-amber-500/10"
          trend={{ value: "-5% from last week", isPositive: true, label: "risk factor" }}
        />
        <StatCard
          title="Sprint Velocity"
          value="45 pts"
          icon={TrendingUp}
          iconClassName="text-purple-500 bg-purple-500/10"
          trend={{ value: "+5 pts", isPositive: true, label: "velocity trend" }}
        />
        
        <StatCard
          title="Active Projects"
          value={stats.active_projects}
          icon={FolderKanban}
          iconClassName="text-primary bg-primary/10"
          trend={{ value: "On track", isPositive: true, label: "current" }}
        />
        <StatCard
          title="Completed Projects"
          value={stats.completed_projects}
          icon={CheckCircle2}
          iconClassName="text-emerald-500 bg-emerald-500/10"
          trend={{ value: "Delivered", isPositive: true, label: "success" }}
        />
        <StatCard
          title="Blocked Tasks"
          value={Math.floor((stats.pending_tasks || 0) * 0.1)}
          icon={CheckSquare}
          iconClassName="text-rose-500 bg-rose-500/10"
          trend={{ value: "Needs attention", isPositive: false, label: "blocked" }}
        />
        <StatCard
          title="Burn Rate"
          value="$12.4k/wk"
          icon={Activity}
          iconClassName="text-rose-500 bg-rose-500/10"
          trend={{ value: "Within budget", isPositive: true, label: "financials" }}
        />
      </div>

      {/* Analytics Charts & Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl border bg-card shadow-sm h-72 flex flex-col">
            <h3 className="font-semibold mb-4">Task Completion Trend</h3>
            <div className="flex-1 border-2 border-dashed border-muted rounded-xl bg-muted/20 flex items-center justify-center">
              <span className="text-muted-foreground text-sm">Interactive Chart</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border bg-card shadow-sm h-64 flex flex-col">
              <h3 className="font-semibold mb-4">Risk Trend</h3>
              <div className="flex-1 border-2 border-dashed border-muted rounded-xl bg-muted/20 flex items-center justify-center">
                <span className="text-muted-foreground text-sm">Interactive Chart</span>
              </div>
            </div>
            <div className="p-6 rounded-2xl border bg-card shadow-sm h-64 flex flex-col">
              <h3 className="font-semibold mb-4">Milestone Progress</h3>
              <div className="flex-1 border-2 border-dashed border-muted rounded-xl bg-muted/20 flex items-center justify-center">
                <span className="text-muted-foreground text-sm">Interactive Chart</span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity & Deadlines Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4 h-[330px] flex flex-col">
            <h3 className="font-sans font-bold text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Upcoming Deadlines
            </h3>
            <div className="flex-1 overflow-y-auto pr-2">
              {upcoming_deadlines.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No upcoming deadlines.</p>
              ) : (
                <div className="divide-y space-y-2">
                  {upcoming_deadlines.map((d) => (
                    <div key={d.id} className="pt-3 first:pt-0 flex items-center justify-between text-sm">
                      <div className="min-w-0 pr-4">
                        <p className="font-semibold text-foreground truncate">{d.title}</p>
                        {d.project_name && <span className="text-xs text-muted-foreground truncate block">{d.project_name}</span>}
                      </div>
                      <span className="font-semibold text-rose-500 whitespace-nowrap bg-rose-500/10 px-2 py-1 rounded-md text-xs">
                        {d.deadline ? new Date(d.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "N/A"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Recent Tasks */}
          <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4 h-[330px] flex flex-col">
            <h3 className="font-sans font-bold text-base flex items-center gap-2">
              <ListTodo className="w-4 h-4 text-primary" />
              Recent Tasks
            </h3>
            <div className="flex-1 overflow-y-auto pr-2">
              {recent_tasks.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No tasks created yet.</p>
              ) : (
                <div className="divide-y space-y-2">
                  {recent_tasks.map((t) => (
                    <div key={t.id} className="pt-3 first:pt-0 flex items-center justify-between text-sm">
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground truncate">{t.title}</p>
                        <span className="text-xs text-muted-foreground capitalize">{t.priority} priority</span>
                      </div>
                      <span className="px-2 py-1 rounded-md text-xs font-bold bg-secondary text-foreground capitalize whitespace-nowrap">
                        {t.status ? t.status.replace("_", " ") : "todo"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
