// app/components/PaymentSuccess.tsx
"use client";

import { CheckCircle2, Share2 } from 'lucide-react';
import { Product } from '../types';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { formatDateWithDay, formatTime } from '../utils/date';

interface PaymentSuccessProps {
  product: Product;
  onShare?: () => void;
}

export function PaymentSuccess({ product, onShare }: PaymentSuccessProps) {
  const billId = '#3738173';
  const date = formatDateWithDay();
  const time = formatTime();
  const tax = 0.00;
  const total = product.price;

  return (
    <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-md">
        <Card className="p-8 animate-in fade-in zoom-in duration-500">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-linear-to-br from-green-400 via-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/50 animate-in zoom-in duration-700 delay-100">
              <CheckCircle2 className="w-14 h-14 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-slate-900 mb-2 text-3xl font-bold">Payment Success!</h1>
            <p className="text-slate-500">Your payment has been successfully processed</p>
          </div>

          {/* Product Info */}
          <div className="bg-linear-to-br from-green-50 to-white rounded-2xl p-4 mb-6 shadow-lg ring-1 ring-green-100 border border-green-100/50">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-linear-to-br from-slate-100 to-slate-50 overflow-hidden shrink-0 shadow-lg ring-1 ring-black/5">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-slate-900 font-semibold">{product.name}</h3>
                <p className="text-slate-500 text-sm">Order confirmed</p>
              </div>
              <div className="w-9 h-9 bg-linear-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shrink-0 shadow-lg">
                <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={3} />
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-3 mb-8 bg-slate-50 rounded-2xl p-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Amount</span>
              <span className="text-slate-900 font-semibold">${product.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Status</span>
              <span className="text-green-600 font-semibold">✓ Successfully Paid</span>
            </div>
            <div className="border-t border-slate-200 pt-3 mt-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Bill ID</span>
                <span className="text-slate-900 font-mono">{billId}</span>
              </div>
            </div>
            <div className="space-y-2 text-sm border-t border-slate-200 pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Date & Time</span>
                <span className="text-slate-900">{date}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Time</span>
                <span className="text-slate-900 font-mono">{time}</span>
              </div>
            </div>
            <div className="border-t border-slate-200 pt-3 mt-3">
              <div className="flex justify-between items-center font-semibold">
                <span className="text-slate-700">Total</span>
                <span className="text-slate-900">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Share Button */}
          <Button
            onClick={onShare}
            variant="secondary"
            size="lg"
            className="w-full"
            aria-label="Share payment success"
          >
            <Share2 className="w-5 h-5" />
            Share Receipt
          </Button>
        </Card>
      </div>
    </div>
  );
}