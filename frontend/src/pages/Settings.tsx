import React from "react";
import { User, Eye, Bell, Settings as SettingsIcon, BrainCircuit, Download } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

export const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
      <div className="pb-4 border-b">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-primary" />
          Application Settings
        </h1>
        <p className="text-muted-foreground mt-1">Manage global preferences, notifications, and application configurations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card settings */}
        <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Profile Preferences
          </h3>
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">Full Name</label>
              <input type="text" defaultValue="Jane Doe" className="w-full px-3 py-2 rounded-xl border bg-background text-sm focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">Work Email Address</label>
              <input type="email" defaultValue="jane.doe@projectpilot.ai" className="w-full px-3 py-2 rounded-xl border bg-background text-sm focus:outline-none" />
            </div>
          </div>
        </div>

        {/* Global theme panel settings */}
        <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            Appearance
          </h3>
          <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/30">
            <div>
              <h4 className="text-sm font-semibold">Dark Mode</h4>
              <p className="text-xs text-muted-foreground">Toggle color mode.</p>
            </div>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-secondary hover:bg-muted text-foreground border transition-all"
            >
              Enable {theme === "light" ? "Dark Theme" : "Light Theme"}
            </button>
          </div>
        </div>

        {/* Notifications panel settings */}
        <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Notifications
          </h3>
          <div className="space-y-3 mt-4">
            {['Email Notifications', 'Push Notifications', 'Weekly Summary', 'Critical Alerts Only'].map(n => (
              <label key={n} className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-primary focus:ring-primary border-muted" />
                <span className="text-sm">{n}</span>
              </label>
            ))}
          </div>
        </div>

        {/* AI Preferences */}
        <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-primary" />
            AI Preferences
          </h3>
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">Auto-Recommendations</label>
              <select className="w-full px-3 py-2 rounded-xl border bg-background text-sm focus:outline-none">
                <option>Always On</option>
                <option>Only on High Risk</option>
                <option>Disabled</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">Insight Frequency</label>
              <select className="w-full px-3 py-2 rounded-xl border bg-background text-sm focus:outline-none">
                <option>Real-time</option>
                <option>Daily Digest</option>
                <option>Weekly Digest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Export settings */}
        <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4 md:col-span-2">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" />
            Export Settings
          </h3>
          <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/30">
            <div>
              <h4 className="text-sm font-semibold">Default Export Format</h4>
              <p className="text-xs text-muted-foreground">Choose the primary format for generated reports.</p>
            </div>
            <select className="px-4 py-2 rounded-xl text-sm font-semibold bg-background border focus:outline-none">
              <option>PDF Document (.pdf)</option>
              <option>Word Document (.docx)</option>
              <option>Spreadsheet (.csv)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
