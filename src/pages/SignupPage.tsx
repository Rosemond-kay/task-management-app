import React, { useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { Button } from "../components/global/Button";
import { Input } from "../components/global/Input";
import { Label } from "../components/global/Label";
import { Alert, AlertDescription } from "../components/global/Alert";
import { Loader } from "../components/global/Loader";
import { Lock, Mail, User } from "lucide-react";
import { Toaster } from "../components/global/toast/Toaster";
import { useToast } from "../components/global/toast/useToast";

interface SignupPageProps {
  onNavigateToLogin: () => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onNavigateToLogin }) => {
  // Local state for form fields and error handling
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Accessing signup function from Zustand auth store
  const signup = useAuthStore((state) => state.signup);

  // Using our custom toast hook for success notifications
  const { toast } = useToast();

  // Handles the signup form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic client-side form validations
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }

    setLoading(true);

    try {
      // Attempt to create a new user
      await signup(email, password, name);

      // Show success toast after signup
      toast("success", "Account created successfully! Welcome to DigiiTask!");
    } catch (err) {
      // Display error message if signup fails
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex w-16 h-16 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] rounded-2xl items-center justify-center mb-4">
              <span className="text-white text-2xl">DT</span>
            </div>
            <h1 className="text-[var(--text-primary)] mb-2">Create an Account</h1>
            <p className="text-[var(--text-secondary)]">Get started with DigiiTask today</p>
          </div>

          {/* Signup Form Card */}
          <div className="bg-[var(--bg-paper)] rounded-2xl shadow-sm border border-[var(--border-color)] p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Input */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="pl-10 bg-[var(--bg-main)]"
                  />
                </div>
              </div>

              {/* Email Input */}
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

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pl-10 bg-[var(--bg-main)]"
                  />
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  Must be at least 6 characters
                </p>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pl-10 bg-[var(--bg-main)]"
                  />
                </div>
              </div>

              {/* Display error alert if any validation or signup fails */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white"
              >
                {loading ? <Loader size="sm" /> : "Create Account"}
              </Button>
            </form>

            {/* Footer section with navigation to login */}
            <div className="mt-6 pt-6 border-t border-[var(--border-color)]">
              <p className="text-center text-sm text-[var(--text-secondary)]">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={onNavigateToLogin}
                  className="text-[var(--color-primary)] hover:underline"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
