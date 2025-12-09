// app/pages/ProductCard.tsx
"use client";

import { Heart, ShoppingCart, Star, Trash2 } from 'lucide-react';
import { Product } from '../types/types';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onSelect: (product: Product) => void;
  onToggleFavorite: () => void;
  onDelete?: () => void;
  showDelete?: boolean;
}

export function ProductCard({
  product,
  isFavorite,
  onSelect,
  onToggleFavorite,
  onDelete,
  showDelete = false,
}: ProductCardProps) {
  const stockStatus = product.inStock ? (
    <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
      In Stock
    </span>
  ) : (
    <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded">
      Out of Stock
    </span>
  );

  return (
    <button
      onClick={() => product.inStock && onSelect(product)}
      disabled={!product.inStock}
      className={`group relative backdrop-blur-xl bg-white/80 hover:bg-white/95 rounded-xl shadow-lg hover:shadow-2xl border border-white/60 overflow-hidden transition-all duration-500 active:scale-[0.98] text-left ${
        !product.inStock ? 'opacity-60 cursor-not-allowed' : ''
      }`}
    >
      {/* Favorite Button */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        className="absolute top-2 right-2 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer"
        role="button"
        tabIndex={0}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.stopPropagation();
            onToggleFavorite();
          }
        }}
      >
        <Heart
          className={`w-4 h-4 transition-all ${
            isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-600'
          }`}
        />
      </div>

      {/* Delete Button */}
      {showDelete && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
          className="absolute top-2 left-2 z-10 w-8 h-8 bg-red-500/90 backdrop-blur-sm hover:bg-red-600 rounded-full flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer"
          role="button"
          tabIndex={0}
          aria-label="Delete product"
        >
          <Trash2 className="w-4 h-4 text-white" />
        </div>
      )}

      <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative p-3">
        {/* Image */}
        <div className="aspect-square rounded-lg bg-linear-to-br from-slate-100 to-slate-50 mb-3 overflow-hidden shadow-md ring-1 ring-black/5">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        </div>

        <div className="px-1">
          {/* Name */}
          <h3 className="text-slate-900 mb-1 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors font-semibold">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(product.rating || 0)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-500">({product.rating})</span>
            </div>
          )}

          {/* Stock Status */}
          <div className="mb-2">{stockStatus}</div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <p className="bg-linear-to-r from-amber-500 via-orange-500 to-orange-600 bg-clip-text text-transparent font-bold">
              ${product.price.toFixed(2)}
            </p>
            <div className="w-7 h-7 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
              <ShoppingCart className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
