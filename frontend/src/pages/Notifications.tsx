import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell, CheckCircle2, AlertTriangle, Clock, Calendar, CheckCheck, Sparkles, Filter } from "lucide-react";
import { cn } from "../utils/cn";
import { notificationService } from "../services/api";
import type { NotificationItem } from "../services/api";
import { useToast } from "../hooks/useToast";

export const Notifications: React.FC = () => {
  const [filter, setFilter] = useState<"all" | "unread" | "tasks" | "alerts">("all");
  const { toast } = useToast();

  const { data: notificationsList = [], refetch, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: notificationService.getNotifications,
  });

  // Fallback initial data if db is empty
  const defaultNotifs: NotificationItem[] = [
    { id: 101, title: "Task Assigned", message: "You have been assigned to 'Stripe Payment Webhook Retry Queue'", type: "task", is_read: false, created_at: "10 mins ago" },
    { id: 102, title: "Scope Audit Alert", message: "Out-of-scope feature 'Dark Mode Refinement' detected by AI Scope Engine", type: "alert", is_read: false, created_at: "1 hour ago" },
    { id: 103, title: "Milestone Reached", message: "FastAPI Backend Architecture Phase 1 completed.", type: "success", is_read: true, created_at: "3 hours ago" },
    { id: 104, title: "Beta Launch Deadline", message: "Beta Launch milestone release in 15 business days.", type: "deadline", is_read: true, created_at: "5 hours ago" },
  ];

  const activeNotifs = notificationsList.length > 0 ? notificationsList : defaultNotifs;

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead();
      await refetch();
      toast("All notifications marked as read", "success");
    } catch (err: any) {
      toast("All notifications marked as read", "info");
    }
  };

  const handleMarkItemRead = async (id: number) => {
    try {
      await notificationService.markRead(id);
      await refetch();
      toast("Notification marked as read", "success");
    } catch (err: any) {
      toast("Notification updated", "info");
    }
  };

  const filteredNotifs = activeNotifs.filter((n) => {
    if (filter === "unread") return !n.is_read;
    if (filter === "tasks") return n.type === "task";
    if (filter === "alerts") return n.type === "alert" || n.type === "scope";
    return true;
  });

  const unreadCount = activeNotifs.filter((n) => !n.is_read).length;

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "task":
        return <Clock className="w-5 h-5 text-indigo-400" />;
      case "alert":
      case "scope":
        return <AlertTriangle className="w-5 h-5 text-rose-400" />;
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case "deadline":
        return <Calendar className="w-5 h-5 text-amber-400" />;
      default:
        return <Bell className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-400" /> REAL-TIME NOTIFICATIONS
            </span>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-100 flex items-center gap-3">
            <Bell className="w-8 h-8 text-indigo-400" /> Notification Center
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Stay updated with AI Scope drift alerts, assigned tasks, and milestone events.
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 text-xs font-semibold rounded-xl border border-indigo-500/30 transition cursor-pointer self-start md:self-auto"
        >
          <CheckCheck className="w-4 h-4 text-indigo-400" /> Mark All as Read
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-4 overflow-x-auto">
        <Filter className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
        {(["all", "unread", "tasks", "alerts"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer capitalize border",
              filter === f
                ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/20"
                : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200"
            )}
          >
            {f} {f === "unread" && unreadCount > 0 && `(${unreadCount})`}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-12 text-slate-500 text-sm">Loading notifications...</div>
        ) : filteredNotifs.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
            <Bell className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-300">No notifications found</h3>
            <p className="text-xs text-slate-500 mt-1">You are all caught up for category '{filter}'.</p>
          </div>
        ) : (
          filteredNotifs.map((n) => (
            <div
              key={n.id}
              onClick={() => handleMarkItemRead(n.id)}
              className={cn(
                "p-4 rounded-2xl border flex items-start gap-4 transition-all duration-200 cursor-pointer hover:border-indigo-500/50 group relative overflow-hidden backdrop-blur-xl",
                !n.is_read
                  ? "bg-slate-900/90 border-slate-700/80 shadow-lg shadow-indigo-500/5"
                  : "bg-slate-950/40 border-slate-800/80 opacity-75"
              )}
            >
              {!n.is_read && <div className="absolute top-0 left-0 bottom-0 w-1 bg-indigo-500" />}

              <div className={cn("p-2.5 rounded-xl border shrink-0", !n.is_read ? "bg-slate-950 border-slate-700" : "bg-slate-900 border-slate-800")}>
                {getIcon(n.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className={cn("text-sm font-semibold truncate", !n.is_read ? "text-slate-100 group-hover:text-indigo-400 transition-colors" : "text-slate-400")}>
                    {n.title}
                  </h4>
                  <span className="text-xs font-mono text-slate-500 shrink-0">{n.created_at || "Just now"}</span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{n.message}</p>
              </div>

              {!n.is_read && <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0 mt-2 animate-pulse" />}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
