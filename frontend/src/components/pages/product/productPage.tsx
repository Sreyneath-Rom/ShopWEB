'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import { Product } from '@/types/product';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  Search,
  ChevronDown,
  Package,
  Laptop,
  Shirt,
  Sparkles,
  Home,
  Trophy,
  Book,
  ToyBrick,
  Utensils,
} from 'lucide-react';

// Category → Icon mapping
const categoryIcons: Record<string, React.ReactNode> = {
  Electronics: <Laptop className="w-5 h-5" />,
  Fashion: <Shirt className="w-5 h-5" />,
  Beauty: <Sparkles className="w-5 h-5" />,
  Home: <Home className="w-5 h-5" />,
  Sports: <Trophy className="w-5 h-5" />,
  Books: <Book className="w-5 h-5" />,
  Toys: <ToyBrick className="w-5 h-5" />,
  Food: <Utensils className="w-5 h-5" />,
};

const defaultIcon = <Package className="w-5 h-5" />;

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'name'>('price-asc');

  useEffect(() => {
    api
      .get('/products')
      .then((res) => {
        setProducts(res.data);
        setFiltered(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = [
    'all',
    ...Array.from(new Set(products.map((p) => p.category).filter(Boolean) as string[])),
  ];

  useEffect(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description?.toLowerCase().includes(term)
      );
    }

    // Sort
    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'name') result.sort((a, b) => a.name.localeCompare(b.name));

    setFiltered(result);
  }, [products, selectedCategory, searchTerm, sortBy]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[...Array(12)].map((_, i) => (
            <Skeleton key={i} className="h-96 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <h1 className="text-5xl font-bold text-center mb-10">All Products</h1>

      {/* Search + Sort Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-accent/30 text-lg"
          />
        </div>

        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl px-5 py-4 pr-12 font-medium cursor-pointer focus:outline-none focus:ring-4 focus:ring-accent/30"
          >
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name A-Z</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none text-gray-500" />
        </div>
      </div>

      {/* Category Pills with Icons */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((cat) => {
          const icon = categoryIcons[cat] || defaultIcon;
          const isActive = selectedCategory === cat;

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
                isActive
                  ? 'bg-accent text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300'
              }`}
            >
              {icon}
              <span>{cat === 'all' ? 'All Products' : cat}</span>
            </button>
          );
        })}
      </div>

      {/* Results Count */}
      <p className="text-center text-lg text-gray-600 dark:text-gray-400 mb-8">
        {filtered.length} {filtered.length === 1 ? 'product' : 'products'} found
      </p>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filtered.map((product) => (
          <Card
            key={product.id}
            className="hover:scale-105 transition-all duration-300 overflow-hidden group"
          >
            <div className="relative">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  {defaultIcon}
                </div>
              )}

              {/* Category Badge on Card */}
              {product.category && (
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-white/90 dark:bg-black/80 backdrop-blur rounded-full shadow-lg">
                    {categoryIcons[product.category] || defaultIcon}
                    {product.category}
                  </span>
                </div>
              )}
            </div>

            <div className="p-5">
              <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                {product.name}
              </h2>
              <p className="text-3xl font-bold text-secondary mb-4">
                ${product.price.toFixed(2)}
              </p>
              <Link
                href={`/products/${product.id}`}
                className="text-primary hover:underline font-medium"
              >
                View Details
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="text-center py-24">
          {defaultIcon}
          <p className="text-2xl text-gray-500 mt-6">No products found</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSortBy('price-asc');
            }}
            className="mt-6 text-primary font-medium underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}