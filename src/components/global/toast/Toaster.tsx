import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      expand
      visibleToasts={5}
      theme="dark"
      style={
        {
          "--sonner-color-success": "#10b981",
          "--sonner-color-error": "#ef4444",
          "--sonner-color-warning": "#f59e0b",
          "--sonner-color-info": "#3b82f6",
        } as React.CSSProperties
      }
    />
  );
}
