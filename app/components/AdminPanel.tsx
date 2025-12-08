"use client";

import { useState } from 'react';
import { Order, Product } from '../types';
import { getOrders, setOrders } from '../utils/storage';
import { useProducts } from '../hooks/useProducts';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface AdminPanelProps {
  onBack: () => void;
}

export function AdminPanel({ onBack }: AdminPanelProps) {
  const { products, deleteProduct, updateProduct } = useProducts();
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
            <h3 className="font-semibold mb-3">Products</h3>
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
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
