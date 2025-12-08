// app/components/ProductDetail.tsx
"use client";

import { Star } from 'lucide-react';
import { Product } from '../types';
import { useState } from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Header } from './ui/Header';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { PRODUCT_SIZES, PRODUCT_COLORS } from '../data/products';

interface ProductDetailProps {
  product: Product;
  onAddToCart: () => void;
  onBack: () => void;
}

export function ProductDetail({ product, onAddToCart, onBack }: ProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState(PRODUCT_COLORS[0]);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToCart = () => {
    onAddToCart();
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Header title="Product Detail" onBack={onBack} variant="orange" />

        <Card className="p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Images */}
            <div>
              <div className="aspect-square rounded-3xl bg-linear-to-br from-slate-100 to-slate-50 mb-4 overflow-hidden shadow-xl ring-1 ring-black/5">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-xl bg-linear-to-br from-slate-100 to-slate-50 shadow-md ring-1 ring-black/5 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <ImageWithFallback
                      src={product.image}
                      alt={`${product.name} view ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-slate-900 mb-2 text-3xl font-bold">{product.name}</h1>
                  <p className="bg-linear-to-r from-amber-500 via-orange-500 to-orange-600 bg-clip-text text-transparent text-2xl font-bold">
                    ${product.price.toFixed(2)}
                  </p>
                  <p className="text-slate-500 text-sm mt-2 font-medium">Select Options</p>
                </div>
                <Button
                  onClick={() => setIsFavorite(!isFavorite)}
                  variant="outline"
                  className="w-12 h-12 p-0 rounded-2xl shrink-0"
                  aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Star
                    className={`w-6 h-6 transition-all ${
                      isFavorite ? 'fill-amber-400 text-amber-400 scale-110' : 'text-slate-400'
                    }`}
                  />
                </Button>
              </div>

              {/* Size Selection */}
              <div className="mb-6">
                <p className="text-slate-700 font-medium mb-3">Size</p>
                <div className="flex gap-2 flex-wrap">
                  {PRODUCT_SIZES.map((size) => (
                    <Button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      variant={selectedSize === size ? 'primary' : 'outline'}
                      size="sm"
                      className={selectedSize === size ? 'scale-105' : ''}
                      aria-pressed={selectedSize === size}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div className="mb-8">
                <p className="text-slate-700 font-medium mb-3">Color</p>
                <div className="flex gap-3">
                  {PRODUCT_COLORS.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`w-12 h-12 rounded-xl transition-all shadow-lg hover:shadow-xl ${
                        selectedColor.name === color.name
                          ? 'ring-2 ring-offset-4 ring-blue-500 scale-110'
                          : 'hover:scale-105'
                      }`}
                      style={{
                        backgroundColor: color.value,
                        border: color.value === '#FFFFFF' ? '2px solid #E5E7EB' : 'none',
                      }}
                      aria-label={`Select ${color.name} color`}
                      aria-pressed={selectedColor.name === color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                variant="primary"
                size="lg"
                className="w-full mt-auto"
                aria-label="Add to cart"
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}