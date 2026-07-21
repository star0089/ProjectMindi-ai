import React from "react";
import { LucideIcon, Inbox } from "lucide-react";
import { cn } from "../../utils/cn";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = Inbox,
  actionLabel,
  onAction,
  className
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center p-8 md:p-12 rounded-2xl border-2 border-dashed bg-card/30 text-card-foreground",
      className
    )}>
      {/* Icon Wrapper */}
      <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-secondary text-muted-foreground mb-4">
        <Icon className="w-6 h-6" />
      </div>

      {/* Metadata */}
      <h3 className="font-sans font-bold text-lg mb-1.5">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>

      {/* Action Button */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-primary-foreground shadow hover:bg-primary/95 hover:-translate-y-0.5 transition-all"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
