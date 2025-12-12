// frontend/src/components/ui/Card.tsx
"use client";
import { forwardRef } from "react";
import { cn } from "@/components/utils/cn";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 shadow-sm",
        "transition-transform",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";
export default Card;
