'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import Button from '../../ui/Button';

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!productId) {
      alert('No product selected');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/stripe/create-checkout-session`, { productId });
      window.location.href = res.data.url;  // Redirect directly to session URL
    } catch (error) {
      console.error('Error initiating checkout:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Payment for Product</h1>
      <Button
        onClick={handleCheckout}
        disabled={loading}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        {loading ? 'Processing...' : 'Pay with Stripe'}
      </Button>
    </div>
  );
}