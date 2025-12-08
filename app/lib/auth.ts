import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const USERS_FILE = path.join(process.cwd(), 'app', 'data', 'users.json');

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  isAdmin?: boolean;
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

function readUsers(): StoredUser[] {
  try {
    if (!fs.existsSync(USERS_FILE)) return [];
    const raw = fs.readFileSync(USERS_FILE, 'utf8');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  try {
    fs.mkdirSync(path.dirname(USERS_FILE), { recursive: true });
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    return true;
  } catch (e) {
    console.error('Failed to write users', e);
    return false;
  }
}

export async function createUser(name: string, email: string, password: string): Promise<StoredUser> {
  const users = readUsers();
  const existing = users.find((u) => u.email === email.toLowerCase());
  if (existing) throw new Error('User already exists');
  const hash = await bcrypt.hash(password, 10);
  const user: StoredUser = { id: email.toLowerCase(), name, email: email.toLowerCase(), passwordHash: hash, isAdmin: email.toLowerCase() === 'admin@luxeshop.com' };
  users.push(user);
  writeUsers(users);
  return user;
}

export async function verifyCredentials(email: string, password: string): Promise<StoredUser | null> {
  const users = readUsers();
  const user = users.find((u) => u.email === email.toLowerCase());
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  return ok ? user : null;
}

export function signToken(payload: object, expiresIn = '1h') {
  // cast to any to satisfy varying typings across jsonwebtoken versions
  return jwt.sign(payload as any, JWT_SECRET as any, { expiresIn } as any);
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET as any) as any;
  } catch (e) {
    return null;
  }
}

export function getPublicUser(u: StoredUser) {
  return { id: u.id, name: u.name, email: u.email, isAdmin: !!u.isAdmin };
}
