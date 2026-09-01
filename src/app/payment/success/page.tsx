'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PaymentStatus from '@/components/payment/PaymentStatus';
import Icon from '@/components/ui/AppIcon';
import { useGetPaymentStatusQuery } from '@/store/api/paymentApi';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams?.get('orderId');
  
  useEffect(() => {
    if (!orderId) {
      router.push('/products');
    }
  }, [orderId, router]);

  if (!orderId) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] py-16">
      <div className="container mx-auto max-w-2xl px-4">
        {/* Centered White Container - Increased size */}
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-12 shadow-lg">
          {/* Success Icon */}
          <div className="mb-6 text-center">
            <div className="inline-block rounded-full bg-green-100 p-4">
              <Icon name="CheckCircleIcon" size={56} className="text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-[#1A2A3A]">Payment Successful!</h1>
            <p className="mt-2 text-lg text-[#6B7280]">Your order has been confirmed.</p>
          </div>

          {/* Order Details - Centered */}
          <div className="mb-8 rounded-xl bg-gray-50 p-6 text-center">
            <div className="flex flex-col items-center justify-center gap-1">
              <span className="text-sm font-medium text-gray-500">Order ID</span>
              <span className="text-xl font-bold text-[#1A2A3A]">{orderId}</span>
            </div>
          </div>

          {/* Success Status Badge */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-6 py-2.5">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="font-medium text-green-700">Payment Successful</span>
            </div>
          </div>

          {/* Action Buttons - Centered */}
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={() => router.push(`/user-dashboard/orders`)}
              className="w-full max-w-xs rounded-lg bg-[#FF6B8A] px-6 py-3 text-white transition-all hover:scale-[0.98] hover:shadow-md"
            >
              View My Orders
            </button>
            <button
              onClick={() => router.push('/products')}
              className="text-sm text-[#6B7280] transition-colors hover:text-[#FF6B8A]"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}