'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import { Product } from '@/types/product';
import api from '@/lib/api';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/products").then(res => {
      setProducts(res.data);
      setLoading(false);
    }).catch(console.error);
  }, []);

  if (loading) return <p className="text-center py-20 text-xl">Loading...</p>;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Featured Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map(product => (
          <Card key={product.id}>
            <h2 className="text-2xl font-semibold mb-2">{product.name}</h2>
            <p className="text-3xl font-bold text-green-600 mb-4">${product.price}</p>
            <Link
              href={`/products/${product.id}`}
              className="text-blue-600 hover:underline"
            >
              View Details →
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}