import React, { createContext, useContext, useState, useEffect } from "react";

// Define the structure for each toast notification
interface Toast {
  id: number;
  message: string;
  type?: "success" | "error" | "info";
}

// Context to allow any component to trigger a toast
const ToastContext = createContext<{
  addToast: (message: string, type?: Toast["type"]) => void;
} | null>(null);

/**
 * ToastProvider
 *
 * Wrap your app with this provider to enable toast notifications globally.
 */
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Function to add a new toast
  const addToast = (message: string, type: Toast["type"] = "info") => {
    const newToast = { id: Date.now(), message, type };
    setToasts((prev) => [...prev, newToast]);

    // Auto-remove toast after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Render toast container */}
      <div className="fixed top-4 right-4 z-50 space-y-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-lg shadow-md px-4 py-3 border text-sm font-medium transition-all duration-300
              ${toast.type === "success" ? "bg-green-100 text-green-800 border-green-300" : ""}
              ${toast.type === "error" ? "bg-red-100 text-red-800 border-red-300" : ""}
              ${toast.type === "info" ? "bg-blue-100 text-blue-800 border-blue-300" : ""}
            `}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

/**
 * useToast Hook
 *
 * Custom hook that allows any component to trigger a toast.
 * Example: const { addToast } = useToast();
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

/**
 * Example Toaster Component
 *
 * Wrap your app in <ToastProvider> in main entry file (e.g., App.tsx)
 * and call `addToast()` from anywhere in your app.
 */
export const Toaster: React.FC = () => null; // Placeholder for consistency with the original export
