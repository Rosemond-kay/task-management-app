import React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ className = "", ...props }) => {
  return (
    <textarea
      className={`resize-none border border-gray-300 placeholder:text-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-200/50 dark:focus:ring-blue-400/40 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 flex min-h-16 w-full rounded-md bg-white px-3 py-2 text-base transition-colors outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${className}`}
      {...props}
    />
  );
};
