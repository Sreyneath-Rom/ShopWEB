// app/components/Payment.tsx
"use client";

import { ChevronLeft, ChevronDown, CreditCard, Wallet, Info, KeyRound } from 'lucide-react';
import { Product } from '../types';
import { useState } from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { ErrorMessage } from './ui/ErrorMessage';
import { usePaymentForm } from '../hooks/usePaymentForm';
import { formatDate } from '../utils/date';

interface PaymentProps {
  product: Product;
  onBack: () => void;
  onPaymentSuccess: () => void;
  onPaymentFailed: () => void;
}

export function Payment({ product, onBack, onPaymentSuccess, onPaymentFailed }: PaymentProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet'>('card');
  const [showDetails, setShowDetails] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const form = usePaymentForm();
  const orderDate = formatDate();

  const handlePay = async (isSuccess: boolean) => {
    if (!form.validate()) {
      return;
    }

    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsProcessing(false);

    if (isSuccess) {
      form.reset();
      onPaymentSuccess();
    } else {
      onPaymentFailed();
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="backdrop-blur-xl bg-white/80 rounded-3xl shadow-xl border border-white/60 p-4 mb-6 flex items-center">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center transition-all active:scale-95 mr-4 shadow-md"
            aria-label="Go back"
          >
            <ChevronLeft className="w-6 h-6 text-slate-700" />
          </button>
          <h2 className="text-slate-900 text-xl font-semibold">Payment</h2>
        </div>

        <Card className="p-6 md:p-8">
          {/* Order Details */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-slate-500 font-medium">Order Information</p>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className={`w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center transition-all shadow-sm ${
                  showDetails ? 'rotate-180' : ''
                }`}
                aria-label={showDetails ? 'Hide order details' : 'Show order details'}
              >
                <ChevronDown className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {showDetails && (
              <div className="bg-linear-to-br from-white/70 to-white/50 backdrop-blur-sm rounded-2xl p-4 shadow-lg ring-1 ring-black/5 border border-white/60">
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-xl bg-linear-to-br from-slate-100 to-slate-50 overflow-hidden shrink-0 shadow-md ring-1 ring-black/5">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-slate-900 font-semibold">{product.name}</h3>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Order Date</span>
                      <span className="text-slate-700">{orderDate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Price</span>
                      <span className="text-slate-900 font-semibold">${product.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <p className="text-slate-700 font-medium mb-3">Payment Method</p>
            <div className="flex gap-3">
              <button
                onClick={() => setPaymentMethod('card')}
                className={`flex-1 py-3 rounded-2xl transition-all shadow-lg font-medium ${
                  paymentMethod === 'card'
                    ? 'bg-linear-to-br from-slate-900 to-slate-800 text-white shadow-xl'
                    : 'bg-white/70 text-slate-600 hover:bg-white/90 hover:shadow-xl'
                }`}
                aria-pressed={paymentMethod === 'card'}
              >
                Credit Card
              </button>
              <button
                onClick={() => setPaymentMethod('wallet')}
                className={`flex-1 py-3 rounded-2xl transition-all shadow-lg font-medium ${
                  paymentMethod === 'wallet'
                    ? 'bg-linear-to-br from-slate-900 to-slate-800 text-white shadow-xl'
                    : 'bg-white/70 text-slate-600 hover:bg-white/90 hover:shadow-xl'
                }`}
                aria-pressed={paymentMethod === 'wallet'}
              >
                Wallet
              </button>
            </div>
          </div>

          {/* Card Payment Form */}
          {paymentMethod === 'card' && (
            <div className="space-y-4 mb-8">
              {/* Card Number */}
              <div className="bg-linear-to-br from-white/70 to-white/50 backdrop-blur-sm rounded-2xl p-4 shadow-lg ring-1 ring-black/5 border border-white/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                    <CreditCard className="w-5 h-5 text-slate-600" />
                  </div>
                  <input
                    type="text"
                    placeholder="Card Number"
                    value={form.cardNumber}
                    onChange={(e) => form.handleCardNumberChange(e.target.value)}
                    maxLength={19}
                    className="flex-1 bg-transparent outline-none text-slate-900 placeholder:text-slate-400 font-mono"
                    aria-invalid={!!form.errors.cardNumber}
                    aria-describedby="cardNumberError"
                  />
                </div>
                <ErrorMessage message={form.errors.cardNumber} id="cardNumberError" />
              </div>

              {/* Expiry & CVV */}
              <div className="grid grid-cols-2 gap-3">
                {/* Expiry Date */}
                <div className="bg-linear-to-br from-white/70 to-white/50 backdrop-blur-sm rounded-2xl p-4 shadow-lg ring-1 ring-black/5 border border-white/60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                      <Info className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 mb-1">Exp Date</p>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={form.expiry}
                        onChange={(e) => form.handleExpiryChange(e.target.value)}
                        maxLength={5}
                        className="w-full bg-transparent outline-none text-slate-900 placeholder:text-slate-400 font-mono"
                        aria-invalid={!!form.errors.expiry}
                        aria-describedby="expiryError"
                      />
                    </div>
                  </div>
                  <ErrorMessage message={form.errors.expiry} id="expiryError" />
                </div>

                {/* CVV */}
                <div className="bg-linear-to-br from-white/70 to-white/50 backdrop-blur-sm rounded-2xl p-4 shadow-lg ring-1 ring-black/5 border border-white/60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                      <KeyRound className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 mb-1">CVV</p>
                      <input
                        type="text"
                        placeholder="123"
                        value={form.cvv}
                        onChange={(e) => form.handleCvvChange(e.target.value)}
                        maxLength={3}
                        className="w-full bg-transparent outline-none text-slate-900 placeholder:text-slate-400 font-mono"
                        aria-invalid={!!form.errors.cvv}
                        aria-describedby="cvvError"
                      />
                    </div>
                  </div>
                  <ErrorMessage message={form.errors.cvv} id="cvvError" />
                </div>
              </div>
            </div>
          )}

          {/* Wallet Payment */}
          {paymentMethod === 'wallet' && (
            <div className="mb-8">
              <div className="bg-linear-to-br from-white/70 to-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg ring-1 ring-black/5 border border-white/60 text-center">
                <div className="w-16 h-16 bg-linear-to-br from-blue-500 via-blue-600 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <Wallet className="w-8 h-8 text-white" />
                </div>
                <p className="text-slate-700 font-semibold mb-2">Digital Wallet</p>
                <p className="text-slate-500 text-sm">Connect your preferred wallet to continue</p>
              </div>
            </div>
          )}

          {/* Payment Actions */}
          <div className="space-y-3">
            <Button
              onClick={() => handlePay(true)}
              variant="success"
              size="lg"
              isLoading={isProcessing}
              disabled={paymentMethod === 'card' && !form.isComplete}
              className="w-full"
              aria-label="Complete payment"
            >
              {isProcessing ? 'Processing...' : 'Complete Payment'}
            </Button>

            {/* Demo: Trigger Payment Failure */}
            <Button
              onClick={() => handlePay(false)}
              variant="danger"
              size="lg"
              isLoading={isProcessing}
              className="w-full"
              aria-label="Simulate payment failure for testing"
            >
              {isProcessing ? 'Processing...' : 'Payment Failed Demo'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}