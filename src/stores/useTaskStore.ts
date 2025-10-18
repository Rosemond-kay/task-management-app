import { create } from "zustand";
import type { Task, TaskState, TaskStatus } from "../types/task";
import { useAuthStore } from "./useAuthStore";

// Mock initial tasks
const mockTasks: Task[] = [
  {
    id: "1",
    title: "Design new landing page",
    description: "Create a modern landing page design with hero section and features",
    status: "todo",
    dueDate: "2025-10-20",
    userId: "2",
    createdAt: "2025-10-10T10:00:00Z",
    updatedAt: "2025-10-10T10:00:00Z",
  },
  {
    id: "2",
    title: "Implement authentication",
    description: "Add login and registration functionality",
    status: "in-progress",
    dueDate: "2025-10-18",
    userId: "2",
    createdAt: "2025-10-09T14:30:00Z",
    updatedAt: "2025-10-14T09:15:00Z",
  },
  {
    id: "3",
    title: "Setup database schema",
    description: "Design and implement the database schema for the application",
    status: "done",
    dueDate: "2025-10-15",
    userId: "2",
    createdAt: "2025-10-08T11:20:00Z",
    updatedAt: "2025-10-13T16:45:00Z",
  },
  {
    id: "4",
    title: "Write API documentation",
    description: "Document all API endpoints with examples",
    status: "todo",
    dueDate: "2025-10-25",
    userId: "1",
    createdAt: "2025-10-11T08:00:00Z",
    updatedAt: "2025-10-11T08:00:00Z",
  },
  {
    id: "5",
    title: "Code review sprint 3",
    description: "Review pull requests from the last sprint",
    status: "in-progress",
    dueDate: "2025-10-16",
    userId: "1",
    createdAt: "2025-10-12T13:00:00Z",
    updatedAt: "2025-10-14T10:30:00Z",
  },
];

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: mockTasks,
  loading: false,
  error: null,

  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      set({ loading: false });
    } catch (error) {
      set({ error: "Failed to fetch tasks", loading: false });
    }
  },

  addTask: async (taskData) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));

      const newTask: Task = {
        ...taskData,
        id: `task-${Date.now()}`,
        userId: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      set((state) => ({
        tasks: [...state.tasks, newTask],
        loading: false,
      }));
    } catch (error) {
      set({ error: "Failed to add task", loading: false });
    }
  },

  updateTask: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));

      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: "Failed to update task", loading: false });
    }
  },

  deleteTask: async (id) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));

      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: "Failed to delete task", loading: false });
    }
  },

  getTasksByStatus: (status: TaskStatus) => {
    const user = useAuthStore.getState().user;
    const tasks = get().tasks;

    if (user?.role === "admin") {
      return tasks.filter((task) => task.status === status);
    }

    return tasks.filter((task) => task.status === status && task.userId === user?.id);
  },

  searchTasks: (query: string) => {
    const user = useAuthStore.getState().user;
    const tasks = get().tasks;
    const lowerQuery = query.toLowerCase();

    const filteredTasks =
      user?.role === "admin" ? tasks : tasks.filter((task) => task.userId === user?.id);

    if (!query) return filteredTasks;

    return filteredTasks.filter(
      (task) =>
        task.title.toLowerCase().includes(lowerQuery) ||
        task.description.toLowerCase().includes(lowerQuery)
    );
  },
}));
