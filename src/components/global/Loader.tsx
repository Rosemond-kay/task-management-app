import React from "react";

/**
 * Loader Component
 *
 * A reusable loading spinner that can be used in buttons, modals, or pages.
 * It supports three sizes: small (sm), medium (md), and large (lg).
 */
export const Loader: React.FC<{ size?: "sm" | "md" | "lg" }> = ({ size = "md" }) => {
  // Define size-specific Tailwind classes for the spinner dimensions and border thickness
  const sizeClasses = {
    sm: "w-4 h-4 border-2", // Small loader
    md: "w-8 h-8 border-3", // Medium loader (default)
    lg: "w-12 h-12 border-4", // Large loader
  };

  return (
    // Center the spinner both vertically and horizontally within its container
    <div className="flex items-center justify-center">
      {/* 
        The spinner itself:
        - Uses Tailwind borders to create a circular ring
        - Top border is transparent to create a "spinning" illusion
        - `animate-spin` applies continuous rotation
        - Rounded fully to create a perfect circle
      */}
      <div
        className={`${sizeClasses[size]} border-[var(--color-primary)] border-t-transparent rounded-full animate-spin`}
      />
    </div>
  );
};

/**
 * LoadingScreen Component
 *
 * Displays a full-page loading state using the Loader component.
 * Typically used for initial app load or long-running async operations.
 */
export const LoadingScreen: React.FC = () => {
  return (
    // Full-screen flex container centered both ways with background color applied
    <div className="flex items-center justify-center min-h-screen bg-[var(--bg-main)]">
      {/* Render a large loader in the middle of the screen */}
      <Loader size="lg" />
    </div>
  );
};
