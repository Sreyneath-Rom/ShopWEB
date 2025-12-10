// app/pages/ProductListing.tsx
"use client";

import { Search, Plus } from 'lucide-react';
import { Product, User } from '../types/types';
import { useState, useMemo, useEffect } from 'react';
import { useFavorites } from '../hooks/useFavorites';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '@/app/context/CartContext';
import { CategoryFilter } from '../components/CategoryFilter';
import { ProductCard } from '../components/ProductCard';
import { AddProductModal } from '../components/AddProductModal';
import { Button } from '../components/ui/Button';

interface ProductListingProps {
  onProductSelect: (product: Product) => void;
  user?: User | null;
  onOpenProfile?: () => void;
  onOpenAdmin?: () => void;
  onOpenLogin?: () => void;
  onLogout?: () => void;
  onOpenRegister?: () => void;
}

export function ProductListing({
  onProductSelect,
  user,
  onOpenProfile,
  onOpenAdmin,
  onOpenLogin,
  onLogout,
  onOpenRegister
}: ProductListingProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const { favorites, toggleFavorite } = useFavorites();
  const { add } = useCart(); // ← Your CartContext uses `add`

  const {
    filteredProducts,
    selectedCategory,
    setSelectedCategory,
    addProduct,
    deleteProduct,
  } = useProducts();

  // Simulate loading + prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const displayedProducts = useMemo(() => {
    return filteredProducts.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [filteredProducts, searchTerm]);

  // FIXED: Add quantity: 1 to match CartItem type
  const handleAddToCart = (product: Product) => {
    add({ ...product, quantity: 1 });
  };

  return (
    <div className="min-h-screen p-4 md:p-6 bg-linear-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="backdrop-blur-xl bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl shadow-xl border border-white/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-white text-3xl font-bold">K-Shop</h1>
              <div className="flex items-center gap-3">
                {mounted && user && user.id !== 'guest' ? (
                  <div className="flex items-center gap-2 bg-white/90 rounded-xl px-3 py-1">
                    <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-slate-900 text-sm font-medium">{user.name}</span>
                    {onLogout && <Button onClick={onLogout} variant="outline" size="sm">Logout</Button>}
                  </div>
                ) : (
                  <Button
                    onClick={() => onOpenProfile?.() || onOpenLogin?.()}
                    variant="outline"
                    className="bg-white/90 text-slate-900"
                  >
                    Profile
                  </Button>
                )}

                {mounted && user?.isAdmin && (
                  <Button
                    onClick={() => setIsModalOpen(true)}
                    variant="outline"
                    className="bg-white/90 text-slate-900"
                  >
                    <Plus className="w-5 h-5" /> Add Product
                  </Button>
                )}
              </div>
            </div>

            {/* Search Bar */}
            <div className="backdrop-blur-xl bg-white/20 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-lg">
              <Search className="w-5 h-5 text-white/80" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent outline-none text-white placeholder:text-white/60"
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-24">
          {isLoading ? (
            // Skeleton Loaders
            [...Array(8)].map((_, i) => (
              <div key={i} className="bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden shadow-md animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-10 bg-gray-300 rounded-full w-24" />
                </div>
              </div>
            ))
          ) : displayedProducts.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <p className="text-slate-500 text-lg font-medium">
                {searchTerm ? 'No products found' : 'No products in this category'}
              </p>
            </div>
          ) : (
            displayedProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={favorites.includes(product.id)}
                onSelect={onProductSelect}
                onToggleFavorite={() => toggleFavorite(product.id)}
                onAddToCart={() => handleAddToCart(product)}
                onDelete={user?.isAdmin ? () => deleteProduct(product.id) : undefined}
                showDelete={!!user?.isAdmin}
              />
            ))
          )}
        </div>
      </div>

      {/* Add Product Modal (Admin only) */}
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addProduct}
      />
    </div>
  );
}