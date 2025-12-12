// app/products/[id]/page.tsx
import ProductDetail from '@/components/pages/product/ProductDetail';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return <ProductDetail />;
}