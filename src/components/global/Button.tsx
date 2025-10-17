import React from "react";

/**
 * ButtonProps defines the types for our button component.
 * - variant: determines the button’s color and visual style.
 * - size: controls the button’s dimensions.
 * - className: allows additional Tailwind or custom classes.
 * - asChild: if true, renders another element (like <a> or <Link>) instead of a button.
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
  className?: string;
}

/**
 * Simple utility function to combine Tailwind classes conditionally.
 */
function classNames(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

// Define a reusable Button component that supports multiple visual variants, sizes,
// and an optional `asChild` prop to render a custom wrapper element instead of a <button>.
export const Button: React.FC<ButtonProps> = ({
  variant = "default",
  size = "default",
  asChild = false,
  className = "",
  children,
  ...props
}) => {
  const Comp: any = asChild ? "span" : "button"; // fallback for custom wrappers

  // Define Tailwind class variants for button styling
  const variantClasses: Record<string, string> = {
    default: "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]",
    destructive: "bg-[var(--color-error)] text-white hover:bg-red-600 focus:ring-red-200",
    outline:
      "border border-[var(--border-color)] bg-[var(--bg-paper)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)]",
    secondary:
      "bg-[var(--color-primary-light)] text-[var(--color-primary)] hover:bg-[var(--color-primary-light)]/80",
    ghost: "hover:bg-[var(--bg-hover)] text-[var(--text-primary)]",
    link: "text-[var(--color-primary)] underline hover:underline-offset-4",
  };

  // Define Tailwind class variants for sizes
  const sizeClasses: Record<string, string> = {
    default: "h-9 px-4 py-2 text-sm",
    sm: "h-8 px-3 py-1 text-sm rounded-md",
    lg: "h-10 px-6 py-2 text-base rounded-md",
    icon: "w-9 h-9 flex items-center justify-center rounded-md",
  };

  // Base classes that apply to all buttons
  const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none";

  return (
    <Comp
      className={classNames(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    >
      {children}
    </Comp>
  );
};

export default Button;
