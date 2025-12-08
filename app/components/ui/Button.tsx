// app/components/ui/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const variantStyles = {
    primary: 'bg-linear-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white shadow-2xl hover:shadow-blue-500/50',
    secondary: 'bg-linear-to-br from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white shadow-2xl',
    danger: 'bg-linear-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 text-white shadow-2xl hover:shadow-red-500/50',
    success: 'bg-linear-to-r from-green-500 via-green-600 to-green-700 hover:from-green-600 hover:via-green-700 hover:to-green-800 text-white shadow-2xl hover:shadow-green-500/50',
    outline: 'bg-white/70 text-slate-600 hover:bg-white/90 border border-slate-200 shadow-lg'
  };

  const sizeStyles = {
    sm: 'px-3 py-2 text-sm rounded-xl',
    md: 'px-4 py-3 text-base rounded-2xl',
    lg: 'px-6 py-4 text-lg rounded-2xl'
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        transition-all duration-300
        active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${className}
      `}
      {...props}
    >
      {isLoading && (
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
