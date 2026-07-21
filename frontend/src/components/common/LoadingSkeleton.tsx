import React from "react";
import { cn } from "../../utils/cn";

interface LoadingSkeletonProps {
  className?: string;
  variant?: "card" | "line" | "circle" | "dashboard";
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className,
  variant = "line"
}) => {
  const baseClass = "bg-muted animate-pulse rounded-lg";

  if (variant === "card") {
    return (
      <div className={cn("p-6 rounded-2xl border bg-card space-y-4 shadow-premium", className)}>
        <div className="flex items-center justify-between">
          <div className={cn("h-4 w-1/3", baseClass)} />
          <div className={cn("h-8 w-8 rounded-xl", baseClass)} />
        </div>
        <div className={cn("h-8 w-1/2", baseClass)} />
        <div className={cn("h-3 w-3/4 mt-4", baseClass)} />
      </div>
    );
  }

  if (variant === "circle") {
    return <div className={cn("rounded-full", baseClass, className)} />;
  }

  if (variant === "dashboard") {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <LoadingSkeleton key={i} variant="card" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={cn("h-80 lg:col-span-2", baseClass)} />
          <div className={cn("h-80", baseClass)} />
        </div>
      </div>
    );
  }

  // Variant "line"
  return <div className={cn("h-4 w-full", baseClass, className)} />;
};
