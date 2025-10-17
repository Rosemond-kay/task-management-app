// src/services/api/mock/db.ts
export interface MockUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: "admin" | "user";
}

export interface MockTask {
  id: string;
  title: string;
  completed: boolean;
  userId: string;
}

export let mockDatabase = {
  users: [
    {
      id: "1",
      email: "admin@taskflow.com",
      password: "admin123",
      name: "Admin User",
      role: "admin",
    },
    {
      id: "2",
      email: "user@taskflow.com",
      password: "user123",
      name: "Regular User",
      role: "user",
    },
  ] as MockUser[],
  tasks: [] as MockTask[],
};

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
