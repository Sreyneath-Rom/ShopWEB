// app/components/Profile.tsx
"use client";

import { User, Order } from '../types';
import { Button } from './ui/Button';
import { useState } from 'react';
import { setOrders, clearOrders } from '../utils/storage';
import { Card } from './ui/Card';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface ProfileProps {
  user: User;
  orders: Order[];
  onBack: () => void;
  onLogout?: () => void;
}

export function Profile({ user, orders, onBack, onLogout }: ProfileProps) {
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [localOrders, setLocalOrders] = useState(orders || []);

  const saveProfile = () => {
    // currently just update local state; persistent user management not implemented
    // In a real app we'd POST to an API
    alert('Profile saved');
  };

  const handleClearOrders = () => {
    if (confirm('Clear all order history?')) {
      clearOrders();
      setLocalOrders([]);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-linear-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100">
              <ImageWithFallback src={user.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200'} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
              <p className="text-sm text-slate-500">{user.email || 'No email provided'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={onBack} variant="outline">Back</Button>
            {onLogout && (
              <Button onClick={onLogout} variant="danger">Logout</Button>
            )}
          </div>
        </div>

        <Card className="p-4 mb-4">
          <h3 className="text-lg font-semibold mb-3">Edit Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input value={name} onChange={(e) => setName(e.target.value)} className="p-3 rounded border" placeholder="Full name" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="p-3 rounded border" placeholder="Email" />
          </div>
          <div className="mt-3 flex gap-3">
            <Button onClick={saveProfile} variant="primary">Save</Button>
            <Button onClick={() => { setName(user.name || ''); setEmail(user.email || ''); }} variant="outline">Reset</Button>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Purchase History</h3>
            <Button onClick={handleClearOrders} variant="danger" size="sm">Clear History</Button>
          </div>
          {localOrders.length === 0 ? (
            <p className="text-slate-500">You haven't made any purchases yet.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {localOrders.map((o) => (
                <div key={o.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100">
                      <ImageWithFallback src={o.productSnapshot.image} alt={o.productSnapshot.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="text-slate-900 font-medium">{o.productSnapshot.name}</div>
                      <div className="text-xs text-slate-500">{new Date(o.date).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-slate-900 font-semibold">${o.total.toFixed(2)}</div>
                    <div className="text-xs text-slate-500">{o.status}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default Profile;
