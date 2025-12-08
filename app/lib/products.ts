import fs from 'fs';
import path from 'path';
import { Product } from '../types';

const FILE = path.join(process.cwd(), 'app', 'data', 'products.json');

export function readProducts(): Product[] {
  try {
    if (!fs.existsSync(FILE)) return [];
    const raw = fs.readFileSync(FILE, 'utf8');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function writeProducts(products: Product[]) {
  try {
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(products, null, 2));
    return true;
  } catch (e) {
    console.error('Failed to write products', e);
    return false;
  }
}

export function addProductToStore(p: Omit<Product, 'id'>) {
  const products = readProducts();
  const nextId = products.length ? Math.max(...products.map(x => x.id)) + 1 : 1;
  const newP: Product = { ...p, id: nextId } as Product;
  products.push(newP);
  writeProducts(products);
  return newP;
}
