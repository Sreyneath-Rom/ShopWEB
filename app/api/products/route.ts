// app/api/products/route.ts  ← កែដូចគ្នា
import { NextResponse } from 'next/server';
import { auth } from "@/app/lib/auth"; // ← ប្តូរ
import { addProductToStore } from '@/app/lib/products';

export async function POST(req: Request) {
  const session = await auth(); 
  if (!session?.user || !(session.user as any).isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await req.json();

  if (body?.type === 'import' && Array.isArray(body.products)) {
    const added = body.products.map((p: any) => addProductToStore(p));
    return NextResponse.json({ added });
  }

  const product = body;
  if (!product?.name) return NextResponse.json({ error: 'Invalid product' }, { status: 400 });

  const added = addProductToStore(product);
  return NextResponse.json({ product: added });
}