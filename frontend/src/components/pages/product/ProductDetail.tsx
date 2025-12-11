'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Product } from '@/types/product';
import api from '@/lib/api';
import toast from 'react-hot-toast'; // ← npm install react-hot-toast

export default function ProductDetail() {
  const params = useParams();
  const id = params?.id;
  const productId = Array.isArray(id) ? id[0] : id;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    api.get(`/products/${productId}`)
      .then(res => setProduct(res.data))
      .catch(() => toast.error("Failed to load product"))
      .finally(() => setLoading(false));
  }, [productId]);

  const addToCart = () => {
    // Simple localStorage cart (you can upgrade to Zustand/Redux later)
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find((item: any) => item.id === product?.id);

    if (existing) {
      existing.quantity += quantity;
      toast.success(`Updated ${product?.name} ×${existing.quantity}`);
    } else {
      cart.push({ ...product, quantity });
      toast.success(`Added ${product?.name} to cart!`);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
  };

  if (loading) return <p className="text-center py-32 text-xl">Loading...</p>;
  if (!productId || !product) return <p className="text-center py-32 text-red-500 text-2xl">Product Not Found</p>;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Product Image */}
        <div className="relative">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-96 flex items-center justify-center overflow-hidden">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-4">Photo</div>
                <p className="text-gray-500">No image yet</p>
              </div>
            )}
          </div>
          <div className="badge badge-success absolute top-4 left-4 text-white px-3 py-1 rounded">
            In Stock
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-5xl font-bold mb-4">{product.name}</h1>
            <p className="text-6xl font-bold text-green-600 mb-6">
              ${product.price}
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              {product.description || "No description available."}
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-lg font-medium">Quantity:</span>
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  –
                </button>
                <span className="px-6 py-2 font-semibold text-lg w-16 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={addToCart}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-5 rounded-xl text-xl shadow-lg transform hover:scale-105 transition"
              >
                Add to Cart
              </button>

              <Link
                href={`/payment?productId=${product.id}&quantity=${quantity}`}
                className="flex-1 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-5 rounded-xl text-xl text-center shadow-lg transform hover:scale-105 transition"
              >
                Buy Now
              </Link>
            </div>
          </div>

          {/* Mini Cart Indicator */}
          <div className="mt-8 text-sm text-gray-500">
            Items in cart: {JSON.parse(localStorage.getItem('cart') || '[]').length}
          </div>
        </div>
      </div>
    </div>
  );
}