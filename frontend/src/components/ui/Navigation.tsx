'use client';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react'; // Icon for cart
import { useEffect, useState } from 'react';

export default function Navigation() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.reduce((sum: number, item: any) => sum + item.quantity, 0));
    };
    updateCart();
    window.addEventListener('storage', updateCart); // Sync across tabs
    return () => window.removeEventListener('storage', updateCart);
  }, []);

  return (
    <nav className="bg-neutral sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">My KShop</Link>
        <ul className="flex space-x-6 items-center">
          <li><Link href="/" className="text-foreground hover:text-primary transition-smooth">Home</Link></li>
          <li><Link href="/products" className="text-foreground hover:text-primary transition-smooth">Products</Link></li>
          <li className="relative">
            <Link href="/cart" className="text-foreground hover:text-primary transition-smooth flex items-center">
              <ShoppingCart className="w-5 h-5 mr-1" />
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-accent text-white text-xs rounded-full px-2 py-1">
                  {cartCount}
                </span>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}