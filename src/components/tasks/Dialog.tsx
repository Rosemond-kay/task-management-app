import React, { useState, useRef, useEffect } from "react";

/** Simple utility for merging Tailwind classes */
function classNames(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ open: controlledOpen, onOpenChange, children }) => {
  const [open, setOpen] = useState(controlledOpen ?? false);

  useEffect(() => {
    if (controlledOpen !== undefined) setOpen(controlledOpen);
  }, [controlledOpen]);

  const handleChange = (value: boolean) => {
    setOpen(value);
    onOpenChange?.(value);
  };

  return (
    <DialogContext.Provider value={{ open, setOpen: handleChange }}>
      {children}
    </DialogContext.Provider>
  );
};

interface DialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextValue | null>(null);
const useDialog = () => {
  const ctx = React.useContext(DialogContext);
  if (!ctx) throw new Error("Dialog components must be used inside <Dialog>");
  return ctx;
};

/** ---------- Trigger ---------- */
export const DialogTrigger: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  ...props
}) => {
  const { setOpen } = useDialog();
  return (
    <button data-slot="dialog-trigger" onClick={() => setOpen(true)} {...props}>
      {children}
    </button>
  );
};

/** ---------- Overlay ---------- */
export const DialogOverlay: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  const { open, setOpen } = useDialog();

  if (!open) return null;

  return (
    <div
      data-slot="dialog-overlay"
      onClick={() => setOpen(false)}
      className={classNames(
        "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-200",
        className
      )}
      {...props}
    />
  );
};

/** ---------- Content ---------- */
export const DialogContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  const { open, setOpen } = useDialog();
  const dialogRef = useRef<HTMLDivElement>(null);

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
      ref={dialogRef}
      data-slot="dialog-content"
      className={classNames(
        "fixed top-1/2 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-white p-6 shadow-lg transition-transform duration-200",
        className
      )}
      {...props}
    >
      {children}
      <button
        onClick={() => setOpen(false)}
        className="absolute top-4 right-4 rounded-full p-1 text-gray-500 hover:bg-gray-100"
      >
        <span className="sr-only">Close</span>✕
      </button>
    </div>
  );
};

/** ---------- Header, Footer, Title, Description ---------- */
export const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    data-slot="dialog-header"
    className={classNames("flex flex-col gap-2 text-center sm:text-left", className)}
    {...props}
  />
);

export const DialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    data-slot="dialog-footer"
    className={classNames("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
    {...props}
  />
);

export const DialogTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  ...props
}) => (
  <h2
    data-slot="dialog-title"
    className={classNames("text-lg font-semibold leading-none", className)}
    {...props}
  />
);

export const DialogDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  ...props
}) => (
  <p
    data-slot="dialog-description"
    className={classNames("text-sm text-gray-500", className)}
    {...props}
  />
);
