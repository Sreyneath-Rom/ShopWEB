// app/types.ts
export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
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
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}