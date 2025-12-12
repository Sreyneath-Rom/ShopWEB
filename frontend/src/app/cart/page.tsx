"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import toast from "react-hot-toast";
import { Product } from "@/types/product";
import { Trash2 } from "lucide-react";

interface CartItem extends Product {
  quantity: number;
}

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
    setTotal(
      storedCart.reduce(
        (sum: number, item: CartItem) => sum + item.price * item.quantity,
        0
      )
    );
  }, []);

  const removeFromCart = (id: string) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);

    setTotal(
      updatedCart.reduce(
        (sum: number, item: CartItem) => sum + item.price * item.quantity,
        0
      )
    );

    window.dispatchEvent(new Event("storage"));
    toast.success("Item removed");
  };

  const proceedToCheckout = () => {
    if (cart.length === 0) return toast.error("Your cart is empty");
    const encoded = btoa(
      JSON.stringify(cart.map((i) => ({ productId: i.id, quantity: i.quantity })))
    );
    router.push(`/payment?cart=${encoded}`);
  };

  // Empty state
  if (cart.length === 0) {
    return (
      <div className="text-center px-6 py-20 bg-[#F2F2F7] min-h-screen">
        <h1 className="text-3xl font-semibold mb-4 text-gray-800">
          Your Cart is Empty
        </h1>
        <Link
          href="/products"
          className="text-sky-600 text-lg font-medium hover:underline"
        >
          Browse Products →
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#F2F2F7] min-h-screen px-4 py-10">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-900">
        Your Cart
      </h1>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="md:col-span-2 space-y-4">
          {cart.map((item) => (
            <Card
              key={item.id}
              className="flex items-center justify-between p-5 rounded-3xl bg-white shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {item.name}
                </h2>
                <p className="text-lg text-gray-500">
                  ${item.price} × {item.quantity}
                </p>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                aria-label="Remove item"
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-6 h-6" />
              </button>
            </Card>
          ))}
        </div>

        <div>
          <Card className="p-6 rounded-3xl bg-white shadow-[0_4px_14px_rgba(0,0,0,0.08)]">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              Total: ${total.toFixed(2)}
            </h2>
            <Button
              onClick={proceedToCheckout}
              className="w-full py-3 rounded-2xl bg-green-500 hover:bg-green-600 text-white text-lg"
            >
              Continue to Checkout
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
