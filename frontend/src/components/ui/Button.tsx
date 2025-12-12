// components/ui/Button.tsx
"use client";

import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/components/utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, loading, fullWidth, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "px-6 py-3 rounded-xl font-semibold text-white shadow-md",
          "transform transition-all hover:scale-105 active:scale-95",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="animate-spin mx-auto" />
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
