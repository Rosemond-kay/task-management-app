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

        const userWithAvatar: User = {
          ...response.user,
          avatarUrl:
            response.user.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              response.user.firstName + " " + response.user.lastName
            )}&background=random`, // fallback avatar
        };

        set({
          user: userWithAvatar,
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

        const userWithAvatar: User = {
          ...response.user,
          avatarUrl:
            response.user.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              firstName + " " + lastName
            )}&background=random`,
        };

        set({
          user: userWithAvatar,
          token: response.token,
          isAuthenticated: true,
        });
      },

      // Logout Function
      logout: () => {
        localStorage.removeItem("auth-storage");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      // Update user data manually
      setUser: (user: User) => {
        set({
          user: {
            ...user,
            avatarUrl:
              user.avatarUrl ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user.firstName + " " + user.lastName
              )}&background=random`,
          },
        });
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
