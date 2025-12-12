'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Product } from '@/types/product';

interface CartItem {
  productId: string;
  quantity: number;
}

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const productId = searchParams?.get('productId');
  const quantity = parseInt(searchParams?.get('quantity') || '1', 10);
  const encodedCart = searchParams?.get('cart');
  const [items, setItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let cartItems: CartItem[] = [];
    if (encodedCart) {
      try {
        cartItems = JSON.parse(atob(encodedCart));
      } catch {
        toast.error('Invalid cart data');
      }
    } else if (productId) {
      cartItems = [{ productId, quantity }];
    }
    setItems(cartItems);

    if (cartItems.length > 0) {
      Promise.all(cartItems.map(item => api.get(`/products/${item.productId}`)))
        .then(responses => {
          const fetchedProducts = responses.map(res => res.data);
          setProducts(fetchedProducts);
          const calculatedTotal = cartItems.reduce((sum, item, idx) => sum + fetchedProducts[idx].price * item.quantity, 0);
          setTotal(calculatedTotal);
        })
        .catch(() => toast.error('Failed to load products'));
    }
  }, [productId, quantity, encodedCart]);

  const handlePay = async () => {
    if (items.length === 0) return toast.error('No items to checkout');
    setLoading(true);
    try {
      const { data } = await api.post('/stripe/create-checkout-session', { items });
      window.location.href = data.url;
    } catch (err) {
      toast.error('Payment failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold text-center mb-8">Checkout</h1>
      <div className="max-w-md mx-auto bg-neutral p-6 rounded-2xl shadow-md mb-8">
        {products.map((product, idx) => (
          <div key={product.id} className="mb-4">
            <h2 className="text-2xl font-semibold mb-2">{product.name}</h2>
            <p className="text-xl">Quantity: {items[idx].quantity} | Subtotal: ${(product.price * items[idx].quantity).toFixed(2)}</p>
          </div>
        ))}
        <h3 className="text-2xl font-bold mt-4">Total: ${total.toFixed(2)}</h3>
      </div>
      <Button
        onClick={handlePay}
        loading={loading}
        className="w-full max-w-md mx-auto bg-secondary hover:bg-green-600"
      >
        Pay with Stripe
      </Button>
    </div>
  );
}