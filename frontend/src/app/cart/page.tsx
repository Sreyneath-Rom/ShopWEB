'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import toast from 'react-hot-toast';
import { Product } from '@/types/product'; // Adjust if needed
import { Trash2 } from 'lucide-react'; // For delete icon

interface CartItem extends Product {
  quantity: number;
}

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(storedCart);
    const calculatedTotal = storedCart.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);
    setTotal(calculatedTotal);
  }, []);

  const removeFromCart = (id: string) => {
    const updatedCart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCart(updatedCart);
    const newTotal = updatedCart.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);
    setTotal(newTotal);
    window.dispatchEvent(new Event('storage')); // Update nav count
    toast.success('Item removed from cart');
  };

  const proceedToCheckout = () => {
    if (cart.length === 0) return toast.error('Cart is empty');
    // For simplicity, pass cart as query param (base64 encoded); in prod, use server-side or context
    const encodedCart = btoa(JSON.stringify(cart.map(item => ({ productId: item.id, quantity: item.quantity }))));
    router.push(`/payment?cart=${encodedCart}`);
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold mb-8">Your Cart is Empty</h1>
        <Link href="/products" className="text-primary hover:underline text-xl">
          Browse Products →
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Shopping Cart</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {cart.map(item => (
            <Card key={item.id} className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">{item.name}</h2>
                <p className="text-xl text-secondary">${item.price} × {item.quantity}</p>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-700"
                aria-label="Remove item"
              >
                <Trash2 className="w-6 h-6" />
              </button>
            </Card>
          ))}
        </div>
        <div>
          <Card>
            <h2 className="text-2xl font-bold mb-4">Total: ${total.toFixed(2)}</h2>
            <Button onClick={proceedToCheckout} className="w-full bg-secondary hover:bg-green-600">
              Proceed to Checkout
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}