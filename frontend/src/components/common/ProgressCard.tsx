import React from "react";
import { cn } from "../../utils/cn";

interface ProgressCardProps {
  title: string;
  percentage: number;
  label?: string;
  sublabel?: string;
  barColorClassName?: string;
  className?: string;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  percentage,
  label,
  sublabel,
  barColorClassName,
  className,
}) => {
  const boundedPercentage = Math.min(100, Math.max(0, percentage));

  return (
    <div className={cn(
      "p-6 rounded-2xl border bg-card text-card-foreground shadow-premium transition-all hover:shadow-md",
      className
    )}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          {title}
        </h4>
        <span className="font-sans font-bold text-lg text-primary">
          {boundedPercentage}%
        </span>
      </div>

      {/* Progress Track */}
      <div className="w-full h-2.5 rounded-full bg-secondary overflow-hidden">
        <div 
          className={cn(
            "h-full rounded-full bg-gradient-to-r from-primary to-violet-500 transition-all duration-500 ease-out",
            barColorClassName
          )}
          style={{ width: `${boundedPercentage}%` }}
        />
      </div>

      {/* Auxiliary Labels */}
      {(label || sublabel) && (
        <div className="flex justify-between items-center mt-3.5 text-xs text-muted-foreground">
          {label && <span className="font-medium text-foreground/80">{label}</span>}
          {sublabel && <span>{sublabel}</span>}
        </div>
      )}
    </div>
  );
};
