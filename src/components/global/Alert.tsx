import React from "react";

/**
 * Props for the Alert component.
 * Supports two variants: "default" and "destructive".
 */
interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive";
}

/**
 * Alert Component
 *
 * A reusable notification box that can display success, warning, or error messages.
 * It supports an optional "destructive" variant for error/danger states.
 */
export const Alert: React.FC<AlertProps> = ({ className = "", variant = "default", ...props }) => {
  // Define Tailwind CSS classes for each variant
  const baseClasses =
    "relative w-full rounded-lg border px-4 py-3 text-sm grid items-start transition-all";
  const variantClasses =
    variant === "destructive"
      ? "bg-card text-destructive border-destructive/40"
      : "bg-card text-card-foreground border-border";

  return (
    <div
      role="alert" // Accessible role for screen readers
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    />
  );
};

/**
 * AlertTitle Component
 *
 * Used inside the Alert to display a bold heading or title.
 */
export const AlertTitle: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = "",
  ...props
}) => {
  return (
    <div
      className={`col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight ${className}`}
      {...props}
    />
  );
};

/**
 * AlertDescription Component
 *
 * Used inside the Alert to display detailed message text.
 */
export const AlertDescription: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = "",
  ...props
}) => {
  return (
    <div
      className={`text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm leading-relaxed ${className}`}
      {...props}
    />
  );
};
