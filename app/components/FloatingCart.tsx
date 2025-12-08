"use client";

import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

type Props = { onOpen: () => void };

export default function FloatingCart({ onOpen }: Props) {
  const { count } = useCart();

  return (
    <button
      aria-label="Open cart"
      onClick={onOpen}
      className="fixed right-4 bottom-6 z-50 flex items-center gap-2 rounded-full bg-blue-600 text-white px-4 py-3 shadow-2xl hover:scale-105 transition-transform"
    >
      <ShoppingCart className="w-5 h-5" />
      <span className="text-sm font-semibold">Cart</span>
      <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-white text-blue-600 font-bold">{count}</span>
    </button>
  );
}
