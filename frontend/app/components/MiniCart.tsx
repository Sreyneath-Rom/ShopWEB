// app/components/MiniCart.tsx
"use client";

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Button } from './ui/Button';

type Props = { open: boolean; onClose: () => void };

export default function MiniCart({ open, onClose }: Props) {
  const { items, remove, clear, subtotal } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center md:items-center md:justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full md:w-96 max-h-[70vh] overflow-auto bg-white rounded-t-xl md:rounded-l-xl p-4 shadow-2xl">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-lg font-semibold">Your cart</h4>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>

        {items.length === 0 ? (
          <div className="py-10 text-center text-slate-500">Your cart is empty</div>
        ) : (
          <div className="space-y-3">
            {items.map((it) => (
              <div key={it.id} className="flex items-center gap-3">
                <div className="w-14 h-14 bg-slate-100 rounded overflow-hidden">
                  {it.image ? <img src={it.image} alt={it.name} className="w-full h-full object-cover" /> : null}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-slate-900">{it.name}</div>
                  <div className="text-sm text-slate-500">{it.quantity} × ${it.price.toFixed(2)}</div>
                </div>
                <div>
                  <Button variant="outline" size="sm" onClick={() => remove(it.id)}>Remove</Button>
                </div>
              </div>
            ))}

            <div className="border-t pt-3 flex items-center justify-between">
              <div className="text-sm text-slate-600">Subtotal</div>
              <div className="font-semibold">${subtotal.toFixed(2)}</div>
            </div>

            <div className="flex items-center justify-between mt-3">
              <Button variant="primary" onClick={async () => {
                if (items.length === 0) return;
                setIsProcessing(true);
                try {
                  const res = await fetch('/api/stripe/create-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ items: items.map(i => ({ name: i.name, price: i.price, quantity: i.quantity, image: i.image })) }),
                  });
                  const data = await res.json();
                  if (data?.url) {
                    window.location.href = data.url;
                    return;
                  }
                  alert('Checkout failed: ' + (data?.error || 'unknown'));
                } catch (err: any) {
                  alert('Network error: ' + (err?.message || err));
                } finally {
                  setIsProcessing(false);
                }
              }} isLoading={isProcessing}>Checkout</Button>
              <Button variant="outline" onClick={() => clear()}>Clear</Button>
              
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
