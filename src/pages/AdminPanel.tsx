import React, { useState, useEffect } from "react";
import { useTaskStore } from "../stores/useTaskStore";
import { useAuthStore } from "../stores/useAuthStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/tasks/Tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/tasks/Table";
import Badge from "../components/tasks/Badge";
import { Button } from "../components/global/Button";
import { Input } from "../components/global/Input";
import { Search, Users, ListTodo, Shield, Trash2, Eye } from "lucide-react";
import { formatDate, formatCompletedAt } from "../utils/formatDate";
import type { Task } from "../types/task";
import type { User } from "../types/auth";

import { dbApi } from "../services/api/db.ts";
import { useToast } from "../components/global/toast/useToast";

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/tasks/Dialog";
import { Calendar, Clock, CheckCircle } from "lucide-react";

const statusColors = {
  todo: "bg-[var(--color-info)]/10 text-[var(--color-info)] border-[var(--color-info)]/20",
  in_progress:
    "bg-[var(--color-warning)]/10 text-[var(--color-warning)] border-[var(--color-warning)]/20",
  done: "bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20",
};

export const AdminPanel: React.FC = () => {
  const { tasks, deleteTask } = useTaskStore();
  const { user: currentUser } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [deleteUserDialogOpen, setDeleteUserDialogOpen] = useState(false);
  const [deleteTaskDialogOpen, setDeleteTaskDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [taskToView, setTaskToView] = useState<Task | null>(null);

  // const { toast } = useToast();
  const { success, error } = useToast();
  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const allUsers = await dbApi.getAllUsers();
      setUsers(allUsers);
    } catch (err) {
      console.error(err);
      error("Failed to load users");
    }
  };

  // Check if user is admin
  if (currentUser?.role !== "admin") {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-[var(--text-secondary)] mx-auto mb-4" />
          <h2 className="text-[var(--text-primary)] mb-2">Access Denied</h2>
          <p className="text-[var(--text-secondary)]">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  const filteredTasks = searchQuery
    ? tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : tasks;

  const filteredUsers = searchQuery
    ? users.filter(
        (u) =>
          u.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users;

  const handleDeleteUserClick = (userId: string) => {
    setUserToDelete(userId);
    setDeleteUserDialogOpen(true);
  };

  const handleDeleteUserConfirm = async () => {
    if (!userToDelete) return;

    try {
      await dbApi.deleteUser(userToDelete);
      await loadUsers(); // Reload users list
      success("User deleted successfully");
      setDeleteUserDialogOpen(false);
      setUserToDelete(null);
    } catch (err) {
      console.error(err);
      error("Failed to delete user");
    }
  };

  const handleDeleteTaskClick = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTaskToDelete(taskId);
    setDeleteTaskDialogOpen(true);
  };

  const handleDeleteTaskConfirm = async () => {
    if (!taskToDelete) return;

    try {
      await deleteTask(taskToDelete);
      success("Task deleted successfully");
      setDeleteTaskDialogOpen(false);
      setTaskToDelete(null);
    } catch (err) {
      console.error(err);
       error("Failed to delete task");
    }
  };

  const handleViewTask = (task: Task) => {
    setTaskToView(task);
    setViewDialogOpen(true);
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-6 h-6 text-[var(--color-primary)]" />
            <h2 className="text-[var(--text-primary)]">Admin Panel</h2>
          </div>
          <p className="text-[var(--text-secondary)]">Manage users and oversee all tasks</p>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-[var(--bg-paper)] border border-[var(--border-color)]">
            <TabsTrigger value="users" className="gap-2">
              <Users className="w-4 h-4" />
              Manage Users
            </TabsTrigger>
            <TabsTrigger value="tasks" className="gap-2">
              <ListTodo className="w-4 h-4" />
              Manage Tasks
            </TabsTrigger>
          </TabsList>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="pl-10 bg-[var(--bg-paper)]"
            />
          </div>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <div className="bg-[var(--bg-paper)] rounded-xl border border-[var(--border-color)] overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Tasks</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-12 text-[var(--text-secondary)]"
                      >
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => {
                      const userTaskCount = tasks.filter((t) => t.userId === user.id).length;
                      const isCurrentUser = user.id === currentUser?.id;

                      return (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {user.firstName}
                              {isCurrentUser && (
                                <Badge variant="outline" className="text-xs">
                                  You
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-[var(--text-secondary)]">
                            {user.email}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                user.role === "admin"
                                  ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                                  : "bg-[var(--bg-hover)] text-[var(--text-secondary)]"
                              }
                            >
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-[var(--text-secondary)]">
                              {userTaskCount} tasks
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUserClick(user.id)}
                              disabled={isCurrentUser}
                              className="text-[var(--color-error)] hover:bg-[var(--color-error)]/10 disabled:opacity-50"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-4">
            <div className="bg-[var(--bg-paper)] rounded-xl border border-[var(--border-color)] overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Completed At</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-12 text-[var(--text-secondary)]"
                      >
                        No tasks found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTasks.map((task) => {
                      const taskOwner = users.find((u) => u.id === task.userId);
                      return (
                        <TableRow
                          key={task.id}
                          className="cursor-pointer hover:bg-[var(--bg-hover)] transition-colors"
                          onClick={() => handleViewTask(task)}
                        >
                          <TableCell>
                            <div>
                              <p className="text-[var(--text-primary)]">{task.title}</p>
                              {task.description && (
                                <p className="text-sm text-[var(--text-secondary)] line-clamp-1">
                                  {task.description}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={statusColors[task.status]}>
                              {task.status === "in_progress"
                                ? "In Progress"
                                : task.status === "todo"
                                  ? "To Do"
                                  : "Done"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-[var(--text-secondary)]">
                            {formatDate(task.dueDate)}
                          </TableCell>
                          <TableCell>
                            <span
                              className={
                                task.completedAt
                                  ? "text-[var(--color-success)]"
                                  : "text-[var(--text-secondary)]"
                              }
                            >
                              {formatCompletedAt(task.completedAt)}
                            </span>
                          </TableCell>
                          <TableCell className="text-[var(--text-secondary)]">
                            {taskOwner?.firstName || "Unknown"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewTask(task);
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => handleDeleteTaskClick(task.id, e)}
                                className="text-[var(--color-error)] hover:bg-[var(--color-error)]/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete User Confirmation Dialog */}
      <AlertDialog open={deleteUserDialogOpen} onOpenChange={setDeleteUserDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action cannot be undone. All tasks
              created by this user will remain in the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUserConfirm}
              className="bg-[var(--color-error)] hover:bg-[var(--color-error)]/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Task Confirmation Dialog */}
      <AlertDialog open={deleteTaskDialogOpen} onOpenChange={setDeleteTaskDialogOpen}>
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
              onClick={handleDeleteTaskConfirm}
              className="bg-[var(--color-error)] hover:bg-[var(--color-error)]/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Task View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Task Details</DialogTitle>
            <DialogDescription>View task information</DialogDescription>
          </DialogHeader>
          {taskToView && (
            <div className="space-y-6">
              {/* Title and Status */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-[var(--text-primary)] mb-2">{taskToView.title}</h3>
                </div>
                <Badge variant="outline" className={statusColors[taskToView.status]}>
                  {taskToView.status === "in_progress"
                    ? "In Progress"
                    : taskToView.status === "todo"
                      ? "To Do"
                      : "Done"}
                </Badge>
              </div>

              {/* Description */}
              {taskToView.description && (
                <div>
                  <h4 className="text-[var(--text-secondary)] mb-2">Description</h4>
                  <p className="text-[var(--text-primary)]">{taskToView.description}</p>
                </div>
              )}

              {/* Owner */}
              <div>
                <h4 className="text-[var(--text-secondary)] mb-2">Owner</h4>
                <p className="text-[var(--text-primary)]">
                  {users.find((u) => u.id === taskToView.userId)?.firstName || "Unknown"}
                </p>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--border-color)]">
                <div>
                  <div className="text-sm text-[var(--text-secondary)] mb-1">Due Date</div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[var(--text-secondary)]" />
                    <span className="text-[var(--text-primary)]">
                      {formatDate(taskToView.dueDate)}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-[var(--text-secondary)] mb-1">Completed At</div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[var(--color-success)]" />
                    <span
                      className={
                        taskToView.completedAt
                          ? "text-[var(--color-success)]"
                          : "text-[var(--text-secondary)]"
                      }
                    >
                      {formatCompletedAt(taskToView.completedAt)}
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
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
