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

      // Login using Supabase auth
      login: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.error("login error:", error);
          throw error;
        }

        const session = data.session;
        const supaUser = data.user ?? session?.user;
        if (!supaUser) {
          throw new Error("No user/session returned from Supabase");
        }

        // fetch profile row (if any)
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", supaUser.id)
          .maybeSingle();

        if (profileError) {
          console.warn("fetch profile warning:", profileError);
        }

        const appUser: User = {
          id: supaUser.id,
          email: supaUser.email ?? "",
          firstName: (profile?.first_name as string) ?? supaUser.user_metadata?.firstName ?? "",
          lastName: (profile?.last_name as string) ?? supaUser.user_metadata?.lastName ?? "",
          avatarUrl:
            supaUser.user_metadata?.avatarUrl ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              `${(profile?.first_name ?? supaUser.user_metadata?.firstName ?? "").trim()} ${(profile?.last_name ?? supaUser.user_metadata?.lastName ?? "").trim()}`
            )}&background=random`,
          role:
            (profile?.role as "admin" | "user") ||
            (supaUser.user_metadata?.role as "admin" | "user") ||
            "user",
        };

        set({
          user: appUser,
          token: session?.access_token ?? null,
          isAuthenticated: true,
        });
      },

      // Sign up using Supabase auth
      signup: async (email: string, password: string, firstName: string, lastName: string) => {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { firstName, lastName },
          },
        });

        if (error) {
          console.error("signup error:", error);
          throw error;
        }

        // if session returned, user is signed in immediately
        const session = data.session;
        const supaUser = data.user ?? session?.user;

        if (supaUser && session) {
          // Attempt to fetch profile row created by trigger (if exists)
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", supaUser.id)
            .maybeSingle();

          if (profileError) console.warn("signup profile fetch warning:", profileError);

          const appUser: User = {
            id: supaUser.id,
            email: supaUser.email ?? email,
            firstName: (profile?.first_name as string) ?? firstName,
            lastName: (profile?.last_name as string) ?? lastName,
            avatarUrl:
              supaUser.user_metadata?.avatarUrl ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(`${firstName} ${lastName}`)}&background=random`,
            role:
              (profile?.role as "admin" | "user") ||
              (supaUser.user_metadata?.role as "admin" | "user") ||
              "user",
          };

          set({
            user: appUser,
            token: session.access_token,
            isAuthenticated: true,
          });

          return { needsConfirmation: false };
        }

        // No session — likely requires email confirmation
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        return { needsConfirmation: true };
      },

      // Sign out using Supabase auth
      logout: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error("signOut error:", error);
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      // Restore session using Supabase persisted session
      restoreSession: async () => {
        try {
          const { data, error } = await supabase.auth.getSession();
          if (error) {
            console.error("getSession error:", error);
            set({ user: null, token: null, isAuthenticated: false });
            return;
          }

          const session = data.session;
          if (!session) {
            set({ user: null, token: null, isAuthenticated: false });
            return;
          }

          const supaUser = session.user;
          // fetch profile
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", supaUser.id)
            .maybeSingle();

          if (profileError) console.warn("restoreSession profile fetch warning:", profileError);

          const appUser: User = {
            id: supaUser.id,
            email: supaUser.email ?? "",
            firstName: (profile?.first_name as string) ?? supaUser.user_metadata?.firstName ?? "",
            lastName: (profile?.last_name as string) ?? supaUser.user_metadata?.lastName ?? "",
            avatarUrl:
              supaUser.user_metadata?.avatarUrl ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                `${(profile?.first_name ?? supaUser.user_metadata?.firstName ?? "").trim()} ${(profile?.last_name ?? supaUser.user_metadata?.lastName ?? "").trim()}`
              )}&background=random`,
            role:
              (profile?.role as "admin" | "user") ||
              (supaUser.user_metadata?.role as "admin" | "user") ||
              "user",
          };

          set({
            user: appUser,
            token: session.access_token,
            isAuthenticated: true,
          });
        } catch (err) {
          console.error("restoreSession caught error:", err);
          set({ user: null, token: null, isAuthenticated: false });
        }
      },

      // Manual setter
      setUser: (user: User) => {
        set({
          user: {
            ...user,
            avatarUrl:
              user.avatarUrl ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(`${user.firstName} ${user.lastName}`)}&background=random`,
          },
          isAuthenticated: true,
        });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Subscribe to Supabase auth state changes to keep store in sync
supabase.auth.onAuthStateChange((_event, session) => {
  (async () => {
    const state = useAuthStore.getState();

    if (session?.user) {
      const user = session.user;

      // fetch profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) console.warn("auth listener profile fetch warning:", profileError);

      const appUser: User = {
        id: user.id,
        email: user.email ?? "",
        firstName: (profile?.first_name as string) ?? user.user_metadata?.firstName ?? "",
        lastName: (profile?.last_name as string) ?? user.user_metadata?.lastName ?? "",
        avatarUrl:
          user.user_metadata?.avatarUrl ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            `${(profile?.first_name ?? user.user_metadata?.firstName ?? "").trim()} ${(profile?.last_name ?? user.user_metadata?.lastName ?? "").trim()}`
          )}&background=random`,
        role:
          (profile?.role as "admin" | "user") ||
          (user.user_metadata?.role as "admin" | "user") ||
          "user",
      };

      const currentUser = state.user;
      if (!currentUser || currentUser.id !== appUser.id) {
        useAuthStore.setState({
          user: appUser,
          token: session.access_token ?? null,
          isAuthenticated: true,
        });
      }
    } else if (useAuthStore.getState().isAuthenticated) {
      useAuthStore.setState({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    }
  })();
});
