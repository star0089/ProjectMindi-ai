import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { planningService } from "../services/api";
import { useToast } from "../hooks/useToast";
import html2pdf from "html2pdf.js";
import { 
  Sparkles, Bot, ChevronRight, ChevronLeft, Save, Download,
  CheckCircle2, Server, Database, Code, ListTodo, Flag,
  UserCircle, Activity
} from "lucide-react";
import { cn } from "../utils/cn";

const loadingMessages = [
  "Analyzing project requirements...",
  "Generating project scope and objectives...",
  "Drafting user personas and stories...",
  "Creating development milestones...",
  "Estimating tasks and timelines...",
  "Designing database architecture...",
  "Mapping API endpoints...",
  "Finalizing comprehensive project plan..."
];

export const AIPlanner: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const prdRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState(1);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);

  // Form State
  const [name, setName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [description, setDescription] = useState("");
  const [techPreference, setTechPreference] = useState("");

  // Generated Plan State
  const [plan, setPlan] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"prd" | "tasks" | "milestones">("prd");

  const generateMutation = useMutation({
    mutationFn: planningService.generatePlan,
    onSuccess: (data) => {
      setPlan(data);
      setStep(4);
      toast("AI Project Plan generated successfully!", "success");
    },
    onError: (err: any) => {
      setStep(2);
      toast(err?.response?.data?.detail || "Failed to generate plan. Please try again.", "error");
    }
  });

  const saveMutation = useMutation({
    mutationFn: () => planningService.savePlan(name, deadline, plan),
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast("Project Plan saved to database!", "success");
      navigate("/");
    },
    onError: () => {
      toast("Failed to save project plan.", "error");
    }
  });

  useEffect(() => {
    let interval: ReturnType<typeof setTimeout>;
    if (step === 3 && generateMutation.isPending) {
      interval = setInterval(() => {
        setLoadingMsgIdx((prev) => (prev + 1) % loadingMessages.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [step, generateMutation.isPending]);

  const handleGenerate = () => {
    if (!name.trim() || !description.trim()) {
      toast("Project Name and Description are required", "error");
      return;
    }
    setStep(3);
    setLoadingMsgIdx(0);
    generateMutation.mutate({
      name,
      description,
      deadline: deadline || undefined,
      team_size: teamSize || undefined,
      tech_preference: techPreference || undefined
    });
  };

  const handleExportPDF = () => {
    if (!prdRef.current) return;
    const opt = {
      margin: 0.5,
      filename: `${name.replace(/\s+/g, '_')}_PRD.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as const }
    };
    html2pdf().set(opt).from(prdRef.current).save();
    toast("Exporting PDF...", "info");
  };

  return (
    <div className="max-w-5xl mx-auto animate-page-fade space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b">
        <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-sans font-bold text-2xl tracking-tight">AI Project Planner</h1>
          <p className="text-sm text-muted-foreground">Transform a simple idea into an execution-ready software plan.</p>
        </div>
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className="p-6 md:p-8 rounded-2xl border bg-card text-card-foreground shadow-premium space-y-6 animate-scale-in max-w-2xl mx-auto">
          <h2 className="font-bold text-xl flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs">1</span>
            Basic Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">Project Name *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. AI Resume Screener" className="w-full px-4 py-2.5 rounded-xl border bg-secondary/30 focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">Target Deadline</label>
                <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border bg-secondary/30 focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">Team Size</label>
                <input type="text" value={teamSize} onChange={(e) => setTeamSize(e.target.value)} placeholder="e.g. 2 Frontend, 1 Backend" className="w-full px-4 py-2.5 rounded-xl border bg-secondary/30 focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end pt-4 border-t">
            <button onClick={() => setStep(2)} disabled={!name.trim()} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/95 disabled:opacity-50 transition-all">
              Next Step <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Description */}
      {step === 2 && (
        <div className="p-6 md:p-8 rounded-2xl border bg-card text-card-foreground shadow-premium space-y-6 animate-slide-left max-w-3xl mx-auto">
          <h2 className="font-bold text-xl flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs">2</span>
            Project Details
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">Detailed Description *</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your project idea in detail. Who is it for? What are the core features?" rows={5} className="w-full px-4 py-3 rounded-xl border bg-secondary/30 focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">Technology Preferences</label>
              <input type="text" value={techPreference} onChange={(e) => setTechPreference(e.target.value)} placeholder="e.g. React, Node.js, PostgreSQL (Leave blank for AI suggestions)" className="w-full px-4 py-2.5 rounded-xl border bg-secondary/30 focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
          </div>
          
          <div className="flex justify-between pt-4 border-t">
            <button onClick={() => setStep(1)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border hover:bg-secondary font-semibold transition-all">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button onClick={handleGenerate} disabled={!description.trim()} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-violet-500 text-white font-semibold hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20">
              <Sparkles className="w-4 h-4" /> Generate Plan
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Loading Generation */}
      {step === 3 && (
        <div className="py-20 flex flex-col items-center justify-center text-center space-y-6 animate-fade-in">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-violet-500 rounded-full flex items-center justify-center relative z-10 animate-bounce shadow-xl">
              <Sparkles className="w-10 h-10 text-white animate-pulse" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">AI is crafting your project...</h2>
            <p className="text-muted-foreground font-medium animate-pulse transition-all duration-300">
              {loadingMessages[loadingMsgIdx]}
            </p>
          </div>
        </div>
      )}

      {/* Step 4: Results & Preview */}
      {step === 4 && plan && (
        <div className="space-y-6 animate-slide-up">
          {/* Action Bar */}
          <div className="flex items-center justify-between p-4 bg-card border rounded-2xl shadow-sm">
            <div className="flex bg-secondary/50 p-1 rounded-xl">
              {(["prd", "tasks", "milestones"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition-all",
                    activeTab === tab ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab === "prd" ? "PRD Viewer" : tab}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 rounded-xl border hover:bg-secondary text-sm font-semibold transition-all">
                <Download className="w-4 h-4" /> Export PDF
              </button>
              <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow hover:bg-primary/95 transition-all disabled:opacity-50">
                {saveMutation.isPending ? "Saving..." : <><Save className="w-4 h-4" /> Save Project</>}
              </button>
            </div>
          </div>

          {/* PRD Viewer Tab */}
          {activeTab === "prd" && (
            <div ref={prdRef} className="bg-card text-card-foreground border rounded-2xl shadow-premium p-8 md:p-12 space-y-8 print:shadow-none print:border-none print:p-0">
              <div className="text-center pb-8 border-b">
                <h1 className="text-3xl font-bold font-sans tracking-tight mb-3">{name}</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">{plan.project_overview}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2 mb-3"><CheckCircle2 className="w-5 h-5 text-primary" /> Objectives</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground bg-secondary/20 p-4 rounded-xl border">{plan.objectives}</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2 mb-3"><Activity className="w-5 h-5 text-primary" /> Project Scope</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground bg-secondary/20 p-4 rounded-xl border">{plan.scope}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2"><UserCircle className="w-5 h-5 text-primary" /> User Stories</h3>
                <div className="grid gap-3">
                  {plan.user_stories?.map((us: any, i: number) => (
                    <div key={i} className="p-3 border rounded-xl bg-card text-sm">
                      <span className="font-semibold text-primary">As a</span> {us.role}, <span className="font-semibold text-primary">I want to</span> {us.action} <span className="font-semibold text-primary">so that</span> {us.benefit}.
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold flex items-center gap-2"><Database className="w-5 h-5 text-primary" /> Database Architecture</h3>
                  <div className="space-y-3">
                    {plan.database_tables?.map((table: any, i: number) => (
                      <div key={i} className="p-4 border rounded-xl bg-secondary/10">
                        <h4 className="font-bold text-sm mb-1">{table.name}</h4>
                        <p className="text-xs text-muted-foreground mb-1"><span className="font-semibold">Columns:</span> {table.columns}</p>
                        <p className="text-xs text-muted-foreground"><span className="font-semibold">Relations:</span> {table.relationships}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-bold flex items-center gap-2"><Server className="w-5 h-5 text-primary" /> API Endpoints</h3>
                  <div className="space-y-3">
                    {plan.api_endpoints?.map((api: any, i: number) => (
                      <div key={i} className="p-3 border rounded-xl bg-secondary/10 flex items-start gap-3">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold text-white",
                          api.method === "GET" ? "bg-blue-500" : api.method === "POST" ? "bg-emerald-500" : api.method === "PUT" ? "bg-amber-500" : "bg-rose-500"
                        )}>{api.method}</span>
                        <div>
                          <p className="font-mono text-xs font-semibold">{api.path}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{api.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-3"><Code className="w-5 h-5 text-primary" /> Tech Stack Recommendation</h3>
                <p className="text-sm text-muted-foreground">{plan.tech_stack}</p>
              </div>
            </div>
          )}

          {/* Tasks Preview Tab */}
          {activeTab === "tasks" && (
            <div className="bg-card border rounded-2xl p-6 shadow-premium">
              <h3 className="text-lg font-bold flex items-center gap-2 mb-4"><ListTodo className="w-5 h-5 text-primary" /> Generated Tasks ({plan.tasks?.length})</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {plan.tasks?.map((task: any, i: number) => (
                  <div key={i} className="p-4 border rounded-xl bg-card hover:border-primary/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase", 
                        task.priority === "high" || task.priority === "critical" ? "bg-rose-500/10 text-rose-500" : "bg-blue-500/10 text-blue-500"
                      )}>{task.priority}</span>
                      <span className="text-[10px] font-semibold text-muted-foreground">{task.estimated_hours} hrs</span>
                    </div>
                    <h4 className="font-bold text-sm mb-1.5">{task.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-3">{task.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Milestones Preview Tab */}
          {activeTab === "milestones" && (
            <div className="bg-card border rounded-2xl p-6 shadow-premium">
              <h3 className="text-lg font-bold flex items-center gap-2 mb-4"><Flag className="w-5 h-5 text-primary" /> Project Milestones ({plan.milestones?.length})</h3>
              <div className="space-y-3 relative pl-4 border-l-2 border-primary/20 ml-2">
                {plan.milestones?.map((m: any, i: number) => (
                  <div key={i} className="relative p-4 border rounded-xl bg-card ml-4 hover:border-primary/50 transition-colors">
                    <div className="absolute w-3 h-3 bg-primary rounded-full -left-6 top-5 ring-4 ring-card" />
                    <h4 className="font-bold text-sm mb-1">{m.title}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{m.description}</p>
                    <div className="text-[11px] font-medium bg-secondary/50 p-2 rounded-lg text-foreground">
                      <span className="font-bold">Deliverables:</span> {m.deliverables}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
