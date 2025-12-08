// app/stripe/success/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { PaymentSuccess } from '../../components/PaymentSuccess';
import { Product } from '../../types';

export default function StripeSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [session, setSession] = useState<any>(null);
  const { clear } = useCart();

  useEffect(() => {
    if (!sessionId) return;

    const fetchSession = async () => {
      try {
        const res = await fetch(`/api/stripe/session?session_id=${sessionId}`);
        const data = await res.json();

        if (data?.session) {
          setSession(data.session);
          try {
            clear(); // Clear cart on success
          } catch (e) {
            console.warn('Failed to clear cart:', e);
          }
        }
      } catch (err) {
        console.error('Failed to verify session:', err);
      }
    };

    fetchSession();
  }, [sessionId, clear]);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">Verifying payment...</p>
        </div>
      </div>
    );
  }

  const item = session.line_items?.data?.[0];

  // Fully typed Product object — all required fields included
  const product: Product = {
    id: Date.now(),
    name: item?.description || item?.price?.product?.name || 'Your Order',
    price: (item?.amount_total || 0) / 100,
    image: item?.price?.product?.images?.[0] || '/placeholder.jpg',
    categoryId: 1, // Required field — default to "All" or any valid category
    inStock: true,
    rating: 4.8,
    description: 'Purchased successfully via Stripe',
    colors: [],
  };

  return (
    <PaymentSuccess
      product={product}
      onBackToHome={() => (window.location.href = '/')}
    />
  );
}