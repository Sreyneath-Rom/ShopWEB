// frontend/src/components/ui/Navigation.tsx
"use client";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function Navigation() {
  const [cartCount, setCartCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(cart.reduce((sum: number, item: any) => sum + item.quantity, 0));
    };
    updateCart();
    window.addEventListener("storage", updateCart);
    
    // Check if admin
    api.get('/auth/me')
      .then((res) => setIsAdmin(res.data.role === 'admin'))
      .catch(() => setIsAdmin(false));

    return () => window.removeEventListener("storage", updateCart);
  }, []);

  return (
    <nav className="backdrop-blur-lg bg-white/70 sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-semibold text-gray-900 tracking-tight">
          My KShop
        </Link>

        <ul className="flex space-x-6 items-center text-gray-700">
          <li>
            <Link href="/" className="hover:text-blue-600 transition">
              Home
            </Link>
          </li>
          <li>
            <Link href="/products" className="hover:text-blue-600 transition">
              Products
            </Link>
          </li>

          <li className="relative">
            <Link
              href="/cart"
              className="flex items-center hover:text-blue-600 transition"
            >
              <ShoppingCart className="w-5 h-5 mr-1" />
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-blue-600 text-white text-[10px] rounded-full px-1.5 py-0.5 shadow-md">
                  {cartCount}
                </span>
              )}
            </Link>
          </li>
          {isAdmin && (
            <li>
              <Link href="/admin/products" className="hover:text-blue-600 transition">
                Admin
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}