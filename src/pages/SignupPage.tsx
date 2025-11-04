import React, { useState } from "react";
//import { useAuthStore } from "../stores/useAuthStore";
import { Button } from "../components/global/Button";
import { Input } from "../components/global/Input";
import { Label } from "../components/global/Label";
import { Alert, AlertDescription } from "../components/global/Alert";
import { Loader } from "../components/global/Loader";
import { Lock, Mail, User, Eye, EyeOff } from "lucide-react";

import { useToast } from "../components/global/toast/useToast";
import { supabase } from "../lib/supabaseClient";

interface SignupPageProps {
  onNavigateToLogin: () => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onNavigateToLogin }) => {
  // Local state for form fields and error handling
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Accessing signup function from Zustand auth store
  //const signup = useAuthStore((state) => state.signup);

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

    if (firstName.trim().length < 2 || lastName.trim().length < 2) {
      setError("First and last name must be at least 2 characters");
      return;
    }

    setLoading(true);

    try {
      // Call Supabase sign-up method
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`, // optional redirect after email confirmation
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

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
              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                  <Input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    required
                    className="pl-10 bg-[var(--bg-main)]"
                  />
                </div>
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                  <Input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
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
                <p className="text-xs text-[var(--text-secondary)]">
                  Must be at least 6 characters
                </p>
              </div>
              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pl-10 pr-10 bg-[var(--bg-main)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
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
