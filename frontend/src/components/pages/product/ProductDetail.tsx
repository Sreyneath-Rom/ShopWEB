// frontend/src/components/pages/product/ProductDetail.tsx
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import { Star, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";

interface ProductDetailProps {
  id: string;
}

export default function ProductDetail({ id }: ProductDetailProps) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedColor, setSelectedColor] = useState<string>("");

  useEffect(() => {
  if (!id) return;
  setLoading(true);
  api
    .get(`/products/${id}`)
    .then((res) => {
      const p = res.data;
      const normalized = {
        ...p,
        category: typeof p.category === 'object' && p.category !== null && 'name' in p.category
          ? (p.category as { name: string }).name
          : (typeof p.category === 'string' ? p.category : undefined),
      };
      setProduct(normalized);
      setSelectedColor(normalized.colors?.[0] ?? "");
    })
    .catch(() => {
      toast.error(`Product ${id} not found`);
      setProduct(null);
    })
    .finally(() => setLoading(false));
}, [id]);

  const addToCart = () => {
    if (!product) return;
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const itemKey = `${product.id}-${selectedColor}`;
      const existing = cart.find((item: any) => item.itemKey === itemKey);
      if (existing) {
        existing.quantity = (existing.quantity || 0) + quantity;
        toast.success(`Updated ×${existing.quantity}`);
      } else {
        cart.push({ ...product, quantity, selectedColor, itemKey });
        toast.success("Added to cart!");
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      // notify other tabs
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      toast.error("Failed to add to cart");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <div className="text-2xl text-slate-600">Loading product…</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <div className="text-2xl text-slate-500">Product not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* Image */}
        <div className="relative">
          <img
            src={product.imageUrl ?? "/images/placeholder-800.png"}
            alt={product.name}
            className="w-full rounded-2xl shadow-md object-contain bg-white"
          />
          {!product.inStock && (
            <div className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center">
              <span className="text-white text-2xl font-semibold">Out of stock</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => {
              const filled = (product.rating ?? 0) >= i + 1;
              return <Star key={i} className={`w-5 h-5 ${filled ? "text-yellow-400" : "text-gray-300"}`} />;
            })}
            <span className="ml-2 text-sm text-slate-600">{product.rating ?? 0}</span>
          </div>

          <p className="text-4xl font-extrabold">${(product.price ?? 0).toFixed(2)}</p>

          {/* Color selector — iOS segmented-like pills */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <div className="text-sm text-slate-600 mb-2">Color</div>
              <div className="flex gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    aria-pressed={selectedColor === c}
                    className={`px-4 py-2 rounded-full text-sm border ${
                      selectedColor === c ? "bg-sky-100 border-sky-300 font-semibold" : "bg-white border-gray-200"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock */}
          {product.inStock ? (
            <div className="flex items-center gap-2 text-sm text-emerald-700">
              <Check className="w-5 h-5" /> In stock — ships today
            </div>
          ) : (
            <div className="text-sm text-rose-600">Currently unavailable</div>
          )}

          {/* Quantity control */}
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-600">Quantity</div>
            <div className="inline-flex items-center border rounded-full overflow-hidden">
              <button className="px-4 py-2 text-lg" onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity">−</button>
              <div className="px-6 py-2 text-sm font-semibold">{quantity}</div>
              <button className="px-4 py-2 text-lg" onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity">+</button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={addToCart} disabled={!product.inStock} variant="primary" className="flex-1">Add to Cart</Button>
            <Button
              onClick={() => router.push(`/payment?productId=${product.id}&quantity=${quantity}`)}
              disabled={!product.inStock}
              variant="outline"
            >
              Buy Now
            </Button>
          </div>

          <div className="mt-6 bg-slate-50 rounded-xl p-4 text-sm text-slate-700">
            <strong>Category:</strong> {product.category ?? "—"}
          </div>
        </div>
      </div>

      {/* Description */}
      <section className="mt-12 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Description</h2>
        <p className="text-sm leading-relaxed text-slate-700">{product.description ?? "No description provided."}</p>
      </section>
    </div>
  );
}
