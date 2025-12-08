// app/components/ui/Card.tsx
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'flat';
}

export function Card({ children, className = '', variant = 'default' }: CardProps) {
  const variantStyles = {
    default: 'backdrop-blur-2xl bg-white/80 rounded-4xl shadow-2xl border border-white/60',
    elevated: 'backdrop-blur-2xl bg-white/90 rounded-4xl shadow-2xl border border-white/60 hover:shadow-2xl transition-shadow',
    flat: 'backdrop-blur-xl bg-white/70 rounded-3xl shadow-lg border border-white/50'
  };

  return (
    <div className={`${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
}
