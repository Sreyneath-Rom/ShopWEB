// frontend/src/components/pages/product/productPage.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Card from "@/components/ui/Card";
import { Product } from "@/types/product";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/Skeleton";
import { Search, Laptop, Shirt, Sparkles, Home, Trophy, Book, ToyBrick, Utensils, Package } from "lucide-react";
import Button from "@/components/ui/Button";

const categoryIcons: Record<string, React.ReactNode> = {
  Electronics: <Laptop className="w-4 h-4" />,
  Fashion: <Shirt className="w-4 h-4" />,
  Beauty: <Sparkles className="w-4 h-4" />,
  Home: <Home className="w-4 h-4" />,
  Sports: <Trophy className="w-4 h-4" />,
  Books: <Book className="w-4 h-4" />,
  Toys: <ToyBrick className="w-4 h-4" />,
  Food: <Utensils className="w-4 h-4" />,
};

const defaultIcon = <Package className="w-4 h-4" />;

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "name">("price-asc");

  useEffect(() => {
    api.get("/products")
      .then((res) => {
        const normalized = res.data.map((p: Product) => ({
          ...p,
          category: typeof p.category === 'object' && p.category !== null && 'name' in p.category
            ? (p.category as { name: string }).name
            : (typeof p.category === 'string' ? p.category : undefined),
        }));
        setProducts(normalized);
        setFiltered(normalized);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => {
      const stringCats = products
        .map((p) => p.category)
        .filter((c): c is string => typeof c === 'string' && c.length > 0);
      return ['all', ...Array.from(new Set(stringCats))];
    },
    [products]
  );

  useEffect(() => {
    let results = products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "all" || p.category === selectedCategory)
    );

    switch (sortBy) {
      case "price-asc":
        results.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case "price-desc":
        results.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case "name":
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    setFiltered(results);
  }, [searchTerm, selectedCategory, sortBy, products]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => <Skeleton key={i} className="h-64 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <h1 className="text-3xl font-bold text-center mb-8">Products</h1>

      {/* Search + Sort */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products…"
            className="w-full rounded-full border border-gray-200 px-12 py-3 text-sm focus:ring-2 focus:ring-sky-100"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-full border border-gray-200 px-4 py-2 text-sm"
          >
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="name">Name A → Z</option>
          </select>
          <Button
            variant="ghost"
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
              setSortBy("price-asc");
            }}
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          const icon = categoryIcons[cat] ?? defaultIcon;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                isActive ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              {icon}
              <span>{cat === "all" ? "All" : cat}</span>
            </button>
          );
        })}
      </div>

      {/* Results */}
      <p className="text-center text-sm text-slate-500 mb-6">
        {filtered.length} {filtered.length === 1 ? "product" : "products"}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((product) => (
          <Card key={product.id} className="hover:scale-105 transition duration-200">
            <div className="relative">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={400}
                  height={160}
                  className="w-full h-40 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-40 bg-slate-100 rounded-lg flex items-center justify-center">
                  {defaultIcon}
                </div>
              )}
              {product.category && (
                <div className="absolute top-3 left-3">
                  <span className="bg-white/80 px-3 py-1 rounded-full text-xs font-semibold border border-gray-100">
                    {product.category}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-3">
              <h3 className="text-lg font-semibold line-clamp-2">{product.name}</h3>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-lg font-bold">${(product.price ?? 0).toFixed(2)}</span>
                <Link
                  href={`/products/${product.id}`}
                  className="text-sky-600 text-sm font-medium"
                >
                  View
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-slate-500">No products found</p>
        </div>
      )}
    </div>
  );
}