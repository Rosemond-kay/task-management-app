import React, { useState, useMemo } from "react";
import { useTaskStore } from "../stores/useTaskStore";
import { useAuthStore } from "../stores/useAuthStore";
import { TaskModal } from "../components/tasks/TaskModal";
import type { Task } from "../types/task";
import { Button } from "../components/global/Button";
import { Input } from "../components/global/Input";
import { Plus, Search, Calendar, Clock, Edit2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/tasks/AlertDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/tasks/Table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/tasks/Dialog";
import Badge from "../components/tasks/Badge";
import { formatDate, isOverdue } from "../utils/formatDate";

import { useToast } from "../components/global/toast/useToast";
import { Toaster } from "../components/global/toast/Toaster";

const statusColors = {
  todo: "bg-[var(--color-info)]/10 text-[var(--color-info)] border-[var(--color-info)]/20",
  "in-progress":
    "bg-[var(--color-warning)]/10 text-[var(--color-warning)] border-[var(--color-warning)]/20",
  done: "bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20",
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { addTask, updateTask, deleteTask, searchTasks } = useTaskStore();
  const { toast } = useToast(); //  toast hook

  const allTasks = useTaskStore((state) => state.tasks);
  const tasks = useMemo(() => {
    if (user?.role === "admin") return allTasks;
    return allTasks.filter((task) => task.userId === user?.id);
  }, [allTasks, user?.id, user?.role]);

  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [taskToView, setTaskToView] = useState<Task | null>(null);

  const filteredTasks = searchQuery ? searchTasks(searchQuery) : tasks;

  const handleCreateTask = () => {
    setModalMode("create");
    setSelectedTask(null);
    setModalOpen(true);
  };

  const handleEditTask = (task: Task, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setModalMode("edit");
    setSelectedTask(task);
    setModalOpen(true);
  };

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTaskToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (taskToDelete) {
      await deleteTask(taskToDelete);
      toast("success", "Task created successfully");
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  const handleSaveTask = async (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt" | "userId">
  ) => {
    await addTask(taskData);
    toast("success", "Task created successfully");
  };

  const handleUpdateTask = async (id: string, updates: Partial<Task>) => {
    await updateTask(id, updates);
    toast("success", "Task updated successfully");
  };

  const handleRowClick = (task: Task) => {
    setTaskToView(task);
    setViewDialogOpen(true);
  };

  return (
    <div className="flex-1 overflow-auto relative">
      {/*  Toast Container */}
      <Toaster />

      <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
        {/* Greeting Header */}
        <div className="mb-8">
          <h2 className="text-[var(--text-primary)] mb-1">
            {getGreeting()}, {user?.firstName || "User"}!
          </h2>
          <p className="text-[var(--text-secondary)]">
            {filteredTasks.length === 0
              ? "You have no tasks yet. Create one to get started!"
              : filteredTasks.length === 1
                ? "You have 1 task to manage"
                : `You have ${filteredTasks.length} tasks to manage`}
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="pl-10 bg-[var(--bg-paper)]"
            />
          </div>

          <Button
            onClick={handleCreateTask}
            className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </div>

        {/* Tasks Table */}
        <div className="bg-[var(--bg-paper)] rounded-xl border border-[var(--border-color)] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-[var(--text-secondary)]">
                    No tasks found.{" "}
                    {searchQuery
                      ? "Try adjusting your search."
                      : "Create your first task to get started!"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredTasks.map((task) => {
                  const overdue = isOverdue(task.dueDate) && task.status !== "done";
                  return (
                    <TableRow
                      key={task.id}
                      className="cursor-pointer hover:bg-[var(--bg-hover)] transition-colors"
                      onClick={() => handleRowClick(task)}
                    >
                      <TableCell>
                        <div>
                          <div className="text-[var(--text-primary)]">{task.title}</div>
                          {task.description && (
                            <div className="text-sm text-[var(--text-secondary)] line-clamp-1 mt-1">
                              {task.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColors[task.status]}>
                          {task.status === "in-progress"
                            ? "In Progress"
                            : task.status === "todo"
                              ? "To Do"
                              : "Done"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                          <span
                            className={
                              overdue ? "text-[var(--color-error)]" : "text-[var(--text-secondary)]"
                            }
                          >
                            {formatDate(task.dueDate)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{new Date(task.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={(e) => handleEditTask(task, e)}
                            className="p-2 hover:bg-[var(--bg-hover)] rounded-lg transition-colors"
                            aria-label="Edit task"
                          >
                            <Edit2 className="w-4 h-4 text-[var(--text-secondary)]" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteClick(task.id, e)}
                            className="p-2 hover:bg-[var(--bg-hover)] rounded-lg transition-colors"
                            aria-label="Delete task"
                          >
                            <Trash2 className="w-4 h-4 text-[var(--color-error)]" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modals and Dialogs */}
      <TaskModal
        task={selectedTask}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveTask}
        onUpdate={handleUpdateTask}
        mode={modalMode}
      />

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Task Details</DialogTitle>
            <DialogDescription>View and manage task information</DialogDescription>
          </DialogHeader>
          {taskToView && (
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-[var(--text-primary)] mb-2">{taskToView.title}</h3>
                </div>
                <Badge variant="outline" className={statusColors[taskToView.status]}>
                  {taskToView.status === "in-progress"
                    ? "In Progress"
                    : taskToView.status === "todo"
                      ? "To Do"
                      : "Done"}
                </Badge>
              </div>

              {taskToView.description && (
                <div>
                  <h4 className="text-[var(--text-secondary)] mb-2">Description</h4>
                  <p className="text-[var(--text-primary)]">{taskToView.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--border-color)]">
                <div>
                  <div className="text-sm text-[var(--text-secondary)] mb-1">Due Date</div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[var(--text-secondary)]" />
                    <span
                      className={
                        isOverdue(taskToView.dueDate) && taskToView.status !== "done"
                          ? "text-[var(--color-error)]"
                          : "text-[var(--text-primary)]"
                      }
                    >
                      {formatDate(taskToView.dueDate)}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-[var(--text-secondary)] mb-1">Last Updated</div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[var(--text-secondary)]" />
                    <span className="text-[var(--text-primary)]">
                      {new Date(taskToView.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-[var(--text-secondary)] mb-1">Created</div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[var(--text-secondary)]" />
                    <span className="text-[var(--text-primary)]">
                      {new Date(taskToView.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-[var(--border-color)]">
                <Button
                  onClick={() => {
                    setViewDialogOpen(false);
                    handleEditTask(taskToView);
                  }}
                  className="flex-1 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Task
                </Button>
                <Button
                  onClick={() => {
                    setViewDialogOpen(false);
                    setTaskToDelete(taskToView.id);
                    setDeleteDialogOpen(true);
                  }}
                  variant="outline"
                  className="border-[var(--color-error)] text-[var(--color-error)] hover:bg-[var(--color-error)]/10"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-[var(--color-error)] hover:bg-[var(--color-error)]/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
