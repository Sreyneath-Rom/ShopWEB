// app/components/ui/OrbCard.tsx
import { cn } from '../../lib/utils';

interface OrbCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  elevated?: boolean;
}

export function OrbCard({
  children,
  className,
  padding = 'md',
  elevated = true,
}: OrbCardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className="relative group">
      {elevated && (
        <div className="absolute -inset-2 bg-linear-to-br from-white/20 via-transparent to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
      )}

      <div
        className={cn(
          "relative overflow-hidden rounded-3xl",
          "bg-white/75 dark:bg-black/65",
          "backdrop-blur-3xl",
          "border border-white/40 dark:border-white/10",
          elevated && "shadow-2xl",
          "transition-all duration-300 group-hover:shadow-3xl group-hover:scale-[1.005]",

          // Fixed: bg-linear-to-*
          "before:absolute before:inset-0 before:bg-linear-to-br before:from-white/25 before:via-transparent before:to-transparent before:rounded-3xl before:pointer-events-none",
          "after:absolute after:inset-0 after:bg-linear-to-tl after:from-transparent after:via-white/10 after:to-white/5 after:rounded-3xl after:pointer-events-none",

          paddingClasses[padding],
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}