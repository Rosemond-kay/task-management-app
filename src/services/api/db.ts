export interface MockUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "admin" | "user";
  avatar?: string;
}

export interface MockTask {
  id: string;
  title: string;
  completed: boolean;
  userId: string;
}

export const mockDatabase: {
  users: MockUser[];
  tasks: MockTask[];
} = {
  users: [
    {
      id: "1",
      email: "amprosemond@gmail.com",
      password: "rosemond",
      firstName: "Rosemond",
      lastName: "Ampomah",
      role: "admin",
      avatar: "https://ui-avatars.com/api/?name=Admin+User&background=random",
    },
    {
      id: "2",
      email: "admin2@taskflow.com",
      password: "admin1234",
      firstName: "Admin",
      lastName: "User",
      role: "admin",
      avatar: "https://ui-avatars.com/api/?name=Admin+User&background=random",
    },
    {
      id: "3",
      email: "user@taskflow.com",
      password: "user123",
      firstName: "Regular",
      lastName: "User",
      role: "user",
    },
  ],
  tasks: [],
};

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const dbApi = {
  // Get all users (admin only)
  getAllUsers: async (): Promise<Omit<MockUser, "password">[]> => {
    await delay(300);

    return mockDatabase.users.map(({ password: _, ...user }) => user);
  },

  // Delete user (admin only)
  deleteUser: async (userId: string): Promise<void> => {
    await delay(500);

    const userIndex = mockDatabase.users.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      throw new Error("User not found");
    }

    // Prevent deleting the last admin
    const user = mockDatabase.users[userIndex];
    if (user.role === "admin") {
      const adminCount = mockDatabase.users.filter((u) => u.role === "admin").length;
      if (adminCount <= 1) {
        throw new Error("Cannot delete the last admin user");
      }
    }

    mockDatabase.users.splice(userIndex, 1);
  },
};

// Helper to get mock database (for admin panel)
export const getMockDatabase = () => {
  return mockDatabase.users.map(({ password: _, ...user }) => user);
};

// Helper to reset database (for testing)
export const resetMockDatabase = () => {
  mockDatabase.users = [
    {
      id: "1",
      email: "admin@taskflow.com",
      password: "admin123",
      firstName: "Admin",
      lastName: "User",
      role: "admin",
    },

    {
      id: "3",
      email: "admin2@taskflow.com",
      password: "admin1234",
      firstName: "Admin",
      lastName: "User",
      role: "admin",
    },
  ];
  mockDatabase.tasks = [];
};
