import React, { useState, useRef, useEffect } from "react";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";

interface DropdownMenuProps {
  triggerLabel: string | React.ReactNode;
  children: React.ReactNode;
}

interface DropdownItemProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "default" | "destructive";
  inset?: boolean;
  shortcut?: string;
}

interface DropdownCheckboxItemProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

interface DropdownRadioItemProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ triggerLabel, children }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={ref}>
      {typeof triggerLabel === "string" ? (
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition"
        >
          {triggerLabel}
        </button>
      ) : (
        <div onClick={() => setOpen((prev) => !prev)}>{triggerLabel}</div>
      )}

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-md z-50">
          {children}
        </div>
      )}
    </div>
  );
};

// --- MENU GROUPS & ITEMS ---

export const DropdownMenuGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="p-1">{children}</div>
);

export const DropdownMenuItem: React.FC<DropdownItemProps> = ({
  label,
  onClick,
  disabled,
  variant = "default",
  inset,
  shortcut,
}) => {
  const variantStyle =
    variant === "destructive" ? "text-red-600 hover:bg-red-100" : "hover:bg-gray-100";
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } flex w-full items-center justify-between text-left px-3 py-1.5 text-sm rounded-sm transition ${variantStyle} ${
        inset ? "pl-8" : ""
      }`}
    >
      <span>{label}</span>
      {shortcut && (
        <span className="ml-auto text-xs text-gray-500 tracking-widest">{shortcut}</span>
      )}
    </button>
  );
};

export const DropdownMenuCheckboxItem: React.FC<DropdownCheckboxItemProps> = ({
  label,
  checked,
  onChange,
}) => {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="flex w-full items-center gap-2 px-3 py-1.5 text-sm hover:bg-gray-100 rounded-sm transition"
    >
      <span className="w-4 h-4 flex items-center justify-center">
        {checked && <CheckIcon size={16} />}
      </span>
      {label}
    </button>
  );
};

export const DropdownMenuRadioGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div>{children}</div>
);

export const DropdownMenuRadioItem: React.FC<DropdownRadioItemProps> = ({
  label,
  selected,
  onSelect,
}) => {
  return (
    <button
      onClick={onSelect}
      className="flex w-full items-center gap-2 px-3 py-1.5 text-sm hover:bg-gray-100 rounded-sm transition"
    >
      <span className="w-4 h-4 flex items-center justify-center">
        {selected && <CircleIcon size={8} fill="currentColor" />}
      </span>
      {label}
    </button>
  );
};

export const DropdownMenuLabel: React.FC<{ inset?: boolean; children: React.ReactNode }> = ({
  inset,
  children,
}) => (
  <div className={`px-3 py-1.5 text-sm font-medium text-gray-700 ${inset ? "pl-8" : ""}`}>
    {children}
  </div>
);

export const DropdownMenuSeparator: React.FC = () => <div className="h-px bg-gray-200 my-1" />;

export const DropdownMenuSub: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="flex w-full items-center justify-between px-3 py-1.5 text-sm hover:bg-gray-100 rounded-sm">
        {label}
        <ChevronRightIcon size={16} />
      </button>

      {open && (
        <div className="absolute top-0 left-full ml-1 w-40 bg-white border border-gray-200 shadow-md rounded-md">
          {children}
        </div>
      )}
    </div>
  );
};
