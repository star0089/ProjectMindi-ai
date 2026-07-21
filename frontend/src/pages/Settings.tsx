import React from "react";
import { User, Bell, Shield, Key, Eye } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

export const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="space-y-8 animate-page-fade max-w-3xl">
      {/* Header */}
      <div className="pb-4 border-b">
        <h2 className="text-base text-muted-foreground">Adjust user configurations, active integrations, and global layout options</h2>
      </div>

      <div className="space-y-6">
        {/* Profile Card settings */}
        <div className="p-6 rounded-2xl border bg-card text-card-foreground shadow-premium space-y-4">
          <h3 className="font-sans font-bold text-base flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Architect Profile
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                defaultValue="Jane Doe"
                readOnly
                className="w-full px-3.5 py-2 rounded-xl border bg-secondary/20 text-sm focus:outline-none text-muted-foreground"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Work Email Address
              </label>
              <input
                type="email"
                defaultValue="jane.doe@projectpilot.ai"
                readOnly
                className="w-full px-3.5 py-2 rounded-xl border bg-secondary/20 text-sm focus:outline-none text-muted-foreground"
              />
            </div>
          </div>
        </div>

        {/* Global theme panel settings */}
        <div className="p-6 rounded-2xl border bg-card text-card-foreground shadow-premium space-y-4">
          <h3 className="font-sans font-bold text-base flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            Appearance Preferences
          </h3>
          <div className="flex items-center justify-between p-4 rounded-xl border bg-secondary/15">
            <div>
              <h4 className="text-sm font-semibold">Dark Mode Styling</h4>
              <p className="text-xs text-muted-foreground">Toggle application color mode between light and dark settings</p>
            </div>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-secondary text-foreground border shadow-sm hover:bg-muted/80 transition-all uppercase"
            >
              Set {theme === "light" ? "Dark Theme" : "Light Theme"}
            </button>
          </div>
        </div>

        {/* Integrations panel */}
        <div className="p-6 rounded-2xl border bg-card text-card-foreground shadow-premium space-y-4">
          <h3 className="font-sans font-bold text-base flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" />
            API Keys & Integrations
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Gemini API Access Token (Mock active)
              </label>
              <div className="relative">
                <input
                  type="password"
                  value="••••••••••••••••••••••••••••••••"
                  readOnly
                  className="w-full px-3.5 py-2.5 rounded-xl border bg-secondary/20 text-sm focus:outline-none text-muted-foreground"
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5">
                This token is simulated. Direct model credentials will be required in Phase 2.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
