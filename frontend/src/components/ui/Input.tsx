// components/ui/Input.tsx
"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/components/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  hint?: string;
  className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, hint, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        {/* Label */}
        {label && (
          <label className="font-medium text-sm text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}

        {/* Input field */}
        <input
          ref={ref}
          className={cn(
            "border rounded-lg px-3 py-2 text-sm outline-none",
            "transition-all shadow-sm bg-white dark:bg-gray-800",
            "focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
            error && "border-red-500 focus:ring-red-400",
            className
          )}
          {...props}
        />

        {/* Error message */}
        {error && (
          <p className="text-red-500 text-xs font-medium mt-1">{error}</p>
        )}

        {/* Hint text */}
        {!error && hint && (
          <p className="text-gray-500 text-xs mt-1">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
