"use client";

import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/context/CartContext";

export default function FloatingCartButton() {
  const { count: totalItems } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-linear-to-br from-orange-500 to-pink-600 
        rounded-full shadow-2xl flex items-center justify-center text-white"
      onClick={() => {}}
    >
      <ShoppingCart className="w-8 h-8" />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-white text-orange-600 text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center animate-pulse">
          {totalItems}
        </span>
      )}
    </button>
  );
}
