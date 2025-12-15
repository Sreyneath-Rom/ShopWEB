// frontend/src/lib/session.ts
import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secretKey = process.env.SESSION_SECRET || 'your-secret-key-here'; // Add to .env.local, generate with `openssl rand -base64 32`
const encodedKey = new TextEncoder().encode(secretKey);

interface SessionPayload {
  userId: string;
  role: string;
  expiresAt: Date;
  [key: string]: unknown;
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, { algorithms: ['HS256'] });
    const parsed = payload;
    if (typeof parsed.userId !== 'string' || typeof parsed.role !== 'string' || typeof parsed.expiresAt !== 'string') {
      return null;
    }
    return {
      userId: parsed.userId,
      role: parsed.role,
      expiresAt: new Date(parsed.expiresAt),
    } as SessionPayload;
  } catch (error) {
    return null;
  }
}

export async function createSession(userId: string, role: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const payload: SessionPayload = { userId, role, expiresAt };
  const session = await encrypt(payload);

  const cookieStore = await cookies();
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  const payload = await decrypt(session);
  if (!session || !payload) return null;
  return payload;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}