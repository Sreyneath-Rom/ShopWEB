// app/lib/users.ts
import fs from 'fs';
import path from 'path';

const FILE = path.join(process.cwd(), 'app', 'data', 'users.json');

export function readUsers(): any[] {
  try {
    if (!fs.existsSync(FILE)) return [];
    const raw = fs.readFileSync(FILE, 'utf8');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function writeUsers(users: any[]) {
  try {
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(users, null, 2));
    return true;
  } catch (e) {
    console.error('Failed to write users', e);
    return false;
  }
}