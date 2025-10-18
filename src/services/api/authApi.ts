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

  async signup({
    email,
    password,
    firstName,
    lastName,
  }: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    await delay(1000);
    if (mockDatabase.users.some((u) => u.email === email)) {
      throw new Error("Email already registered");
    }
    const newUser: MockUser = {
      id: `user-${Date.now()}`,
      email,
      password,
      firstName,
      lastName,
      role: "user",
    };
    mockDatabase.users.push(newUser);
    const { password: _, ...safeUser } = newUser;
    return { user: safeUser, token: `mock-token-${newUser.id}-${Date.now()}` };
  },
  /////////////////////////////////////////////////////////////

  // Request password reset
  async requestPasswordReset(email: string) {
    await delay(800);
    const user = mockDatabase.users.find((u) => u.email === email);
    if (!user) throw new Error("Email not found");

    // Generate a simple 6-digit code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Simulate saving the reset code to mock database
    (user as any).resetCode = resetCode;

    return resetCode; // For demo, we return it directly
  },

  //  Reset password
  async resetPassword(email: string, newPassword: string) {
    await delay(1000);
    const user = mockDatabase.users.find((u) => u.email === email);
    if (!user) throw new Error("User not found");

    user.password = newPassword;
    delete (user as any).resetCode;

    return { message: "Password reset successfully" };
  },
};
