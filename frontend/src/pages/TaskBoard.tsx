import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskService, projectService } from "../services/api";
import type { Task, TaskPriority, TaskStatus } from "../types";
import { TaskCard } from "../components/common/TaskCard";
import { TaskModal } from "../components/task/TaskModal";
import { DeleteConfirmModal } from "../components/common/DeleteConfirmModal";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";
import { EmptyState } from "../components/common/EmptyState";
import { useToast } from "../hooks/useToast";
import { CheckSquare, Plus, Search, Filter } from "lucide-react";

export const TaskBoard: React.FC = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [selectedProjectId, setSelectedProjectId] = useState<number | undefined>(undefined);
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [search, setSearch] = useState("");

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  // Drag and drop state
  const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null);

  // Queries
  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: () => projectService.getProjects(),
  });

  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ["tasks", selectedProjectId, priorityFilter, search],
    queryFn: () => taskService.getTasks({
      project_id: selectedProjectId,
      priority: priorityFilter,
      search: search
    }),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: taskService.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] });
      setIsModalOpen(false);
      toast("Task created successfully!", "success");
    },
    onError: () => toast("Failed to create task", "error")
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Task> }) => taskService.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] });
      setIsModalOpen(false);
      setEditingTask(null);
      toast("Task updated successfully!", "success");
    },
    onError: () => toast("Failed to update task", "error")
  });

  const moveStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: TaskStatus }) => taskService.moveTaskStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] });
      toast(`Task status moved to ${variables.status.replace("_", " ")}`, "info");
    },
    onError: () => toast("Failed to move task status", "error")
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => taskService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] });
      setDeletingTask(null);
      toast("Task deleted", "info");
    },
    onError: () => toast("Failed to delete task", "error")
  });

  const handleCreateOrUpdate = (data: {
    project_id: number;
    title: string;
    description: string | null;
    priority: TaskPriority;
    status: TaskStatus;
    assignee: string | null;
    start_date: string | null;
    end_date: string | null;
  }) => {
    if (editingTask) {
      updateMutation.mutate({ id: editingTask.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const columns: { id: TaskStatus; title: string; color: string }[] = [
    { id: "todo", title: "To Do", color: "bg-slate-500/10 text-slate-700 dark:text-slate-400" },
    { id: "in_progress", title: "In Progress", color: "bg-violet-500/10 text-violet-700 dark:text-violet-400" },
    { id: "review", title: "Review", color: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400" },
    { id: "testing", title: "Testing", color: "bg-amber-500/10 text-amber-700 dark:text-amber-400" },
    { id: "done", title: "Done", color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" },
  ];

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks ? tasks.filter((t) => t.status === status) : [];
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, taskId: number) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData("text/plain", taskId.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    if (draggedTaskId !== null) {
      const taskToMove = tasks?.find((t) => t.id === draggedTaskId);
      if (taskToMove && taskToMove.status !== targetStatus) {
        moveStatusMutation.mutate({ id: draggedTaskId, status: targetStatus });
      }
      setDraggedTaskId(null);
    }
  };

  return (
    <div className="space-y-6 animate-page-fade">
      {/* Action Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search input */}
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border bg-card text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Project Filter */}
          <div className="flex items-center gap-2 bg-card border rounded-xl px-3 py-2 text-xs">
            <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
            <select
              value={selectedProjectId || ""}
              onChange={(e) => setSelectedProjectId(e.target.value ? Number(e.target.value) : undefined)}
              className="bg-transparent focus:outline-none font-medium cursor-pointer"
            >
              <option value="">All Projects</option>
              {projects?.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-2 bg-card border rounded-xl px-3 py-2 text-xs">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-transparent focus:outline-none font-medium cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Create Task Button */}
        <button
          onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-primary text-primary-foreground shadow hover:bg-primary/95 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {isLoading ? (
        <LoadingSkeleton variant="dashboard" />
      ) : error || !tasks ? (
        <EmptyState
          title="Failed to Load Tasks"
          description="Ensure the backend server is running and database is connected."
          icon={CheckSquare}
        />
      ) : tasks.length === 0 ? (
        <EmptyState
          title="No Tasks Found"
          description="Create your first task to start organizing workflows across Kanban columns."
          icon={CheckSquare}
          actionLabel="Create Task"
          onAction={() => { setEditingTask(null); setIsModalOpen(true); }}
        />
      ) : (
        /* Kanban Columns Grid */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
          {columns.map((col) => {
            const columnTasks = getTasksByStatus(col.id);
            return (
              <div 
                key={col.id} 
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
                className="flex flex-col gap-3.5 p-3 rounded-2xl border bg-muted/20 min-h-[500px]"
              >
                {/* Column header */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-card border shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${col.id === 'todo' ? 'bg-slate-400' : col.id === 'in_progress' ? 'bg-violet-500' : col.id === 'review' ? 'bg-indigo-500' : col.id === 'testing' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                    <span className="font-semibold text-xs">{col.title}</span>
                  </div>
                  <span className={`px-2 py-0.5 text-[11px] font-bold rounded-full ${col.color}`}>
                    {columnTasks.length}
                  </span>
                </div>

                {/* Task Cards Column */}
                <div className="flex-1 space-y-3">
                  {columnTasks.length === 0 ? (
                    <div className="h-32 flex items-center justify-center border-2 border-dashed rounded-xl text-[11px] text-muted-foreground/60">
                      Drop tasks here
                    </div>
                  ) : (
                    columnTasks.map((task) => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        className="cursor-grab active:cursor-grabbing"
                      >
                        <TaskCard 
                          task={task} 
                          onClick={() => { setEditingTask(task); setIsModalOpen(true); }}
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Task Creation / Edit Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
        task={editingTask}
        projects={projects || []}
        defaultProjectId={selectedProjectId}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingTask}
        title="Delete Task"
        message={`Are you sure you want to delete task '${deletingTask?.title}'?`}
        onClose={() => setDeletingTask(null)}
        onConfirm={() => deletingTask && deleteMutation.mutate(deletingTask.id)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
