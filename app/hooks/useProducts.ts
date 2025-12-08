// app/hooks/useProducts.ts
"use client";

import { useState, useCallback, useMemo } from 'react';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<number>(1);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 1) {
      return products;
    }
    return products.filter(p => p.categoryId === selectedCategory);
  }, [products, selectedCategory]);

  const addProduct = useCallback((product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Math.max(...products.map(p => p.id), 0) + 1,
    };
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  }, [products]);

  const updateProduct = useCallback((id: number, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  const deleteProduct = useCallback((id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const getProductById = useCallback((id: number) => {
    return products.find(p => p.id === id);
  }, [products]);

  const searchProducts = useCallback((term: string) => {
    return products.filter(p =>
      p.name.toLowerCase().includes(term.toLowerCase()) ||
      p.description?.toLowerCase().includes(term.toLowerCase())
    );
  }, [products]);

  return {
    products,
    filteredProducts,
    selectedCategory,
    setSelectedCategory,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    searchProducts,
  };
};
