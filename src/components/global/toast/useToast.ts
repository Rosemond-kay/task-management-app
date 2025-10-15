import { useCallback } from "react";

// Define the types of toast messages you can show
export type ToastType = "success" | "error" | "info" | "warning";

// Simple toast interface
export interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

//a global event system for simplicity so that any component can trigger toasts.
const toastEvent = new EventTarget();

// Custom hook: useToast()
export function useToast() {
  // Function to trigger a toast anywhere in the app
  const toast = useCallback((type: ToastType, message: string) => {
    const event = new CustomEvent("toast", {
      detail: {
        id: Date.now(),
        type,
        message,
      } as Toast,
    });
    toastEvent.dispatchEvent(event);
  }, []);

  return { toast, toastEvent };
}
