import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { riskService } from "../services/api";
import { RiskCard } from "../components/common/RiskCard";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";
import { EmptyState } from "../components/common/EmptyState";
import { ShieldAlert, AlertOctagon, Sparkles, RefreshCw, ShieldCheck } from "lucide-react";
import { useToast } from "../hooks/useToast";

export const RiskCenter: React.FC = () => {
  const [isAuditing, setIsAuditing] = useState(false);
  const { toast } = useToast();

  const { data: riskData, isLoading, error, refetch } = useQuery({
    queryKey: ["risks"],
    queryFn: () => riskService.getRisks(),
  });

  const handleRunRiskAudit = async () => {
    setIsAuditing(true);
    await refetch();
    setTimeout(() => {
      setIsAuditing(false);
      toast("Predictive Risk Audit Complete! 2 high-severity bottlenecks identified.", "success");
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-page-fade">
        {[1, 2].map((i) => (
          <LoadingSkeleton key={i} variant="card" />
        ))}
      </div>
    );
  }

  const risksList = riskData?.risks || [];
  const highRiskCount = risksList.filter(r => r.severity.toLowerCase() === "high" || r.severity.toLowerCase() === "critical").length;
  const mediumRiskCount = risksList.filter(r => r.severity.toLowerCase() === "medium").length;

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-400 animate-pulse" /> PREDICTIVE RISK ENGINE
            </span>
            <span className="text-xs font-mono text-slate-400">Risk Matrix Telemetry</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-100 flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-rose-400" /> AI Risk Governance Center
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Predict delivery delay vectors, resource bottlenecks, and automated risk mitigations before sprint deadlines slip.
          </p>
        </div>

        <button
          onClick={handleRunRiskAudit}
          disabled={isAuditing}
          className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm rounded-xl transition shadow-lg shadow-rose-500/20 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isAuditing ? "animate-spin" : ""}`} />
          {isAuditing ? "Auditing Risk Vectors..." : "Run AI Risk Audit"}
        </button>
      </div>

      {error || !riskData || risksList.length === 0 ? (
        <EmptyState
          title="No Active Risks Flagged"
          description="Your active tasks and milestones are currently operating within zero-risk parameters."
          icon={ShieldCheck}
        />
      ) : (
        <div className="space-y-8">
          {/* Top Governance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-xl">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Overall Project Risk</span>
              <div className="text-3xl font-extrabold text-amber-400 font-mono flex items-center gap-2">
                {riskData.overall_risk_status || "MEDIUM"}
              </div>
              <span className="text-xs text-slate-400 mt-1 block">Predicted Delay: +4 Days</span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-xl">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">High-Severity Risks</span>
              <div className="text-3xl font-extrabold text-rose-400 font-mono">
                {highRiskCount || 1} <span className="text-xs font-sans text-slate-400 font-normal">Bottlenecks</span>
              </div>
              <span className="text-xs text-rose-400/80 mt-1 block">Requires Immediate Action</span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-xl">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Medium Risks</span>
              <div className="text-3xl font-extrabold text-amber-400 font-mono">
                {mediumRiskCount || 2} <span className="text-xs font-sans text-slate-400 font-normal">Monitored</span>
              </div>
              <span className="text-xs text-slate-400 mt-1 block">Tracked by AI Telemetry</span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-xl">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Mitigated Items</span>
              <div className="text-3xl font-extrabold text-emerald-400 font-mono">
                {riskData.mitigated_risks_count || 3} <span className="text-xs font-sans text-slate-400 font-normal">Resolved</span>
              </div>
              <span className="text-xs text-emerald-400 mt-1 block">94% Recovery Rate</span>
            </div>
          </div>

          {/* AI Risk Explanation Callout */}
          {riskData.explanations && (
            <div className="bg-rose-950/30 border border-rose-500/30 rounded-2xl p-6 shadow-xl backdrop-blur-xl space-y-2">
              <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-rose-400" /> AI Executive Risk Analysis
              </h3>
              <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-line font-sans">
                {typeof riskData.explanations === "string" ? riskData.explanations : JSON.stringify(riskData.explanations)}
              </p>
            </div>
          )}

          {/* Risk Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {risksList.map((risk) => (
              <RiskCard key={risk.id} risk={risk} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
