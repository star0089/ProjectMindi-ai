import React from "react";
import { useQuery } from "@tanstack/react-query";
import { scopeService } from "../services/api";
import { ProgressCard } from "../components/common/ProgressCard";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";
import { EmptyState } from "../components/common/EmptyState";
import { ShieldCheck, ShieldAlert } from "lucide-react";
import { cn } from "../utils/cn";

export const ScopeGuardian: React.FC = () => {
  const { data: scopeData, isLoading, error } = useQuery({
    queryKey: ["scope"],
    queryFn: () => scopeService.getScope(),
  });

  if (isLoading) {
    return <LoadingSkeleton variant="dashboard" />;
  }

  const statusStyles = {
    in_scope: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    out_of_scope: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    pending_review: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    implemented: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  };

  const statusLabels = {
    in_scope: "In Scope",
    out_of_scope: "Out of Scope",
    pending_review: "Pending Review",
    implemented: "Implemented",
  };

  return (
    <div className="space-y-8 animate-page-fade">
      {/* Header */}
      <div className="pb-4 border-b">
        <h2 className="text-base text-muted-foreground">Prevent scope creep and audit original project requirements</h2>
      </div>

      {error || !scopeData ? (
        <EmptyState
          title="No Scope Data"
          description="Register requirements to audit implementation logs."
          icon={ShieldCheck}
        />
      ) : (
        <div className="space-y-6">
          {/* Alignment overview cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 p-6 rounded-2xl border bg-card text-card-foreground shadow-premium flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <h3 className="font-sans font-bold text-lg flex items-center gap-2">
                  {scopeData.scope_drift_detected ? (
                    <ShieldAlert className="w-5 h-5 text-red-500" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  )}
                  Scope Creep Assessment
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {scopeData.scope_drift_detected 
                    ? scopeData.drift_details || "Warning: Unauthorized features or modifications detected. Please review recently closed tasks."
                    : "Excellent: No unauthorized modifications or requirements detected. Implementation remains 100% compliant with initial specs."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t text-xs">
                <div>
                  <span className="text-muted-foreground block">Health Score</span>
                  <span className="font-bold text-lg text-primary">{scopeData.scope_health_score}%</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Requirement Coverage</span>
                  <span className="font-bold text-lg text-foreground">
                    {scopeData.requirement_coverage_percent}%
                  </span>
                </div>
              </div>
            </div>

            <ProgressCard
              title="Scope Coverage"
              percentage={scopeData.requirement_coverage_percent || 0}
              label={`${scopeData.requirement_coverage_percent}% coverage`}
              sublabel="target: 100%"
            />
          </div>

          {/* AI Insights: Missing & Unplanned */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border bg-card text-card-foreground shadow-premium space-y-4">
              <h3 className="font-sans font-bold text-base text-rose-500">Missing Features / Incomplete</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                {scopeData.missing_features?.map((f: string, i: number) => <li key={`missing-${i}`}>{f}</li>)}
                {scopeData.incomplete_modules?.map((m: string, i: number) => <li key={`inc-${i}`}>{m} (Incomplete)</li>)}
                {(!scopeData.missing_features?.length && !scopeData.incomplete_modules?.length) && <li>No missing features detected.</li>}
              </ul>
            </div>
            <div className="p-6 rounded-2xl border bg-card text-card-foreground shadow-premium space-y-4">
              <h3 className="font-sans font-bold text-base text-amber-500">Unplanned Features (Scope Drift)</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                {scopeData.unplanned_features?.map((f: string, i: number) => <li key={`unplanned-${i}`}>{f}</li>)}
                {!scopeData.unplanned_features?.length && <li>No unplanned features detected.</li>}
              </ul>
            </div>
          </div>

          {/* Requirements list */}
          <div className="p-6 rounded-2xl border bg-card text-card-foreground shadow-premium space-y-4">
            <h3 className="font-sans font-bold text-base">Requirement Specification Register</h3>
            <div className="space-y-4">
              {scopeData.requirements.map((req) => (
                <div 
                  key={req.id} 
                  className="p-4 rounded-xl border bg-secondary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-muted-foreground/30 transition-all"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">{req.requirement}</p>
                    {req.notes && (
                      <p className="text-xs text-muted-foreground font-medium">{req.notes}</p>
                    )}
                  </div>

                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold border text-center self-start sm:self-center uppercase tracking-wide",
                    statusStyles[req.status]
                  )}>
                    {statusLabels[req.status]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
