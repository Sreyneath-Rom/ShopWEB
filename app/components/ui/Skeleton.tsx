// app/components/ui/Skeleton.tsx
"use client";

import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return <div className={`animate-pulse bg-slate-200 rounded ${className}`} />;
};

export const CardSkeleton: React.FC = () => (
  <div className="rounded-xl p-3 bg-white/50 shadow-sm">
    <div className="aspect-square mb-3"><div className="w-full h-full bg-slate-200 animate-pulse" /></div>
    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2 animate-pulse" />
    <div className="h-3 bg-slate-200 rounded w-1/2 animate-pulse" />
  </div>
);
