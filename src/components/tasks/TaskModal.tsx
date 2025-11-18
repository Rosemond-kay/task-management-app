import React, { useState, useEffect } from "react";
import type { Task, TaskStatus } from "../../types/task.d.ts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./Dialog";
import { Button } from "../global/Button";
import { Input } from "../global/Input";
import { Label } from "../global/Label";
import { Textarea } from "./Textarea";
import { Select } from "./Select";
import { formatDateTime } from "../../utils/formatDate";

interface TaskModalProps {
  task: Task | null;
  open: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<Task, "id" | "createdAt" | "updatedAt" | "userId">) => void;
  onUpdate?: (id: string, updates: Partial<Task>) => void;
  mode: "create" | "edit";
}

export const TaskModal: React.FC<TaskModalProps> = ({
  task,
  open,
  onClose,
  onSave,
  onUpdate,
  mode,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo" as TaskStatus,
    dueDate: "",
  });

  useEffect(() => {
    if (task && mode === "edit") {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        dueDate: task.dueDate,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        status: "todo",
        dueDate: "",
      });
    }
  }, [task, mode, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "edit" && task && onUpdate) {
      onUpdate(task.id, formData);
    } else {
      onSave(formData);
    }

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create New Task" : "Edit Task"}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Fill in the details below to create a new task."
              : "Update the task details and save your changes."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter task title"
              required
              className="bg-[var(--bg-paper)]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter task description"
              rows={4}
              className="bg-[var(--bg-paper)] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                label=""
                value={formData.status}
                onChange={(value: string) =>
                  setFormData({ ...formData, status: value as TaskStatus })
                }
                options={[
                  { label: "To Do", value: "todo" },
                  { label: "In Progress", value: "in_progress" },
                  { label: "Done", value: "done" },
                ]}
                placeholder="Select status"
                className="bg-[var(--bg-paper)]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              required
              className="bg-[var(--bg-paper)]"
            />
          </div>

          {mode === "edit" && task && (
            <div className="pt-3 border-t border-[var(--border-color)] space-y-1">
              <p className="text-xs text-[var(--text-secondary)]">
                Created: {formatDateTime(task.createdAt)}
              </p>
              <p className="text-xs text-[var(--text-secondary)]">
                Updated: {formatDateTime(task.updatedAt)}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white"
            >
              {mode === "create" ? "Create Task" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
