import { Activity as ActivityIcon, CheckCircle2, Clock, GitCommit, AlertCircle } from "lucide-react";

export const Activity = () => {
  const activities = [
    { id: 1, type: "create", title: "Project Alpha Created", desc: "Jane Doe created a new project.", time: "2 hours ago", icon: GitCommit, color: "text-blue-500", bg: "bg-blue-500/10" },
    { id: 2, type: "update", title: "Task Status Changed", desc: "John moved 'Database Schema' to In Progress.", time: "4 hours ago", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { id: 3, type: "complete", title: "Milestone Completed", desc: "Backend Phase 1 was marked as completed.", time: "1 day ago", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { id: 4, type: "risk", title: "Risk Detected", desc: "AI detected a potential delay in the timeline.", time: "2 days ago", icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-500/10" },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <ActivityIcon className="w-8 h-8 text-primary" />
          Activity Timeline
        </h1>
        <p className="text-muted-foreground mt-1">Chronological history of all project events and actions.</p>
      </div>

      <div className="relative pl-6 border-l-2 border-muted space-y-8 mt-8">
        {activities.map((act) => (
          <div key={act.id} className="relative">
            <div className={`absolute -left-[35px] w-12 h-12 rounded-full border-4 border-background flex items-center justify-center ${act.bg}`}>
              <act.icon className={`w-5 h-5 ${act.color}`} />
            </div>
            <div className="bg-card border rounded-2xl p-5 shadow-sm ml-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{act.title}</h3>
                <span className="text-sm font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                  {act.time}
                </span>
              </div>
              <p className="text-muted-foreground mt-2">{act.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
