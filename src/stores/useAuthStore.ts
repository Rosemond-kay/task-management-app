import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthState, User } from "../types/auth.d.ts";
import { supabase } from "../lib/supabaseClient";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      //  LOGIN FUNCTION (Supabase)
      login: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw new Error(error.message);
        if (!data.session) throw new Error("No session returned from Supabase.");

        const supaUser = data.session.user;

        const user: User = {
          id: supaUser.id,
          email: supaUser.email || "",
          firstName: supaUser.user_metadata?.firstName || "",
          lastName: supaUser.user_metadata?.lastName || "",
          avatarUrl:
            supaUser.user_metadata?.avatarUrl ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              `${supaUser.user_metadata?.firstName || ""} ${supaUser.user_metadata?.lastName || ""}`
            )}&background=random`,
          role: supaUser.user_metadata?.role || "user",
        };

        set({
          user,
          token: data.session.access_token,
          isAuthenticated: true,
        });
      },

      //  SIGNUP FUNCTION (Supabase)
      signup: async (email: string, password: string, firstName: string, lastName: string) => {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { firstName, lastName },
          },
        });

        if (error) throw new Error(error.message);

        //  Supabase may require email confirmation — session may be null
        const supaUser = data.user;

        const user: User = {
          id: supaUser?.id || "",
          email: supaUser?.email || email,
          firstName,
          lastName,
          avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            `${firstName} ${lastName}`
          )}&background=random`,
          role: "user",
        };

        set({
          user,
          token: data.session?.access_token || null,
          isAuthenticated: !!data.session,
        });
      },

      //  LOGOUT FUNCTION
      logout: async () => {
        await supabase.auth.signOut();
        localStorage.removeItem("auth-storage");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      //  RESTORE SESSION + AUTH LISTENER
      restoreSession: async () => {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Session restore failed:", error.message);
          return;
        }

        const session = data.session;
        if (!session) return;

        const supaUser = session.user;
        const user: User = {
          id: supaUser.id,
          email: supaUser.email || "",
          firstName: supaUser.user_metadata?.firstName || "",
          lastName: supaUser.user_metadata?.lastName || "",
          avatarUrl:
            supaUser.user_metadata?.avatarUrl ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              `${supaUser.user_metadata?.firstName || ""} ${supaUser.user_metadata?.lastName || ""}`
            )}&background=random`,
          role: supaUser.user_metadata?.role || "user",
        };

        set({
          user,
          token: session.access_token,
          isAuthenticated: true,
        });
      },

      //  MANUAL USER SETTER
      setUser: (user: User) => {
        set((state) => ({
          ...state,
          user: {
            ...user,
            avatarUrl:
              user.avatarUrl ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                `${user.firstName} ${user.lastName}`
              )}&background=random`,
          },
          isAuthenticated: true,
        }));
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

//  Listen for Supabase auth state changes globally
supabase.auth.onAuthStateChange((_event, session) => {
  const state = useAuthStore.getState();

  if (session?.user) {
    const user = session.user;

    // Only update if the user data has changed to avoid unnecessary re-renders
    const currentUser = state.user;
    const newUserId = user.id;

    if (!currentUser || currentUser.id !== newUserId) {
      state.setUser({
        id: user.id,
        email: user.email || "",
        firstName: user.user_metadata?.firstName || "",
        lastName: user.user_metadata?.lastName || "",
        avatarUrl:
          user.user_metadata?.avatarUrl ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            `${user.user_metadata?.firstName || ""} ${user.user_metadata?.lastName || ""}`
          )}&background=random`,
        role: user.user_metadata?.role || "user",
      });
    }
  } else if (state.isAuthenticated) {
    // Only clear state if currently authenticated (avoid infinite loops)
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  }
});
