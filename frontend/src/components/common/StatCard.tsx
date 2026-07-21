import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "../../utils/cn";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string | number;
    isPositive?: boolean;
    label?: string;
  };
  className?: string;
  iconClassName?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  className,
  iconClassName,
}) => {
  return (
    <div className={cn(
      "p-6 rounded-2xl border bg-card text-card-foreground shadow-premium transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5",
      className
    )}>
      <div className="flex items-start justify-between">
        {/* Metric Meta */}
        <div className="space-y-1">
          <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
            {title}
          </p>
          <h3 className="font-sans font-bold text-2xl md:text-3xl tracking-tight">
            {value}
          </h3>
        </div>

        {/* Icon Accent */}
        <div className={cn(
          "p-2.5 rounded-xl bg-secondary text-muted-foreground transition-colors",
          iconClassName
        )}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {/* Trend indicator */}
      {trend && (
        <div className="flex items-center gap-1.5 mt-4 text-xs font-medium">
          <span className={cn(
            "px-2 py-0.5 rounded-full font-semibold",
            trend.isPositive 
              ? "bg-green-500/10 text-green-600 dark:text-green-400" 
              : "bg-red-500/10 text-red-600 dark:text-red-400"
          )}>
            {trend.value}
          </span>
          <span className="text-muted-foreground">
            {trend.label || "since last iteration"}
          </span>
        </div>
      )}
    </div>
  );
};
