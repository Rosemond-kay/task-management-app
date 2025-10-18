import React, { useState, useContext, useRef, useEffect } from "react";

/** Utility for merging Tailwind classes */
function classNames(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

/** ------------------ Context ------------------ */
interface AlertDialogContextValue {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const AlertDialogContext = React.createContext<AlertDialogContextValue | null>(null);

const useAlertDialog = () => {
  const ctx = useContext(AlertDialogContext);
  if (!ctx) throw new Error("AlertDialog components must be used inside <AlertDialog>");
  return ctx;
};

/** ------------------ Root ------------------ */
interface AlertDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
  open: controlledOpen,
  onOpenChange,
  children,
}) => {
  const [open, setOpen] = useState(controlledOpen ?? false);

  useEffect(() => {
    if (controlledOpen !== undefined) setOpen(controlledOpen);
  }, [controlledOpen]);

  const handleChange = (value: boolean) => {
    setOpen(value);
    onOpenChange?.(value);
  };

  return (
    <AlertDialogContext.Provider value={{ open, setOpen: handleChange }}>
      {children}
    </AlertDialogContext.Provider>
  );
};

/** ------------------ Trigger ------------------ */
export const AlertDialogTrigger: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  ...props
}) => {
  const { setOpen } = useAlertDialog();
  return (
    <button data-slot="alert-dialog-trigger" onClick={() => setOpen(true)} {...props}>
      {children}
    </button>
  );
};

/** ------------------ Overlay ------------------ */
export const AlertDialogOverlay: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  const { open } = useAlertDialog();
  if (!open) return null;
  return (
    <div
      data-slot="alert-dialog-overlay"
      className={classNames(
        "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-200",
        className
      )}
      {...props}
    />
  );
};

/** ------------------ Content ------------------ */
export const AlertDialogContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  const { open, setOpen } = useAlertDialog();
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [setOpen]);

  if (!open) return null;

  return (
    <div
      data-slot="alert-dialog-content"
      ref={dialogRef}
      className={classNames(
        "fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-white p-6 shadow-lg transition-all duration-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/** ------------------ Header ------------------ */
export const AlertDialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    data-slot="alert-dialog-header"
    className={classNames("flex flex-col gap-2 text-center sm:text-left", className)}
    {...props}
  />
);

/** ------------------ Footer ------------------ */
export const AlertDialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    data-slot="alert-dialog-footer"
    className={classNames("mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
    {...props}
  />
);

/** ------------------ Title ------------------ */
export const AlertDialogTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  ...props
}) => (
  <h2
    data-slot="alert-dialog-title"
    className={classNames("text-lg font-semibold", className)}
    {...props}
  />
);

/** ------------------ Description ------------------ */
export const AlertDialogDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  ...props
}) => (
  <p
    data-slot="alert-dialog-description"
    className={classNames("text-sm text-gray-500", className)}
    {...props}
  />
);

/** ------------------ Action (Confirm) ------------------ */
export const AlertDialogAction: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className,
  children,
  ...props
}) => {
  const { setOpen } = useAlertDialog();
  return (
    <button
      onClick={() => setOpen(false)}
      data-slot="alert-dialog-action"
      className={classNames(
        "rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

/** ------------------ Cancel ------------------ */
export const AlertDialogCancel: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className,
  children,
  ...props
}) => {
  const { setOpen } = useAlertDialog();
  return (
    <button
      onClick={() => setOpen(false)}
      data-slot="alert-dialog-cancel"
      className={classNames(
        "rounded border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-100 transition",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
