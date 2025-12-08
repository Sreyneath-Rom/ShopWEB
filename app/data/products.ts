// app/data/products.ts
import { Product, Category } from '../types';

export const CATEGORIES: Category[] = [
  { id: 1, name: 'All', icon: '🛍️', color: 'from-blue-500 to-blue-600' },
  { id: 2, name: 'Clothing', icon: '👕', color: 'from-purple-500 to-purple-600' },
  { id: 3, name: 'Shoes', icon: '👟', color: 'from-orange-500 to-orange-600' },
  { id: 4, name: 'Accessories', icon: '⌚', color: 'from-pink-500 to-pink-600' },
  { id: 5, name: 'Bags', icon: '🎒', color: 'from-green-500 to-green-600' },
];

export const PRODUCTS: Product[] = [
  { id: 1, categoryId: 2, name: 'Classic T-Shirt', price: 29.99, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', description: 'Comfortable cotton t-shirt', rating: 4.5, inStock: true },
  { id: 2, categoryId: 2, name: 'Denim Jacket', price: 89.99, image: 'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=500', description: 'Classic denim jacket', rating: 4.8, inStock: true },
  { id: 3, categoryId: 3, name: 'Running Shoes', price: 119.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', description: 'Professional running shoes', rating: 4.7, inStock: true },
  { id: 4, categoryId: 3, name: 'Casual Sneakers', price: 79.99, image: 'https://images.unsplash.com/photo-1687586370460-ace8afa5cb07?w=500', description: 'Everyday casual sneakers', rating: 4.6, inStock: true },
  { id: 5, categoryId: 2, name: 'Leather Jacket', price: 159.99, image: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=500', description: 'Premium leather jacket', rating: 4.9, inStock: false },
  { id: 6, categoryId: 2, name: 'Slim Fit Jeans', price: 69.99, image: 'https://images.unsplash.com/photo-1589226849736-8d0e0c78e869?w=500', description: 'Modern slim fit jeans', rating: 4.4, inStock: true },
  { id: 7, categoryId: 5, name: 'Travel Backpack', price: 49.99, image: 'https://images.unsplash.com/photo-1612979022617-b498c5ffbe6d?w=500', description: 'Durable travel backpack', rating: 4.5, inStock: true },
  { id: 8, categoryId: 4, name: 'Aviator Sunglasses', price: 129.99, image: 'https://images.unsplash.com/photo-1638109556691-2e36b5e0f39e?w=500', description: 'Classic aviator style', rating: 4.7, inStock: true },
  { id: 9, categoryId: 4, name: 'Sport Watch', price: 199.99, image: 'https://images.unsplash.com/photo-1667284152842-f240b6634655?w=500', description: 'Advanced sports watch', rating: 4.8, inStock: true },
  { id: 10, categoryId: 2, name: 'Hoodie Sweatshirt', price: 54.99, image: 'https://images.unsplash.com/photo-1680292783974-a9a336c10366?w=500', description: 'Cozy hoodie', rating: 4.6, inStock: true },
  { id: 11, categoryId: 3, name: 'White Sneakers', price: 94.99, image: 'https://images.unsplash.com/photo-1578314921455-34dd4626b38d?w=500', description: 'Clean white sneakers', rating: 4.5, inStock: true },
  { id: 12, categoryId: 4, name: 'Baseball Cap', price: 24.99, image: 'https://images.unsplash.com/photo-1606483956061-46a898dce538?w=500', description: 'Classic baseball cap', rating: 4.3, inStock: true },
];

export const PRODUCT_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export const PRODUCT_COLORS = [
  { name: 'Black', value: '#000000' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Gray', value: '#9CA3AF' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Red', value: '#EF4444' },
];
