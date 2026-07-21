import React from "react";
import { Brain, ShieldAlert, Sparkles, TrendingUp } from "lucide-react";
import { cn } from "../../utils/cn";

interface AIInsightCardProps {
  text: string;
  category: "risk" | "progress" | "scope" | "general";
  timestamp?: string;
  className?: string;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({
  text,
  category,
  timestamp,
  className
}) => {
  // Category mapping
  const categoryDetails = {
    risk: {
      label: "Risk Warning",
      icon: ShieldAlert,
      styles: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    },
    progress: {
      label: "Timeline Update",
      icon: TrendingUp,
      styles: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    },
    scope: {
      label: "Scope Check",
      icon: Sparkles,
      styles: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    },
    general: {
      label: "Smart Insight",
      icon: Brain,
      styles: "bg-primary/10 text-primary border-primary/20",
    },
  };

  const currentCategory = categoryDetails[category] || categoryDetails.general;
  const Icon = currentCategory.icon;

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return null;
    return new Date(timeStr).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className={cn(
      "p-5 rounded-2xl border relative overflow-hidden glass-panel shadow-premium transition-all hover:shadow-md",
      "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 bg-gradient-to-r from-primary/5 to-transparent",
      className
    )}>
      {/* Category header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={cn(
            "p-1.5 rounded-lg border",
            currentCategory.styles
          )}>
            <Icon className="w-3.5 h-3.5" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-foreground/80">
            {currentCategory.label}
          </span>
        </div>
        {timestamp && (
          <span className="text-[10px] text-muted-foreground">
            {formatTime(timestamp)}
          </span>
        )}
      </div>

      {/* Insight text */}
      <p className="text-sm font-sans font-medium text-foreground/90 leading-relaxed pl-1">
        {text}
      </p>
    </div>
  );
};
