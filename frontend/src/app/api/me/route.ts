import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function GET() {
  const session = await getSession();
  if (session) {
    return NextResponse.json({ id: session.userId, role: session.role });
  }
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}