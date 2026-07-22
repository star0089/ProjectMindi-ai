export type ProjectStatus = "planning" | "active" | "on_hold" | "completed" | "cancelled";
export type TaskStatus = "todo" | "in_progress" | "review" | "testing" | "done";
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
  progress_percentage: number;
  completed_tasks_count: number;
  pending_tasks_count: number;
  total_tasks_count: number;
  overdue_tasks_count: number;
  milestones_count: number;
  completed_milestones_count: number;
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
  project_name?: string | null;
}

export interface Milestone {
  id: number;
  project_id: number;
  title: string;
  deadline: string | null;
  completed: boolean;
  project_name?: string | null;
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
  stats: {
    total_projects: number;
    active_projects: number;
    completed_projects: number;
    total_tasks: number;
    completed_tasks: number;
    pending_tasks: number;
    overdue_tasks: number;
    active_milestones: number;
    overall_progress_percentage: number;
  };
  recent_projects: Project[];
  recent_tasks: Task[];
  upcoming_deadlines: Array<{
    id: string;
    title: string;
    deadline: string;
    type: "milestone" | "task";
    project_name?: string | null;
  }>;
}

export interface AIUserStory {
  role: string;
  action: string;
  benefit: string;
}

export interface AITask {
  title: string;
  description: string;
  priority: string;
  estimated_hours: number;
  status: string;
}

export interface AIMilestone {
  title: string;
  description: string;
  deadline_days_offset: number;
  deliverables: string;
}

export interface AIRisk {
  title: string;
  severity: string;
  description: string;
  mitigation: string;
}

export interface AIDatabaseTable {
  name: string;
  columns: string;
  relationships: string;
}

export interface AIApiEndpoint {
  method: string;
  path: string;
  description: string;
}

export interface AIProjectPlan {
  project_overview: string;
  objectives: string;
  scope: string;
  deliverables: string;
  personas: string;
  modules: string;
  tech_stack: string;
  user_stories: AIUserStory[];
  tasks: AITask[];
  milestones: AIMilestone[];
  risks: AIRisk[];
  database_tables: AIDatabaseTable[];
  api_endpoints: AIApiEndpoint[];
}
