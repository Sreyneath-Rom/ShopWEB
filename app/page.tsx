// app/page.tsx
"use client";

import { useState } from 'react';
import { Product, Order, User } from './types';
import { ProductListing } from './components/ProductListing';
import { ProductDetail } from './components/ProductDetail';
import { Payment } from './components/Payment';
import { PaymentSuccess } from './components/PaymentSuccess';
import { PaymentFailed } from './components/PaymentFailed';
import { addOrder as storageAddOrder, getOrders } from './utils/storage';
import Profile from './components/Profile';

export default function Home() {
  const [currentView, setCurrentView] = useState<'listing' | 'detail' | 'payment' | 'success' | 'failed' | 'profile'>('listing');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      return getOrders() as Order[];
    } catch {
      return [];
    }
  });
  const [user] = useState<User>({ id: 'u1', name: 'Guest User' });

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('detail');
  };

  const handleAddToCart = () => {
    setCurrentView('payment');
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
        <ProductListing onProductSelect={handleProductSelect} onOpenProfile={handleOpenProfile} />
      )}
      {currentView === 'profile' && (
        <Profile user={user} orders={orders} onBack={() => setCurrentView('listing')} />
      )}
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