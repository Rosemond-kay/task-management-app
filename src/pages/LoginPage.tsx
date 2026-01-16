import React, { useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { Button } from "../components/global/Button";
import { Input } from "../components/global/Input";
import { Label } from "../components/global/Label";
import { Alert, AlertDescription } from "../components/global/Alert";
import { Loader } from "../components/global/Loader";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useToast } from "../components/global/toast/useToast";
import bg from "../assets/bk-img.png";
import { Toaster } from "../components/global/toast/Toaster";
import { supabase } from "../lib/supabaseClient";

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
  const { success, error: errorToast } = useToast();

  const handleGoogleSignIn = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
          queryParams: { prompt: "select_account" },
        },
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Google sign-in failed";
      errorToast(message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      success("Welcome back!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      errorToast(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <div
        className="min-h-screen bg-[var(--bg-main)] bg-cover bg-center flex items-center justify-center p-4"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="w-full max-w-md bg">
          <div className="text-center mb-8">
            <div className="inline-flex w-16 h-16 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] rounded-2xl items-center justify-center mb-4">
              <span className="text-white text-2xl">T</span>
            </div>
            <h1 className="text-white text-3xl font-semibold mb-2 tracking-wide uppercase">
              Welcome to TaskFlow
            </h1>
            <p className="text-black">Sign in to manage your tasks</p>
          </div>

          <div className="bg-[var(--bg-paper)] rounded-2xl shadow-sm border border-[var(--border-color)] p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="mt-4">
                <Button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full bg-[var(--color-primary)] text-[var(--text-primary)] border border-[var(--border-color)] hover:bg-[var(--bg-hover)]"
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
                      <path
                        fill="#FFC107"
                        d="M43.6 20.5H42V20H24v8h11.3C34 31.1 29.6 34 24 34c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.8 4.1 29.7 2 24 2 12.9 2 4 10.9 4 22s8.9 20 20 20 18.7-8.1 18.7-20c0-1.3-.1-2.2-.3-3.5z"
                      />
                      <path
                        fill="#FF3D00"
                        d="M6.3 14.7L13 19.2C14.8 14.9 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.8 4.1 29.7 2 24 2 16.1 2 9.5 6.5 6.3 14.7z"
                      />
                      <path
                        fill="#4CAF50"
                        d="M24 42c5.5 0 10.5-2.1 14.2-5.5l-6.5-5.3C29.6 34 27 35 24 35c-5.6 0-10.3-3.8-11.9-9l-6.7 5.2C7.6 36.9 15.1 42 24 42z"
                      />
                      <path
                        fill="#1976D2"
                        d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.2-3.6 5.6-6.6 7.2l6.5 5.3C38.1 37.6 42 30.9 42 22c0-1.3-.1-2.2-.3-3.5z"
                      />
                    </svg>
                    Sign in with Google
                  </span>
                </Button>
              </div>
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
        </div>
      </div>
    </>
  );
};
