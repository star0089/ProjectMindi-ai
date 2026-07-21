import React from "react";
import { Risk } from "../../types";
import { AlertOctagon, ShieldCheck, HelpCircle, Activity } from "lucide-react";
import { cn } from "../../utils/cn";

interface RiskCardProps {
  risk: Risk;
  onClick?: () => void;
}

export const RiskCard: React.FC<RiskCardProps> = ({ risk, onClick }) => {
  // Severity badges
  const severityColors = {
    low: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    medium: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    high: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    critical: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30 animate-pulse",
  };

  // Status badges
  const statusColors = {
    identified: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    mitigated: "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400",
    triggered: "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400",
    resolved: "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
  };

  // Icons based on status
  const getStatusIcon = (status: Risk["status"]) => {
    switch (status) {
      case "mitigated":
      case "resolved":
        return <ShieldCheck className="w-4 h-4 text-green-500" />;
      case "triggered":
        return <AlertOctagon className="w-4 h-4 text-red-500" />;
      default:
        return <HelpCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div 
      onClick={onClick}
      className="p-6 rounded-2xl border bg-card text-card-foreground shadow-premium hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <span className={cn(
          "px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider",
          severityColors[risk.severity]
        )}>
          {risk.severity} Severity
        </span>
        <div className="flex items-center gap-1.5 text-xs">
          {getStatusIcon(risk.status)}
          <span className={cn(
            "px-2 py-0.5 rounded-full text-xs font-semibold capitalize",
            statusColors[risk.status]
          )}>
            {risk.status}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <h3 className="font-sans font-bold text-base mb-2 hover:text-primary transition-colors">
        {risk.title}
      </h3>
      {risk.description && (
        <p className="text-sm text-muted-foreground mb-4">
          {risk.description}
        </p>
      )}

      {/* Mitigation Action Panel */}
      {risk.mitigation_plan && (
        <div className="p-3.5 rounded-xl bg-secondary/50 border text-xs">
          <span className="font-bold text-foreground block mb-1 uppercase tracking-wide">
            Mitigation Plan
          </span>
          <p className="text-muted-foreground leading-relaxed">
            {risk.mitigation_plan}
          </p>
        </div>
      )}
    </div>
  );
};
