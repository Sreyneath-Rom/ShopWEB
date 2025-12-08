// app/types.ts
export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
}

export interface ColorVariant {
  name: string;
  value: string;
  image: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  categoryId: number;
  description?: string;
  rating?: number;
  inStock?: boolean;
  colors?: ColorVariant[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Order {
  id: string;
  productId: number;
  productSnapshot: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  subtotal: number;
  tax: number;
  total: number;
  date: string; // ISO
  status: 'paid' | 'failed' | 'pending';
}

export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  isAdmin?: boolean;
}