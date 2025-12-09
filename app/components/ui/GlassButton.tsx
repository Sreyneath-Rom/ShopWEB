// app/components/ui/GlassButton.tsx
"use client";

import React from "react";

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "tinted";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function GlassButton({
  children,
  variant = "primary",
  size = "md",
  onClick,
  className = "",
  ...props
}: GlassButtonProps) {
  const variants: Record<NonNullable<GlassButtonProps["variant"]>, string> = {
    primary:
      "bg-gradient-to-br from-white/90 to-white/70 text-black shadow-xl border border-white/50",
    tinted:
      "bg-ios-accent/20 text-ios-accent backdrop-blur-2xl border border-ios-accent/30",
  };

  const sizeClasses: Record<NonNullable<GlassButtonProps["size"]>, string> = {
    sm: "px-4 py-2 text-sm rounded-full",
    md: "px-6 py-4 text-base rounded-full",
    lg: "px-8 py-5 text-lg rounded-full",
  };

  return (
    <button
      onClick={onClick}
      className={`
        relative overflow-hidden font-semibold transition-all duration-300 active:scale-95
        rounded-full
        ${variants[variant]}
        ${sizeClasses[size]}
        ${className}
        before:absolute before:inset-0 before:bg-white/30 before:opacity-0 before:transition-opacity
        hover:before:opacity-100
        active:before:opacity-40
      `}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
}

export default GlassButton;
