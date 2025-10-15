import { useState } from "react";
import { useAuthStore } from "./stores/useAuthStore";
import { Toaster } from "./components/global/toast/Toaster";
import { SignupPage } from "./pages/SignupPage";

type AuthView = "login" | "signup" | "reset";

export default function App() {
  const { isAuthenticated } = useAuthStore();

  const [authView, setAuthView] = useState<AuthView>("signup");

  if (!isAuthenticated) {
    return (
      <>
        {authView === "signup" && <SignupPage onNavigateToLogin={() => setAuthView("login")} />}
        {authView === "login" && (
          <div className="min-h-screen flex items-center justify-center">
            <p>Login page not implemented yet</p>
          </div>
        )}
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] flex flex-col">
      <SignupPage onNavigateToLogin={() => setAuthView("login")} />
      <Toaster />
    </div>
  );
}
