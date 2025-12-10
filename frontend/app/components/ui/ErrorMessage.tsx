// app/components/ui/ErrorMessage.tsx
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message?: string;
  id?: string;
  className?: string;
}

export function ErrorMessage({ message, id, className = '' }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div
      id={id}
      className={`flex items-center gap-2 mt-2 p-3 bg-red-50 rounded-lg border border-red-200 ${className}`}
      role="alert"
      aria-live="polite"
    >
      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
      <p className="text-red-700 text-sm">{message}</p>
    </div>
  );
}
