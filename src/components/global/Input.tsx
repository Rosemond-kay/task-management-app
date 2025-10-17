import React from "react";

// Define props for the Input component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

/**
 * Input Component
 *
 * A reusable input field built with Tailwind CSS and TypeScript.
 * - Supports file inputs
 * - Preserves focus and invalid states
 * - Handles disabled and aria-invalid accessibility states
 * - Allows extra classes through `className` prop
 */
export const Input: React.FC<InputProps> = ({ className = "", type = "text", ...props }) => {
  // Combine the base Tailwind classes with any custom classes passed
  const combinedClasses = `
    file:text-foreground placeholder:text-muted-foreground
    selection:bg-primary selection:text-primary-foreground
    dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border
    px-3 py-1 text-base bg-input-background transition-[color,box-shadow]
    outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent
    file:text-sm file:font-medium disabled:pointer-events-none
    disabled:cursor-not-allowed disabled:opacity-50 md:text-sm
    focus-visible:border-ring focus-visible:ring-ring/50
    focus-visible:ring-[3px] aria-invalid:ring-destructive/20
    dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive
    ${className}
  `;

  return <input type={type} data-slot="input" className={combinedClasses} {...props} />;
};
