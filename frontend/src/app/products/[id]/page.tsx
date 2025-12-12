// frontend/src/app/products/[id]/page.tsx
"use client";
import { use } from "react";
import ProductDetail from "@/components/pages/product/ProductDetail";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params: paramsPromise }: ProductDetailPageProps) {
  const params = use(paramsPromise);
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  if (!id) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <div className="text-2xl text-slate-500">Product ID is missing</div>
      </div>
    );
  }

  return <ProductDetail id={id} />;
}
