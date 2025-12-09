// app/components/FloatingCart.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function FloatingCart({ onOpen }: { onOpen: () => void }) {
  const { count } = useCart();
  const [mounted, setMounted] = useState(false);

  // ដោះស្រាយ hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return (
    <button
      onClick={onOpen}
      className="fixed right-4 bottom-6 z-50 flex items-center gap-2 rounded-full bg-blue-600 text-white px-4 py-3 shadow-2xl"
    >
      <ShoppingCart className="w-5 h-5" />
      <span className="text-sm font-semibold">Cart</span>
    </button>
  );

  return (
    <button
      onClick={onOpen}
      className="fixed right-4 bottom-6 z-50 flex items-center gap-2 rounded-full bg-blue-600 text-white px-4 py-3 shadow-2xl hover:scale-105 transition-transform"
    >
      <ShoppingCart className="w-5 h-5" />
      <span className="text-sm font-semibold">Cart</span>
      {count > 0 && (
        <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-white text-blue-600 font-bold">
          {count}
        </span>
      )}
    </button>
  );
}