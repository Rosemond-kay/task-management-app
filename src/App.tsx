import { useEffect, useState } from "react";
import { useAuthStore } from "./stores/useAuthStore";
import { Toaster, ToastProvider } from "./components/global/toast/Toaster";
import { DashboardPage } from "./pages/DashboardPage";
import { SignupPage } from "./pages/SignupPage";
import { LoginPage } from "./pages/LoginPage";
import { AdminPanel } from "./pages/AdminPanel";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { supabase } from "./lib/supabaseClient";
import { Navbar } from "./components/layout/NavBar";
import { Footer } from "./components/layout/Footer";

type View = "dashboard" | "admin";
type AuthView = "login" | "signup" | "reset";

export default function App() {
  const { isAuthenticated, setUser, logout } = useAuthStore();
  const [activeView, setActiveView] = useState<View>("dashboard");
  const [authView, setAuthView] = useState<AuthView>("login");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error.message);
          logout();
          return;
        }

        const session = data.session;

        if (session?.user) {
          const { email, user_metadata } = session.user;

          // Set user in Zustand
          setUser({
            id: session.user.id,
            email: email || "",
            firstName: user_metadata?.firstName || "",
            lastName: user_metadata?.lastName || "",
            avatarUrl:
              user_metadata?.avatarUrl ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                `${user_metadata?.firstName || ""} ${user_metadata?.lastName || ""}`
              )}&background=random`,
            role: "user",
          });
        } else {
          logout();
        }
      } catch (error) {
        console.error("Session check failed:", error);
        logout();
      } finally {
        // Always set loading to false, even if there's an error
        setLoading(false);
      }
    };

    // Initial session check
    getSession();

    // Listen for changes to the auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const { email, user_metadata } = session.user;

        setUser({
          id: session.user.id,
          email: email || "",
          firstName: user_metadata?.firstName || "",
          lastName: user_metadata?.lastName || "",
          avatarUrl:
            user_metadata?.avatarUrl ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              `${user_metadata?.firstName || ""} ${user_metadata?.lastName || ""}`
            )}&background=random`,
          role: "user",
        });
      } else {
        logout();
      }
    });

    // Cleanup listener on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, logout]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--bg-main)]">
        <div className="text-center">
          <div className="inline-flex w-16 h-16 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] rounded-2xl items-center justify-center mb-4">
            <span className="text-white text-2xl">T</span>
          </div>
          <p className="text-[var(--text-primary)] font-medium">Loading TaskFlow...</p>
        </div>
      </div>
    );
  }

  // When user is NOT authenticated, show login/signup pages
  if (!isAuthenticated) {
    return (
      <ToastProvider>
        <>
          {authView === "login" && (
            <LoginPage
              onNavigateToSignup={() => setAuthView("signup")}
              onNavigateToReset={() => setAuthView("reset")}
            />
          )}
          {authView === "signup" && <SignupPage onNavigateToLogin={() => setAuthView("login")} />}
          {authView === "reset" && (
            <ResetPasswordPage onNavigateToLogin={() => setAuthView("login")} />
          )}
          <Toaster />
        </>
      </ToastProvider>
    );
  }

  // When user IS authenticated, show the main app
  return (
    <ToastProvider>
      <div className="min-h-screen bg-[var(--bg-main)] flex flex-col">
        <Navbar activeView={activeView} onViewChange={setActiveView} />
        <div className="flex-1">
          {activeView === "dashboard" && <DashboardPage />}
          {activeView === "admin" && <AdminPanel />}
        </div>
        <Footer />
        <Toaster />
      </div>
    </ToastProvider>
  );
}
