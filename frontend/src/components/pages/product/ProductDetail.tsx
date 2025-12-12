'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import { Star, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProductDetailProps {
  id: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
  category?: string;
  rating: number;
  inStock: boolean;
  colors: string[];
}

export default function ProductDetail({ id }: ProductDetailProps) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    api
      .get(`/products/${id}`)
      .then((res) => {
        const p = res.data;
        setProduct(p);
        setSelectedColor(p.colors?.[0] || '');
      })
      .catch(() => {
        toast.error(`Product ${id} not found`);
        setProduct(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const addToCart = () => {
    if (!product) return;

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const itemKey = `${product.id}-${selectedColor}`;
    const existing = cart.find((item: any) => item.itemKey === itemKey);

    if (existing) {
      existing.quantity += quantity;
      toast.success(`Updated ×${existing.quantity}`);
    } else {
      cart.push({ ...product, quantity, selectedColor, itemKey });
      toast.success('Added to cart!');
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <div className="text-3xl">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <div className="text-3xl text-gray-500">Product not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Product Image */}
        <div className="relative">
          <img
            src={product.imageUrl || 'https://via.placeholder.com/800'}
            alt={product.name}
            className="w-full rounded-3xl shadow-2xl object-contain bg-white"
          />
          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-3xl">
              <span className="text-white text-4xl font-bold">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <h1 className="text-5xl font-bold mb-4">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-8 h-8 ${
                  i < Math.floor(product.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="ml-3 text-2xl font-semibold">{product.rating}</span>
          </div>

          {/* Price */}
          <p className="text-6xl font-bold text-secondary mb-8">${Number(product.price).toFixed(2)}</p>

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-10">
              <p className="text-lg font-semibold mb-4">
                Color: <span className="text-primary font-bold">{selectedColor}</span>
              </p>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-6 py-3 rounded-xl border-2 font-medium transition-all ${
                      selectedColor === color
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock Status */}
          {product.inStock ? (
            <div className="flex items-center gap-3 text-green-600 text-xl font-medium mb-8">
              <Check className="w-7 h-7" /> In Stock – Ships Today
            </div>
          ) : (
            <div className="text-red-600 text-xl font-medium mb-8">Currently unavailable</div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center gap-6 mb-10">
            <span className="text-lg font-semibold">Quantity:</span>
            <div className="flex items-center border-2 border-gray-300 rounded-xl">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-6 py-4 text-2xl hover:bg-gray-100"
              >
                −
              </button>
              <span className="px-10 py-4 text-xl font-bold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-6 py-4 text-2xl hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-5">
            <Button
              onClick={addToCart}
              disabled={!product.inStock}
              className="flex-1 bg-accent hover:bg-orange-600 text-white py-6 text-xl font-bold rounded-2xl shadow-xl"
            >
              Add to Cart
            </Button>
            <Button
              onClick={() =>
                router.push(`/payment?productId=${product.id}&quantity=${quantity}`)
              }
              disabled={!product.inStock}
              className="flex-1 bg-linear-to-r from-primary to-blue-600 text-white py-6 text-xl font-bold rounded-2xl shadow-xl"
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-20 bg-neutral/30 rounded-3xl p-10">
        <h2 className="text-3xl font-bold mb-6">Description</h2>
        <p className="text-xl leading-relaxed text-gray-700 dark:text-gray-300">
          {product.description}
        </p>
      </div>
    </div>
  );
}
