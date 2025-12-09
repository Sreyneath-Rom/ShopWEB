// app/components/AdminPanel.tsx
"use client";

import { useState } from 'react';
import { Order, Product } from '../types';
import { getOrders, setOrders } from '../utils/storage';
import { useProducts } from '../hooks/useProducts';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { AddProductModal } from './AddProductModal';

interface AdminPanelProps {
  onBack: () => void;
}

export function AdminPanel({ onBack }: AdminPanelProps) {
  const { products, deleteProduct, updateProduct, addProduct } = useProducts();
  const [addOpen, setAddOpen] = useState(false);
  const [orders, setLocalOrders] = useState<Order[]>(() => getOrders() as Order[]);

  const setAndSaveOrders = (updated: Order[]) => {
    setLocalOrders(updated);
    setOrders(updated as any);
  };

  const changeStatus = (id: string, status: Order['status']) => {
    const updated = orders.map(o => o.id === id ? { ...o, status } : o);
    setAndSaveOrders(updated);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-linear-to-br from-slate-50 via-gray-50 to-slate-100">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          <div className="flex items-center gap-3">
            <Button onClick={onBack} variant="outline">Back</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Orders</h3>
            {orders.length === 0 ? (
              <p className="text-slate-500">No orders yet.</p>
            ) : (
              <div className="divide-y">
                {orders.map(o => (
                  <div key={o.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{o.productSnapshot.name}</div>
                      <div className="text-xs text-slate-500">{new Date(o.date).toLocaleString()}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-semibold">${o.total.toFixed(2)}</div>
                      <Button onClick={() => changeStatus(o.id, 'paid')} variant="success" size="sm">Mark Paid</Button>
                      <Button onClick={() => changeStatus(o.id, 'failed')} variant="danger" size="sm">Mark Failed</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Products</h3>
              <div className="flex items-center gap-2">
                <Button onClick={() => setAddOpen(true)} variant="primary" size="sm">Add Product</Button>
                <label className="inline-flex items-center px-3 py-1 bg-slate-100 rounded text-sm cursor-pointer">
                  <span className="mr-2">Import</span>
                  <input
                    type="file"
                    accept="application/json"
                    className="hidden"
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      try {
                        const txt = await f.text();
                        const parsed = JSON.parse(txt);
                        if (!Array.isArray(parsed)) throw new Error('Expected an array of products');
                        const added: any[] = [];
                        for (const p of parsed) {
                          // add to client state
                          const np = addProduct({
                            name: p.name,
                            price: Number(p.price) || 0,
                            categoryId: Number(p.categoryId) || 2,
                            description: p.description || '',
                            image: p.image || '',
                            rating: p.rating || 4.5,
                            inStock: p.inStock !== false,
                            colors: p.colors || [],
                          } as any);
                          added.push(np);
                        }
                        // post to server to persist (admin-only)
                        try {
                          await fetch('/api/products', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ type: 'import', products: parsed }),
                          });
                        } catch (err) {
                          // ignore server errors for demo
                        }
                      } catch (err: any) {
                        alert('Import failed: ' + (err.message || err));
                      }
                      // reset input
                      e.currentTarget.value = '';
                    }}
                  />
                </label>
              </div>
            </div>
            {products.length === 0 ? (
              <p className="text-slate-500">No products found.</p>
            ) : (
              <div className="divide-y">
                {products.map((p: Product) => (
                  <div key={p.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-slate-500">${p.price.toFixed(2)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button onClick={() => deleteProduct(p.id)} variant="danger" size="sm">Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
          <AddProductModal isOpen={addOpen} onClose={() => setAddOpen(false)} onAdd={async (p) => {
            // add to client state
            addProduct({
              name: p.name,
              price: p.price,
              categoryId: p.categoryId,
              description: p.description,
              image: p.image,
              rating: p.rating,
              inStock: p.inStock,
              colors: (p as any).colors || [],
            } as any);
            // try to persist on server
            try {
              await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(p),
              });
            } catch (err) {
              // ignore
            }
            setAddOpen(false);
          }} />
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
