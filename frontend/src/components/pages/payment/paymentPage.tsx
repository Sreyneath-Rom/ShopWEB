'use client';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import api from '@/lib/api';

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const productId = searchParams?.get('productId') ?? null;
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!productId) return alert("No product selected");

    setLoading(true);
    try {
      const { data } = await api.post('/stripe/create-checkout-session', { productId });
      window.location.href = data.url;
    } catch (err) {
      alert("Payment failed. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>
      <Button
        onClick={handlePay}
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white text-xl px-12 py-6"
      >
        {loading ? "Redirecting..." : "Pay with Stripe"}
      </Button>
    </div>
  );
}