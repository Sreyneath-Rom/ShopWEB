// frontend/src/components/ui/Input.tsx
"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/components/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, hint, error, className, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-sm text-slate-600 font-medium">{label}</label>}
      <input
        ref={ref}
        {...props}
        className={cn(
          "rounded-2xl px-4 py-3 text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-200",
          error ? "border-rose-400 focus:ring-rose-200" : "bg-white",
          className
        )}
      />
      {error ? <p className="text-rose-500 text-xs">{error}</p> : hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
});

Input.displayName = "Input";
export default Input;
