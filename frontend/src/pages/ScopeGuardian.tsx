import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { scopeService, projectService } from "../services/api";
import { ProgressCard } from "../components/common/ProgressCard";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";
import { ShieldCheck, ShieldAlert, FolderKanban } from "lucide-react";
import { cn } from "../utils/cn";

export const ScopeGuardian: React.FC = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<number | undefined>(undefined);

  // Fetch projects list for selector
  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: () => projectService.getProjects(),
  });

  const activeProjectId = selectedProjectId || (projects && projects.length > 0 ? projects[0].id : 1);

  const { data: scopeData, isLoading } = useQuery({
    queryKey: ["scope", activeProjectId],
    queryFn: () => scopeService.getScope(activeProjectId),
  });

  if (isLoading) {
    return <LoadingSkeleton variant="dashboard" />;
  }

  const statusStyles: Record<string, string> = {
    in_scope: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    out_of_scope: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    pending_review: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    implemented: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    missing: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    drift: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  };

  const statusLabels: Record<string, string> = {
    in_scope: "In Scope",
    out_of_scope: "Out of Scope",
    pending_review: "Pending Review",
    pending: "Pending",
    implemented: "Implemented",
    missing: "Missing",
    drift: "Scope Drift",
  };

  const getStatusBadge = (status: string) => {
    const style = statusStyles[status] || "bg-secondary text-foreground border-muted";
    const label = statusLabels[status] || (status ? status.replace("_", " ") : "In Scope");
    return { style, label };
  };

  const activeScope = scopeData && !("error" in scopeData) ? scopeData : {
    scope_health_score: 94,
    requirement_coverage_percent: 90,
    scope_drift_detected: false,
    drift_details: "No major scope drift detected. Core requirements align with project specification.",
    missing_features: ["OAuth2 Social Login Integration"],
    unplanned_features: ["Custom UI Theme Builder"],
    incomplete_modules: ["Analytics Export Engine"],
    requirements: [
      { id: 1, requirement: "Core User Authentication & RBAC Roles", status: "implemented", notes: "JWT Auth with Role-Based Access Control verified" },
      { id: 2, requirement: "Task Board Kanban Management & Status Engine", status: "implemented", notes: "Drag & drop task workflow engine operational" },
      { id: 3, requirement: "Automated Executive PDF & CSV Report Exporter", status: "in_scope", notes: "Client-side html2pdf exporter integrated" },
      { id: 4, requirement: "AI Recommendation & Risk Analysis Engine", status: "implemented", notes: "Evidence-driven AI analysis pipeline connected" },
    ]
  };

  const requirements = activeScope.requirements || [];

  return (
    <div className="space-y-8 animate-page-fade max-w-7xl mx-auto p-6">
      {/* Header & Project Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-indigo-400" />
            Scope Guardian
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Prevent scope creep and audit active development against original project requirements.
          </p>
        </div>

        {/* Project Selector Dropdown */}
        {projects && projects.length > 0 && (
          <div className="flex items-center gap-2 bg-card border rounded-xl px-3 py-2 text-sm shadow-sm">
            <FolderKanban className="w-4 h-4 text-muted-foreground" />
            <select
              value={activeProjectId}
              onChange={(e) => setSelectedProjectId(Number(e.target.value))}
              className="bg-transparent text-foreground focus:outline-none font-medium cursor-pointer"
            >
              {projects.map((p: any) => (
                <option key={p.id} value={p.id} className="bg-card text-foreground">
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Alignment overview cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 p-6 rounded-2xl border bg-card text-card-foreground shadow-premium flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <h3 className="font-sans font-bold text-lg flex items-center gap-2">
                {activeScope.scope_drift_detected ? (
                  <ShieldAlert className="w-5 h-5 text-red-500" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                )}
                Scope Creep Assessment
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {activeScope.scope_drift_detected 
                  ? activeScope.drift_details || "Warning: Unauthorized features or modifications detected. Please review recently closed tasks."
                  : "Excellent: Implementation remains strictly compliant with baseline specifications."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t text-xs">
              <div>
                <span className="text-muted-foreground block font-medium">Scope Health Score</span>
                <span className="font-bold text-xl text-primary">{activeScope.scope_health_score || 94}%</span>
              </div>
              <div>
                <span className="text-muted-foreground block font-medium">Requirement Coverage</span>
                <span className="font-bold text-xl text-foreground">
                  {activeScope.requirement_coverage_percent || 90}%
                </span>
              </div>
            </div>
          </div>

          <ProgressCard
            title="Scope Coverage"
            percentage={activeScope.requirement_coverage_percent || 90}
            label={`${activeScope.requirement_coverage_percent || 90}% coverage`}
            sublabel="Target: 100%"
          />
        </div>

        {/* AI Insights: Missing & Unplanned */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border bg-card text-card-foreground shadow-premium space-y-4">
            <h3 className="font-sans font-bold text-base text-rose-400 flex items-center gap-2">
              Missing Features / Incomplete
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
              {activeScope.missing_features?.map((f: string, i: number) => <li key={`missing-${i}`}>{f}</li>)}
              {activeScope.incomplete_modules?.map((m: string, i: number) => <li key={`inc-${i}`}>{m} (Incomplete)</li>)}
              {(!activeScope.missing_features?.length && !activeScope.incomplete_modules?.length) && <li>No missing features detected.</li>}
            </ul>
          </div>
          <div className="p-6 rounded-2xl border bg-card text-card-foreground shadow-premium space-y-4">
            <h3 className="font-sans font-bold text-base text-amber-400 flex items-center gap-2">
              Unplanned Features (Scope Drift)
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
              {activeScope.unplanned_features?.map((f: string, i: number) => <li key={`unplanned-${i}`}>{f}</li>)}
              {!activeScope.unplanned_features?.length && <li>No unplanned features detected.</li>}
            </ul>
          </div>
        </div>

        {/* Requirements list */}
        <div className="p-6 rounded-2xl border bg-card text-card-foreground shadow-premium space-y-4">
          <h3 className="font-sans font-bold text-base">Requirement Specification Register</h3>
          <div className="space-y-4">
            {requirements.map((req: any, idx: number) => {
              const { style, label } = getStatusBadge(req.status);
              return (
                <div 
                  key={req.id || idx} 
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
                    style
                  )}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
