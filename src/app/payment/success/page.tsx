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
    <main className="min-h-screen bg-[#FAFAFA] py-12">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-block rounded-full bg-green-100 p-3">
            <Icon name="CheckCircleIcon" size={48} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-[#1A2A3A]">Payment Successful!</h1>
          <p className="mt-2 text-[#6B7280]">Your order has been confirmed.</p>
          <p className="text-sm text-[#6B7280]">Order ID: #{orderId}</p>
        </div>

        <PaymentStatus orderId={parseInt(orderId)} />

        <div className="mt-6 flex flex-col items-center gap-3">
          <button
            onClick={() => router.push(`/user-dashboard/orders`)}
            className="rounded-lg bg-[#FF6B8A] px-6 py-2 text-white transition-all hover:scale-[0.98]"
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
    </main>
  );
}