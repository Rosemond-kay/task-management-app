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

      // Login Function
      login: async (email: string, password: string) => {
        const response = await authApi.login({ email, password });

        set({
          user: response.user,
          token: response.token,
          isAuthenticated: true,
        });
      },

      // Signup Function
      signup: async (email: string, password: string, firstName: string, lastName: string) => {
        const response = await authApi.signup({
          email,
          password,
          firstName,
          lastName,
        });

        set({
          user: response.user,
          token: response.token,
          isAuthenticated: true,
        });
      },

      // Logout Function
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      // Update user data in store
      setUser: (user: User) => {
        set({ user });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
