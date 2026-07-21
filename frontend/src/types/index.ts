export type ProjectStatus = "planning" | "active" | "completed" | "on_hold";
export type TaskStatus = "todo" | "in_progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "critical";
export type RiskSeverity = "low" | "medium" | "high" | "critical";
export type RiskStatus = "identified" | "mitigated" | "triggered" | "resolved";
export type ScopeStatus = "in_scope" | "out_of_scope" | "pending_review" | "implemented";

export interface Project {
  id: number;
  name: string;
  description: string | null;
  status: ProjectStatus;
  deadline: string | null; // ISO Date String
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  project_id: number;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  assignee: string | null;
  start_date: string | null;
  end_date: string | null;
}

export interface Milestone {
  id: number;
  project_id: number;
  title: string;
  deadline: string | null;
  completed: boolean;
  phase?: string;
}

export interface Risk {
  id: number;
  project_id: number;
  title: string;
  severity: RiskSeverity;
  status: RiskStatus;
  description: string | null;
  mitigation_plan?: string;
}

export interface Scope {
  id: number;
  project_id: number;
  requirement: string;
  status: ScopeStatus;
  notes: string | null;
}

export interface ChatHistory {
  id: number;
  project_id: number;
  question: string;
  response: string;
  timestamp: string;
}

export interface DashboardSummary {
  project_health: {
    status: string;
    score: number;
    description: string;
  };
  overall_progress: {
    percentage: number;
    completed_milestones: number;
    total_milestones: number;
  };
  tasks_summary: {
    completed: number;
    in_progress: number;
    todo: number;
    total: number;
  };
  upcoming_deadlines: Array<{
    id: number;
    title: string;
    deadline: string;
    type: "milestone" | "task";
  }>;
  active_risks: {
    count: number;
    severity_breakdown: Record<RiskSeverity, number>;
    items: Array<{
      id: number;
      title: string;
      severity: RiskSeverity;
      status: string;
    }>;
  };
  scope_health: {
    percentage: number;
    total_requirements: number;
    implemented: number;
    creep_detected: boolean;
  };
  recent_ai_insights: Array<{
    id: number;
    category: "risk" | "progress" | "scope" | "general";
    text: string;
    timestamp: string;
  }>;
  recent_activity: Array<{
    id: number;
    user: string;
    action: string;
    timestamp: string;
  }>;
}
