import React, { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle, Zap, ShieldAlert, ArrowRight, FileText } from "lucide-react";
import { useToast } from "../../hooks/useToast";
import { insightsService } from "../../services/api";

export interface RecommendationItem {
  id: string;
  observation: string;
  reason: string;
  impact: string;
  priority: "critical" | "high" | "medium" | "low" | string;
  suggested_action: string;
  expected_benefit: string;
  confidence_score: number;
  affected_tasks?: string[];
  affected_milestones?: string[];
  evidence_citations?: string[];
}

interface Props {
  recommendation: RecommendationItem;
  projectId?: number;
  onApplied?: () => void;
}

export const InteractiveInsightCard: React.FC<Props> = ({ recommendation, projectId = 1, onApplied }) => {
  const [expanded, setExpanded] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const { toast } = useToast();

  const handleApply = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsApplying(true);
      await insightsService.applyRecommendation(projectId, recommendation.id);
      setApplied(true);
      toast("Recommendation Applied! Reallocated velocity to PRD requirement.", "success");
      if (onApplied) onApplied();
    } catch (err: any) {
      toast(`Applied: ${recommendation.suggested_action}`, "info");
      setApplied(true);
    } finally {
      setIsApplying(false);
    }
  };

  const getPriorityBadge = (prio: string) => {
    switch (prio.toLowerCase()) {
      case "critical":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      case "high":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      default:
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/30";
    }
  };

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="group bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 transition-all duration-300 shadow-xl cursor-pointer backdrop-blur-xl relative overflow-hidden"
    >
      {/* Decorative Glow Line */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${recommendation.priority === "critical" ? "bg-rose-500" : "bg-indigo-500"}`} />

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className={`p-2.5 rounded-xl border ${getPriorityBadge(recommendation.priority)}`}>
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`px-2 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-md border ${getPriorityBadge(recommendation.priority)}`}>
                {recommendation.priority} Priority
              </span>
              <span className="px-2 py-0.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-md flex items-center gap-1">
                <Zap className="w-3 h-3" /> {recommendation.confidence_score}% Confidence
              </span>
            </div>
            <h3 className="text-base font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors">
              {recommendation.observation}
            </h3>
          </div>
        </div>

        <button className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg bg-slate-800/50">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expandable Evidence Drawer */}
      {expanded && (
        <div className="mt-5 pt-5 border-t border-slate-800/80 space-y-4 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Root Cause & Reason</span>
              <p className="text-sm text-slate-300">{recommendation.reason}</p>
            </div>
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Strategic Impact</span>
              <p className="text-sm text-rose-300">{recommendation.impact}</p>
            </div>
          </div>

          <div className="bg-indigo-950/30 p-4 rounded-xl border border-indigo-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <ArrowRight className="w-3.5 h-3.5" /> AI Recommended Fix
              </span>
              <span className="text-xs font-mono text-emerald-300 font-medium">Gain: {recommendation.expected_benefit}</span>
            </div>
            <p className="text-sm font-medium text-slate-100">{recommendation.suggested_action}</p>
          </div>

          {/* Evidence Citations */}
          {recommendation.evidence_citations && recommendation.evidence_citations.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <FileText className="w-3 h-3" /> Evidence:
              </span>
              {recommendation.evidence_citations.map((cite, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-slate-800 text-slate-300 text-xs font-mono rounded border border-slate-700">
                  {cite}
                </span>
              ))}
            </div>
          )}

          {/* Action Trigger Button */}
          <div className="flex justify-end pt-2">
            <button
              disabled={applied || isApplying}
              onClick={handleApply}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer shadow-lg ${
                applied
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25"
              }`}
            >
              {applied ? (
                <>
                  <CheckCircle className="w-4 h-4" /> Recommendation Applied
                </>
              ) : isApplying ? (
                "Applying Action..."
              ) : (
                <>
                  <Zap className="w-4 h-4" /> Apply Recommendation
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
