export type TaskStatus = "todo" | "in_progress" | "done";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (
    task: Omit<Task, "id" | "createdAt" | "updatedAt" | "userId" | "completedAt">
  ) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  getTasksByStatus: (status: TaskStatus) => Task[];
  searchTasks: (query: string) => Task[];
}

export interface CreateTaskInput {
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
}
