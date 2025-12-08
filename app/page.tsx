// app/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Product, Order, User } from './types';
import { ProductListing } from './components/ProductListing';
import { ProductDetail } from './components/ProductDetail';
import { Payment } from './components/Payment';
import { PaymentSuccess } from './components/PaymentSuccess';
import { PaymentFailed } from './components/PaymentFailed';
import { addOrder, getOrders } from './utils/storage';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import Profile from './components/Profile';
import AdminPanel from './components/AdminPanel';
import { useCart } from './context/CartContext';
import { toast } from 'sonner';
import { ShoppingCart, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

function HomeContent() {
  const [currentView, setCurrentView] = useState<'listing' | 'detail' | 'payment' | 'success' | 'failed' | 'profile' | 'admin'>('listing');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUserState] = useState<User | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { items, count: totalItems, add, clear } = useCart();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setOrders(getOrders() as Order[]);
    // Try to get session user from server
    (async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data?.user) setUserState(data.user as User);
      } catch (e) {
        // ignore
      }
    })();
    // Live sales toast
    const interval = setInterval(() => {
      const names = ["Emma", "Liam", "Sophia", "Noah"];
      const products = ["Classic T-Shirt", "Sneakers Pro", "Leather Jacket", "Denim Jeans"];
      const name = names[Math.floor(Math.random() * names.length)];
      const product = products[Math.floor(Math.random() * products.length)];
      toast.success(`${name} just purchased ${product}`, {
        icon: "New Sale",
        duration: 4000,
      });
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const handleAddToCart = (product: Product, size = 'M', color = 'Default') => {
    // Add a cart item with product snapshot
    add({ id: product.id, name: product.name, price: product.price, quantity: 1, image: product.image });
    toast.success(`${product.name} added to cart!`);
    setCurrentView('listing');
  };

  const handlePaymentSuccess = () => {
    items.forEach((item) => {
      // create a minimal Product snapshot for the Order
      const productSnapshot: Product = {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image || '',
        categoryId: 0,
      } as Product;

      addOrder({
        id: Date.now().toString(),
        productId: item.id,
        productSnapshot,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
        tax: +(item.price * item.quantity * 0.1).toFixed(2),
        total: +(item.price * item.quantity * 1.1).toFixed(2),
        date: new Date().toISOString(),
        status: 'paid' as const,
      });
    });
    toast.success("Payment successful! Thank you for your purchase!");
    // clear cart after successful payment
    try {
      clear();
    } catch (e) {}
    setCurrentView('success');
  };

  return (
    <>
      {/* Floating Cart Button */}
      <button
        onClick={() => setCartOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-linear-to-br from-orange-500 to-pink-600 rounded-full shadow-2xl flex items-center justify-center text-white"
      >
        <ShoppingCart className="w-8 h-8" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-white text-orange-600 text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center animate-pulse">
            {totalItems}
          </span>
        )}
      </button>

      {/* Dark Mode Toggle */}
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="fixed top-6 right-6 z-50 w-12 h-12 bg-white/90 dark:bg-black/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg"
      >
        {theme === 'dark' ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6" />}
      </button>

      {currentView === 'listing' && (
        <ProductListing
          onProductSelect={(p) => { setSelectedProduct(p); setCurrentView('detail'); }}
          user={user}
          onOpenLogin={() => setLoginOpen(true)}
          onOpenRegister={() => setRegisterOpen(true)}
          onOpenProfile={() => setCurrentView('profile')}
          onOpenAdmin={() => setCurrentView('admin')}
          onLogout={async () => {
            try {
              await fetch('/api/auth/logout', { method: 'POST' });
            } catch (e) {}
            setUserState(null);
            toast.info('Logged out');
          }}
        />
      )}

      {/* Simple management navigation (profile / orders / admin) */}
      {(currentView === 'profile' || currentView === 'admin') && (
        <div className="max-w-4xl mx-auto mt-6 px-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 rounded-md text-sm bg-slate-100" onClick={() => setCurrentView('listing')}>Back to shop</button>
              <button className={`px-3 py-1 rounded-md text-sm ${currentView === 'profile' ? 'bg-slate-200' : 'bg-white'}`} onClick={() => setCurrentView('profile')}>Profile</button>
              <button className={`px-3 py-1 rounded-md text-sm ${currentView === 'profile' ? 'bg-white' : 'bg-slate-200'}`} onClick={() => setCurrentView('admin')}>Orders / Admin</button>
            </div>
            <div className="text-sm text-slate-500">Signed in as {user?.name || 'Guest'}</div>
          </div>
        </div>
      )}

      {currentView === 'detail' && selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onAddToCart={() => handleAddToCart(selectedProduct)}
          onBack={() => setCurrentView('listing')}
        />
      )}

      {currentView === 'payment' && selectedProduct && (
        <Payment
          product={selectedProduct}
          onBack={() => setCurrentView('listing')}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentFailed={() => setCurrentView('failed')}
        />
      )}

      {currentView === 'success' && <PaymentSuccess product={selectedProduct!} onBackToHome={() => setCurrentView('listing')} />}
      {currentView === 'failed' && <PaymentFailed product={selectedProduct!} onRetry={() => setCurrentView('payment')} onBackToHome={() => setCurrentView('listing')} />}
      {currentView === 'profile' && (
        <Profile
          user={user || { id: 'guest', name: 'Guest' }}
          orders={orders}
          onBack={() => setCurrentView('listing')}
          onLogout={async () => {
            try {
              await fetch('/api/auth/logout', { method: 'POST' });
            } catch (e) {}
            setUserState(null);
            toast.info('Logged out');
            setCurrentView('listing');
          }}
        />
      )}
      {currentView === 'admin' && <AdminPanel onBack={() => setCurrentView('listing')} />}

      {/* MiniCart is provided by layout ClientShell; no local render needed here. */}

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={(u) => {
          // server already set cookie; just update client state
          setUserState(u);
          toast.success(`Welcome ${u.name}!`);
        }}
      />
      <RegisterModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onRegister={(u) => {
          setUserState(u);
          toast.success('Account created!');
        }}
      />
    </>
  );
}

export default function Home() {
  return <HomeContent />;
}