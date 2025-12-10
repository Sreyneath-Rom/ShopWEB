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
    primary: 'bg-[linear-gradient(90deg,rgba(10,132,255,0.95),rgba(0,122,255,0.9))] text-white shadow-lg',
    secondary: 'bg-white/90 text-slate-800 shadow-sm border border-white/60',
    danger: 'bg-red-500 text-white shadow-sm',
    success: 'bg-green-500 text-white shadow-sm',
    outline: 'bg-transparent text-slate-700 border border-slate-200'
  };

  const sizeStyles = {
    sm: 'px-3 py-2 text-sm rounded-full',
    md: 'px-4 py-3 text-base rounded-full',
    lg: 'px-6 py-4 text-lg rounded-full'
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={
        `${variantStyles[variant]} ${sizeStyles[size]} transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${className}`
      }
      {...props}
    >
      {isLoading && (
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
