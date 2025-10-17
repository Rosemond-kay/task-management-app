import React, { useState } from "react";
import { Button } from "../components/global/Button";
import { Input } from "../components/global/Input";
import { Label } from "../components/global/Label";
import { Alert, AlertDescription } from "../components/global/Alert";
import { Loader } from "../components/global/Loader";
import { Mail, Lock, CheckCircle2, ArrowLeft } from "lucide-react";
import { useToast } from "../components/global/toast/Toaster";

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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");

  //  initialize the toast context hook
  const { addToast } = useToast();

  // handle email submit
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const code = await authApi.requestPasswordReset(email);
      setGeneratedCode(code);
      setStep("code");

      // toast.success() from addToast()
      addToast("Reset code sent to your email!", "success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reset code");
      addToast("Failed to send reset code", "error");
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
      addToast("Invalid reset code", "error");
      return;
    }

    setStep("password");
    addToast("Code verified successfully!", "success");
  };

  // handle password reset
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      addToast("Passwords do not match", "error");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      addToast("Password too short", "error");
      return;
    }

    setLoading(true);

    try {
      await authApi.resetPassword(email, newPassword);
      setStep("success");
      addToast("Password reset successfully!", "success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
      addToast("Failed to reset password", "error");
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
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pl-10 bg-[var(--bg-main)]"
                  />
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
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
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
