// app/page.tsx
"use client";

import { useState } from 'react';
import { Product, Order, User } from './types';
import { ProductListing } from './components/ProductListing';
import { ProductDetail } from './components/ProductDetail';
import { Payment } from './components/Payment';
import { PaymentSuccess } from './components/PaymentSuccess';
import { PaymentFailed } from './components/PaymentFailed';
import { addOrder as storageAddOrder, getOrders, getUser, setUser, clearUser } from './utils/storage';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import Profile from './components/Profile';
import AdminPanel from './components/AdminPanel';

export default function Home() {
  const [currentView, setCurrentView] = useState<'listing' | 'detail' | 'payment' | 'success' | 'failed' | 'profile' | 'admin'>('listing');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      return getOrders() as Order[];
    } catch {
      return [];
    }
  });
  const [user, setUserState] = useState<User | null>(() => {
    try {
      return (getUser() as User) || { id: 'guest', name: 'Guest User' };
    } catch {
      return { id: 'guest', name: 'Guest User' };
    }
  });
  const [loginOpen, setLoginOpen] = useState(false);
  const [postLoginAction, setPostLoginAction] = useState<'none' | 'openAdmin' | 'openProfile'>('none');
  const [registerOpen, setRegisterOpen] = useState(false);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('detail');
  };

  const handleAddToCart = () => {
    setCurrentView('payment');
  };

  const handleLogin = (u: User, remember?: boolean) => {
    if (remember) {
      try {
        setUser(u);
      } catch {}
    }
    setUserState(u);
    // perform post-login action if set
    if (postLoginAction === 'openAdmin' && (u as any).isAdmin) {
      setCurrentView('admin');
    } else if (postLoginAction === 'openProfile') {
      setCurrentView('profile');
    }
    setPostLoginAction('none');
  };

  const handleRegister = (u: User, remember?: boolean) => {
    if (remember) {
      try {
        setUser(u);
      } catch {}
    }
    setUserState(u);
    setCurrentView('profile');
  };

  const handleLogout = () => {
    clearUser();
    setUserState({ id: 'guest', name: 'Guest User' });
    setCurrentView('listing');
  };

  const handlePaymentSuccess = () => {
    if (selectedProduct) {
      const subtotal = selectedProduct.price;
      const tax = +(subtotal * 0.1).toFixed(2);
      const total = +(subtotal + tax).toFixed(2);
      const order: Order = {
        id: `ord_${Date.now()}`,
        productId: selectedProduct.id,
        productSnapshot: selectedProduct,
        quantity: 1,
        subtotal,
        tax,
        total,
        date: new Date().toISOString(),
        status: 'paid'
      };
      const newOrders = storageAddOrder(order) as Order[];
      setOrders(newOrders);
    }
    setCurrentView('success');
  };

  const handlePaymentFailed = () => {
    setCurrentView('failed');
  };

  const handleRetry = () => {
    setCurrentView('payment');
  };

  const handleBackToHome = () => {
    setCurrentView('listing');
    setSelectedProduct(null); 
  };

  const handleOpenProfile = () => {
    setCurrentView('profile');
  };

  const handleOpenAdmin = () => {
    // require admin rights for admin view
    if (user && (user as any).isAdmin) {
      setCurrentView('admin');
    } else {
      setPostLoginAction('openAdmin');
      setLoginOpen(true);
    }
  };

  const handleBack = () => {
    if (currentView === 'payment') {
      setCurrentView('detail');
    } else if (currentView === 'detail') {
      setCurrentView('listing');
    }
  };

  const handleShare = () => {
    alert('Share functionality - this would open native share dialog on iOS');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100 transition-opacity duration-500 opacity-100">
      {currentView === 'listing' && (
        <ProductListing
          onProductSelect={handleProductSelect}
          onOpenProfile={handleOpenProfile}
          onOpenAdmin={handleOpenAdmin}
          onOpenLogin={() => {
            setPostLoginAction('openProfile');
            setLoginOpen(true);
          }}
          onOpenRegister={() => setRegisterOpen(true)}
          user={user}
          onLogout={handleLogout}
        />
      )}
      {currentView === 'admin' && (
        <AdminPanel onBack={() => setCurrentView('listing')} />
      )}
      {currentView === 'profile' && (
        <Profile
          user={(user as User) || { id: 'guest', name: 'Guest User' }}
          orders={orders}
          onBack={() => setCurrentView('listing')}
          onLogout={handleLogout}
        />
      )}

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={(u, remember) => handleLogin(u, remember)}
      />
      <RegisterModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onRegister={(u, remember) => handleRegister(u, remember)}
      />
      {currentView === 'detail' && selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onAddToCart={handleAddToCart}
          onBack={handleBack}
        />
      )}
      {currentView === 'payment' && selectedProduct && (
        <Payment
          product={selectedProduct}
          onBack={handleBack}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentFailed={handlePaymentFailed}
        />
      )}
      {currentView === 'success' && selectedProduct && (
        <PaymentSuccess
          product={selectedProduct}
          onShare={handleShare}
          onBackToHome={handleBackToHome}
        />
      )}
      {currentView === 'failed' && selectedProduct && (
        <PaymentFailed
          product={selectedProduct}
          onRetry={handleRetry}
          onBackToHome={handleBackToHome}
        />
      )}
    </div>
  );
}