import { mockDatabase, delay } from "./db";
import type { MockUser } from "./db";

export const authApi = {
  async login({ email, password }: { email: string; password: string }) {
    await delay(800);
    const user = mockDatabase.users.find((u) => u.email === email && u.password === password);
    if (!user) throw new Error("Invalid email or password");
    const { password: _, ...safeUser } = user;
    return { user: safeUser, token: `mock-token-${user.id}-${Date.now()}` };
  },

  async signup({ email, password, name }: { email: string; password: string; name: string }) {
    await delay(1000);
    if (mockDatabase.users.some((u) => u.email === email)) {
      throw new Error("Email already registered");
    }
    const newUser: MockUser = {
      id: `user-${Date.now()}`,
      email,
      password,
      name,
      role: "user",
    };
    mockDatabase.users.push(newUser);
    const { password: _, ...safeUser } = newUser;
    return { user: safeUser, token: `mock-token-${newUser.id}-${Date.now()}` };
  },
};
