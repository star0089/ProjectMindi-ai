import axios from "axios";
import type { 
  Project, Task, TaskStatus, Milestone, Risk, Scope, ChatHistory, DashboardSummary 
} from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "https://projectmindi-ai.onrender.com";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Response interceptor for unified error formatting
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let customError = "An unexpected error occurred.";
    if (error.response) {
      const data = error.response.data;
      if (data && data.message) {
        customError = data.message;
      } else if (data && data.detail) {
        customError = typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail);
      } else {
        customError = `Server returned status ${error.response.status}`;
      }
    } else if (error.request) {
      customError = "Network error: Unable to connect to backend service.";
    } else {
      customError = error.message || customError;
    }
    return Promise.reject(new Error(customError));
  }
);

export const projectService = {
  getProjects: async (params?: { search?: string; status?: string; sort_by?: string }): Promise<Project[]> => {
    const response = await apiClient.get<Project[]>("/projects", { params });
    return response.data;
  },
  getProject: async (id: number): Promise<Project> => {
    const response = await apiClient.get<Project>(`/projects/${id}`);
    return response.data;
  },
  createProject: async (project: Omit<Project, "id" | "created_at" | "updated_at" | "progress_percentage" | "completed_tasks_count" | "pending_tasks_count" | "total_tasks_count" | "overdue_tasks_count" | "milestones_count" | "completed_milestones_count">): Promise<Project> => {
    const response = await apiClient.post<Project>("/projects", project);
    return response.data;
  },
  updateProject: async (id: number, project: Partial<Project>): Promise<Project> => {
    const response = await apiClient.put<Project>(`/projects/${id}`, project);
    return response.data;
  },
  deleteProject: async (id: number): Promise<void> => {
    await apiClient.delete(`/projects/${id}`);
  },
};

export const taskService = {
  getTasks: async (params?: { 
    project_id?: number; 
    status?: string; 
    priority?: string; 
    search?: string; 
    assignee?: string 
  }): Promise<Task[]> => {
    const response = await apiClient.get<Task[]>("/tasks", { params });
    return response.data;
  },
  getTask: async (id: number): Promise<Task> => {
    const response = await apiClient.get<Task>(`/tasks/${id}`);
    return response.data;
  },
  createTask: async (task: Omit<Task, "id" | "project_name">): Promise<Task> => {
    const response = await apiClient.post<Task>("/tasks", task);
    return response.data;
  },
  updateTask: async (id: number, task: Partial<Task>): Promise<Task> => {
    const response = await apiClient.put<Task>(`/tasks/${id}`, task);
    return response.data;
  },
  moveTaskStatus: async (id: number, status: TaskStatus): Promise<Task> => {
    const response = await apiClient.patch<Task>(`/tasks/${id}/status`, { status });
    return response.data;
  },
  deleteTask: async (id: number): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`);
  },
};

export const milestoneService = {
  getMilestones: async (projectId?: number): Promise<Milestone[]> => {
    const params = projectId ? { project_id: projectId } : {};
    const response = await apiClient.get<Milestone[]>("/milestones", { params });
    return response.data;
  },
  getMilestone: async (id: number): Promise<Milestone> => {
    const response = await apiClient.get<Milestone>(`/milestones/${id}`);
    return response.data;
  },
  createMilestone: async (milestone: Omit<Milestone, "id" | "project_name">): Promise<Milestone> => {
    const response = await apiClient.post<Milestone>("/milestones", milestone);
    return response.data;
  },
  updateMilestone: async (id: number, milestone: Partial<Milestone>): Promise<Milestone> => {
    const response = await apiClient.put<Milestone>(`/milestones/${id}`, milestone);
    return response.data;
  },
  toggleMilestoneComplete: async (id: number): Promise<Milestone> => {
    const response = await apiClient.patch<Milestone>(`/milestones/${id}/complete`);
    return response.data;
  },
  deleteMilestone: async (id: number): Promise<void> => {
    await apiClient.delete(`/milestones/${id}`);
  },
};

export const dashboardService = {
  getSummary: async (): Promise<DashboardSummary> => {
    const response = await apiClient.get<DashboardSummary>("/dashboard");
    return response.data;
  },
};

export const timelineService = {
  getTimeline: async (projectId?: number): Promise<any[]> => {
    const params = projectId ? { project_id: projectId } : {};
    const response = await apiClient.get("/timeline", { params });
    return response.data;
  },
};

export const scopeService = {
  getScope: async (projectId?: number): Promise<{
    project_id?: number;
    scope_health_score?: number;
    scope_alignment_score?: number;
    requirement_coverage_percent?: number;
    total_requirements?: number;
    implemented_requirements?: number;
    drift_detected?: boolean;
    scope_drift_detected?: boolean;
    drift_details?: string;
    missing_features?: string[];
    unplanned_features?: string[];
    incomplete_modules?: string[];
    requirements: Scope[];
  }> => {
    const params = projectId ? { project_id: projectId } : {};
    const response = await apiClient.get("/scope", { params });
    return response.data;
  },
};

export const riskService = {
  getRisks: async (projectId?: number): Promise<{
    project_id?: number;
    overall_risk_status: string;
    active_risks_count: number;
    mitigated_risks_count: number;
    risks: Risk[];
    explanations?: string | string[];
  }> => {
    const params = projectId ? { project_id: projectId } : {};
    const response = await apiClient.get("/risk", { params });
    return response.data;
  },
};

export const chatService = {
  askAssistant: async (projectId: number, question: string): Promise<ChatHistory> => {
    const response = await apiClient.post<ChatHistory>("/chat", {
      project_id: projectId,
      question,
    });
    return response.data;
  },
};

export const planningService = {
  generatePlan: async (request: {
    name: string;
    description: string;
    deadline?: string;
    team_size?: string;
    tech_preference?: string;
  }): Promise<any> => {
    const response = await apiClient.post("/planning/generate", request, {
      timeout: 60000, // 60s timeout for complex LLM generation
    });
    return response.data;
  },
  
  savePlan: async (name: string, deadline?: string, planData?: any): Promise<Project> => {
    const response = await apiClient.post<Project>("/planning/save", planData, {
      params: { name, deadline: deadline || undefined },
    });
    return response.data;
  }
};

export const insightsService = {
  getHealthScore: async (projectId: number): Promise<any> => {
    const response = await apiClient.get("/insights/health", { params: { project_id: projectId } });
    return response.data;
  },
  getStandup: async (projectId: number): Promise<any> => {
    const response = await apiClient.get("/insights/standup", { params: { project_id: projectId } });
    return response.data;
  },
  getExecutiveSummary: async (projectId: number): Promise<any> => {
    const response = await apiClient.get("/insights/executive-summary", { params: { project_id: projectId } });
    return response.data;
  },
  getRecommendations: async (projectId: number): Promise<any> => {
    const response = await apiClient.get("/insights/recommendations", { params: { project_id: projectId } });
    return response.data;
  },
  applyRecommendation: async (projectId: number, recommendationId: string): Promise<any> => {
    const response = await apiClient.post("/insights/recommendations/apply", null, {
      params: { project_id: projectId, recommendation_id: recommendationId }
    });
    return response.data;
  },
  getPredictions: async (projectId: number): Promise<any> => {
    const response = await apiClient.get("/insights/prediction", { params: { project_id: projectId } });
    return response.data;
  },
};

export const prdService = {
  parsePRD: async (documentText: string, documentTitle?: string): Promise<any> => {
    const response = await apiClient.post("/prd/parse", { document_text: documentText, document_title: documentTitle });
    return response.data;
  },
  auditScope: async (projectId: number, blueprint?: any): Promise<any> => {
    const response = await apiClient.post("/prd/audit", { project_id: projectId, blueprint });
    return response.data;
  },
  getScopeAudit: async (projectId: number): Promise<any> => {
    const response = await apiClient.get("/prd/audit", { params: { project_id: projectId } });
    return response.data;
  }
};

export interface NotificationItem {
  id: number;
  user_id?: number;
  project_id?: number;
  title: string;
  message: string;
  type: "task" | "alert" | "success" | "deadline" | string;
  is_read: boolean;
  created_at: string;
}

export const notificationService = {
  getNotifications: async (): Promise<NotificationItem[]> => {
    const response = await apiClient.get<NotificationItem[]>("/notifications");
    return response.data;
  },
  markRead: async (id: number): Promise<any> => {
    const response = await apiClient.patch(`/notifications/${id}/read`);
    return response.data;
  },
  markAllRead: async (): Promise<any> => {
    const response = await apiClient.post("/notifications/read-all");
    return response.data;
  },
  createNotification: async (data: Partial<NotificationItem>): Promise<NotificationItem> => {
    const response = await apiClient.post<NotificationItem>("/notifications", data);
    return response.data;
  }
};
