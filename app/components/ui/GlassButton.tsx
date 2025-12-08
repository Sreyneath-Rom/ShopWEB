// components/ui/GlassButton.tsx
export function GlassButton({
  children,
  variant = "primary",
  size = "md",
  onClick,
  className = "",
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-gradient-to-br from-white/90 to-white/70 text-black shadow-xl border border-white/50",
    tinted: "bg-ios-accent/20 text-ios-accent backdrop-blur-2xl border border-ios-accent/30",
  };

  return (
    <button
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-full font-semibold transition-all duration-300 active:scale-95
        bg-white/80 backdrop-blur-3xl
        ${variants[variant]} ${className}
        before:absolute before:inset-0 before:bg-white/30 before:opacity-0 before:transition-opacity
        hover:before:opacity-100
        active:before:opacity-40
      `}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2 px-6 py-4">
        {children}
      </span>
    </button>
  );
}