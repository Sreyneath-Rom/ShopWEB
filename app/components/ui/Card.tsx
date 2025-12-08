// app/components/ui/Card.tsx
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'flat';
}

export function Card({ children, className = '', variant = 'default' }: CardProps) {
  const variantStyles = {
    default: 'backdrop-blur-sm bg-[rgba(255,255,255,0.65)] rounded-2xl shadow-md border border-[rgba(255,255,255,0.6)]',
    elevated: 'backdrop-blur-sm bg-[rgba(255,255,255,0.75)] rounded-2xl shadow-lg border border-[rgba(255,255,255,0.65)] hover:shadow-xl transition-shadow',
    flat: 'bg-transparent rounded-xl shadow-sm'
  };

  return (
    <div className={`${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
}
