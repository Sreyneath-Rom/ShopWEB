// frontend/src/pages/homePage.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import { Product } from "@/types/product";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/Skeleton";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api.get("/products")
      .then((res) => {
        setProducts(res.data.slice(0, 8));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-64 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <h1 className="text-3xl font-bold text-center mb-8">Featured</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="hover:scale-105 transition">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover rounded-lg mb-3" />
            ) : (
              <div className="w-full h-40 bg-slate-100 rounded-lg mb-3 flex items-center justify-center">
                No Image
              </div>
            )}

            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-lg font-bold mt-2">${(product.price ?? 0).toFixed(2)}</p>

            <div className="mt-3">
              <Link
                href={`/products/${product.id}`}
                className="text-sky-600 text-sm font-medium"
              >
                View Details →
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
