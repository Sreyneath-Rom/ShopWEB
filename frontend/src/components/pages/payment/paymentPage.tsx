"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { Product } from "@/types/product";

interface CartItem {
  productId: string;
  quantity: number;
}

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const encodedCart = searchParams?.get("cart");
  const productId = searchParams?.get("productId");
  const quantity = parseInt(searchParams?.get("quantity") || "1", 10);

  const [items, setItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cartItems: CartItem[] = [];

    if (encodedCart) {
      try {
        cartItems = JSON.parse(atob(encodedCart));
      } catch {
        toast.error("Invalid cart data");
      }
    } else if (productId) {
      cartItems = [{ productId, quantity }];
    }

    setItems(cartItems);

    if (cartItems.length > 0) {
      Promise.all(cartItems.map((i) => api.get(`/products/${i.productId}`)))
        .then((res) => {
          const productsFetched = res.map((r) => r.data);
          setProducts(productsFetched);
          const totalCalc = cartItems.reduce(
            (sum, item, idx) =>
              sum + productsFetched[idx].price * item.quantity,
            0
          );
          setTotal(totalCalc);
        })
        .catch(() => toast.error("Failed to load products"));
    }
  }, [productId, quantity, encodedCart]);

  const handlePay = async () => {
    if (items.length === 0) return toast.error("Nothing to pay for");
    setLoading(true);
    try {
      const { data } = await api.post("/stripe/create-checkout-session", {
        items,
      });
      window.location.href = data.url;
    } catch (err) {
      toast.error("Payment error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F2F2F7] min-h-screen px-4 py-20">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-900">
        Checkout
      </h1>

      <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl shadow-[0_4px_14px_rgba(0,0,0,0.08)]">
        {products.map((product, i) => (
          <div key={product.id} className="mb-6 pb-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              {product.name}
            </h2>
            <p className="text-lg text-gray-500 mt-1">
              Qty: {items[i].quantity} — Subtotal: $
              {(product.price * items[i].quantity).toFixed(2)}
            </p>
          </div>
        ))}

        <h3 className="text-3xl font-bold text-gray-900 mb-8">
          Total: ${total.toFixed(2)}
        </h3>

        <Button
          className="w-full py-3 rounded-2xl bg-green-500 hover:bg-green-600 text-white text-lg"
          loading={loading}
          onClick={handlePay}
        >
          Pay with Stripe
        </Button>
      </div>
    </div>
  );
}
