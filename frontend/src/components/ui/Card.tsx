// components/ui/Card.tsx
import { forwardRef } from "react";
import { cn } from "@/components/utils/cn";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-neutral border border-gray-200 dark:border-gray-700",
          "rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
export default Card;