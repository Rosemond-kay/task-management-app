import { useEffect, useState } from "react";
import { useAuthStore } from "./stores/useAuthStore";
import { Toaster } from "./components/global/toast/Toaster";
import { DashboardPage } from "./pages/DashboardPage";
import { SignupPage } from "./pages/SignupPage";
import { LoginPage } from "./pages/LoginPage";
import { AdminPanel } from "./pages/AdminPanel";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";

import { Navbar } from "./components/layout/NavBar";
import { Footer } from "./components/layout/Footer";

type View = "dashboard" | "admin";
type AuthView = "login" | "signup" | "reset";

export default function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [activeView, setActiveView] = useState<View>("dashboard");
  const [authView, setAuthView] = useState<AuthView>("login");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const persistedState = localStorage.getItem("auth-storage");
        if (persistedState) {
          const parsed = JSON.parse(persistedState);

          if (parsed.state?.isAuthenticated) {
            useAuthStore.setState({ isAuthenticated: false });
          }
        }

        await useAuthStore.getState().restoreSession();
      } finally {
        setLoading(false);
      }
    };
    init();
    // No auth listener here; it's managed globally in the store
  }, []);

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
      <>
        <Toaster />

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
        {/* <Toaster /> */}
      </>
    );
  }

  // When user IS authenticated, show the main app
  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-[var(--bg-main)] flex flex-col">
        <Navbar activeView={activeView} onViewChange={setActiveView} />
        <div className="flex-1">
          {activeView === "dashboard" && <DashboardPage />}
          {activeView === "admin" && <AdminPanel />}
        </div>
        <Footer />
        {/* <Toaster /> */}
      </div>
    </>
  );
}
