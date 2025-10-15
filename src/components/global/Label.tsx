"use client"; // Ensures this component runs on the client side in Next.js (can be ignored in plain React apps)

import React from "react";

// Define props for the Label component using native HTML label attributes
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

/**
 * Label Component
 *
 * A reusable form label component that aligns text beside form fields,
 * supports disabled states, and works seamlessly with input elements.
 */
export const Label: React.FC<LabelProps> = ({ className = "", children, ...props }) => {
  return (
    <label
      // Custom data attribute for potential styling or accessibility hooks
      data-slot="label"
      // Combine Tailwind classes for consistent spacing, alignment, and readability
      className={`flex items-center gap-2 text-sm leading-none font-medium select-none
        peer-disabled:cursor-not-allowed peer-disabled:opacity-50
        group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50
        ${className}`}
      // Spread remaining label props (e.g. htmlFor)
      {...props}
    >
      {children}
    </label>
  );
};
