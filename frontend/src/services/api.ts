import axios from "axios";
import { 
  Project, ProjectStatus, Task, Milestone, Risk, Scope, ChatHistory, DashboardSummary 
} from "../types";

const API_BASE_URL = "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const projectService = {
  getProjects: async (): Promise<Project[]> => {
    const response = await apiClient.get<Project[]>("/projects");
    return response.data;
  },
  createProject: async (project: Omit<Project, "id" | "created_at" | "updated_at">): Promise<Project> => {
    const response = await apiClient.post<Project>("/projects", project);
    return response.data;
  },
};

export const taskService = {
  getTasks: async (projectId?: number): Promise<Task[]> => {
    const params = projectId ? { project_id: projectId } : {};
    const response = await apiClient.get<Task[]>("/tasks", { params });
    return response.data;
  },
  createTask: async (task: Omit<Task, "id">): Promise<Task> => {
    const response = await apiClient.post<Task>("/tasks", task);
    return response.data;
  },
};

export const dashboardService = {
  getSummary: async (): Promise<DashboardSummary> => {
    const response = await apiClient.get<DashboardSummary>("/dashboard");
    return response.data;
  },
};

export const timelineService = {
  getTimeline: async (projectId?: number): Promise<Milestone[]> => {
    const params = projectId ? { project_id: projectId } : {};
    const response = await apiClient.get<Milestone[]>("/timeline", { params });
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
