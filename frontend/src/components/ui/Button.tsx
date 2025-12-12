import { ButtonHTMLAttributes, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export default function Button({ children, className = '', loading, disabled, onClick, ...props }: ButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (loading || isLoading) return;
    setIsLoading(true);
    try {
      if (onClick) await onClick(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className={`px-6 py-3 rounded-xl font-semibold text-white shadow-md transform transition-smooth hover:scale-105 active:scale-95 disabled:opacity-50 ${className}`}
      disabled={disabled || loading || isLoading}
      onClick={handleClick}
      {...props}
    >
      {loading || isLoading ? <Loader2 className="animate-spin mx-auto" /> : children}
    </button>
  );
}