// app/hooks/useProducts.ts
import { useState, useEffect } from 'react';
import api from '@/app/lib/api';

interface Product {
  id: number;
  name: string;
  price: number;
  image?: string;
  description?: string;
  [key: string]: any;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Product[]>('/products')
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const addProduct = async (product: Omit<Product, 'id'>) => {
    const res = await api.post<Product>('/products', product);
    setProducts(prev => [...prev, res.data]);
  };

  const deleteProduct = async (id: number) => {
    await api.delete(`/products/${id}`);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return { products, loading, addProduct, deleteProduct };
};