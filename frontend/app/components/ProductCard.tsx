// app/components/ProductCard.tsx
"use client";

import { useRef } from "react";
import { Heart, ShoppingCart, Star, Trash2 } from "lucide-react";
import { Product } from '../types/types';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onSelect: (product: Product) => void;
  onToggleFavorite: () => void;
  onAddToCart: () => void;   // ← Required
  onDelete?: () => void;
  showDelete?: boolean;
}

export function ProductCard({
  product,
  isFavorite,
  onSelect,
  onToggleFavorite,
  onAddToCart,
  onDelete,
  showDelete,
}: ProductCardProps) {
  const cardRef = useRef<HTMLButtonElement>(null);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Haptics
    if ("vibrate" in navigator) {
      navigator.vibrate([40, 30, 60]);
    }

    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;

    const img = document.createElement("img");
    img.src = product.image;
    img.className = "fixed w-24 h-24 rounded-2xl shadow-2xl object-cover pointer-events-none z-50 border-4 border-white";
    img.style.left = `${rect.left + rect.width / 2 - 48}px`;
    img.style.top = `${rect.top + rect.height / 2 - 48}px`;
    document.body.appendChild(img);

    const badge = document.getElementById("cart-tab-badge");
    const targetRect = badge?.getBoundingClientRect() || { left: window.innerWidth - 60, top: window.innerHeight - 100 };

    img.animate([
      { transform: "scale(1) rotate(0deg)", opacity: 1 },
      { transform: `translate(${targetRect.left - rect.left - 40}px, ${targetRect.top - rect.top - 40}px) scale(0.3) rotate(20deg)`, opacity: 0 },
    ], {
      duration: 900,
      easing: "cubic-bezier(0.2, 0.8, 0.4, 1)"
    }).onfinish = () => img.remove();

    onAddToCart();
  };

  return (
    <button
      ref={cardRef}
      onClick={() => onSelect(product)}
      className="group relative bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
    >
      {/* Image */}
      <div className="aspect-square relative overflow-hidden">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />

        {/* Favorite Heart */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="absolute top-3 right-3 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-lg"
        >
          <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-slate-700"}`} />
        </button>

        {/* Delete Button (Admin) */}
        {showDelete && onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="absolute top-3 left-3 w-10 h-10 bg-red-500/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg"
          >
            <Trash2 className="w-5 h-5 text-white" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 truncate">{product.name}</h3>
        <div className="flex items-center justify-between mt-2">
          <p className="text-lg font-bold text-slate-900">
            ${product.price.toFixed(2)}
          </p>

          {/* Add to Cart Button */}
          <div
            onClick={handleAddToCart}
            className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300 cursor-pointer"
          >
            <ShoppingCart className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </button>
  );
}