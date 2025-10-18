import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  size?: "sm" | "default";
  label?: string;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  size = "default",
  label,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !triggerRef.current?.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative w-full ${className || ""}`}>
      {label && (
        <label className="block mb-1 text-sm text-gray-500 dark:text-gray-400">{label}</label>
      )}

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between rounded-md border bg-input-background px-3 py-2 text-sm text-left transition-colors outline-none
        focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50
        ${size === "sm" ? "h-8" : "h-9"} `}
      >
        <span className="truncate text-gray-700 dark:text-gray-200">
          {selectedOption ? (
            selectedOption.label
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {open && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-1 w-full rounded-md border bg-white dark:bg-gray-800 shadow-md overflow-hidden animate-in fade-in zoom-in"
        >
          <ul className="max-h-56 overflow-y-auto py-1 text-sm">
            {options.map((opt) => (
              <li
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700
                ${opt.value === value ? "bg-gray-100 dark:bg-gray-700" : ""}`}
              >
                <span className="truncate text-gray-700 dark:text-gray-200">{opt.label}</span>
                {opt.value === value && <Check className="w-4 h-4 text-gray-500" />}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
