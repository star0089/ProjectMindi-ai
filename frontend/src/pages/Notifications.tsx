import React, { useState } from "react";
import { Bell, CheckCircle2, AlertTriangle, Clock, Calendar, Search } from "lucide-react";
import { cn } from "../utils/cn";

export const Notifications = () => {
  const [filter, setFilter] = useState("all");

  const notifs = [
    { id: 1, type: "task", title: "Task Assigned", desc: "You have been assigned to 'Update API Docs'", time: "10 mins ago", read: false },
    { id: 2, type: "alert", title: "Risk Increased", desc: "Project Alpha risk score increased to 75%", time: "1 hour ago", read: false },
    { id: 3, type: "success", title: "Milestone Reached", desc: "Frontend Phase 1 completed.", time: "3 hours ago", read: true },
    { id: 4, type: "deadline", title: "Deadline Tomorrow", desc: "Submit Q3 Report by 5 PM.", time: "5 hours ago", read: true },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "task": return <Clock className="w-5 h-5 text-blue-500" />;
      case "alert": return <AlertTriangle className="w-5 h-5 text-rose-500" />;
      case "success": return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case "deadline": return <Calendar className="w-5 h-5 text-amber-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Notification Center</h1>
          <p className="text-muted-foreground mt-1">Stay updated with project events and tasks.</p>
        </div>
        <button className="text-sm text-primary hover:underline font-medium">
          Mark all as read
        </button>
      </div>

      <div className="flex items-center gap-4 border-b pb-4">
        {["all", "unread", "tasks", "alerts"].map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors",
              filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-secondary"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {notifs.map(n => (
          <div 
            key={n.id} 
            className={cn(
              "p-4 border rounded-2xl flex items-start gap-4 transition-all hover:shadow-md",
              !n.read ? "bg-card border-primary/20 shadow-sm" : "bg-muted/30"
            )}
          >
            <div className={cn(
              "p-2 rounded-xl",
              !n.read ? "bg-background shadow-sm" : "bg-muted"
            )}>
              {getIcon(n.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className={cn("font-medium", !n.read && "text-foreground font-semibold")}>{n.title}</h4>
                <span className="text-xs text-muted-foreground">{n.time}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{n.desc}</p>
            </div>
            {!n.read && (
              <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
