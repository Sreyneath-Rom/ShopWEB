// app/pages/ProductListing.tsx
"use client";

import { Search, Plus } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { CategoryFilter } from '../components/CategoryFilter';
import { AddProductModal } from '../components/AddProductModal';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '@/app/context/CartContext';
import { useState, useMemo } from 'react';
import type { User } from '../types/types';

// Extend Product type to accept partial categoryId from backend
interface ProductFromAPI {
  id: number;
  name: string;
  price: number;
  image?: string;
  description?: string;
  categoryId?: number; // ← Optional from API
  [key: string]: any;
}

interface ProductListingProps {
  user?: User | null;
  onProductSelect: (product: ProductFromAPI) => void;
  onAddToCart: (product: ProductFromAPI) => void;
}

export function ProductListing({
  user,
  onProductSelect,
  onAddToCart,
}: ProductListingProps) {
  const { products = [], loading, addProduct, deleteProduct } = useProducts();
  const { add: addToCart } = useCart();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Ensure every product has categoryId (default to 1 = "All")
  const safeProducts = useMemo(() => {
    return products.map((p: any) => ({
      ...p,
      categoryId: p.categoryId ?? 1,
    }));
  }, [products]);

  const filteredByCategory = useMemo(() => {
    if (selectedCategory === 1) return safeProducts;
    return safeProducts.filter((p: any) => p.categoryId === selectedCategory);
  }, [safeProducts, selectedCategory]);

  const displayedProducts = useMemo(() => {
    if (!searchTerm.trim()) return filteredByCategory;
    const term = searchTerm.toLowerCase();
    return filteredByCategory.filter((p: any) =>
      p.name?.toLowerCase().includes(term) ||
      p.description?.toLowerCase().includes(term)
    );
  }, [filteredByCategory, searchTerm]);

  const handleAddToCart = (product: ProductFromAPI) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
    onAddToCart(product);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="mt-4 text-gray-500">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="pb-32">
      {/* Search */}
      <div className="px-4 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w- w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white/90 backdrop-blur-lg rounded-2xl border border-gray-200 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 mb-6">
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      {/* Products Grid */}
      <div className="px-4">
        {displayedProducts.length === 0 ? (
          <p className="text-center py-16 text-gray-500">No products found</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product as any} // Safe cast — we fixed categoryId above
                isFavorite={false}
                onSelect={() => onProductSelect(product)}
                onToggleFavorite={() => {}}
                onAddToCart={() => handleAddToCart(product)}
                onDelete={user?.isAdmin ? () => deleteProduct(product.id) : undefined}
                showDelete={!!user?.isAdmin}
              />
            ))}
          </div>
        )}
      </div>

      {/* Admin Add Button */}
      {user?.isAdmin && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-24 right-6 z-40 w-14 h-14 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition"
        >
          <Plus className="w-8 h-8" />
        </button>
      )}

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={async (newProduct: any) => {
          // Ensure categoryId is set
          await addProduct({ ...newProduct, categoryId: newProduct.categoryId || 1 });
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}