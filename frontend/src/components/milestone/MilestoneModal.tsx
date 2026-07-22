import React, { useState, useEffect } from "react";
import type { Milestone, Project } from "../../types";
import { X } from "lucide-react";

interface MilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { project_id: number; title: string; deadline: string | null; completed: boolean }) => void;
  milestone?: Milestone | null;
  projects: Project[];
  defaultProjectId?: number;
  isLoading?: boolean;
}

export const MilestoneModal: React.FC<MilestoneModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  milestone,
  projects,
  defaultProjectId,
  isLoading
}) => {
  const [projectId, setProjectId] = useState<number>(1);
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [completed, setCompleted] = useState(false);
  const [titleError, setTitleError] = useState("");

  useEffect(() => {
    if (milestone) {
      setProjectId(milestone.project_id);
      setTitle(milestone.title);
      setDeadline(milestone.deadline ? milestone.deadline.substring(0, 10) : "");
      setCompleted(milestone.completed);
    } else {
      if (defaultProjectId) {
        setProjectId(defaultProjectId);
      } else if (projects.length > 0) {
        setProjectId(projects[0].id);
      }
      setTitle("");
      setDeadline("");
      setCompleted(false);
    }
    setTitleError("");
  }, [milestone, isOpen, defaultProjectId, projects]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setTitleError("Milestone Title is required.");
      return;
    }

    onSubmit({
      project_id: Number(projectId),
      title: title.trim(),
      deadline: deadline || null,
      completed,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md p-6 bg-card text-card-foreground border rounded-2xl shadow-premium animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-2 border-b">
          <h3 className="font-sans font-bold text-lg">
            {milestone ? "Edit Milestone" : "Create Milestone"}
          </h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-secondary text-muted-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Assigned Project *
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl border bg-secondary/30 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Milestone Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError) setTitleError("");
              }}
              placeholder="e.g. Beta Release 1.0"
              className="w-full px-3.5 py-2 rounded-xl border bg-secondary/30 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background"
            />
            {titleError && (
              <p className="text-xs font-medium text-rose-500 mt-1">{titleError}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Target Deadline Date
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border bg-secondary/30 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background"
            />
          </div>

          <div className="flex items-center gap-2.5 pt-2">
            <input
              type="checkbox"
              id="milestoneCompleted"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              className="w-4 h-4 rounded text-primary border bg-secondary focus:ring-primary"
            />
            <label htmlFor="milestoneCompleted" className="text-sm font-medium text-foreground cursor-pointer">
              Mark as Completed
            </label>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 justify-end pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold border hover:bg-secondary transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-primary-foreground shadow hover:bg-primary/95 disabled:opacity-55 transition-all"
            >
              {isLoading ? "Saving..." : milestone ? "Save Milestone" : "Create Milestone"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
