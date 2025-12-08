// app/components/ui/Header.tsx
import { ChevronLeft } from 'lucide-react';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  variant?: 'blue' | 'orange' | 'default';
}

export function Header({ title, onBack, variant = 'default' }: HeaderProps) {
  const variantStyles = {
    blue: 'backdrop-blur-xl bg-linear-to-r from-blue-500 via-purple-500 to-pink-500',
    orange: 'backdrop-blur-xl bg-linear-to-r from-amber-400 via-orange-400 to-orange-500',
    default: 'backdrop-blur-xl bg-white/80'
  };

  const titleStyles = {
    blue: 'text-white',
    orange: 'text-white',
    default: 'text-slate-900'
  };

  return (
    <div className={`${variantStyles[variant]} rounded-3xl shadow-xl border border-white/50 p-4 mb-6 flex items-center`}>
      {onBack && (
        <button
          onClick={onBack}
          className={`w-10 h-10 ${
            variant !== 'default' ? 'bg-white/20 hover:bg-white/30' : 'bg-slate-100 hover:bg-slate-200'
          } backdrop-blur-sm rounded-xl flex items-center justify-center transition-all active:scale-95 mr-4 shadow-lg`}
          aria-label="Go back"
        >
          <ChevronLeft
            className={`w-6 h-6 ${variant !== 'default' ? 'text-white' : 'text-slate-700'}`}
          />
        </button>
      )}
      <h2 className={`text-${titleStyles[variant]} text-xl font-semibold`}>
        {title}
      </h2>
    </div>
  );
}
