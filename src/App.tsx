import { useState } from "react";
import { useAuthStore } from "./stores/useAuthStore";
import { Toaster } from "./components/global/toast/Toaster";
import { DashboardPage } from "./pages/DashboardPage";
import { SignupPage } from "./pages/SignupPage";
import { LoginPage } from "./pages/LoginPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { ToastProvider } from "./components/global/toast/Toaster";

type View = "dashboard" | "admin";
type AuthView = "login" | "signup" | "reset";

export default function App() {
  const { isAuthenticated } = useAuthStore();
  const [activeView] = useState<View>("dashboard");
  const [authView, setAuthView] = useState<AuthView>("login");

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
    <div className="min-h-screen bg-[var(--bg-main)] flex flex-col">
      <div className="flex-1">{activeView === "dashboard" && <DashboardPage />}</div>
      <Toaster />
    </div>
  );
}
