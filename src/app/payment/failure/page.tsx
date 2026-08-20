'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PaymentStatus from '@/components/payment/PaymentStatus';
import Icon from '@/components/ui/AppIcon';

export default function PaymentFailurePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams?.get('orderId');
  const error = searchParams?.get('error');

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
          <div className="mb-4 inline-block rounded-full bg-red-100 p-3">
            <Icon name="XCircleIcon" size={48} className="text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-[#1A2A3A]">Payment Failed</h1>
          <p className="mt-2 text-[#6B7280]">
            {error || 'There was an issue processing your payment.'}
          </p>
          <p className="text-sm text-[#6B7280]">Order ID: #{orderId}</p>
        </div>

        <PaymentStatus orderId={parseInt(orderId)} />

        <div className="mt-6 flex flex-col items-center gap-3">
          <button
            onClick={() => router.push(`/checkout-process`)}
            className="rounded-lg bg-[#FF6B8A] px-6 py-2 text-white transition-all hover:scale-[0.98]"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push('/contact')}
            className="text-sm text-[#6B7280] transition-colors hover:text-[#FF6B8A]"
          >
            Contact Support
          </button>
        </div>
      </div>
    </main>
  );
}