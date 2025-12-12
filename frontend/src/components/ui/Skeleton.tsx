// frontend/src/components/ui/Skeleton.tsx
"use client";
import { forwardRef } from "react";
import { cn } from "@/components/utils/cn";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        "rounded-2xl bg-gray-200 dark:bg-gray-700/60 animate-pulse",
        className
      )}
      {...props}
    />
  );
});
Skeleton.displayName = "Skeleton";
export default Skeleton;
