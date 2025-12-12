// components/ui/Skeleton.tsx
import { forwardRef } from "react";
import { cn } from "@/components/utils/cn";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md",
          className
        )}
        {...props}
      />
    );
  }
);

Skeleton.displayName = "Skeleton";
export default Skeleton;