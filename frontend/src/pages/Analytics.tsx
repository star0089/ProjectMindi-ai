import { TrendingUp, Activity, Clock, Zap } from "lucide-react";

export const Analytics = () => {
  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Productivity Analytics</h1>
          <p className="text-muted-foreground mt-1">Deep insights into team velocity, efficiency, and burn rate.</p>
        </div>
        <select className="px-4 py-2 bg-card border rounded-lg text-sm shadow-sm outline-none focus:ring-2 focus:ring-primary">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>This Quarter</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: "Sprint Velocity", value: "42 pts", trend: "+12%", icon: TrendingUp, color: "text-emerald-500" },
          { title: "Avg Completion Time", value: "3.2 days", trend: "-0.5 days", icon: Clock, color: "text-blue-500" },
          { title: "Daily Productivity", value: "High", trend: "Steady", icon: Zap, color: "text-amber-500" },
          { title: "Project Burn Rate", value: "$4,200", trend: "-5%", icon: Activity, color: "text-rose-500" }
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-card border rounded-2xl shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <stat.icon className={`w-16 h-16 ${stat.color}`} />
            </div>
            <div className="relative z-10">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                {stat.title}
              </h3>
              <p className="text-3xl font-bold mt-3">{stat.value}</p>
              <p className={`text-xs mt-2 font-medium ${stat.trend.startsWith('+') || stat.trend.startsWith('Steady') || stat.trend.includes('-0') ? 'text-emerald-500' : 'text-rose-500'}`}>
                {stat.trend} from last period
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-card border rounded-2xl shadow-sm h-80 flex flex-col">
          <h3 className="font-semibold mb-4">Task Completion Trend</h3>
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-muted rounded-xl bg-muted/20">
            <p className="text-muted-foreground text-sm">Chart Placeholder (Integrate Recharts/Chart.js)</p>
          </div>
        </div>
        <div className="p-6 bg-card border rounded-2xl shadow-sm h-80 flex flex-col">
          <h3 className="font-semibold mb-4">Workload Distribution</h3>
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-muted rounded-xl bg-muted/20">
            <p className="text-muted-foreground text-sm">Chart Placeholder (Integrate Recharts/Chart.js)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
