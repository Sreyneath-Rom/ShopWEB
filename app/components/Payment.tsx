// app/components/Payment.tsx
"use client";

import { ChevronLeft, ChevronDown, CreditCard, Wallet, Info, KeyRound, Lock, CheckCircle } from 'lucide-react';
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
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const form = usePaymentForm();
  const orderDate = formatDate();
  const tax = product.price * 0.1;
  const subtotal = product.price;
  const total = subtotal + tax;

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
    <div className="min-h-screen p-4 md:p-8 bg-linear-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="max-w-2xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 text-xs">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">1</div>
              <span className="text-slate-700 font-medium ml-2">Order</span>
            </div>
            <div className="h-1 w-12 bg-blue-500 rounded-full mx-2"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">2</div>
              <span className="text-slate-700 font-medium ml-2">Payment</span>
            </div>
            <div className="h-1 w-12 bg-slate-300 rounded-full mx-2"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">3</div>
              <span className="text-slate-500 font-medium ml-2">Confirm</span>
            </div>
          </div>
        </div>
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
              <p className="text-slate-500 font-medium">Order Summary</p>
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
              <div className="bg-linear-to-br from-white/70 to-white/50 backdrop-blur-sm rounded-2xl p-4 shadow-lg ring-1 ring-black/5 border border-white/60 mb-4">
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
                      <span className="text-slate-500">Unit Price</span>
                      <span className="text-slate-900 font-semibold">${product.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Quantity</span>
                      <span className="text-slate-900 font-semibold">1x</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Order Summary */}
            <div className="bg-linear-to-br from-slate-50 to-white rounded-2xl p-4 shadow-md ring-1 ring-black/5">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="text-slate-900 font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Tax (10%)</span>
                  <span className="text-slate-900 font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between">
                  <span className="text-slate-900 font-semibold">Total Amount</span>
                  <span className="text-slate-900 font-bold text-lg">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <p className="text-slate-700 font-medium mb-3">Choose Payment Method</p>
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

          {/* Security Info */}
          <div className="mb-6 bg-linear-to-br from-blue-50 to-blue-100/50 rounded-2xl p-4 border border-blue-200/50 flex items-start gap-3">
            <Lock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-blue-900 font-medium text-sm">Your payment is secure</p>
              <p className="text-blue-800 text-xs mt-1">We use SSL encryption to protect your payment information</p>
            </div>
          </div>

          {/* Card Payment Form */}
          {paymentMethod === 'card' && (
            <div className="space-y-4 mb-8">
              {/* Card Number */}
              <div>
                <div className={`bg-linear-to-br from-white/70 to-white/50 backdrop-blur-sm rounded-2xl p-4 shadow-lg ring-1 border transition-all ${
                  form.errors.cardNumber 
                    ? 'ring-red-300 border-red-200/60 bg-red-50/30' 
                    : 'ring-black/5 border-white/60'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                      form.errors.cardNumber 
                        ? 'bg-red-100' 
                        : 'bg-slate-100'
                    }`}>
                      <CreditCard className={`w-5 h-5 ${form.errors.cardNumber ? 'text-red-600' : 'text-slate-600'}`} />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={form.cardNumber}
                        onChange={(e) => form.handleCardNumberChange(e.target.value)}
                        maxLength={19}
                        className="w-full bg-transparent outline-none text-slate-900 placeholder:text-slate-400 font-mono text-lg"
                        aria-invalid={!!form.errors.cardNumber}
                        aria-describedby="cardNumberError"
                      />
                    </div>
                    {!form.errors.cardNumber && form.rawCardNumber.length === 16 && (
                      <div className="text-green-600 text-sm">✓</div>
                    )}
                  </div>
                </div>
                {form.errors.cardNumber ? (
                  <ErrorMessage message={form.errors.cardNumber} id="cardNumberError" />
                ) : (
                  <p className="text-xs text-slate-500 mt-2 ml-1">Enter 16-digit card number</p>
                )}
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

          {/* Terms Agreement */}
          <div className="mb-6 flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="w-5 h-5 rounded-lg border border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer mt-0.5"
              aria-label="Agree to terms and conditions"
            />
            <label htmlFor="terms" className="flex-1 cursor-pointer">
              <p className="text-slate-700 text-sm">I agree to the <span className="text-blue-600 font-medium">terms and conditions</span> and <span className="text-blue-600 font-medium">privacy policy</span></p>
              <p className="text-slate-500 text-xs mt-1">Your card will be charged ${total.toFixed(2)}</p>
            </label>
          </div>

          {/* Payment Actions */}
          <div className="space-y-3">
            <Button
              onClick={() => handlePay(true)}
              variant="success"
              size="lg"
              isLoading={isProcessing}
              disabled={(paymentMethod === 'card' && !form.isComplete) || !agreeToTerms}
              className="w-full"
              aria-label="Complete payment"
            >
              <CheckCircle className="w-5 h-5" />
              {isProcessing ? 'Processing Payment...' : `Pay $${total.toFixed(2)}`}
            </Button>

            <Button
              onClick={onBack}
              variant="outline"
              size="lg"
              disabled={isProcessing}
              className="w-full"
              aria-label="Cancel payment"
            >
              Cancel Payment
            </Button>

            {/* Demo: Trigger Payment Failure */}
            <div className="pt-2 border-t border-slate-200">
              <button
                onClick={() => handlePay(false)}
                disabled={isProcessing}
                className="w-full text-slate-500 hover:text-slate-600 text-xs font-medium py-2 transition-colors"
                aria-label="Simulate payment failure for testing"
              >
                {isProcessing ? 'Processing...' : '→ Test Payment Failed (Demo)'}
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}