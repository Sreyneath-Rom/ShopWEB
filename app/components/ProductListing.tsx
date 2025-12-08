// app/components/ProductListing.tsx
"use client";

import { Search, Plus } from 'lucide-react';
import { Product, User } from '../types';
import { useState, useMemo, useEffect } from 'react';
import { useFavorites } from '../hooks/useFavorites';
import { useProducts } from '../hooks/useProducts';
import { CategoryFilter } from './CategoryFilter';
import { ProductCard } from './ProductCard';
import { AddProductModal } from './AddProductModal';
import { Button } from './ui/Button';

interface ProductListingProps {
  onProductSelect: (product: Product) => void;
  onOpenProfile?: () => void;
  onOpenAdmin?: () => void;
  onOpenLogin?: () => void;
  user?: User | null;
  onLogout?: () => void;
  onOpenRegister?: () => void;
}

export function ProductListing({ onProductSelect, onOpenProfile, onOpenAdmin, onOpenLogin, user, onLogout, onOpenRegister }: ProductListingProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { favorites, isLoaded, toggleFavorite } = useFavorites();
  const {
    filteredProducts,
    selectedCategory,
    setSelectedCategory,
    addProduct,
    deleteProduct,
  } = useProducts();

  const displayedProducts = useMemo(() => {
    return filteredProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [filteredProducts, searchTerm]);

  // Avoid rendering user-dependent UI on the server to prevent hydration mismatch.
  // Only show user/admin specific elements after the component has mounted on the client.
  useEffect(() => {
    setMounted(true);
  }, []);

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
                      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=white`} alt={user.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-slate-900 text-sm font-medium">{user.name}</div>
                    {onLogout && (
                      <Button onClick={onLogout} variant="outline" size="sm">Logout</Button>
                    )}
                  </div>
                ) : (
                  <Button
                    onClick={() => (onOpenProfile ? onOpenProfile() : onOpenLogin && onOpenLogin())}
                    variant="outline"
                    size="md"
                    className="bg-white/90 text-slate-900"
                    aria-label="Open profile"
                  >
                    Profile
                  </Button>
                )}
                {!mounted && user && user.id === 'guest' && onOpenRegister && (
                  <Button onClick={() => onOpenRegister && onOpenRegister()} variant="primary" size="md" className="ml-2">Sign up</Button>
                )}
                {onOpenAdmin && (
                  <Button
                    onClick={() => onOpenAdmin && onOpenAdmin()}
                    variant="outline"
                    size="md"
                    className="bg-white/90 text-slate-900"
                    aria-label="Open admin"
                  >
                    Admin
                  </Button>
                )}
                {mounted && user && user.isAdmin ? (
                  <Button
                    onClick={() => setIsModalOpen(true)}
                    variant="outline"
                    size="md"
                    className="bg-white/90 text-slate-900"
                  >
                    <Plus className="w-5 h-5" />
                    Add Product
                  </Button>
                ) : null}
              </div>
            </div>

            {/* Search */}
            <div className="backdrop-blur-xl bg-white/20 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-lg">
              <Search className="w-5 h-5 text-white/80" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent outline-none text-white placeholder:text-white/60 focus:outline-none"
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayedProducts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-500 text-lg font-medium">
                {searchTerm ? 'No products found matching your search' : 'No products in this category'}
              </p>
            </div>
          ) : (
            displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={favorites.includes(product.id)}
                onSelect={onProductSelect}
                onToggleFavorite={() => toggleFavorite(product.id)}
                onDelete={user && user.isAdmin ? () => deleteProduct(product.id) : undefined}
                showDelete={!!(user && user.isAdmin)}
              />
            ))
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addProduct}
      />
    </div>
  );
}