import { create } from "zustand";
import type { TaskState, TaskStatus } from "../types/task";
import { useAuthStore } from "./useAuthStore";
import { supabase } from "../lib/supabaseClient";

// Status mappers between UI and DB
const toDbStatus = (status?: string) =>
  status === "todo" ? "To Do" : status === "in_progress" ? "In Progress" : status === "done" ? "Done" : status;

const fromDbStatus = (status?: string) =>
  status === "To Do" ? "todo" : status === "In Progress" ? "in_progress" : status === "Done" ? "done" : (status as any);

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  // Map UI status <-> DB status
  // UI: 'todo' | 'in_progress' | 'done'
  // DB: 'To Do' | 'In Progress' | 'Done'
  
  
  
  

  //  FETCH TASKS (User-specific or Admin)
  fetchTasks: async () => {
    set({ loading: true, error: null });
    const user = useAuthStore.getState().user;

    if (!user) {
      set({ loading: false, error: "User not authenticated" });
      return;
    }

    try {
      let query = supabase.from("tasks").select("*").order("created_at", { ascending: false });

      // Non-admin users see only their tasks
      if (user.role !== "admin") {
        query = query.eq("user_id", user.id);
      }

      const { data, error } = await query;

      if (error) throw error;

      const normalized = (data || []).map((t: any) => ({
        id: t.id,
        title: t.title,
        description: t.description ?? "",
        status: fromDbStatus(t.status),
        dueDate: t.due_date ?? null,
        completedAt: t.completed_at ?? null,
        createdAt: t.created_at ?? null,
        updatedAt: t.updated_at ?? null,
        userId: t.user_id,
      }));

      set({ tasks: normalized, loading: false });
    } catch (err: any) {
      console.error("Fetch error:", err.message);
      set({ error: "Failed to fetch tasks", loading: false });
    }
  },

  // ADD TASK
  addTask: async (taskData) => {
    const user = useAuthStore.getState().user;
    if (!user) throw new Error("User not authenticated");


    set({ loading: true, error: null });

    try {
      const dbStatus = toDbStatus(taskData.status) || "To Do";
      const insertPayload: any = {
        title: taskData.title,
        description: taskData.description ?? "",
        status: dbStatus,
        due_date: taskData.dueDate,
        user_id: user.id,
      };
  
      // Set completed_at if status is "Done" on creation
      if (dbStatus === "Done") {
        insertPayload.completed_at = new Date().toISOString();
      }
  
      const { data, error } = await supabase
        .from("tasks")
        .insert([insertPayload])
        .select()
        .single();
  

      if (error) throw error;

      const created = {
        id: data.id,
        title: data.title,
        description: data.description ?? "",
        status: fromDbStatus(data.status),
        dueDate: data.due_date ?? null,
        completedAt: data.completed_at ?? null,
        createdAt: data.created_at ?? null,
        updatedAt: data.updated_at ?? null,
        userId: data.user_id,
      };

      set((state) => ({
        tasks: [created, ...state.tasks],
        loading: false,
      }));
    } catch (err: any) {
      console.error("Add error:", err.message);
      set({ error: "Failed to add task", loading: false });
      throw err;
    }
  },

  // UPDATE TASK
  updateTask: async (id, updates) => {
    set({ loading: true, error: null });

    try {
      const dbStatus = toDbStatus(updates.status as any);
      const updatePayload: any = {
        title: updates.title,
        description: updates.description,
        status: dbStatus,
        due_date: updates.dueDate,
        updated_at: new Date().toISOString(),
      };
  
      // If status is being changed, update completed_at accordingly
      if (updates.status !== undefined) {
        if (dbStatus === "Done") {
          updatePayload.completed_at = new Date().toISOString();
        } else {
          // Clear completed_at if status is changed away from "Done"
          updatePayload.completed_at = null;
        }
      }

      const { data, error } = await supabase
        .from("tasks")
        .update(updatePayload)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      const updated = {
        id: data.id,
        title: data.title,
        description: data.description ?? "",
        status: fromDbStatus(data.status),
        dueDate: data.due_date ?? null,
        completedAt: data.completed_at ?? null,
        createdAt: data.created_at ?? null,
        updatedAt: data.updated_at ?? null,
        userId: data.user_id,
      };

      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updated } : t)),
        loading: false,
      }));
    
  } catch (err: any) {
    console.error("Delete error:", err.message);
    set({ error: "Failed to delete task", loading: false });
    throw err; 
  }
  },


  

  //  DELETE TASK
  deleteTask: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw error;

      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
        loading: false,
      }));
    } catch (err: any) {
      console.error("Delete error:", err.message);
      set({ error: "Failed to delete task", loading: false });
      throw err;
    }
  },

  //  FILTER BY STATUS
  getTasksByStatus: (status: TaskStatus) => {
    const user = useAuthStore.getState().user;
    const tasks = get().tasks;

    if (user?.role === "admin") {
      return tasks.filter((task) => task.status === status);
    }

    return tasks.filter((task) => task.status === status && task.userId === user?.id);
  },

  //  SEARCH
  searchTasks: (query: string) => {
    const user = useAuthStore.getState().user;
    const tasks = get().tasks;
    const lowerQuery = query.toLowerCase();

    const filteredTasks =
      user?.role === "admin" ? tasks : tasks.filter((task) => task.userId === user?.id);

    if (!query) return filteredTasks;

    return filteredTasks.filter(
      (task) =>
        task.title?.toLowerCase().includes(lowerQuery) ||
        task.description?.toLowerCase().includes(lowerQuery)
    );
  },
}));
