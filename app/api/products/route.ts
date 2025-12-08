import { NextResponse } from 'next/server';
import { verifyToken } from '../../lib/auth';
import { readProducts, writeProducts, addProductToStore } from '../../lib/products';

export async function POST(req: Request) {
  try {
    const cookie = req.headers.get('cookie') || '';
    const tokenMatch = cookie.split(';').map(c => c.trim()).find(c => c.startsWith('token='));
    const token = tokenMatch ? tokenMatch.split('=')[1] : null;
    const payload = token ? verifyToken(token) : null;
    if (!payload || !payload.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    // support single product or batch import
    if (body?.type === 'import' && Array.isArray(body.products)) {
      const added = [] as any[];
      for (const p of body.products) {
        const np = addProductToStore(p as any);
        added.push(np);
      }
      return NextResponse.json({ added });
    }

    // single product
    const product = body;
    if (!product || !product.name) return NextResponse.json({ error: 'Invalid product' }, { status: 400 });
    const added = addProductToStore(product as any);
    return NextResponse.json({ product: added });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed' }, { status: 500 });
  }
}
