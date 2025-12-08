import { NextResponse } from 'next/server';
import { createUser, getPublicUser, signToken } from '../../../lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, remember } = body;
    if (!name || !email || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    const user = await createUser(name, email, password);
    const token = signToken({ id: user.id, isAdmin: !!user.isAdmin }, remember ? '30d' : '1h');
    const res = NextResponse.json({ user: getPublicUser(user) });
    res.cookies.set('token', token, { httpOnly: true, path: '/', maxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60 });
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Register failed' }, { status: 400 });
  }
}
