// app/page.tsx
"use client";

import { useState } from 'react';
import { Product } from './types';
import { ProductListing } from './components/ProductListing';
import { ProductDetail } from './components/ProductDetail';
import { Payment } from './components/Payment';
import { PaymentSuccess } from './components/PaymentSuccess';
import { PaymentFailed } from './components/PaymentFailed';

export default function Home() {
  const [currentView, setCurrentView] = useState<'listing' | 'detail' | 'payment' | 'success' | 'failed'>('listing');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('detail');
  };

  const handleAddToCart = () => {
    setCurrentView('payment');
  };

  const handlePaymentSuccess = () => {
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
        <ProductListing onProductSelect={handleProductSelect} />
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