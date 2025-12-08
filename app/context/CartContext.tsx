"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type CartContextValue = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (id: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = 'cart_items_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      if (typeof window === 'undefined') return [];
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const add = (item: CartItem) => {
    setItems((prev) => {
      const found = prev.find((p) => p.id === item.id);
      if (found) {
        return prev.map((p) => (p.id === item.id ? { ...p, quantity: p.quantity + item.quantity } : p));
      }
      return [item, ...prev];
    });
  };

  const remove = (id: number) => setItems((prev) => prev.filter((p) => p.id !== id));
  const clear = () => setItems([]);

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, add, remove, clear, count, subtotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

export type { CartItem };
