import React from "react";
import { Sun, Moon, Bell, Search, Menu } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { useLocation } from "react-router-dom";

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // Determine page title based on path
  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case "/":
        return "Dashboard Overview";
      case "/projects":
        return "Projects Portfolio";
      case "/tasks":
        return "Task Board";
      case "/timeline":
        return "Milestone Timeline";
      case "/milestones":
        return "Milestones Management";
      case "/scope":
        return "Scope Guardian";
      case "/risk":
        return "Risk Center";
      case "/chat":
        return "AI Copilot Assistant";
      case "/settings":
        return "Account Settings";
      default:
        return "ProjectPilot AI";
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 border-b bg-background/80 backdrop-blur-md">
      {/* Page Title & Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-1.5 rounded-lg border hover:bg-secondary lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="font-sans font-bold text-lg md:text-xl tracking-tight">
          {getPageTitle(location.pathname)}
        </h1>
      </div>

      {/* Global Actions */}
      <div className="flex items-center gap-4">
        {/* Mock Search Bar */}
        <div className="relative hidden md:block w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tasks, risks, scopes..."
            className="w-full pl-9 pr-4 py-1.5 rounded-xl border bg-secondary/30 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background transition-all"
          />
        </div>

        {/* Notifications Icon Button */}
        <button className="relative p-2 rounded-xl border hover:bg-secondary text-muted-foreground hover:text-foreground transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-background" />
        </button>

        {/* Theme Toggler Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl border hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
          aria-label="Toggle Theme"
        >
          {theme === "light" ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
        </button>
      </div>
    </header>
  );
};
