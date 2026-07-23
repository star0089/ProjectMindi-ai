import React from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Clock, 
  Flag,
  ShieldAlert, 
  BrainCircuit, 
  Settings, 
  ShieldCheck,
  X,
  Sparkles,
  LineChart,
  ClipboardList,
  FileText,
  Lightbulb,
  TrendingUp,
  Users,
  Calendar,
  Activity,
  Bell
} from "lucide-react";
import { cn } from "../../utils/cn";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const menuItems = [
    { name: "Enterprise Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Team Management", path: "/team", icon: Users },
    { name: "AI Planner", path: "/planner", icon: Sparkles },
    { name: "Projects", path: "/projects", icon: FolderKanban },
    { name: "Task Board", path: "/tasks", icon: CheckSquare },
    { name: "Timeline", path: "/timeline", icon: Clock },
    { name: "Calendar", path: "/calendar", icon: Calendar },
    { name: "Milestones", path: "/milestones", icon: Flag },
    { name: "Scope Guardian", path: "/scope", icon: ShieldCheck },
    { name: "Risk Center", path: "/risk", icon: ShieldAlert },
    { name: "Analytics", path: "/analytics", icon: LineChart },
    { name: "Reports", path: "/reports", icon: FileText },
    { name: "Activity", path: "/activity", icon: Activity },
    { name: "Notifications", path: "/notifications", icon: Bell },
    { name: "AI Insights", path: "/insights", icon: LineChart },
    { name: "Standups", path: "/standup", icon: ClipboardList },
    { name: "Exec Summary", path: "/executive-summary", icon: FileText },
    { name: "Recommendations", path: "/recommendations", icon: Lightbulb },
    { name: "Predictions", path: "/prediction", icon: TrendingUp },
    { name: "AI Assistant", path: "/chat", icon: BrainCircuit },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 border-r bg-card text-card-foreground transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-violet-500 shadow-md">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <span className="font-sans font-bold text-lg tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              ProjectPilot <span className="text-primary">AI</span>
            </span>
          </div>
          <button 
            className="p-1 rounded-md hover:bg-muted lg:hidden" 
            onClick={() => setIsOpen(false)}
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group relative",
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn(
                    "w-5 h-5 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )} />
                  <span>{item.name}</span>
                  {isActive && (
                    <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User profile footer */}
        <div className="p-4 border-t bg-muted/40">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary/80 cursor-pointer transition-colors">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-semibold text-sm shadow">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold truncate">Jane Doe</h4>
              <p className="text-xs text-muted-foreground truncate">Lead Architect</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
