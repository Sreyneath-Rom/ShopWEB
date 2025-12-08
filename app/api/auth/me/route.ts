import { NextResponse } from 'next/server';
import { verifyToken, getPublicUser } from '../../../lib/auth';

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get('cookie') || '';
    const tokenMatch = cookie.split(';').map(c => c.trim()).find(c => c.startsWith('token='));
    if (!tokenMatch) return NextResponse.json({ user: null });
    const token = tokenMatch.split('=')[1];
    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ user: null });
    // payload contains id and isAdmin
    // load user data
    const user = await getPublicUser({ id: payload.id, isAdmin: payload.isAdmin } as any);
    return NextResponse.json({ user: user || null });
  } catch (e: any) {
    return NextResponse.json({ user: null });
  }
}
