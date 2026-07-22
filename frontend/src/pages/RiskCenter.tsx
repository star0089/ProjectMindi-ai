import React from "react";
import { useQuery } from "@tanstack/react-query";
import { riskService } from "../services/api";
import { RiskCard } from "../components/common/RiskCard";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";
import { EmptyState } from "../components/common/EmptyState";
import { ShieldAlert, AlertOctagon } from "lucide-react";
import { cn } from "../utils/cn";

export const RiskCenter: React.FC = () => {
  const { data: riskData, isLoading, error } = useQuery({
    queryKey: ["risks"],
    queryFn: () => riskService.getRisks(),
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-page-fade">
        {[1, 2].map((i) => (
          <LoadingSkeleton key={i} variant="card" />
        ))}
      </div>
    );
  }

  const getOverallRiskColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "low":
        return "text-green-500 bg-green-500/10";
      case "medium":
      case "low-medium":
        return "text-yellow-500 bg-yellow-500/10";
      case "high":
        return "text-red-500 bg-red-500/10";
      default:
        return "text-muted-foreground bg-secondary";
    }
  };

  return (
    <div className="space-y-8 animate-page-fade">
      {/* Header */}
      <div className="pb-4 border-b">
        <h2 className="text-base text-muted-foreground">Monitor potential project threats, active severities, and mitigation plans</h2>
      </div>

      {error || !riskData || riskData.risks.length === 0 ? (
        <EmptyState
          title="No Risks Identified"
          description="Register active risks to begin drafting mitigation steps."
          icon={ShieldAlert}
        />
      ) : (
        <div className="space-y-6">
          {/* Aggregated Risk Assessment */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border bg-card text-card-foreground shadow-premium flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Overall Project Risk
                </span>
                <h3 className="font-sans font-bold text-2xl tracking-tight">
                  {riskData.overall_risk_status}
                </h3>
              </div>
              <span className={cn(
                "p-3 rounded-xl border text-sm font-bold capitalize",
                getOverallRiskColor(riskData.overall_risk_status)
              )}>
                <AlertOctagon className="w-6 h-6" />
              </span>
            </div>

            <div className="p-6 rounded-2xl border bg-card text-card-foreground shadow-premium flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Active Risks Tracked
                </span>
                <h3 className="font-sans font-bold text-2xl tracking-tight">
                  {riskData.active_risks_count}
                </h3>
              </div>
              <span className="p-3 rounded-xl border bg-red-500/10 text-red-500 text-sm font-bold">
                {riskData.active_risks_count} Active
              </span>
            </div>

            <div className="p-6 rounded-2xl border bg-card text-card-foreground shadow-premium flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Mitigated Risks
                </span>
                <h3 className="font-sans font-bold text-2xl tracking-tight">
                  {riskData.mitigated_risks_count}
                </h3>
              </div>
              <span className="p-3 rounded-xl border bg-green-500/10 text-green-500 text-sm font-bold">
                {riskData.mitigated_risks_count} Mitigated
              </span>
            </div>
          </div>

          {/* Risk Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {riskData.risks.map((risk) => (
              <RiskCard key={risk.id} risk={risk} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
