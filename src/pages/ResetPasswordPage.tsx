import React, { useState } from "react";
import { Button } from "../components/global/Button";
import { Input } from "../components/global/Input";
import { Label } from "../components/global/Label";
import { Alert, AlertDescription } from "../components/global/Alert";
import { Loader } from "../components/global/Loader";
import { Mail, Lock, CheckCircle2, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useToast } from "../components/global/toast/useToast";
import { supabase } from "../lib/supabaseClient";
import { authApi } from "../services/api/authApi";
interface ResetPasswordPageProps {
  onNavigateToLogin: () => void;
}

type ResetStep = "email" | "code" | "password" | "success";

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ onNavigateToLogin }) => {
  const [step, setStep] = useState<ResetStep>("email");
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedCode] = useState("");

  //  initialize the toast context hook
  const { success } = useToast();

  // handle email submit
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Use Supabase to send a password reset email
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        // optional: redirectTo: `${window.location.origin}/auth/reset-callback`
      });

      if (error) {
        console.error("resetPasswordForEmail error:", error);
        throw error;
      }

      // Supabase sends an email with a reset link — show success to user
      setStep("success");
      success("Password reset email sent. Check your inbox.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to send reset email";
      setError(msg);
      console.error("handleEmailSubmit error:", err);
    } finally {
      setLoading(false);
    }
  };

  // handle code verification
  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (resetCode !== generatedCode) {
      setError("Invalid reset code. Please check and try again.");

      return;
    }

    setStep("password");
    success("Code verified successfully!");
  };

  // handle password reset
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");

      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");

      return;
    }

    setLoading(true);

    try {
      await authApi.resetPassword(email, newPassword);
      setStep("success");
      success("Password reset successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    onNavigateToLogin();
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] rounded-2xl items-center justify-center mb-4">
            <span className="text-white text-2xl">DT</span>
          </div>
          <h1 className="text-[var(--text-primary)] mb-2">Reset Password</h1>
          <p className="text-[var(--text-secondary)]">
            {step === "email" && "Enter your email to receive a reset code"}
            {step === "code" && "Enter the verification code"}
            {step === "password" && "Create a new password"}
            {step === "success" && "Your password has been reset"}
          </p>
        </div>

        {/* Card container */}
        <div className="bg-[var(--bg-paper)] rounded-2xl shadow-sm border border-[var(--border-color)] p-8">
          {/* Step 1: Email */}
          {step === "email" && (
            <form onSubmit={handleEmailSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
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
                {loading ? <Loader size="sm" /> : "Send Reset Code"}
              </Button>
            </form>
          )}

          {/* Step 2: Code Verification */}
          {step === "code" && (
            <form onSubmit={handleCodeSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  required
                  maxLength={6}
                  className="bg-[var(--bg-main)] text-center tracking-widest"
                />
                <p className="text-xs text-[var(--text-secondary)]">Code sent to {email}</p>
              </div>

              {/* Demo Display */}
              <div className="bg-[var(--color-primary-light)] border border-[var(--color-primary)]/20 rounded-lg p-4">
                <p className="text-xs text-[var(--text-secondary)] mb-2">
                  Demo Mode - Your reset code:
                </p>
                <p className="text-center text-2xl tracking-widest text-[var(--color-primary)]">
                  {generatedCode}
                </p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-3">
                <Button
                  type="submit"
                  className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white"
                >
                  Verify Code
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("email")}
                  className="w-full"
                >
                  Back to Email
                </Button>
              </div>
            </form>
          )}

          {/* Step 3: New Password */}
          {step === "password" && (
            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pl-10 pr-10 bg-[var(--bg-main)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  Must be at least 6 characters
                </p>
              </div>

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
                {loading ? <Loader size="sm" /> : "Reset Password"}
              </Button>
            </form>
          )}

          {/* Step 4: Success */}
          {step === "success" && (
            <div className="text-center space-y-5">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-[var(--color-success)]/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-[var(--color-success)]" />
                </div>
              </div>
              <div>
                <h3 className="text-[var(--text-primary)] mb-2">Password Reset Complete!</h3>
                <p className="text-[var(--text-secondary)] text-sm">
                  Your password has been successfully reset. You can now log in with your new
                  password.
                </p>
              </div>
              <Button
                onClick={handleBackToLogin}
                className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </div>
          )}
        </div>

        {/* Back to Login button (bottom) */}
        {step !== "success" && (
          <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
            <button
              type="button"
              onClick={handleBackToLogin}
              className="text-[var(--color-primary)] hover:underline inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" />
              Back to login
            </button>
          </p>
        )}
      </div>
    </div>
  );
};
