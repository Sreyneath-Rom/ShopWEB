export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
  category?: string; // ← NEW
  categorySlug?: string;
  rating?: number;
  inStock?: boolean;
  colors?: string[];
}
