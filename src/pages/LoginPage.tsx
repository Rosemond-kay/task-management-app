import React, { useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { Button } from "../components/global/Button";
import { Input } from "../components/global/Input";
import { Label } from "../components/global/Label";
import { Alert, AlertDescription } from "../components/global/Alert";
import { Loader } from "../components/global/Loader";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useToast } from "../components/global/toast/useToast";
import { ToastProvider } from "../components/global/toast/Toaster";

interface LoginPageProps {
  onNavigateToSignup: () => void;
  onNavigateToReset: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigateToSignup, onNavigateToReset }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((state) => state.login);

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      toast("success", "Welcome back!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      toast("error", message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex w-16 h-16 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] rounded-2xl items-center justify-center mb-4">
              <span className="text-white text-2xl">T</span>
            </div>
            <h1 className="text-[var(--text-primary)] mb-2">Welcome to TaskFlow</h1>
            <p className="text-[var(--text-secondary)]">Sign in to manage your tasks</p>
          </div>

          <div className="bg-[var(--bg-paper)] rounded-2xl shadow-sm border border-[var(--border-color)] p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="pl-10 bg-[var(--bg-main)]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pl-10 pr-10 bg-[var(--bg-main)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white"
              >
                {loading ? <Loader size="sm" /> : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-[var(--border-color)]">
              <p className="text-center text-sm text-[var(--text-secondary)]">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={onNavigateToSignup}
                  className="text-[var(--color-primary)] hover:underline"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>

          <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
            <button
              type="button"
              onClick={onNavigateToReset}
              className="text-[var(--color-primary)] hover:underline"
            >
              Forgot password?
            </button>
          </p>
        </div>
      </div>
    </ToastProvider>
  );
};
