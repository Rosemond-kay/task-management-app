import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthState, User } from "../types/auth.d.ts";
import { authApi } from "../services/api/authApi";
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        const response = await authApi.login({ email, password });

        set({
          user: response.user,
          token: response.token,
          isAuthenticated: true,
        });
      },

      signup: async (email: string, password: string, name: string) => {
        const response = await authApi.signup({ email, password, name });

        set({
          user: response.user,
          token: response.token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      setUser: (user: User) => {
        set({ user });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
