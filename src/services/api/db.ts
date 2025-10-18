export interface MockUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
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
      firstName: "Admin",
      lastName: "User",
      role: "admin",
    },
    {
      id: "2",
      email: "user@taskflow.com",
      password: "user123",
      firstName: "Regular",
      lastName: "User",
      role: "user",
    },
  ] as MockUser[],
  tasks: [] as MockTask[],
};

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
