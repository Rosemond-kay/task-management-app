import React from "react";

function Badge({
  variant = "default",
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "secondary" | "destructive" | "outline";
}) {
  // Define variant styles manually
  const baseStyle =
    "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 transition-colors overflow-hidden";

  const variants: Record<string, string> = {
    default: "border-transparent bg-blue-600 text-white hover:bg-blue-700",
    secondary: "border-transparent bg-gray-200 text-gray-800 hover:bg-gray-300",
    destructive: "border-transparent bg-red-600 text-white hover:bg-red-700",
    outline: "border border-gray-400 text-gray-800 hover:bg-gray-100",
  };

  const finalClassName = `${baseStyle} ${variants[variant]} ${className}`;

  return (
    <span className={finalClassName} {...props}>
      {children}
    </span>
  );
}

export default Badge;
