import axios from "axios";
import type { 
  Project, Task, TaskStatus, Milestone, Risk, Scope, ChatHistory, DashboardSummary 
} from "../types";

const API_BASE_URL = "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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
    project_id: number;
    scope_alignment_score: number;
    total_requirements: number;
    implemented_requirements: number;
    drift_detected: boolean;
    requirements: Scope[];
  }> => {
    const params = projectId ? { project_id: projectId } : {};
    const response = await apiClient.get("/scope", { params });
    return response.data;
  },
};

export const riskService = {
  getRisks: async (projectId?: number): Promise<{
    project_id: number;
    overall_risk_status: string;
    active_risks_count: number;
    mitigated_risks_count: number;
    risks: Risk[];
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
