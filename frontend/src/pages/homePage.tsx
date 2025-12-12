'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import { Product } from '@/types/product';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/Skeleton';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/products").then(res => {
      setProducts(res.data);
      setLoading(false);
    }).catch(console.error);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-64 rounded-2xl" />)}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Featured Products</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map(product => (
          <Card key={product.id} className="hover:scale-105 transition-smooth">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover rounded-xl mb-4" />
            ) : (
              <div className="w-full h-48 bg-gray-200 rounded-xl mb-4 flex items-center justify-center text-gray-500">No Image</div>
            )}
            <h2 className="text-2xl font-semibold mb-2">{product.name}</h2>
            <p className="text-3xl font-bold text-secondary mb-4">${product.price}</p>
            <Link href={`/products/${product.id}`} className="text-primary hover:underline font-medium">
              View Details →
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}