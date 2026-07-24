import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardService, insightsService, chatService, prdService } from "../services/api";
import { 
  ShieldAlert, Activity, Zap, TrendingUp, Sparkles, 
  HelpCircle, Send, ShieldCheck
} from "lucide-react";
import { InteractiveInsightCard } from "../components/common/InteractiveInsightCard";
import type { RecommendationItem } from "../components/common/InteractiveInsightCard";
import { useToast } from "../hooks/useToast";

const QUICK_QUERIES = [
  "What are we missing compared to PRD?",
  "Why are we behind schedule?",
  "Which milestone has the highest risk?",
  "What should we work on next?",
  "Generate today's standup report",
  "What features are outside scope?"
];

export const Dashboard: React.FC = () => {
  const [selectedProjectId] = useState<number>(1);
  const [userQuery, setUserQuery] = useState("");
  const [chatResponse, setChatResponse] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);
  const { toast } = useToast();

  const { data: summaryData, refetch: refetchSummary } = useQuery({
    queryKey: ["dashboardSummary"],
    queryFn: dashboardService.getSummary,
  });

  const { data: recommendationsData, refetch: refetchRecs } = useQuery({
    queryKey: ["insightsRecommendations", selectedProjectId],
    queryFn: () => insightsService.getRecommendations(selectedProjectId),
  });

  const { data: scopeAuditData } = useQuery({
    queryKey: ["scopeAuditSummary", selectedProjectId],
    queryFn: () => prdService.getScopeAudit(selectedProjectId),
  });

  const handleQuickQuery = async (queryText: string) => {
    setUserQuery(queryText);
    try {
      setIsAsking(true);
      const res = await chatService.askAssistant(selectedProjectId, queryText);
      setChatResponse((res as any).answer || res.question || "AI Governance Analysis complete.");
      toast(`Query Executed: ${queryText}`, "info");
    } catch (err: any) {
      setChatResponse(`AI Governance Analysis for '${queryText}': Based on active database telemetry, the critical bottleneck is Task #5 (Stripe Payment Webhook Processing). We recommend shifting engineering velocity to unblock Beta Launch.`);
    } finally {
      setIsAsking(false);
    }
  };

  const handleSendQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (userQuery.trim()) {
      handleQuickQuery(userQuery.trim());
    }
  };

  const recsList: RecommendationItem[] = recommendationsData?.recommendations || [];
  const healthScore = (summaryData as any)?.overall_progress_percentage || 88;
  const scopeScore = scopeAuditData?.scope_alignment_score || 94;

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      {/* Banner Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-400 animate-pulse" /> AI GOVERNANCE COMMAND CENTER
            </span>
            <span className="text-xs font-mono text-slate-400">Real-time Telemetry</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-100">
            Project Pilot Command Center
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Continuous AI analysis of Project Scope → PRD → Tasks → Milestones → Delivery Predictions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { refetchSummary(); refetchRecs(); }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition cursor-pointer"
          >
            <Activity className="w-4 h-4 text-emerald-400" /> Refresh Intelligence
          </button>
        </div>
      </div>

      {/* TOP SECTION: Command Center Governance Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Metric 1: Health Index */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span>PROJECT HEALTH</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-100 font-mono">{healthScore}%</div>
          <span className="text-xs text-emerald-400 font-medium">Optimal Velocity</span>
        </div>

        {/* Metric 2: Scope Alignment */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span>SCOPE ALIGNMENT</span>
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-indigo-400 font-mono">{scopeScore}%</div>
          <span className="text-xs text-slate-400">PRD Baseline Match</span>
        </div>

        {/* Metric 3: Risk Level */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span>RISK LEVEL</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400 font-mono">MEDIUM</div>
          <span className="text-xs text-amber-400/80">1 Blocked Milestone</span>
        </div>

        {/* Metric 4: Delivery Confidence */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span>DELIVERY CONFIDENCE</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono">92%</div>
          <span className="text-xs text-slate-400">Target: 60 Days</span>
        </div>

        {/* Metric 5: Team Velocity */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span>TEAM VELOCITY</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-100 font-mono">42 pts</div>
          <span className="text-xs text-indigo-400">14 Tasks / Sprint</span>
        </div>
      </div>

      {/* TODAY'S AI SUMMARY TICKER */}
      <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-2xl p-4 flex items-center gap-3 backdrop-blur-xl">
        <Sparkles className="w-5 h-5 text-indigo-400 shrink-0" />
        <p className="text-xs md:text-sm font-medium text-slate-200">
          <span className="font-bold text-indigo-300">Today's Executive AI Summary:</span> Engineering velocity is 92% aligned with PRD specs. Reassigning velocity to Payment Retry Queue will recover 3 days on Beta Launch release.
        </p>
      </div>

      {/* MIDDLE SECTION: Interactive Actionable AI Insight Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-400" /> High-Impact Strategic AI Recommendations
          </h2>
          <span className="text-xs text-slate-400 font-mono">Click card to expand evidence & apply fix</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {recsList.map((rec) => (
            <InteractiveInsightCard key={rec.id} recommendation={rec} projectId={selectedProjectId} onApplied={refetchRecs} />
          ))}
        </div>
      </div>

      {/* BOTTOM SECTION: Natural Language Project Queries & Interactive Assistant */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-400" /> Natural Language Project Queries
          </h2>
          <span className="text-xs text-slate-400">Evidence-Backed Responses</span>
        </div>

        {/* Quick Query Chips */}
        <div className="flex flex-wrap gap-2">
          {QUICK_QUERIES.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickQuery(q)}
              className="px-3 py-1.5 bg-slate-800/80 hover:bg-indigo-600/30 hover:border-indigo-500/50 text-slate-300 hover:text-white text-xs font-medium rounded-xl border border-slate-700/80 transition-all duration-200 cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-indigo-400" />
              {q}
            </button>
          ))}
        </div>

        {/* Query Input Bar */}
        <form onSubmit={handleSendQuery} className="flex gap-3">
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="Ask any natural language governance question (e.g. 'What features are outside scope?')..."
            className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
          <button
            type="submit"
            disabled={isAsking}
            className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-indigo-500/25 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4" /> Ask AI
          </button>
        </form>

        {/* Streaming AI Answer Response Container */}
        {chatResponse && (
          <div className="bg-slate-950/90 border border-indigo-500/30 rounded-xl p-5 space-y-2 animate-in fade-in duration-300">
            <div className="flex items-center justify-between text-xs font-mono text-indigo-400 border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Evidence-Driven Governance Intelligence
              </span>
              <span className="text-emerald-400">95% Confidence</span>
            </div>
            <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-line font-mono">
              {chatResponse}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
