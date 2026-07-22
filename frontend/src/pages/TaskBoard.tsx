import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskService } from "../services/api";
import { TaskCard } from "../components/common/TaskCard";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";
import { EmptyState } from "../components/common/EmptyState";
import { CheckSquare, Plus, X } from "lucide-react";
import type { TaskPriority, TaskStatus } from "../types";

export const TaskBoard: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskPriority, setTaskPriority] = useState<TaskPriority>("medium");
  const [taskAssignee, setTaskAssignee] = useState("");

  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => taskService.getTasks(),
  });

  const createTaskMutation = useMutation({
    mutationFn: taskService.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setIsModalOpen(false);
      setTaskTitle("");
      setTaskDesc("");
      setTaskPriority("medium");
      setTaskAssignee("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    createTaskMutation.mutate({
      project_id: 1, // default project id
      title: taskTitle,
      description: taskDesc || null,
      priority: taskPriority,
      status: "todo",
      assignee: taskAssignee || null,
      start_date: null,
      end_date: null,
    });
  };

  const columns: { id: TaskStatus; title: string; color: string }[] = [
    { id: "todo", title: "To Do", color: "bg-slate-500/10 text-slate-700 dark:text-slate-400" },
    { id: "in_progress", title: "In Progress", color: "bg-violet-500/10 text-violet-700 dark:text-violet-400" },
    { id: "review", title: "In Review", color: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400" },
    { id: "done", title: "Done", color: "bg-green-500/10 text-green-700 dark:text-green-400" },
  ];

  if (isLoading) {
    return <LoadingSkeleton variant="dashboard" />;
  }

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks ? tasks.filter((t) => t.status === status) : [];
  };

  return (
    <div className="space-y-8 animate-page-fade">
      {/* Header section */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b">
        <div>
          <h2 className="text-base text-muted-foreground">Manage project implementation steps and status cards</h2>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-primary-foreground shadow hover:bg-primary/95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {error || !tasks || tasks.length === 0 ? (
        <EmptyState
          title="No Tasks Found"
          description="Create your first task block to begin sorting workflows."
          icon={CheckSquare}
          actionLabel="Create Task"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((col) => {
            const columnTasks = getTasksByStatus(col.id);
            return (
              <div key={col.id} className="flex flex-col gap-4">
                {/* Column header */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-card border">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${col.id === 'todo' ? 'bg-slate-400' : col.id === 'in_progress' ? 'bg-violet-500' : col.id === 'review' ? 'bg-indigo-500' : 'bg-green-500'}`} />
                    <span className="font-semibold text-sm">{col.title}</span>
                  </div>
                  <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${col.color}`}>
                    {columnTasks.length}
                  </span>
                </div>

                {/* Column list */}
                <div className="flex-1 space-y-4 min-h-[300px]">
                  {columnTasks.length === 0 ? (
                    <div className="h-full flex items-center justify-center p-6 border-2 border-dashed rounded-2xl bg-muted/10 text-xs text-muted-foreground">
                      No tasks
                    </div>
                  ) : (
                    columnTasks.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 bg-card text-card-foreground border rounded-2xl shadow-premium animate-scale-in">
            <div className="flex items-center justify-between mb-6 pb-2 border-b">
              <h3 className="font-sans font-bold text-lg">Add Task Item</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-secondary text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Write database migrations"
                  className="w-full px-3.5 py-2 rounded-xl border bg-secondary/30 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Description
                </label>
                <textarea
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  placeholder="Detail task activities or implementation scope..."
                  rows={3}
                  className="w-full px-3.5 py-2 rounded-xl border bg-secondary/30 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Priority
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as TaskPriority)}
                    className="w-full px-3.5 py-2 rounded-xl border bg-secondary/30 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Assignee
                  </label>
                  <input
                    type="text"
                    value={taskAssignee}
                    onChange={(e) => setTaskAssignee(e.target.value)}
                    placeholder="Developer"
                    className="w-full px-3.5 py-2 rounded-xl border bg-secondary/30 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 justify-end pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold border hover:bg-secondary transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createTaskMutation.isPending}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-primary-foreground shadow hover:bg-primary/95 disabled:opacity-55 transition-all"
                >
                  {createTaskMutation.isPending ? "Adding..." : "Add Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
