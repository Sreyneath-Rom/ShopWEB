import { NextResponse } from 'next/server';
import { createSession } from '@/lib/session';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  // Replace with real auth logic (e.g., check against DB or external service)
  if (email === 'admin@example.com' && password === 'password') {  // Mock for demo; secure this!
    await createSession('1', 'admin');
    return NextResponse.json({ role: 'admin' });
  }
  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}