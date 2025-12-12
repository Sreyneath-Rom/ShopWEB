// frontend/src/components/ui/Button.tsx
"use client";

import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/components/utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "primary" | "outline" | "ghost";
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ children, loading, variant = "primary", fullWidth, className, disabled, ...props }, ref) => {
  const base = "rounded-full px-5 py-3 font-semibold text-sm shadow-sm transition-transform active:scale-95";
  const primary = "bg-sky-600 text-white hover:bg-sky-700";
  const outline = "bg-white border border-gray-200 text-slate-800 hover:bg-gray-50";
  const ghost = "bg-transparent text-sky-600 hover:underline";

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(base, variant === "primary" ? primary : variant === "outline" ? outline : ghost, fullWidth && "w-full", className)}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : children}
    </button>
  );
});

Button.displayName = "Button";
export default Button;
