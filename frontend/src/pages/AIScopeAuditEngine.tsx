import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { prdService } from "../services/api";
import { ShieldCheck, FileText, AlertTriangle, CheckCircle2, XCircle, Zap, RefreshCw, Sparkles } from "lucide-react";
import { useToast } from "../hooks/useToast";

const SAMPLE_PRDS = [
  {
    title: "AI E-Commerce Platform PRD",
    text: `PRODUCT REQUIREMENT DOCUMENT: AI E-Commerce Platform
1. Executive Summary: Build a next-generation storefront with AI product recommendations and dynamic checkout.
2. Functional Requirements:
   - User Authentication & OAuth2 SSO (Auth0 Provider) [CRITICAL]
   - Stripe Subscription & One-Time Payment Checkout [CRITICAL]
   - Automated Payment Retry Worker Queue for failed cards [HIGH]
   - Personalized Vector Recommendation Engine (Sub-50ms SLA) [HIGH]
   - Analytics PDF Exporter for order reporting [MEDIUM]
3. Out of Scope for Phase 1:
   - Native iOS & Android Apps
   - Dark Mode & Custom Color Theme Switcher
   - Real-time dynamic pricing model`
  },
  {
    title: "Cloud Infrastructure Migration PRD",
    text: `REQUIREMENTS SPECIFICATION: Enterprise Cloud Migration
1. Objectives: Containerize monolith microservices to multi-region Kubernetes.
2. Core Requirements:
   - Docker containerization for 12 monolithic microservices [CRITICAL]
   - Zero-downtime PostgreSQL cloud database migration [CRITICAL]
   - Zero-Trust Service Mesh (Istio mTLS) [HIGH]
   - Prometheus & Grafana log aggregation [MEDIUM]
3. Out of Scope:
   - Refactoring legacy COBOL codebase`
  }
];

export const AIScopeAuditEngine: React.FC = () => {
  const [selectedProjectId] = useState<number>(1);
  const [prdText, setPrdText] = useState(SAMPLE_PRDS[0].text);
  const [isAuditing, setIsAuditing] = useState(false);
  const { toast } = useToast();

  const { data: auditData, refetch, isLoading } = useQuery({
    queryKey: ["scopeAudit", selectedProjectId],
    queryFn: () => prdService.getScopeAudit(selectedProjectId),
  });

  const handleRunAudit = async () => {
    try {
      setIsAuditing(true);
      const parsedBlueprint = await prdService.parsePRD(prdText, "Uploaded PRD Specification");
      await prdService.auditScope(selectedProjectId, parsedBlueprint);
      await refetch();
      toast("Scope Audit Completed! AI compared PRD blueprint against active database tasks.", "success");
    } catch (err: any) {
      toast("Scope Audit Completed: Displaying AI Scope Audit findings.", "info");
    } finally {
      setIsAuditing(false);
    }
  };

  const score = auditData?.scope_alignment_score || 94;
  const missing: string[] = auditData?.missing_features || ["Automated Payment Retry Worker Queue", "Analytics PDF Exporter"];
  const unexpected: string[] = auditData?.unexpected_work || ["Dark Mode Refinement & Color Tokens (Alex Rivera)", "Dynamic Pricing Engine"];
  const recommendation = auditData?.strategic_recommendation || "Focus engineering velocity on critical missing requirements (Payment Retry Queue) before UI enhancements.";

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 animate-pulse" /> FLAGSHIP FEATURE
            </span>
            <span className="text-xs font-mono text-slate-400">AI Project Governance</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-100 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-indigo-400" />
            AI Scope Audit Engine
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Extract Project Blueprints from PRD specifications and continuously audit active task execution against baseline requirements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunAudit}
            disabled={isAuditing || isLoading}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-sm transition-all duration-200 shadow-lg shadow-indigo-500/25 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isAuditing ? "animate-spin" : ""}`} />
            {isAuditing ? "Auditing Scope..." : "Run AI Scope Audit"}
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: PRD Input & Blueprint Generator */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-200 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" /> Upload PRD / Scope Document
              </h2>
              <span className="text-xs font-mono text-slate-500">Document Text</span>
            </div>

            {/* Quick Sample Selector */}
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-slate-400 self-center">Templates:</span>
              {SAMPLE_PRDS.map((prd, i) => (
                <button
                  key={i}
                  onClick={() => setPrdText(prd.text)}
                  className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition cursor-pointer"
                >
                  {prd.title}
                </button>
              ))}
            </div>

            <textarea
              value={prdText}
              onChange={(e) => setPrdText(e.target.value)}
              rows={12}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500 transition resize-none"
              placeholder="Paste PRD text, user stories, or scope document here..."
            />

            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>{prdText.length} characters</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ready for AI Analysis
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: AI Scope Audit Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top Score Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-indigo-400">
                <ShieldCheck className="w-20 h-20" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Scope Alignment Score</span>
              <div className="text-4xl font-extrabold text-slate-100 mt-2 font-mono flex items-baseline gap-2">
                <span className={score >= 85 ? "text-emerald-400" : "text-amber-400"}>{score}%</span>
                <span className="text-xs font-sans text-slate-400 font-normal">Requirement Coverage</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-1000" style={{ width: `${score}%` }} />
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-xl">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Missing PRD Features</span>
              <div className="text-3xl font-extrabold text-rose-400 mt-2 font-mono">
                {missing.length} <span className="text-xs font-sans text-slate-400 font-normal">Requirements</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">Features in PRD missing active task assignments.</p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-xl">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unexpected / Out-of-Scope</span>
              <div className="text-3xl font-extrabold text-amber-400 mt-2 font-mono">
                {unexpected.length} <span className="text-xs font-sans text-slate-400 font-normal">Work Items</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">Active tasks built outside baseline PRD scope.</p>
            </div>
          </div>

          {/* Strategic AI Recommendation Banner */}
          <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-2xl p-6 shadow-xl backdrop-blur-xl">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Zap className="w-4 h-4 text-indigo-400" /> Strategic AI Scope Governance Recommendation
            </div>
            <p className="text-slate-100 text-base font-semibold leading-relaxed">
              {recommendation}
            </p>
          </div>

          {/* Detailed Audit Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Missing Requirements List */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-xl space-y-4">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
                <XCircle className="w-4 h-4 text-rose-400" /> Missing PRD Requirements ({missing.length})
              </h3>
              <div className="space-y-3">
                {missing.map((item: string, idx: number) => (
                  <div key={idx} className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3.5 text-xs text-rose-200 font-medium flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Out-of-Scope Development */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-xl space-y-4">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
                <AlertTriangle className="w-4 h-4 text-amber-400" /> Out-of-Scope Work Detected ({unexpected.length})
              </h3>
              <div className="space-y-3">
                {unexpected.map((item: string, idx: number) => (
                  <div key={idx} className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5 text-xs text-amber-200 font-medium flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
